package com.flotasytransportes.infraestructura.integracion;

import com.flotasytransportes.aplicacion.servicio.CalculadoraDistanciaService;
import com.flotasytransportes.dominio.puertos.DistanciaServicePort;

public class DistanciaAdapter implements DistanciaServicePort {

    private final CalculadoraDistanciaService calculadoraDistanciaService;

    public DistanciaAdapter(CalculadoraDistanciaService calculadoraDistanciaService) {
        this.calculadoraDistanciaService = calculadoraDistanciaService;
    }

    @Override
    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        System.out.println("[ADAPTER - DistanciaAdapter] Adaptando solicitud de cálculo...");
        return calculadoraDistanciaService.calcularDistancia(lat1, lon1, lat2, lon2);
    }
}