package com.flotasytransportes.infraestructura.persistencia.adaptador;

import org.springframework.stereotype.Repository;
import com.flotasytransportes.dominio.puertos.OrdenRepositoryPort;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;

@Repository
public class OrdenRepositoryAdapter implements OrdenRepositoryPort {

    @Override
    public OrdenTransporte guardar(OrdenTransporte orden) {
        // lógica de guardado
        return orden;
    }
}