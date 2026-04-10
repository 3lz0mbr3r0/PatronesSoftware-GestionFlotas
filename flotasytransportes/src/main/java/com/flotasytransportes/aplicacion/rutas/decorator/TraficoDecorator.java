package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public class TraficoDecorator extends RutaDecorator {

    public TraficoDecorator(RutaComponent wrappee) {
        super(wrappee);
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        ruta = super.procesarRuta(ruta);

        System.out.println("[DECORATOR] Ajustando ruta por tráfico");
        return new Ruta(ruta.getOrigen(), ruta.getDestino(), ruta.getDistancia() + 2);
    }
}