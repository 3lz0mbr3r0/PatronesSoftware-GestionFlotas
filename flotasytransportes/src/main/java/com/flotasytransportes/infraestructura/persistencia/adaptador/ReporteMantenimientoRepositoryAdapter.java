package com.flotasytransportes.infraestructura.persistencia.adaptador;

import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import com.flotasytransportes.dominio.puertos.ReporteMantenimientoRepositoryPort;
import com.flotasytransportes.infraestructura.persistencia.entidad.ReporteMantenimientoEntity;
import com.flotasytransportes.infraestructura.persistencia.repositorio.ReporteMantenimientoJpaRepository;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
public class ReporteMantenimientoRepositoryAdapter implements ReporteMantenimientoRepositoryPort {

    private final ReporteMantenimientoJpaRepository jpaRepository;

    public ReporteMantenimientoRepositoryAdapter(ReporteMantenimientoJpaRepository jpaRepository) {
        this.jpaRepository = jpaRepository;
    }

    @Override
    public ReporteMantenimiento guardar(ReporteMantenimiento reporte) {
        ReporteMantenimientoEntity entity = mapToEntity(reporte);
        ReporteMantenimientoEntity saved = jpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public List<ReporteMantenimiento> buscarTodos() {
        return jpaRepository.findAll()
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<ReporteMantenimiento> buscarPorPlaca(String placa) {
        return jpaRepository.findByPlacaVehiculoOrderByFechaAsc(placa)
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public void eliminar(String placaVehiculo, String tipoMantenimiento, String fecha) {
        jpaRepository.deleteByPlacaVehiculoAndTipoMantenimientoAndFecha(placaVehiculo, tipoMantenimiento, fecha);
    }

    private ReporteMantenimiento mapToDomain(ReporteMantenimientoEntity entity) {
        if (entity == null) return null;

        return new ReporteMantenimiento.Builder(
                entity.getPlacaVehiculo(),
                entity.getKilometraje(),
                entity.getFecha(),
                entity.getTipoMantenimiento()
        )
        .observaciones(entity.getObservaciones())
        .prioridad(entity.getPrioridad())
        .tecnicoResponsable(entity.getTecnicoResponsable())
        .taller(entity.getTaller())
        .costoEstimado(entity.getCostoEstimado())
        .tiempoEstimadoHoras(entity.getTiempoEstimadoHoras())
        .requiereRepuestos(entity.getRequiereRepuestos())
        .nivelDesgaste(entity.getNivelDesgaste())
        .proximoMantenimientoKm(entity.getProximoMantenimientoKm())
        .build();
    }

    private ReporteMantenimientoEntity mapToEntity(ReporteMantenimiento reporte) {
        if (reporte == null) return null;

        ReporteMantenimientoEntity entity = new ReporteMantenimientoEntity();
        entity.setPlacaVehiculo(reporte.getPlacaVehiculo());
        entity.setKilometraje(reporte.getKilometraje());
        entity.setFecha(reporte.getFecha());
        entity.setTipoMantenimiento(reporte.getTipoMantenimiento());
        entity.setObservaciones(reporte.getObservaciones());
        entity.setPrioridad(reporte.getPrioridad());
        entity.setTecnicoResponsable(reporte.getTecnicoResponsable());
        entity.setTaller(reporte.getTaller());
        entity.setCostoEstimado(reporte.getCostoEstimado());
        entity.setTiempoEstimadoHoras(reporte.getTiempoEstimadoHoras());
        entity.setRequiereRepuestos(reporte.getRequiereRepuestos());
        entity.setNivelDesgaste(reporte.getNivelDesgaste());
        entity.setProximoMantenimientoKm(reporte.getProximoMantenimientoKm());
        return entity;
    }
}
