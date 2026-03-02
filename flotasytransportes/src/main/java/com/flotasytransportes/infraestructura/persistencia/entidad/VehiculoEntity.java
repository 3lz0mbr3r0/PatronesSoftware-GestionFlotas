package com.flotasytransportes.infraestructura.persistencia.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "vehiculos")
public class VehiculoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String placa;

    private Double latitud;
    private Double longitud;

    @Column(nullable = false)
    private String estado;

    // 🔥 NUEVO CAMPO NECESARIO PARA FACTORY METHOD
    @Column(nullable = false)
    private String tipo;

    private Double kilometrajeActual;
    private Double limiteMantenimiento;

    public VehiculoEntity() {
    }

    public VehiculoEntity(Long id, String placa, Double latitud, Double longitud,
                          String estado, String tipo,
                          Double kilometrajeActual, Double limiteMantenimiento) {
        this.id = id;
        this.placa = placa;
        this.latitud = latitud;
        this.longitud = longitud;
        this.estado = estado;
        this.tipo = tipo;
        this.kilometrajeActual = kilometrajeActual;
        this.limiteMantenimiento = limiteMantenimiento;
    }

    // ========================
    // GETTERS Y SETTERS
    // ========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Double getLatitud() {
        return latitud;
    }

    public void setLatitud(Double latitud) {
        this.latitud = latitud;
    }

    public Double getLongitud() {
        return longitud;
    }

    public void setLongitud(Double longitud) {
        this.longitud = longitud;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public String getTipo() {
        return tipo;
    }

    public void setTipo(String tipo) {
        this.tipo = tipo;
    }

    public Double getKilometrajeActual() {
        return kilometrajeActual;
    }

    public void setKilometrajeActual(Double kilometrajeActual) {
        this.kilometrajeActual = kilometrajeActual;
    }

    public Double getLimiteMantenimiento() {
        return limiteMantenimiento;
    }

    public void setLimiteMantenimiento(Double limiteMantenimiento) {
        this.limiteMantenimiento = limiteMantenimiento;
    }
}