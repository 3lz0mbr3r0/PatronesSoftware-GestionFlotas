package com.flotasytransportes.dominio.puertos;

import com.flotasytransportes.dominio.modelo.OrdenTransporte;
import java.util.List;
import java.util.Optional;

public interface OrdenRepositoryPort {

    OrdenTransporte guardar(OrdenTransporte orden);
    Optional<OrdenTransporte> buscarPorCodigo(String codigoOrden);
    List<OrdenTransporte> buscarTodas();
    void eliminarPorCodigo(String codigoOrden);

}