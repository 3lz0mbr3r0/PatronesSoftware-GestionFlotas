package com.flotasytransportes.dominio.puerto.proxy;

import org.springframework.stereotype.Component;
import java.util.LinkedHashMap;
import java.util.Map;

@Component
public class CacheEnMemoria<T> implements CacheAlmacenamiento<T> {

    private final Map<String, T> cache;
    private final int capacidadMaxima;

    public CacheEnMemoria() {
        this.capacidadMaxima = 100;
        this.cache = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, T> eldest) {
                return size() > CacheEnMemoria.this.capacidadMaxima;
            }
        };
    }

    public CacheEnMemoria(int capacidadMaxima) {
        this.capacidadMaxima = capacidadMaxima;
        this.cache = new LinkedHashMap<>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<String, T> eldest) {
                return size() > CacheEnMemoria.this.capacidadMaxima;
            }
        };
    }

    @Override
    public T obtener(String clave) {
        return cache.get(clave);
    }

    @Override
    public void guardar(String clave, T valor) {
        cache.put(clave, valor);
    }

    @Override
    public void limpiar() {
        cache.clear();
    }

    @Override
    public boolean contiene(String clave) {
        return cache.containsKey(clave);
    }

    @Override
    public int tamano() {
        return cache.size();
    }

    public int getCapacidadMaxima() {
        return capacidadMaxima;
    }
}