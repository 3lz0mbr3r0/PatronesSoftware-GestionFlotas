package com.flotasytransportes.infraestructura.navegacion;

import org.springframework.stereotype.Component;
import com.flotasytransportes.dominio.modelo.*;

@Component
public class OpenStreetMapAPI implements NavegacionAPI {

    @Override
    public Ruta calcularRuta(String origen, String destino) {
        System.out.println("OSM en uso");
        return new Ruta(origen, destino, 12.0);
    }

    @Override
    public double calcularDistancia(String origen, String destino) {
        return 12.0;
    }
}
