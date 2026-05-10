package com.flotasytransportes.infraestructura.persistencia.repositorio;

import com.flotasytransportes.infraestructura.persistencia.entidad.OrdenEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrdenJpaRepository extends JpaRepository<OrdenEntity, String> {
    List<OrdenEntity> findAllByOrderByFechaCreacionDesc();
}