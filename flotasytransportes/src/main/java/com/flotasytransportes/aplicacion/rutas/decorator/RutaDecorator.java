package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public abstract class RutaDecorator implements RutaComponent {

    protected RutaComponent wrappee;

    public RutaDecorator(RutaComponent wrappee) {
        this.wrappee = wrappee;
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        return wrappee.procesarRuta(ruta);
    }
}