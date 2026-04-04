package com.flotasytransportes.dominio.modelo;

public class Moto extends Vehiculo {

    public Moto() {
        super();
    }

    public Moto(String placa, Double latitud, Double longitud,
                EstadoVehiculo estado, TipoEnergia tipoEnergia,
                Double kilometrajeActual, Double limiteMantenimiento) {
        super(placa, latitud, longitud, estado, tipoEnergia,
              kilometrajeActual, limiteMantenimiento);
    }

    // Constructor copia
    public Moto(Moto source) {
        super(source);
    }

    @Override
    public Vehiculo clonar() {
        return new Moto(this);
    }
}