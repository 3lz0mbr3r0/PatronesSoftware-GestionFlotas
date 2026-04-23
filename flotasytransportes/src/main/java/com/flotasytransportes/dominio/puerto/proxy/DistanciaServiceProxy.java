package com.flotasytransportes.dominio.puerto.proxy;

import com.flotasytransportes.dominio.puertos.DistanciaServicePort;

public class DistanciaServiceProxy implements DistanciaServicePort {

    private final DistanciaServicePort servicioReal;
    private final CacheAlmacenamiento<Double> cache;

    public DistanciaServiceProxy(
            DistanciaServicePort servicioReal,
            CacheAlmacenamiento<Double> cache) {
        this.servicioReal = servicioReal;
        this.cache = cache;
    }

    @Override
    public double calcularDistancia(double lat1, double lon1, double lat2, double lon2) {
        String clave = generarClave(lat1, lon1, lat2, lon2);

        Double resultadoCacheado = cache.obtener(clave);
        if (resultadoCacheado != null) {
            System.out.println("[PROXY CACHE] Cache HIT para: " + clave);
            return resultadoCacheado;
        }

        System.out.println("[PROXY CACHE] Cache MISS - calculando distancia...");
        double distancia = servicioReal.calcularDistancia(lat1, lon1, lat2, lon2);

        cache.guardar(clave, distancia);
        System.out.println("[PROXY CACHE] Guardado en cache. Tamaño actual: " + cache.tamano());

        return distancia;
    }

    private String generarClave(double lat1, double lon1, double lat2, double lon2) {
        return String.format("%.4f,%.4f-%.4f,%.4f", lat1, lon1, lat2, lon2);
    }

    public int getCacheTamano() {
        return cache.tamano();
    }

    public void limpiarCache() {
        cache.limpiar();
        System.out.println("[PROXY CACHE] Cache limpiado");
    }
}