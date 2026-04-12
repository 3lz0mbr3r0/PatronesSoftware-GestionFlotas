package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public class PeajeDecorator extends RutaDecorator {

    public PeajeDecorator(RutaComponent wrappee) {
        super(wrappee);
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        ruta = super.procesarRuta(ruta);

        System.out.println("[DECORATOR] Añadiendo costo de peajes");
        return new Ruta(ruta.getOrigen(), ruta.getDestino(), ruta.getDistancia() + 1);
    }
}