package com.flotasytransportes.dominio.factory;

import com.flotasytransportes.dominio.abstractfactory.VehiculoAbstractFactory;
import com.flotasytransportes.dominio.modelo.*;

public abstract class VehiculoFactory implements VehiculoAbstractFactory {

    // ESTE ES EL FACTORY METHOD
    public abstract Vehiculo crearVehiculo(
            String placa,
            Double latitud,
            Double longitud,
            EstadoVehiculo estado,
            Double kilometrajeActual,
            Double limiteMantenimiento
    );
}