package com.flotasytransportes.dominio.factory;

import com.flotasytransportes.dominio.modelo.*;

public class CamionFactory extends VehiculoFactory {

	@Override
	public Vehiculo crearVehiculo(String placa, Double latitud, Double longitud, EstadoVehiculo estado,
			Double kilometrajeActual, Double limiteMantenimiento) {

		return new Camion(placa, latitud, longitud, estado, kilometrajeActual, limiteMantenimiento);
	}
}