package com.flotasytransportes.infraestructura.persistencia.entidad;

import jakarta.persistence.*;

@Entity
@Table(name = "reportes_mantenimiento")
public class ReporteMantenimientoEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String placaVehiculo;

    @Column(nullable = false)
    private Double kilometraje;

    @Column(nullable = false)
    private String fecha;

    @Column(nullable = false)
    private String tipoMantenimiento;

    private String observaciones;
    private String prioridad;
    private String tecnicoResponsable;
    private String taller;
    private Double costoEstimado;
    private Integer tiempoEstimadoHoras;
    private Boolean requiereRepuestos;
    private String nivelDesgaste;
    private Double proximoMantenimientoKm;

    public ReporteMantenimientoEntity() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getPlacaVehiculo() { return placaVehiculo; }
    public void setPlacaVehiculo(String placaVehiculo) { this.placaVehiculo = placaVehiculo; }

    public Double getKilometraje() { return kilometraje; }
    public void setKilometraje(Double kilometraje) { this.kilometraje = kilometraje; }

    public String getFecha() { return fecha; }
    public void setFecha(String fecha) { this.fecha = fecha; }

    public String getTipoMantenimiento() { return tipoMantenimiento; }
    public void setTipoMantenimiento(String tipoMantenimiento) { this.tipoMantenimiento = tipoMantenimiento; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public String getPrioridad() { return prioridad; }
    public void setPrioridad(String prioridad) { this.prioridad = prioridad; }

    public String getTecnicoResponsable() { return tecnicoResponsable; }
    public void setTecnicoResponsable(String tecnicoResponsable) { this.tecnicoResponsable = tecnicoResponsable; }

    public String getTaller() { return taller; }
    public void setTaller(String taller) { this.taller = taller; }

    public Double getCostoEstimado() { return costoEstimado; }
    public void setCostoEstimado(Double costoEstimado) { this.costoEstimado = costoEstimado; }

    public Integer getTiempoEstimadoHoras() { return tiempoEstimadoHoras; }
    public void setTiempoEstimadoHoras(Integer tiempoEstimadoHoras) { this.tiempoEstimadoHoras = tiempoEstimadoHoras; }

    public Boolean getRequiereRepuestos() { return requiereRepuestos; }
    public void setRequiereRepuestos(Boolean requiereRepuestos) { this.requiereRepuestos = requiereRepuestos; }

    public String getNivelDesgaste() { return nivelDesgaste; }
    public void setNivelDesgaste(String nivelDesgaste) { this.nivelDesgaste = nivelDesgaste; }

    public Double getProximoMantenimientoKm() { return proximoMantenimientoKm; }
    public void setProximoMantenimientoKm(Double proximoMantenimientoKm) { this.proximoMantenimientoKm = proximoMantenimientoKm; }
}
