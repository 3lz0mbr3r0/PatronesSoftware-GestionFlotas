package com.flotasytransportes.aplicacion.rutas;

import com.flotasytransportes.infraestructura.navegacion.NavegacionAPI;
import com.flotasytransportes.dominio.modelo.*;

public class RutaRapidaService extends ServicioRutas {

    public RutaRapidaService(NavegacionAPI api) {
        super(api);
    }

    @Override
    public Ruta generarRuta(String origen, String destino) {
        System.out.println("Ruta rápida");
        return navegacionAPI.calcularRuta(origen, destino);
    }
}
