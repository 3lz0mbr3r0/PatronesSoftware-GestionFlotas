package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import com.flotasytransportes.infraestructura.web.dto.ReporteMantenimientoDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReporteMantenimientoService {

    private List<ReporteMantenimiento> reportes = new ArrayList<>();
    
    private final VehiculoRepositoryPort vehiculoRepository;

    public ReporteMantenimientoService(VehiculoRepositoryPort vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public ReporteMantenimiento crearReporte(ReporteMantenimientoDTO dto) {

    	// verificar si el vehículo existe
        vehiculoRepository.buscarPorPlaca(dto.getPlacaVehiculo())
                .orElseThrow(() -> new RuntimeException("El vehículo con placa "
                        + dto.getPlacaVehiculo() + " no existe"));

        // si existe, crear el reporte con Builder
        ReporteMantenimiento reporte = new ReporteMantenimiento.Builder(
                dto.getPlacaVehiculo(),
                dto.getKilometraje(),
                dto.getFecha(),
                dto.getTipoMantenimiento()
        )
        .observaciones(dto.getObservaciones())
        .prioridad(dto.getPrioridad())
        .tecnicoResponsable(dto.getTecnicoResponsable())
        .taller(dto.getTaller())
        .costoEstimado(dto.getCostoEstimado())
        .tiempoEstimadoHoras(dto.getTiempoEstimadoHoras())
        .requiereRepuestos(dto.getRequiereRepuestos())
        .nivelDesgaste(dto.getNivelDesgaste())
        .proximoMantenimientoKm(dto.getProximoMantenimientoKm())
        .build();

        reportes.add(reporte);

        return reporte;
    }

    public List<ReporteMantenimiento> listarReportes() {
        return reportes;
    }
    
}
