package com.flotasytransportes.infraestructura.web.dto;

import com.flotasytransportes.dominio.modelo.EstadoVehiculo;

public class VehiculoDTO {

    private String placa;
    private Double latitud;
    private Double longitud;
    private EstadoVehiculo estado;
    private Double kilometrajeActual;
    private Double limiteMantenimiento;

    public VehiculoDTO() {
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

	public EstadoVehiculo getEstado() {
		return estado;
	}

	public void setEstado(EstadoVehiculo estado) {
		this.estado = estado;
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

    // getters y setters
    
}