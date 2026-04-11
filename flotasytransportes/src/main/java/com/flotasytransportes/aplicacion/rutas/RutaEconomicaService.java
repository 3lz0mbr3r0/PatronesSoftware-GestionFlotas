package com.flotasytransportes.aplicacion.rutas;

import com.flotasytransportes.infraestructura.navegacion.NavegacionAPI;
import com.flotasytransportes.dominio.modelo.*;

public class RutaEconomicaService extends ServicioRutas {

    public RutaEconomicaService(NavegacionAPI api) {
        super(api);
    }

    @Override
    public Ruta generarRuta(String origen, String destino) {
        System.out.println("Ruta económica");
        return navegacionAPI.calcularRuta(origen, destino);
    }
}
