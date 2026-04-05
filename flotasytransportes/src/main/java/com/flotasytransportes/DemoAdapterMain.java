package com.flotasytransportes;

import org.springframework.boot.WebApplicationType;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import com.flotasytransportes.aplicacion.servicio.OrdenService;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;

public class DemoAdapterMain {

    public static void main(String[] args) {

        ConfigurableApplicationContext context = new SpringApplicationBuilder(FlotasytransportesApplication.class)
                .web(WebApplicationType.NONE) // evita levantar el servidor web
                .run(args);

        try {
            OrdenService ordenService = context.getBean(OrdenService.class);

            OrdenTransporte orden = new OrdenTransporte(
                    "ORD-001",
                    7.125,   // origenLat
                    -73.119, // origenLng
                    7.200,   // destinoLat
                    -73.050  // destinoLng
            );

            ordenService.crearYAsignarOrden(orden);

        } finally {
            context.close();
        }
    }
}