package com.flotasytransportes.aplicacion.rutas.decorator;

import com.flotasytransportes.dominio.modelo.Ruta;

public class ClimaDecorator extends RutaDecorator {

    public ClimaDecorator(RutaComponent wrappee) {
        super(wrappee);
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        ruta = super.procesarRuta(ruta);

        System.out.println("[DECORATOR] Ajustando por condiciones climáticas");
        return new Ruta(ruta.getOrigen(), ruta.getDestino(), ruta.getDistancia() + 1.5);
    }
}