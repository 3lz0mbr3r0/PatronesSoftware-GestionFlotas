package com.flotasytransportes.dominio.puerto.proxy;

public interface CacheAlmacenamiento<T> {
    
    T obtener(String clave);
    
    void guardar(String clave, T valor);
    
    void limpiar();
    
    boolean contiene(String clave);
    
    int tamano();
}