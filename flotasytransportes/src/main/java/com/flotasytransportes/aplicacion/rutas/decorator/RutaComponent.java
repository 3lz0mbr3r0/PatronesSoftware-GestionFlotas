package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public interface RutaComponent {
    Ruta procesarRuta(Ruta ruta);
}