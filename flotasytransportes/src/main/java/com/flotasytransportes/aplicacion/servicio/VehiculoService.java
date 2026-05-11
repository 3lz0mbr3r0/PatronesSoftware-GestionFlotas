package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.VehiculoRepositoryPort;
import com.flotasytransportes.dominio.factory.*;
import com.flotasytransportes.dominio.abstractfactory.*;
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

    public Vehiculo actualizarUbicacion(String placa, Double lat, Double lng) {
        Vehiculo vehiculo = vehiculoRepository.buscarPorPlaca(placa)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.actualizarUbicacion(lat, lng);
        return vehiculoRepository.guardar(vehiculo);
    }

    public Vehiculo actualizarKilometraje(String placa, Double km) {
        Vehiculo vehiculo = vehiculoRepository.buscarPorPlaca(placa)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));

        vehiculo.actualizarKilometraje(km);
        return vehiculoRepository.guardar(vehiculo);
    }

    public List<Vehiculo> listar() {
        return vehiculoRepository.buscarTodos();
    }
    
    public Vehiculo buscarVehiculo(String placa) {

        return vehiculoRepository.buscarPorPlaca(placa)
                .orElseThrow(() ->
                        new RuntimeException("Vehiculo no encontrado"));
    }
    
    public void eliminarVehiculo(String placa) {

        if (!vehiculoRepository.buscarPorPlaca(placa).isPresent()) {
            throw new RuntimeException("Vehiculo no encontrado");
        }

        vehiculoRepository.eliminarPorPlaca(placa);
    }
    
    
    public Vehiculo cambiarEstado(String placa, EstadoVehiculo estado) {
        Vehiculo vehiculo = vehiculoRepository.buscarPorPlaca(placa)
                .orElseThrow(() -> new RuntimeException("Vehículo no encontrado"));
        if (vehiculo.getEstado() == EstadoVehiculo.MANTENIMIENTO && estado == EstadoVehiculo.DISPONIBLE) {
            vehiculo.setLimiteMantenimiento(vehiculo.getLimiteMantenimiento() * 2);
        }
        vehiculo.cambiarEstado(estado);
        return vehiculoRepository.guardar(vehiculo);
    }

    public Vehiculo crearVehiculo(TipoVehiculo tipo, VehiculoDTO dto) {

        VehiculoAbstractFactory abstractfactory;

        switch (tipo) {
            case CAMION:
            	abstractfactory = new CamionFactory();
                break;
            case MOTO:
            	abstractfactory = new MotoFactory();
                break;
            case FURGON:
            	abstractfactory = new FurgonFactory();
                break;
            default:
                throw new IllegalArgumentException("Tipo no soportado");
        }

        Vehiculo vehiculo = abstractfactory.crearVehiculo(
                dto.getPlaca(),
                dto.getLatitud(),
                dto.getLongitud(),
                dto.getEstado(),
                dto.getTipoEnergia(),
                dto.getKilometrajeActual(),
                dto.getLimiteMantenimiento()
        );

        return vehiculoRepository.guardar(vehiculo);
    }
    
    
    // =========================
    // MÉTODO PROTOTYPE
    // =========================
    
    public Vehiculo clonarVehiculo(String placaOriginal, VehiculoDTO dto) {

        Vehiculo original = vehiculoRepository.buscarPorPlaca(placaOriginal)
                .orElseThrow(() -> new RuntimeException("Vehículo original no encontrado"));

        Vehiculo clon = original.clonar();

        clon.setPlaca(dto.getPlaca());

        if (dto.getLatitud() != null) {
            clon.setLatitud(dto.getLatitud());
        }

        if (dto.getLongitud() != null) {
            clon.setLongitud(dto.getLongitud());
        }

        if (dto.getEstado() != null) {
            clon.setEstado(dto.getEstado());
        }

        if (dto.getTipoEnergia() != null) {
            clon.setTipoEnergia(dto.getTipoEnergia());
        }

        if (dto.getKilometrajeActual() != null) {
            clon.setKilometrajeActual(dto.getKilometrajeActual());
        }

        if (dto.getLimiteMantenimiento() != null) {
            clon.setLimiteMantenimiento(dto.getLimiteMantenimiento());
        }

        return vehiculoRepository.guardar(clon);
    }
    
}
