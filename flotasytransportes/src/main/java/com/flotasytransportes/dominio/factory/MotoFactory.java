package com.flotasytransportes.dominio.factory;

import com.flotasytransportes.dominio.modelo.*;

public class MotoFactory extends VehiculoFactory {

    @Override
    public Vehiculo crearVehiculo(String placa, Double latitud, Double longitud,
                                  EstadoVehiculo estado, TipoEnergia tipoEnergia,
                                  Double kilometrajeActual,
                                  Double limiteMantenimiento) {

        return new Moto(placa, latitud, longitud,
                        estado, tipoEnergia, kilometrajeActual,
                        limiteMantenimiento);
    }
}