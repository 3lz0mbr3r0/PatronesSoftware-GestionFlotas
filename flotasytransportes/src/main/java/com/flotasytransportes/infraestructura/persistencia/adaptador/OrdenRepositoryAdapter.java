package com.flotasytransportes.infraestructura.persistencia.adaptador;

import com.flotasytransportes.dominio.modelo.OrdenTransporte;
import com.flotasytransportes.dominio.puertos.OrdenRepositoryPort;
import com.flotasytransportes.infraestructura.persistencia.entidad.OrdenEntity;
import com.flotasytransportes.infraestructura.persistencia.repositorio.OrdenJpaRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class OrdenRepositoryAdapter implements OrdenRepositoryPort {

    private final OrdenJpaRepository ordenJpaRepository;

    public OrdenRepositoryAdapter(OrdenJpaRepository ordenJpaRepository) {
        this.ordenJpaRepository = ordenJpaRepository;
    }

    @Override
    public OrdenTransporte guardar(OrdenTransporte orden) {
        OrdenEntity entity = mapToEntity(orden);
        OrdenEntity saved = ordenJpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<OrdenTransporte> buscarPorCodigo(String codigoOrden) {
        return ordenJpaRepository.findById(codigoOrden)
                .map(this::mapToDomain);
    }

    @Override
    public List<OrdenTransporte> buscarTodas() {
        return ordenJpaRepository.findAllByOrderByFechaCreacionDesc()
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    private OrdenTransporte mapToDomain(OrdenEntity entity) {
        if (entity == null) return null;

        OrdenTransporte orden = new OrdenTransporte(
                entity.getCodigoOrden(),
                entity.getOrigenLat(),
                entity.getOrigenLng(),
                entity.getDestinoLat(),
                entity.getDestinoLng()
        );

        if (entity.getVehiculoPlaca() != null) {
            orden.asignarVehiculo(entity.getVehiculoPlaca());
        }

        if (entity.getEstado() != null) {
            orden.setEstado(entity.getEstado());
        }

        if (entity.getFechaCreacion() != null) {
            orden.setFechaCreacion(entity.getFechaCreacion());
        }

        return orden;
    }

    private OrdenEntity mapToEntity(OrdenTransporte orden) {
        if (orden == null) return null;

        OrdenEntity entity = new OrdenEntity();
        entity.setCodigoOrden(orden.getCodigoOrden());
        entity.setOrigenLat(orden.getOrigenLat());
        entity.setOrigenLng(orden.getOrigenLng());
        entity.setDestinoLat(orden.getDestinoLat());
        entity.setDestinoLng(orden.getDestinoLng());
        entity.setVehiculoPlaca(orden.getVehiculoPlaca());
        entity.setEstado(orden.getEstado());
        entity.setFechaCreacion(orden.getFechaCreacion() != null ?
                orden.getFechaCreacion() : LocalDateTime.now());

        return entity;
    }
}