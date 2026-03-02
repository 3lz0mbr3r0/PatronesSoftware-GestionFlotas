package com.flotasytransportes.dominio.modelo;

public abstract class Vehiculo {

	/*
    private Long id;
    private String placa;
    private Double latitud;
    private Double longitud;
    private EstadoVehiculo estado;
    private Double kilometrajeActual;
    private Double limiteMantenimiento;

    public Vehiculo(Long id, String placa, Double latitud, Double longitud,
                    EstadoVehiculo estado, Double kilometrajeActual, Double limiteMantenimiento) {
        this.id = id;
        this.placa = placa;
        this.latitud = latitud;
        this.longitud = longitud;
        this.estado = estado;
        this.kilometrajeActual = kilometrajeActual;
        this.limiteMantenimiento = limiteMantenimiento;
    }
    
    */
	
	protected Long id;
    protected String placa;
    protected Double latitud;
    protected Double longitud;
    protected EstadoVehiculo estado;
    protected Double kilometrajeActual;
    protected Double limiteMantenimiento;

    public Vehiculo(String placa, Double latitud, Double longitud,
                    EstadoVehiculo estado,
                    Double kilometrajeActual,
                    Double limiteMantenimiento) {
        this.placa = placa;
        this.latitud = latitud;
        this.longitud = longitud;
        this.estado = estado;
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
    public Long getId() { return id; }
    public String getPlaca() { return placa; }
    public Double getLatitud() { return latitud; }
    public Double getLongitud() { return longitud; }
    public EstadoVehiculo getEstado() { return estado; }
    public Double getKilometrajeActual() { return kilometrajeActual; }
    public Double getLimiteMantenimiento() { return limiteMantenimiento; }
    
    // setters
    public void setId(Long id) {
		this.id = id;
	}

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

	public void setKilometrajeActual(Double kilometrajeActual) {
		this.kilometrajeActual = kilometrajeActual;
	}

	public void setLimiteMantenimiento(Double limiteMantenimiento) {
		this.limiteMantenimiento = limiteMantenimiento;
	}

}
