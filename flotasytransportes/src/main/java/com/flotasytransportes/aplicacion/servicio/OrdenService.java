package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.DistanciaServicePort;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrdenService {

    private final VehiculoRepositoryPort vehiculoRepository;
    private final DistanciaServicePort distanciaService;

    public OrdenService(VehiculoRepositoryPort vehiculoRepository,
                        DistanciaServicePort distanciaService) {
        this.vehiculoRepository = vehiculoRepository;
        this.distanciaService = distanciaService;
    }

    public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {

        List<Vehiculo> disponibles = vehiculoRepository.buscarDisponibles();

        if (disponibles.isEmpty()) {
            throw new RuntimeException("No hay vehículos disponibles");
        }

        Vehiculo vehiculoMasCercano = disponibles.stream()
                .min(Comparator.comparing(v -> distanciaService.calcularDistancia(
                        orden.getOrigenLat(),
                        orden.getOrigenLng(),
                        v.getLatitud(),
                        v.getLongitud()
                )))
                .orElseThrow();

        // Cambiar estado del vehículo
        vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
        vehiculoRepository.guardar(vehiculoMasCercano);

        // Asignar vehículo a la orden
        orden.asignarVehiculo(vehiculoMasCercano.getPlaca());

        return orden;
    }
}