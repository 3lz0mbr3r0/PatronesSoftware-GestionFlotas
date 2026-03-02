package com.flotasytransportes.aplicacion.servicio;

import com.flotasytransportes.dominio.modelo.*;
import com.flotasytransportes.dominio.puertos.*;

import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
public class OrdenService {

	private final OrdenRepositoryPort ordenRepository;
	private final VehiculoRepositoryPort vehiculoRepository;
	private final CalculadoraDistanciaService calculadoraDistancia;

	public OrdenService(OrdenRepositoryPort ordenRepository, VehiculoRepositoryPort vehiculoRepository,
			CalculadoraDistanciaService calculadoraDistancia) {
		this.ordenRepository = ordenRepository;
		this.vehiculoRepository = vehiculoRepository;
		this.calculadoraDistancia = calculadoraDistancia;
	}

	public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {

		List<Vehiculo> disponibles = vehiculoRepository.buscarDisponibles();

		if (disponibles.isEmpty()) {
			throw new RuntimeException("No hay vehículos disponibles");
		}

		Vehiculo vehiculoMasCercano = disponibles.stream().min(Comparator.comparing(v -> calculadoraDistancia
				.calcularDistancia(orden.getOrigenLat(), orden.getOrigenLng(), v.getLatitud(), v.getLongitud())))
				.orElseThrow();

		// Cambiar estado del vehículo
		vehiculoMasCercano.cambiarEstado(EstadoVehiculo.EN_RUTA);
		vehiculoRepository.guardar(vehiculoMasCercano);

		// Asignar vehículo a la orden
		orden.asignarVehiculo(vehiculoMasCercano.getId());

		return ordenRepository.guardar(orden);
	}
}
