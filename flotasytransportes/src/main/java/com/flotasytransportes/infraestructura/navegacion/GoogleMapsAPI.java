package com.flotasytransportes.infraestructura.navegacion;

import org.springframework.stereotype.Component;
import com.flotasytransportes.dominio.modelo.*;

@Component
public class GoogleMapsAPI implements NavegacionAPI {

    @Override
    public Ruta calcularRuta(String origen, String destino) {
        System.out.println("Google Maps en uso");
        return new Ruta(origen, destino, 10.0);
    }

    @Override
    public double calcularDistancia(String origen, String destino) {
        return 10.0;
    }
}
