package com.flotasytransportes.dominio.puertos;

import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import java.util.List;

public interface ReporteMantenimientoRepositoryPort {

    ReporteMantenimiento guardar(ReporteMantenimiento reporte);
    List<ReporteMantenimiento> buscarTodos();
    List<ReporteMantenimiento> buscarPorPlaca(String placa);
    void eliminar(String placaVehiculo, String tipoMantenimiento, String fecha);
}
