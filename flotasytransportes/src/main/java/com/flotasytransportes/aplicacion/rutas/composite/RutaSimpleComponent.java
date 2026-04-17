package com.flotasytransportes.aplicacion.rutas.composite;

import com.flotasytransportes.dominio.modelo.Ruta;
import java.util.Collections;
import java.util.List;

public class RutaSimpleComponent implements RutaComponent {

    private final Ruta ruta;
    private double ajusteDistancia;

    public RutaSimpleComponent(Ruta ruta) {
        this.ruta = ruta;
        this.ajusteDistancia = 0;
    }

    public RutaSimpleComponent(Ruta ruta, double ajusteDistancia) {
        this.ruta = ruta;
        this.ajusteDistancia = ajusteDistancia;
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        System.out.println("[RutaSimple] Procesando ruta directa: " 
            + ruta.getOrigen() + " -> " + ruta.getDestino());
        return ruta;
    }

    @Override
    public double getDistanciaTotal() {
        return ruta.getDistancia() + ajusteDistancia;
    }

    @Override
    public String getDescripcionRuta() {
        return "Ruta simple: " + ruta.getOrigen() + " -> " + ruta.getDestino();
    }

    @Override
    public List<RutaComponent> getSegmentos() {
        return Collections.emptyList();
    }

    @Override
    public void addSegmento(RutaComponent segmento) {
        throw new UnsupportedOperationException(
            "Una ruta simple no puede contener segmentos");
    }

    @Override
    public void removeSegmento(RutaComponent segmento) {
        throw new UnsupportedOperationException(
            "Una ruta simple no puede contener segmentos");
    }

    @Override
    public boolean isCompuesto() {
        return false;
    }

    public Ruta getRuta() {
        return ruta;
    }

    public void setAjusteDistancia(double ajusteDistancia) {
        this.ajusteDistancia = ajusteDistancia;
    }
}