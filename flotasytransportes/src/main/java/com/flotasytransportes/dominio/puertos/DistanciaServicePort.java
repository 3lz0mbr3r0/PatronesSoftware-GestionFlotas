package com.flotasytransportes.dominio.puertos;

public interface DistanciaServicePort {

    double calcularDistancia(double lat1, double lon1, double lat2, double lon2);
    
}