package com.flotasytransportes.dominio.modelo;

public class Furgon extends Vehiculo {

    public Furgon(String placa, Double latitud, Double longitud,
                  EstadoVehiculo estado,
                  Double kilometrajeActual,
                  Double limiteMantenimiento) {
        super(placa, latitud, longitud, estado,
              kilometrajeActual, limiteMantenimiento);
    }
}