package com.flotasytransportes.aplicacion.rutas.composite;

import com.flotasytransportes.dominio.modelo.Ruta;
import java.util.Collections;
import java.util.List;

public class RutaBaseComponentAdapter implements RutaComponent {

    private final com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent componente;

    public RutaBaseComponentAdapter(
            com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent componente) {
        this.componente = componente;
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        return componente.procesarRuta(ruta);
    }

    @Override
    public double getDistanciaTotal() {
        return 0;
    }

    @Override
    public String getDescripcionRuta() {
        return "Componente base";
    }

    @Override
    public List<RutaComponent> getSegmentos() {
        return Collections.emptyList();
    }

    @Override
    public void addSegmento(RutaComponent segmento) {
        throw new UnsupportedOperationException("No es un componente compuesto");
    }

    @Override
    public void removeSegmento(RutaComponent segmento) {
        throw new UnsupportedOperationException("No es un componente compuesto");
    }

    @Override
    public boolean isCompuesto() {
        return false;
    }

    public com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent getComponente() {
        return componente;
    }
}