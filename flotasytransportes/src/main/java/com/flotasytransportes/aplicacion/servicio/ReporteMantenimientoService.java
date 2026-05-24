package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import com.flotasytransportes.dominio.modelo.Vehiculo;
import com.flotasytransportes.dominio.modelo.EstadoVehiculo;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import com.flotasytransportes.infraestructura.web.dto.ReporteMantenimientoDTO;
import com.flotasytransportes.infraestructura.web.dto.VehiculoProximoDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ReporteMantenimientoService {

    private List<ReporteMantenimiento> reportes = new ArrayList<>();
    
    private final VehiculoRepositoryPort vehiculoRepository;

    public ReporteMantenimientoService(VehiculoRepositoryPort vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public ReporteMantenimiento crearReporte(ReporteMantenimientoDTO dto) {

    	// verificar si el vehículo existe y cambiar estado a MANTENIMIENTO
        Vehiculo vehiculo = vehiculoRepository.buscarPorPlaca(dto.getPlacaVehiculo())
                .orElseThrow(() -> new RuntimeException("El vehículo con placa "
                        + dto.getPlacaVehiculo() + " no existe"));

        vehiculo.cambiarEstado(EstadoVehiculo.MANTENIMIENTO);
        vehiculoRepository.guardar(vehiculo);

        // crear el reporte con Builder
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

    public List<ReporteMantenimiento> listarOrdenadosPorFecha(String direccion) {
        return reportes.stream()
            .sorted(direccion.equalsIgnoreCase("asc")
                ? Comparator.comparing(ReporteMantenimiento::getFecha)
                : Comparator.comparing(ReporteMantenimiento::getFecha).reversed())
            .collect(Collectors.toList());
    }

    public List<ReporteMantenimiento> listarPorRangoFechas(String desde, String hasta) {
        return reportes.stream()
            .filter(r -> r.getFecha().compareTo(desde) >= 0 && r.getFecha().compareTo(hasta) <= 0)
            .sorted(Comparator.comparing(ReporteMantenimiento::getFecha).reversed())
            .collect(Collectors.toList());
    }

    public List<ReporteMantenimiento> listarProximos(Double kmUmbral) {
        return reportes.stream()
            .filter(r -> {
                Vehiculo v = vehiculoRepository.buscarPorPlaca(r.getPlacaVehiculo()).orElse(null);
                if (v == null) return false;
                if (r.getProximoMantenimientoKm() != null) {
                    return v.getKilometrajeActual() >= r.getProximoMantenimientoKm() - kmUmbral
                        && v.getKilometrajeActual() < r.getProximoMantenimientoKm() + 1000;
                }
                return v.getKilometrajeActual() >= v.getLimiteMantenimiento() - kmUmbral
                    && v.getKilometrajeActual() < v.getLimiteMantenimiento() + 1000;
            })
            .sorted(Comparator.comparing(ReporteMantenimiento::getFecha).reversed())
            .collect(Collectors.toList());
    }

    public List<VehiculoProximoDTO> listarVehiculosProximos(Double kmUmbral) {
        List<Vehiculo> vehiculos = vehiculoRepository.buscarTodos();
        List<VehiculoProximoDTO> resultado = new ArrayList<>();

        for (Vehiculo v : vehiculos) {
            Double kmActual = v.getKilometrajeActual();
            Double targetKm = v.getLimiteMantenimiento();
            if (kmActual == null || targetKm == null) continue;

            ReporteMantenimiento ultimoReporte = reportes.stream()
                .filter(r -> r.getPlacaVehiculo().equals(v.getPlaca())
                          && r.getProximoMantenimientoKm() != null)
                .max(Comparator.comparing(ReporteMantenimiento::getFecha))
                .orElse(null);

            Double proximoKm = null;
            if (ultimoReporte != null) {
                proximoKm = ultimoReporte.getProximoMantenimientoKm();
                targetKm = proximoKm;
            }

            Double kmRestantes = targetKm - kmActual;
            if (kmRestantes > kmUmbral) continue;

            Double porcentaje = (kmActual / targetKm) * 100;

            String riesgo;
            if (kmRestantes <= 0) riesgo = "CRITICO";
            else if (porcentaje >= 90) riesgo = "ALTO";
            else if (porcentaje >= 80) riesgo = "MEDIO";
            else riesgo = "BAJO";

            resultado.add(new VehiculoProximoDTO(
                v.getPlaca(),
                v.getTipo().name(),
                kmActual,
                v.getLimiteMantenimiento(),
                proximoKm,
                kmRestantes,
                Math.min(porcentaje, 100.0),
                riesgo
            ));
        }

        resultado.sort(Comparator.comparingDouble(VehiculoProximoDTO::getKmRestantes));
        return resultado;
    }

    public void eliminarReporte(String placaVehiculo, String tipoMantenimiento, String fecha) {
        reportes.removeIf(r ->
            r.getPlacaVehiculo().equals(placaVehiculo) &&
            r.getTipoMantenimiento().equals(tipoMantenimiento) &&
            r.getFecha().equals(fecha)
        );
    }
    
}
