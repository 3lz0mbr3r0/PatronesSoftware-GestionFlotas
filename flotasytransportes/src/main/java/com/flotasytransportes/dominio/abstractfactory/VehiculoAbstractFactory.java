package com.flotasytransportes.dominio.abstractfactory;

import com.flotasytransportes.dominio.modelo.Vehiculo;
import com.flotasytransportes.dominio.modelo.EstadoVehiculo;

public interface VehiculoAbstractFactory {

	Vehiculo crearVehiculo(String placa, Double latitud, Double longitud, EstadoVehiculo estado,
			Double kilometrajeActual, Double limiteMantenimiento);

}