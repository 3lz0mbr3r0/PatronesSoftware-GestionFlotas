package com.flotasytransportes.infraestructura.persistencia.entidad;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "ordenes")
public class OrdenEntity {

    @Id
    private String codigoOrden;

    private Double origenLat;
    private Double origenLng;
    private Double destinoLat;
    private Double destinoLng;
    private String vehiculoPlaca;

    @Column(nullable = false)
    private String estado;

    private LocalDateTime fechaCreacion;

    public OrdenEntity() {
    }

    public OrdenEntity(String codigoOrden, Double origenLat, Double origenLng,
                       Double destinoLat, Double destinoLng, String vehiculoPlaca,
                       String estado, LocalDateTime fechaCreacion) {
        this.codigoOrden = codigoOrden;
        this.origenLat = origenLat;
        this.origenLng = origenLng;
        this.destinoLat = destinoLat;
        this.destinoLng = destinoLng;
        this.vehiculoPlaca = vehiculoPlaca;
        this.estado = estado;
        this.fechaCreacion = fechaCreacion;
    }

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