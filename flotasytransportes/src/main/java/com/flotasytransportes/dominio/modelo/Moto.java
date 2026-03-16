package com.flotasytransportes.dominio.modelo;

public class Moto extends Vehiculo {

    public Moto(String placa, Double latitud, Double longitud,
                EstadoVehiculo estado, TipoEnergia tipoEnergia,
                Double kilometrajeActual,
                Double limiteMantenimiento) {
        super(placa, latitud, longitud, estado, tipoEnergia,
              kilometrajeActual, limiteMantenimiento);
    }
}