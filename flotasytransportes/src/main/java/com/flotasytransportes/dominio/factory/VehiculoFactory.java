package com.flotasytransportes.dominio.factory;

import com.flotasytransportes.dominio.modelo.*;

public abstract class VehiculoFactory {

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