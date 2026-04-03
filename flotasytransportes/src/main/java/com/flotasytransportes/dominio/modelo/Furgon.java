package com.flotasytransportes.dominio.modelo;

public class Furgon extends Vehiculo {

    public Furgon() {
        super();
    }

    public Furgon(String placa, Double latitud, Double longitud,
                  EstadoVehiculo estado, TipoEnergia tipoEnergia,
                  Double kilometrajeActual, Double limiteMantenimiento) {
        super(placa, latitud, longitud, estado, tipoEnergia,
              kilometrajeActual, limiteMantenimiento);
    }

    // Constructor copia
    public Furgon(Furgon source) {
        super(source);
    }

    @Override
    public Vehiculo clonar() {
        return new Furgon(this);
    }
}