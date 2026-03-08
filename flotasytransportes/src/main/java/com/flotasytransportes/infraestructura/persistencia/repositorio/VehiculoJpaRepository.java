package com.flotasytransportes.infraestructura.persistencia.repositorio;

import com.flotasytransportes.infraestructura.persistencia.entidad.VehiculoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VehiculoJpaRepository extends JpaRepository<VehiculoEntity, String> {

    List<VehiculoEntity> findByEstado(String estado);
}
