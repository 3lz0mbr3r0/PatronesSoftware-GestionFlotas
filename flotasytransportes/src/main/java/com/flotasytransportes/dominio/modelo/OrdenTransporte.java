package com.flotasytransportes.dominio.modelo;

public class OrdenTransporte {

    private String placa;
    private Double origenLat;
    private Double origenLng;
    private Double destinoLat;
    private Double destinoLng;
    private Long vehiculoId;

    public OrdenTransporte(String placa, Double origenLat, Double origenLng,
                           Double destinoLat, Double destinoLng) {
        this.placa = placa;
        this.origenLat = origenLat;
        this.origenLng = origenLng;
        this.destinoLat = destinoLat;
        this.destinoLng = destinoLng;
    }

    public void asignarVehiculo(String placa) {
        this.placa = placa;
    }

    public String generarLinkNavegacion() {
        return "https://www.google.com/maps/dir/"
                + origenLat + "," + origenLng + "/"
                + destinoLat + "," + destinoLng;
    }

    // getters
    public String getPlaca() { return placa; }
    public Double getOrigenLat() { return origenLat; }
    public Double getOrigenLng() { return origenLng; }
    public Double getDestinoLat() { return destinoLat; }
    public Double getDestinoLng() { return destinoLng; }
    public Long getVehiculoId() { return vehiculoId; }
}
