package com.flotasytransportes.infraestructura.persistencia.adaptador;

import com.flotasytransportes.dominio.modelo.EstadoVehiculo;
import com.flotasytransportes.dominio.modelo.Vehiculo;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import com.flotasytransportes.infraestructura.persistencia.entidad.VehiculoEntity;
import com.flotasytransportes.infraestructura.persistencia.repositorio.VehiculoJpaRepository;

import org.springframework.stereotype.Component;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Component
public class VehiculoRepositoryAdapter implements VehiculoRepositoryPort {

    private final VehiculoJpaRepository vehiculoJpaRepository;

    // Constructor obligatorio (inyección por constructor)
    public VehiculoRepositoryAdapter(VehiculoJpaRepository vehiculoJpaRepository) {
        this.vehiculoJpaRepository = vehiculoJpaRepository;
    }

    @Override
    public Vehiculo guardar(Vehiculo vehiculo) {
        VehiculoEntity entity = mapToEntity(vehiculo);
        VehiculoEntity saved = vehiculoJpaRepository.save(entity);
        return mapToDomain(saved);
    }

    @Override
    public Optional<Vehiculo> buscarPorId(Long id) {
        return vehiculoJpaRepository.findById(id)
                .map(this::mapToDomain);
    }

    @Override
    public List<Vehiculo> buscarDisponibles() {
        return vehiculoJpaRepository.findByEstado("DISPONIBLE")
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    @Override
    public List<Vehiculo> buscarTodos() {
        return vehiculoJpaRepository.findAll()
                .stream()
                .map(this::mapToDomain)
                .collect(Collectors.toList());
    }

    // =========================
    // MÉTODOS DE MAPEO
    // =========================

    private Vehiculo mapToDomain(VehiculoEntity entity) {

        if (entity == null) {
            return null;
        }

        return new Vehiculo(
                entity.getId(),
                entity.getPlaca(),
                entity.getLatitud(),
                entity.getLongitud(),
                EstadoVehiculo.valueOf(entity.getEstado()),
                entity.getKilometrajeActual(),
                entity.getLimiteMantenimiento()
        );
    }

    private VehiculoEntity mapToEntity(Vehiculo vehiculo) {

        if (vehiculo == null) {
            return null;
        }

        VehiculoEntity entity = new VehiculoEntity();

        entity.setId(vehiculo.getId());
        entity.setPlaca(vehiculo.getPlaca());
        entity.setLatitud(vehiculo.getLatitud());
        entity.setLongitud(vehiculo.getLongitud());
        entity.setEstado(vehiculo.getEstado().name());
        entity.setKilometrajeActual(vehiculo.getKilometrajeActual());
        entity.setLimiteMantenimiento(vehiculo.getLimiteMantenimiento());

        return entity;
    }
}
