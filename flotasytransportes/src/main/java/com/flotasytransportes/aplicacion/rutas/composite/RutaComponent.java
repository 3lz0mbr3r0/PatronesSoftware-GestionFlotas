package com.flotasytransportes.aplicacion.rutas.composite;

import com.flotasytransportes.dominio.modelo.Ruta;
import java.util.List;

public interface RutaComponent extends com.flotasytransportes.aplicacion.rutas.decorator.RutaComponent {

    double getDistanciaTotal();

    String getDescripcionRuta();

    List<RutaComponent> getSegmentos();

    void addSegmento(RutaComponent segmento);

    void removeSegmento(RutaComponent segmento);

    boolean isCompuesto();
}