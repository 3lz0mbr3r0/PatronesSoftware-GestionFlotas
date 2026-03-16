package com.flotasytransportes.dominio.modelo;

public abstract class Vehiculo {
	
    protected String placa;
    protected Double latitud;
    protected Double longitud;
    protected EstadoVehiculo estado;
    protected TipoEnergia tipoEnergia;
    protected Double kilometrajeActual;
    protected Double limiteMantenimiento;
    
	public Vehiculo(String placa, Double latitud, Double longitud, EstadoVehiculo estado, TipoEnergia tipoEnergia,
			Double kilometrajeActual, Double limiteMantenimiento) {
		this.placa = placa;
		this.latitud = latitud;
		this.longitud = longitud;
		this.estado = estado;
		this.tipoEnergia = tipoEnergia;
		this.kilometrajeActual = kilometrajeActual;
		this.limiteMantenimiento = limiteMantenimiento;
	}

	public void actualizarUbicacion(Double lat, Double lng) {
        this.latitud = lat;
        this.longitud = lng;
    }

    public void actualizarKilometraje(Double km) {
        this.kilometrajeActual = km;
        if (this.kilometrajeActual >= this.limiteMantenimiento) {
            this.estado = EstadoVehiculo.MANTENIMIENTO;
        }
    }

    public void cambiarEstado(EstadoVehiculo estado) {
        this.estado = estado;
    }
    
    
    // getters
    
    public String getPlaca() { return placa; }
    public Double getLatitud() { return latitud; }
    public Double getLongitud() { return longitud; }
    public EstadoVehiculo getEstado() { return estado; }
    public TipoEnergia getTipoEnergia() { return tipoEnergia; }
    public Double getKilometrajeActual() { return kilometrajeActual; }
    public Double getLimiteMantenimiento() { return limiteMantenimiento; }
    
    // setters

	public void setPlaca(String placa) {
		this.placa = placa;
	}

	public void setLatitud(Double latitud) {
		this.latitud = latitud;
	}

	public void setLongitud(Double longitud) {
		this.longitud = longitud;
	}

	public void setEstado(EstadoVehiculo estado) {
		this.estado = estado;
	}
	
	public void setTipoEnergia(TipoEnergia tipoEnergia) {
		this.tipoEnergia = tipoEnergia;
	}

	public void setKilometrajeActual(Double kilometrajeActual) {
		this.kilometrajeActual = kilometrajeActual;
	}

	public void setLimiteMantenimiento(Double limiteMantenimiento) {
		this.limiteMantenimiento = limiteMantenimiento;
	}

}
