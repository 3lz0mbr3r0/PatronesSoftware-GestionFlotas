package com.flotasytransportes.dominio.modelo;

public class OrdenTransporte {

    private String codigoOrden;
    private Double origenLat;
    private Double origenLng;
    private Double destinoLat;
    private Double destinoLng;
    private String vehiculoPlaca;

    public OrdenTransporte() {
    }

    public OrdenTransporte(String codigoOrden, Double origenLat, Double origenLng,
                           Double destinoLat, Double destinoLng) {
        this.codigoOrden = codigoOrden;
        this.origenLat = origenLat;
        this.origenLng = origenLng;
        this.destinoLat = destinoLat;
        this.destinoLng = destinoLng;
    }

    public void asignarVehiculo(String vehiculoPlaca) {
        this.vehiculoPlaca = vehiculoPlaca;
    }

    public String generarLinkNavegacion() {
        return "https://www.google.com/maps/dir/"
                + origenLat + "," + origenLng + "/"
                + destinoLat + "," + destinoLng;
    }

    // Getters y Setters
    public String getCodigoOrden() {
        return codigoOrden;
    }

    public void setCodigoOrden(String codigoOrden) {
        this.codigoOrden = codigoOrden;
    }

    public Double getOrigenLat() {
        return origenLat;
    }

    public void setOrigenLat(Double origenLat) {
        this.origenLat = origenLat;
    }

    public Double getOrigenLng() {
        return origenLng;
    }

    public void setOrigenLng(Double origenLng) {
        this.origenLng = origenLng;
    }

    public Double getDestinoLat() {
        return destinoLat;
    }

    public void setDestinoLat(Double destinoLat) {
        this.destinoLat = destinoLat;
    }

    public Double getDestinoLng() {
        return destinoLng;
    }

    public void setDestinoLng(Double destinoLng) {
        this.destinoLng = destinoLng;
    }

    public String getVehiculoPlaca() {
        return vehiculoPlaca;
    }

    public void setVehiculoPlaca(String vehiculoPlaca) {
        this.vehiculoPlaca = vehiculoPlaca;
    }
}