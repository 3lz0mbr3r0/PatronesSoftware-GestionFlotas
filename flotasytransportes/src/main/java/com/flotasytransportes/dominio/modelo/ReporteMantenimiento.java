package com.flotasytransportes.dominio.modelo;

public class ReporteMantenimiento {

	// CAMPOS OBLIGATORIOS
	private String placaVehiculo;
	private Double kilometraje;
	private String fecha;
	private String tipoMantenimiento;

	// CAMPOS OPCIONALES
	private String observaciones;
	private String prioridad;
	private String tecnicoResponsable;
	private String taller;
	private Double costoEstimado;
	private Integer tiempoEstimadoHoras;
	private Boolean requiereRepuestos;
	private String nivelDesgaste;
	private Double proximoMantenimientoKm;

	private ReporteMantenimiento(Builder builder) {
		this.placaVehiculo = builder.placaVehiculo;
		this.kilometraje = builder.kilometraje;
		this.fecha = builder.fecha;
		this.tipoMantenimiento = builder.tipoMantenimiento;

		this.observaciones = builder.observaciones;
		this.prioridad = builder.prioridad;
		this.tecnicoResponsable = builder.tecnicoResponsable;
		this.taller = builder.taller;
		this.costoEstimado = builder.costoEstimado;
		this.tiempoEstimadoHoras = builder.tiempoEstimadoHoras;
		this.requiereRepuestos = builder.requiereRepuestos;
		this.nivelDesgaste = builder.nivelDesgaste;
		this.proximoMantenimientoKm = builder.proximoMantenimientoKm;
	}

	public static class Builder {

		// OBLIGATORIOS
		private String placaVehiculo;
		private Double kilometraje;
		private String fecha;
		private String tipoMantenimiento;

		// OPCIONALES
		private String observaciones;
		private String prioridad;
		private String tecnicoResponsable;
		private String taller;
		private Double costoEstimado;
		private Integer tiempoEstimadoHoras;
		private Boolean requiereRepuestos;
		private String nivelDesgaste;
		private Double proximoMantenimientoKm;

		// CONSTRUCTOR CON OBLIGATORIOS
		public Builder(String placaVehiculo, Double kilometraje, String fecha, String tipoMantenimiento) {
			this.placaVehiculo = placaVehiculo;
			this.kilometraje = kilometraje;
			this.fecha = fecha;
			this.tipoMantenimiento = tipoMantenimiento;
		}

		public Builder observaciones(String observaciones) {
			this.observaciones = observaciones;
			return this;
		}

		public Builder prioridad(String prioridad) {
			this.prioridad = prioridad;
			return this;
		}

		public Builder tecnicoResponsable(String tecnicoResponsable) {
			this.tecnicoResponsable = tecnicoResponsable;
			return this;
		}

		public Builder taller(String taller) {
			this.taller = taller;
			return this;
		}

		public Builder costoEstimado(Double costoEstimado) {
			this.costoEstimado = costoEstimado;
			return this;
		}

		public Builder tiempoEstimadoHoras(Integer tiempoEstimadoHoras) {
			this.tiempoEstimadoHoras = tiempoEstimadoHoras;
			return this;
		}

		public Builder requiereRepuestos(Boolean requiereRepuestos) {
			this.requiereRepuestos = requiereRepuestos;
			return this;
		}

		public Builder nivelDesgaste(String nivelDesgaste) {
			this.nivelDesgaste = nivelDesgaste;
			return this;
		}

		public Builder proximoMantenimientoKm(Double km) {
			this.proximoMantenimientoKm = km;
			return this;
		}

		public ReporteMantenimiento build() {
			return new ReporteMantenimiento(this);
		}
	}

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
