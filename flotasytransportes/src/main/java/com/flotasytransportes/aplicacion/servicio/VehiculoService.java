package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculoService {

    private final VehiculoRepositoryPort vehiculoRepository;

    public VehiculoService(VehiculoRepositoryPort vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public Vehiculo actualizarUbicacion(Long id, Double lat, Double lng) {
        Vehiculo vehiculo = vehiculoRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.actualizarUbicacion(lat, lng);
        return vehiculoRepository.guardar(vehiculo);
    }

    public Vehiculo actualizarKilometraje(Long id, Double km) {
        Vehiculo vehiculo = vehiculoRepository.buscarPorId(id)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.actualizarKilometraje(km);
        return vehiculoRepository.guardar(vehiculo);
    }

    public List<Vehiculo> listar() {
        return vehiculoRepository.buscarTodos();
    }
}
