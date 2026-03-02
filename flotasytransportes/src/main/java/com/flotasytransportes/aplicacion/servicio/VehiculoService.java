package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import com.flotasytransportes.dominio.factory.*;
import com.flotasytransportes.infraestructura.web.dto.VehiculoDTO;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculoService {

    private final VehiculoRepositoryPort vehiculoRepository;

    public VehiculoService(VehiculoRepositoryPort vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }
    
    public Vehiculo guardar(Vehiculo vehiculo) {
        return vehiculoRepository.guardar(vehiculo);
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
    
    public Vehiculo crearVehiculo(TipoVehiculo tipo, VehiculoDTO dto) {

        VehiculoFactory factory;

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
                dto.getPlaca(),
                dto.getLatitud(),
                dto.getLongitud(),
                dto.getEstado(),
                dto.getKilometrajeActual(),
                dto.getLimiteMantenimiento()
        );

        return vehiculoRepository.guardar(vehiculo);
    }
    
}
