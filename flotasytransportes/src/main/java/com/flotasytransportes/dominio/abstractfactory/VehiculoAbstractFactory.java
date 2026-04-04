package com.flotasytransportes.dominio.abstractfactory;

import com.flotasytransportes.dominio.modelo.Vehiculo;
import com.flotasytransportes.dominio.modelo.EstadoVehiculo;
import com.flotasytransportes.dominio.modelo.TipoEnergia;

public interface VehiculoAbstractFactory {

	Vehiculo crearVehiculo(String placa, Double latitud, Double longitud, EstadoVehiculo estado, TipoEnergia tipoEnergia,
			Double kilometrajeActual, Double limiteMantenimiento);

}