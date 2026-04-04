package com.flotasytransportes.dominio.modelo;

public class Camion extends Vehiculo {

    public Camion() {
        super();
    }

    public Camion(String placa, Double latitud, Double longitud,
                  EstadoVehiculo estado, TipoEnergia tipoEnergia,
                  Double kilometrajeActual, Double limiteMantenimiento) {
        super(placa, latitud, longitud, estado, tipoEnergia,
              kilometrajeActual, limiteMantenimiento);
    }

    // Constructor copia
    public Camion(Camion source) {
        super(source);
    }

    @Override
    public Vehiculo clonar() {
        return new Camion(this);
    }
}