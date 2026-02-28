package com.flotasytransportes.dominio.puertos;

import com.flotasytransportes.dominio.modelo.Vehiculo;
import java.util.List;
import java.util.Optional;

public interface VehiculoRepositoryPort {

    Vehiculo guardar(Vehiculo vehiculo);
    Optional<Vehiculo> buscarPorId(Long id);
    List<Vehiculo> buscarDisponibles();
    List<Vehiculo> buscarTodos();
}
