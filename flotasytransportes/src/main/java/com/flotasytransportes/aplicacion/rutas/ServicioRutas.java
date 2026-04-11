package com.flotasytransportes.aplicacion.rutas;

import com.flotasytransportes.infraestructura.navegacion.NavegacionAPI;
import com.flotasytransportes.dominio.modelo.*;

public abstract class ServicioRutas {

    protected NavegacionAPI navegacionAPI;

    public ServicioRutas(NavegacionAPI navegacionAPI) {
        this.navegacionAPI = navegacionAPI;
    }

    public abstract Ruta generarRuta(String origen, String destino);
}
