package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public class RutaBaseComponent implements RutaComponent {

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        System.out.println("[BASE] Ruta sin modificaciones");
        return ruta;
    }
}