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

        System.out.println("\n========== DEMOSTRACIÓN ADAPTER ==========");
        System.out.println("[CLIENTE - OrdenService] Creando orden: " + orden.getCodigoOrden());
        System.out.println("[CLIENTE] Origen: (" + orden.getOrigenLat() + ", " + orden.getOrigenLng() + ")");
        System.out.println("[CLIENTE] Buscando vehículos disponibles...");

        List<Vehiculo> disponibles = vehiculoRepository.buscarDisponibles();

        if (disponibles.isEmpty()) {
            throw new RuntimeException("No hay vehículos disponibles");
        }

        for (Vehiculo v : disponibles) {
            double distancia = distanciaService.calcularDistancia(
                    orden.getOrigenLat(),
                    orden.getOrigenLng(),
                    v.getLatitud(),
                    v.getLongitud()
            );

            System.out.println("[CLIENTE] Vehículo " + v.getPlaca() + " está a " + distancia + " km");
        }

        Vehiculo vehiculoMasCercano = disponibles.stream()
                .min(Comparator.comparing(v -> distanciaService.calcularDistancia(
                        orden.getOrigenLat(),
                        orden.getOrigenLng(),
                        v.getLatitud(),
                        v.getLongitud()
                )))
                .orElseThrow();

        System.out.println("[CLIENTE] Vehículo más cercano seleccionado: " + vehiculoMasCercano.getPlaca());

        vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
        vehiculoRepository.guardar(vehiculoMasCercano);

        orden.asignarVehiculo(vehiculoMasCercano.getPlaca());

        System.out.println("[CLIENTE] Orden asignada al vehículo: " + orden.getVehiculoPlaca());
        System.out.println("[CLIENTE] Link de navegación: " + orden.generarLinkNavegacion());
        System.out.println("==========================================\n");

        return orden;
    }
}