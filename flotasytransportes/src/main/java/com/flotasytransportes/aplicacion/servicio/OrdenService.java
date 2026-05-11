package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.aplicacion.facade.OrdenTransporteFacade;
import com.flotasytransportes.aplicacion.rutas.decorator.*;
import com.flotasytransportes.aplicacion.rutas.ServicioRutas;
import com.flotasytransportes.aplicacion.rutas.composite.*;
import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.DistanciaServicePort;
import com.flotasytransportes.dominio.puertos.OrdenRepositoryPort;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicInteger;

@Service
public class OrdenService {

    private final VehiculoRepositoryPort vehiculoRepository;
    private final DistanciaServicePort distanciaService;
    private final ServicioRutas servicioRutas;
    private final OrdenRepositoryPort ordenRepository;

    private static final AtomicInteger contadorOrdenes = new AtomicInteger(0);

    public OrdenService(VehiculoRepositoryPort vehiculoRepository,
                        @Qualifier("distanciaServicePort") DistanciaServicePort distanciaService,
                        ServicioRutas servicioRutas,
                        OrdenRepositoryPort ordenRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.distanciaService = distanciaService;
        this.servicioRutas = servicioRutas;
        this.ordenRepository = ordenRepository;
        inicializarContador();
    }

    private void inicializarContador() {
        try {
            List<OrdenTransporte> todas = ordenRepository.buscarTodas();
            int max = 0;
            for (OrdenTransporte o : todas) {
                String cod = o.getCodigoOrden();
                if (cod != null && cod.startsWith("ORD")) {
                    try {
                        int num = Integer.parseInt(cod.replace("ORD", ""));
                        if (num > max) max = num;
                    } catch (NumberFormatException ignored) {}
                }
            }
            contadorOrdenes.set(max);
        } catch (Exception e) {
            contadorOrdenes.set(0);
        }
    }

    public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {
        if (orden.getCodigoOrden() == null || orden.getCodigoOrden().isBlank()) {
            String nextCode = String.format("ORD%03d", contadorOrdenes.incrementAndGet());
            orden.setCodigoOrden(nextCode);
        }

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

        // Bridge
        System.out.println("[CLIENTE] Generando ruta con Bridge...");
        Ruta rutaVehiculoAOrigen = servicioRutas.generarRuta(
                vehiculoMasCercano.getLatitud() + "," + vehiculoMasCercano.getLongitud(),
                orden.getOrigenLat() + "," + orden.getOrigenLng()
        );
        Ruta rutaOrigenADestino = servicioRutas.generarRuta(
                orden.getOrigenLat() + "," + orden.getOrigenLng(),
                orden.getDestinoLat() + "," + orden.getDestinoLng()
        );

        System.out.println("[CLIENTE] Ruta vehículo->origen: " + rutaVehiculoAOrigen.getDistancia() + " km");
        System.out.println("[CLIENTE] Ruta origen->destino: " + rutaOrigenADestino.getDistancia() + " km");

        // Composite
        System.out.println("[CLIENTE] Construyendo ruta compuesta con Composite...");
        RutaSimpleComponent segmento1 = new RutaSimpleComponent(rutaVehiculoAOrigen);
        RutaSimpleComponent segmento2 = new RutaSimpleComponent(rutaOrigenADestino);
        RutaCompuestaComponent rutaCompuesta = new RutaCompuestaComponent("Entrega Completa");
        rutaCompuesta.addSegmento(segmento1);
        rutaCompuesta.addSegmento(segmento2);

        System.out.println("[COMPOSITE] Distancia total compuesta: " + rutaCompuesta.getDistanciaTotal() + " km");

        // Decorator
        System.out.println("[CLIENTE] Aplicando decoradores a la ruta compuesta...");
        com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent componente = rutaCompuesta;
        componente = new TraficoDecorator(componente);
        componente = new PeajeDecorator(componente);
        componente = new ClimaDecorator(componente);

        Ruta rutaBase = new Ruta(
                vehiculoMasCercano.getLatitud() + "," + vehiculoMasCercano.getLongitud(),
                orden.getDestinoLat() + "," + orden.getDestinoLng(),
                rutaCompuesta.getDistanciaTotal()
        );
        rutaBase = componente.procesarRuta(rutaBase);
        System.out.println("[CLIENTE] Ruta final con decoradores: " + rutaBase.getDistancia() + " km");

        // Final
        vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
        vehiculoRepository.guardar(vehiculoMasCercano);
        orden.asignarVehiculo(vehiculoMasCercano.getPlaca());

        OrdenTransporte ordenGuardada = ordenRepository.guardar(orden);

        System.out.println("[CLIENTE] Orden asignada correctamente - Vehículo: " + ordenGuardada.getVehiculoPlaca());
        System.out.println("================================================================================\n");

        return ordenGuardada;
    }

    public List<OrdenTransporte> listarOrdenes() {
        return ordenRepository.buscarTodas();
    }
}