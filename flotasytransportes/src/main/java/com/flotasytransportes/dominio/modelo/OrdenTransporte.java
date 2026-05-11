package com.flotasytransportes.dominio.modelo;

import java.time.LocalDateTime;

public class OrdenTransporte {

    private String codigoOrden;
    private Double origenLat;
    private Double origenLng;
    private Double destinoLat;
    private Double destinoLng;
    private String vehiculoPlaca;
    private String estado;
    private LocalDateTime fechaCreacion;

    public OrdenTransporte() {
        this.estado = "CREADA";
        this.fechaCreacion = LocalDateTime.now();
    }

    public OrdenTransporte(String codigoOrden, Double origenLat, Double origenLng,
                           Double destinoLat, Double destinoLng) {
        this.codigoOrden = codigoOrden;
        this.origenLat = origenLat;
        this.origenLng = origenLng;
        this.destinoLat = destinoLat;
        this.destinoLng = destinoLng;
        this.estado = "CREADA";
        this.fechaCreacion = LocalDateTime.now();
    }

    public void asignarVehiculo(String vehiculoPlaca) {
        this.vehiculoPlaca = vehiculoPlaca;
        this.estado = "ASIGNADA";
    }

    public String generarLinkNavegacion() {
        if (origenLat == null || origenLng == null || destinoLat == null || destinoLng == null) {
            return "";
        }
        return "https://www.google.com/maps/dir/"
                + origenLat + "," + origenLng + "/"
                + destinoLat + "," + destinoLng;
    }

    // Getters y Setters
    public String getCodigoOrden() { return codigoOrden; }
    public void setCodigoOrden(String codigoOrden) { this.codigoOrden = codigoOrden; }

    public Double getOrigenLat() { return origenLat; }
    public void setOrigenLat(Double origenLat) { this.origenLat = origenLat; }

    public Double getOrigenLng() { return origenLng; }
    public void setOrigenLng(Double origenLng) { this.origenLng = origenLng; }

    public Double getDestinoLat() { return destinoLat; }
    public void setDestinoLat(Double destinoLat) { this.destinoLat = destinoLat; }

    public Double getDestinoLng() { return destinoLng; }
    public void setDestinoLng(Double destinoLng) { this.destinoLng = destinoLng; }

    public String getVehiculoPlaca() { return vehiculoPlaca; }
    public void setVehiculoPlaca(String vehiculoPlaca) { this.vehiculoPlaca = vehiculoPlaca; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
}