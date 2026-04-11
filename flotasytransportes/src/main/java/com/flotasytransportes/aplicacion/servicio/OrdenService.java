package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.aplicacion.rutas.decorator.*;
import com.flotasytransportes.aplicacion.rutas.ServicioRutas;
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
    private final ServicioRutas servicioRutas;

    public OrdenService(VehiculoRepositoryPort vehiculoRepository,
                        DistanciaServicePort distanciaService,
                        ServicioRutas servicioRutas) {

        this.vehiculoRepository = vehiculoRepository;
        this.distanciaService = distanciaService;
        this.servicioRutas = servicioRutas;
    }

    public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {

        System.out.println("\n========== DEMOSTRACIÓN ADAPTER + BRIDGE + DECORATOR ==========");
        System.out.println("[CLIENTE - OrdenService] Creando orden: " + orden.getCodigoOrden());

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

        System.out.println("[CLIENTE] Vehículo más cercano: " + vehiculoMasCercano.getPlaca());

        // =========================
        // PATRON BRIDGE
        // =========================
        System.out.println("[CLIENTE] Generando ruta con Bridge...");

        Ruta ruta = servicioRutas.generarRuta(
                orden.getOrigenLat() + "," + orden.getOrigenLng(),
                vehiculoMasCercano.getLatitud() + "," + vehiculoMasCercano.getLongitud()
        );

        System.out.println("[CLIENTE] Distancia base: " + ruta.getDistancia());

        // =========================
        // PATRON DECORATOR
        // =========================
        System.out.println("[CLIENTE] Aplicando decoradores a la ruta...");

        RutaComponent componente = new RutaBaseComponent();

        componente = new TraficoDecorator(componente);
        componente = new PeajeDecorator(componente);
        componente = new ClimaDecorator(componente);

        ruta = componente.procesarRuta(ruta);

        System.out.println("[CLIENTE] Ruta final con decoradores: " + ruta.getDistancia());

        // =========================
        // FINAL
        // =========================
        vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
        vehiculoRepository.guardar(vehiculoMasCercano);

        orden.asignarVehiculo(vehiculoMasCercano.getPlaca());

        System.out.println("[CLIENTE] Orden asignada correctamente");
        System.out.println("==========================================\n");

        return orden;
    }
}