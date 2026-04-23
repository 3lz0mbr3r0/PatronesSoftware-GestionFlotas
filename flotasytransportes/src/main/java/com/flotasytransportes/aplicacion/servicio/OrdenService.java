package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.aplicacion.rutas.decorator.*;
import com.flotasytransportes.aplicacion.rutas.ServicioRutas;
import com.flotasytransportes.aplicacion.rutas.composite.*;
import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.DistanciaServicePort;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrdenService {

    private final VehiculoRepositoryPort vehiculoRepository;
    private final DistanciaServicePort distanciaService;
    private final ServicioRutas servicioRutas;

    public OrdenService(VehiculoRepositoryPort vehiculoRepository,
                        @Qualifier("distanciaServicePort") DistanciaServicePort distanciaService,
                        ServicioRutas servicioRutas) {

        this.vehiculoRepository = vehiculoRepository;
        this.distanciaService = distanciaService;
        this.servicioRutas = servicioRutas;
    }

    public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {

        System.out.println("\n========== DEMOSTRACIÓN ADAPTER + BRIDGE + DECORATOR + COMPOSITE ==========");
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

        // Ruta del vehículo al origen de la orden
        Ruta rutaVehiculoAOrigen = servicioRutas.generarRuta(
                vehiculoMasCercano.getLatitud() + "," + vehiculoMasCercano.getLongitud(),
                orden.getOrigenLat() + "," + orden.getOrigenLng()
        );

        // Ruta del origen al destino de la orden
        Ruta rutaOrigenADestino = servicioRutas.generarRuta(
                orden.getOrigenLat() + "," + orden.getOrigenLng(),
                orden.getDestinoLat() + "," + orden.getDestinoLng()
        );

        System.out.println("[CLIENTE] Ruta vehículo->origen: " + rutaVehiculoAOrigen.getDistancia() + " km");
        System.out.println("[CLIENTE] Ruta origen->destino: " + rutaOrigenADestino.getDistancia() + " km");

        // =========================
        // PATRON COMPOSITE
        // =========================
        System.out.println("[CLIENTE] Construyendo ruta compuesta con Composite...");

        // Crear componentes (hojas) para cada segmento
        RutaSimpleComponent segmento1 = new RutaSimpleComponent(rutaVehiculoAOrigen);
        RutaSimpleComponent segmento2 = new RutaSimpleComponent(rutaOrigenADestino);

        // Crear compuesto y agregar segmentos
        RutaCompuestaComponent rutaCompuesta = new RutaCompuestaComponent("Entrega Completa");
        rutaCompuesta.addSegmento(segmento1);
        rutaCompuesta.addSegmento(segmento2);

        System.out.println("[COMPOSITE] Distancia total compuesta: " + rutaCompuesta.getDistanciaTotal() + " km");
        System.out.println("[COMPOSITE] Descripción:\n" + rutaCompuesta.getDescripcionRuta());

        // =========================
        // PATRON DECORATOR (sobre Composite)
        // =========================
        System.out.println("[CLIENTE] Aplicando decoradores a la ruta compuesta...");

        // El composite puede ser decorado igual que un componente simple
        com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent componente = rutaCompuesta;
        componente = new TraficoDecorator(componente);
        componente = new PeajeDecorator(componente);
        componente = new ClimaDecorator(componente);

        // Obtener la ruta final procesada
        Ruta rutaBase = new Ruta(
                vehiculoMasCercano.getLatitud() + "," + vehiculoMasCercano.getLongitud(),
                orden.getDestinoLat() + "," + orden.getDestinoLng(),
                rutaCompuesta.getDistanciaTotal()
        );

        rutaBase = componente.procesarRuta(rutaBase);

        System.out.println("[CLIENTE] Ruta final con decoradores: " + rutaBase.getDistancia() + " km");

        // =========================
        // FINAL
        // =========================
        vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
        vehiculoRepository.guardar(vehiculoMasCercano);

        orden.asignarVehiculo(vehiculoMasCercano.getPlaca());

        System.out.println("[CLIENTE] Orden asignada correctamente");
        System.out.println("================================================================================\n");

        return orden;
    }
}