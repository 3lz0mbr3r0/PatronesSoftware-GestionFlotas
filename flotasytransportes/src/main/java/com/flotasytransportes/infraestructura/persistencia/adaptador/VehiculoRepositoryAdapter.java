package com.flotasytransportes.infraestructura.persistencia.adaptador;

import com.flotasytransportes.dominio.factory.*;
import com.flotasytransportes.dominio.modelo.*;
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

    public VehiculoRepositoryAdapter(VehiculoJpaRepository vehiculoJpaRepository) {
        this.vehiculoJpaRepository = vehiculoJpaRepository;
    }

    // =========================
    // MÉTODOS DEL PUERTO
    // =========================

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
    // MAPEO ENTITY → DOMINIO
    // =========================

    private Vehiculo mapToDomain(VehiculoEntity entity) {

        if (entity == null) {
            return null;
        }

        VehiculoFactory factory;

        TipoVehiculo tipo = TipoVehiculo.valueOf(entity.getTipo());

        switch (tipo) {
            case CAMION:
                factory = new CamionFactory();
                break;
            case MOTO:
                factory = new MotoFactory();
                break;
            case FURGON:
                factory = new FurgonFactory();
                break;
            default:
                throw new IllegalArgumentException("Tipo no soportado");
        }

        Vehiculo vehiculo = factory.crearVehiculo(
                entity.getPlaca(),
                entity.getLatitud(),
                entity.getLongitud(),
                EstadoVehiculo.valueOf(entity.getEstado()),
                entity.getKilometrajeActual(),
                entity.getLimiteMantenimiento()
        );

        // 🔥 IMPORTANTE: asignar el ID después de crear el objeto
        vehiculo.setId(entity.getId());

        return vehiculo;
    }

    // =========================
    // MAPEO DOMINIO → ENTITY
    // =========================

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

        // 🔥 Detectar tipo según la subclase creada por Factory
        if (vehiculo instanceof Camion) {
            entity.setTipo(TipoVehiculo.CAMION.name());
        } else if (vehiculo instanceof Moto) {
            entity.setTipo(TipoVehiculo.MOTO.name());
        } else if (vehiculo instanceof Furgon) {
            entity.setTipo(TipoVehiculo.FURGON.name());
        } else {
            throw new IllegalArgumentException("Tipo de vehículo no soportado");
        }

        return entity;
    }
}