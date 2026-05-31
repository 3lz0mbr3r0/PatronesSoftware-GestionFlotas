package com.flotasytransportes.infraestructura.persistencia.repositorio;

import com.flotasytransportes.infraestructura.persistencia.entidad.ReporteMantenimientoEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ReporteMantenimientoJpaRepository extends JpaRepository<ReporteMantenimientoEntity, Long> {
    List<ReporteMantenimientoEntity> findByPlacaVehiculoOrderByFechaAsc(String placaVehiculo);
    void deleteByPlacaVehiculoAndTipoMantenimientoAndFecha(String placaVehiculo, String tipoMantenimiento, String fecha);
}
