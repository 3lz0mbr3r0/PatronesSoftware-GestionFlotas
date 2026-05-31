package com.flotasytransportes.infraestructura.web.dto;

public class VehiculoProximoDTO {

    private String placa;
    private String tipo;
    private Double kilometrajeActual;
    private Double limiteMantenimiento;
    private Double proximoMantenimientoKm;
    private Double kmRestantes;
    private Double porcentaje;
    private String nivelRiesgo;

    public VehiculoProximoDTO() {
    }

    public VehiculoProximoDTO(String placa, String tipo, Double kilometrajeActual,
                               Double limiteMantenimiento, Double proximoMantenimientoKm,
                               Double kmRestantes, Double porcentaje, String nivelRiesgo) {
        this.placa = placa;
        this.tipo = tipo;
        this.kilometrajeActual = kilometrajeActual;
        this.limiteMantenimiento = limiteMantenimiento;
        this.proximoMantenimientoKm = proximoMantenimientoKm;
        this.kmRestantes = kmRestantes;
        this.porcentaje = porcentaje;
        this.nivelRiesgo = nivelRiesgo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
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

    public Double getProximoMantenimientoKm() {
        return proximoMantenimientoKm;
    }

    public void setProximoMantenimientoKm(Double proximoMantenimientoKm) {
        this.proximoMantenimientoKm = proximoMantenimientoKm;
    }

    public Double getKmRestantes() {
        return kmRestantes;
    }

    public void setKmRestantes(Double kmRestantes) {
        this.kmRestantes = kmRestantes;
    }

    public Double getPorcentaje() {
        return porcentaje;
    }

    public void setPorcentaje(Double porcentaje) {
        this.porcentaje = porcentaje;
    }

    public String getNivelRiesgo() {
        return nivelRiesgo;
    }

    public void setNivelRiesgo(String nivelRiesgo) {
        this.nivelRiesgo = nivelRiesgo;
    }
}
