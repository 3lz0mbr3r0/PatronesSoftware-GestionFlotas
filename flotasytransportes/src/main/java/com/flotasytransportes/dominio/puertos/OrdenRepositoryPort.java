package com.flotasytransportes.dominio.puertos;

import com.flotasytransportes.dominio.modelo.OrdenTransporte;

public interface OrdenRepositoryPort {

    OrdenTransporte guardar(OrdenTransporte orden);
}
