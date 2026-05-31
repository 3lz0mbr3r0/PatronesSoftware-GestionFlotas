package com.flotasytransportes.infraestructura.web.dto;

public class ReporteProyeccionDTO {

    private String placa;
    private Double ultimoKmReporte;
    private Double promedioIntervaloKm;
    private Double proximoEstimadoKm;
    private Double kmRestantes;
    private Long diasEstimados;
    private String nivelRiesgo;

    public ReporteProyeccionDTO() {
    }

    public ReporteProyeccionDTO(String placa, Double ultimoKmReporte, Double promedioIntervaloKm,
                                 Double proximoEstimadoKm, Double kmRestantes,
                                 Long diasEstimados, String nivelRiesgo) {
        this.placa = placa;
        this.ultimoKmReporte = ultimoKmReporte;
        this.promedioIntervaloKm = promedioIntervaloKm;
        this.proximoEstimadoKm = proximoEstimadoKm;
        this.kmRestantes = kmRestantes;
        this.diasEstimados = diasEstimados;
        this.nivelRiesgo = nivelRiesgo;
    }

    public String getPlaca() {
        return placa;
    }

    public void setPlaca(String placa) {
        this.placa = placa;
    }

    public Double getUltimoKmReporte() {
        return ultimoKmReporte;
    }

    public void setUltimoKmReporte(Double ultimoKmReporte) {
        this.ultimoKmReporte = ultimoKmReporte;
    }

    public Double getPromedioIntervaloKm() {
        return promedioIntervaloKm;
    }

    public void setPromedioIntervaloKm(Double promedioIntervaloKm) {
        this.promedioIntervaloKm = promedioIntervaloKm;
    }

    public Double getProximoEstimadoKm() {
        return proximoEstimadoKm;
    }

    public void setProximoEstimadoKm(Double proximoEstimadoKm) {
        this.proximoEstimadoKm = proximoEstimadoKm;
    }

    public Double getKmRestantes() {
        return kmRestantes;
    }

    public void setKmRestantes(Double kmRestantes) {
        this.kmRestantes = kmRestantes;
    }

    public Long getDiasEstimados() {
        return diasEstimados;
    }

    public void setDiasEstimados(Long diasEstimados) {
        this.diasEstimados = diasEstimados;
    }

    public String getNivelRiesgo() {
        return nivelRiesgo;
    }

    public void setNivelRiesgo(String nivelRiesgo) {
        this.nivelRiesgo = nivelRiesgo;
    }
}
