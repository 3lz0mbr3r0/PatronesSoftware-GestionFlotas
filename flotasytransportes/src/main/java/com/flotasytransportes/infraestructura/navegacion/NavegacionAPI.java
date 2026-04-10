package com.flotasytransportes.infraestructura.navegacion;

import com.flotasytransportes.dominio.modelo.*;

public interface NavegacionAPI {
    Ruta calcularRuta(String origen, String destino);
    double calcularDistancia(String origen, String destino);
}
