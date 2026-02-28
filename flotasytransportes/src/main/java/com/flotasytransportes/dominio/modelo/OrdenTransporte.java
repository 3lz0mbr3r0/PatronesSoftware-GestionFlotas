package com.flotasytransportes.dominio.modelo;

public class OrdenTransporte {

    private Long id;
    private Double origenLat;
    private Double origenLng;
    private Double destinoLat;
    private Double destinoLng;
    private Long vehiculoId;

    public OrdenTransporte(Long id, Double origenLat, Double origenLng,
                           Double destinoLat, Double destinoLng) {
        this.id = id;
        this.origenLat = origenLat;
        this.origenLng = origenLng;
        this.destinoLat = destinoLat;
        this.destinoLng = destinoLng;
    }

    public void asignarVehiculo(Long vehiculoId) {
        this.vehiculoId = vehiculoId;
    }

    public String generarLinkNavegacion() {
        return "https://www.google.com/maps/dir/"
                + origenLat + "," + origenLng + "/"
                + destinoLat + "," + destinoLng;
    }

    // getters
    public Long getId() { return id; }
    public Double getOrigenLat() { return origenLat; }
    public Double getOrigenLng() { return origenLng; }
    public Double getDestinoLat() { return destinoLat; }
    public Double getDestinoLng() { return destinoLng; }
    public Long getVehiculoId() { return vehiculoId; }
}
