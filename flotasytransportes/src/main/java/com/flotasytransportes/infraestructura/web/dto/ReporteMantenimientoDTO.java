package com.flotasytransportes.infraestructura.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class ReporteMantenimientoDTO {

	// obligatorios
	@NotBlank(message = "La placa del vehículo es obligatoria")
    private String placaVehiculo;

    @NotNull(message = "El kilometraje es obligatorio")
    private Double kilometraje;

    @NotBlank(message = "La fecha es obligatoria")
    private String fecha;

    @NotBlank(message = "El tipo de mantenimiento es obligatorio")
    private String tipoMantenimiento;

	// opcionales
	private String observaciones;
	private String prioridad;
	private String tecnicoResponsable;
	private String taller;
	private Double costoEstimado;
	private Integer tiempoEstimadoHoras;
	private Boolean requiereRepuestos;
	private String nivelDesgaste;
	private Double proximoMantenimientoKm;

	// getters y setters
	public String getPlacaVehiculo() {
		return placaVehiculo;
	}

	public void setPlacaVehiculo(String placaVehiculo) {
		this.placaVehiculo = placaVehiculo;
	}

	public Double getKilometraje() {
		return kilometraje;
	}

	public void setKilometraje(Double kilometraje) {
		this.kilometraje = kilometraje;
	}

	public String getFecha() {
		return fecha;
	}

	public void setFecha(String fecha) {
		this.fecha = fecha;
	}

	public String getTipoMantenimiento() {
		return tipoMantenimiento;
	}

	public void setTipoMantenimiento(String tipoMantenimiento) {
		this.tipoMantenimiento = tipoMantenimiento;
	}

	public String getObservaciones() {
		return observaciones;
	}

	public void setObservaciones(String observaciones) {
		this.observaciones = observaciones;
	}

	public String getPrioridad() {
		return prioridad;
	}

	public void setPrioridad(String prioridad) {
		this.prioridad = prioridad;
	}

	public String getTecnicoResponsable() {
		return tecnicoResponsable;
	}

	public void setTecnicoResponsable(String tecnicoResponsable) {
		this.tecnicoResponsable = tecnicoResponsable;
	}

	public String getTaller() {
		return taller;
	}

	public void setTaller(String taller) {
		this.taller = taller;
	}

	public Double getCostoEstimado() {
		return costoEstimado;
	}

	public void setCostoEstimado(Double costoEstimado) {
		this.costoEstimado = costoEstimado;
	}

	public Integer getTiempoEstimadoHoras() {
		return tiempoEstimadoHoras;
	}

	public void setTiempoEstimadoHoras(Integer tiempoEstimadoHoras) {
		this.tiempoEstimadoHoras = tiempoEstimadoHoras;
	}

	public Boolean getRequiereRepuestos() {
		return requiereRepuestos;
	}

	public void setRequiereRepuestos(Boolean requiereRepuestos) {
		this.requiereRepuestos = requiereRepuestos;
	}

	public String getNivelDesgaste() {
		return nivelDesgaste;
	}

	public void setNivelDesgaste(String nivelDesgaste) {
		this.nivelDesgaste = nivelDesgaste;
	}

	public Double getProximoMantenimientoKm() {
		return proximoMantenimientoKm;
	}

	public void setProximoMantenimientoKm(Double proximoMantenimientoKm) {
		this.proximoMantenimientoKm = proximoMantenimientoKm;
	}
}
