package com.flotasytransportes.aplicacion.rutas.composite;

import com.flotasytransportes.dominio.modelo.Ruta;
import java.util.ArrayList;
import java.util.List;

public class RutaCompuestaComponent implements RutaComponent {

    private String nombreRuta;
    private final List<RutaComponent> segmentos;

    public RutaCompuestaComponent() {
        this.segmentos = new ArrayList<>();
        this.nombreRuta = "Ruta Compuesta";
    }

    public RutaCompuestaComponent(String nombreRuta) {
        this.segmentos = new ArrayList<>();
        this.nombreRuta = nombreRuta;
    }

    @Override
    public Ruta procesarRuta(Ruta ruta) {
        System.out.println("[RutaCompuesta] Procesando ruta compuesta con " 
            + segmentos.size() + " segmentos");

        Ruta rutaProcesada = ruta;
        for (RutaComponent segmento : segmentos) {
            rutaProcesada = segmento.procesarRuta(rutaProcesada);
        }

        return rutaProcesada;
    }

    @Override
    public double getDistanciaTotal() {
        return segmentos.stream()
                .mapToDouble(RutaComponent::getDistanciaTotal)
                .sum();
    }

    @Override
    public String getDescripcionRuta() {
        StringBuilder sb = new StringBuilder();
        sb.append("Ruta Compuesta (").append(nombreRuta).append("):\n");
        for (int i = 0; i < segmentos.size(); i++) {
            sb.append("  Segmento ").append(i + 1).append(": ")
              .append(segmentos.get(i).getDescripcionRuta())
              .append(" [")
              .append(String.format("%.2f km", segmentos.get(i).getDistanciaTotal()))
              .append("]\n");
        }
        sb.append("  Total: ").append(String.format("%.2f km", getDistanciaTotal()));
        return sb.toString();
    }

    @Override
    public List<RutaComponent> getSegmentos() {
        return new ArrayList<>(segmentos);
    }

    @Override
    public void addSegmento(RutaComponent segmento) {
        if (segmento != null) {
            segmentos.add(segmento);
            System.out.println("[RutaCompuesta] Segmento agregado: " 
                + segmento.getDescripcionRuta());
        }
    }

    @Override
    public void removeSegmento(RutaComponent segmento) {
        segmentos.remove(segmento);
        System.out.println("[RutaCompuesta] Segmento removido");
    }

    @Override
    public boolean isCompuesto() {
        return true;
    }

    public String getNombreRuta() {
        return nombreRuta;
    }

    public void setNombreRuta(String nombreRuta) {
        this.nombreRuta = nombreRuta;
    }

    public int getCantidadSegmentos() {
        return segmentos.size();
    }

    public void clearSegmentos() {
        segmentos.clear();
    }
}