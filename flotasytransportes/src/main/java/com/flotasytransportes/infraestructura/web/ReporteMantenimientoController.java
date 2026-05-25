package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.servicio.ReporteMantenimientoService;
import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import com.flotasytransportes.infraestructura.web.dto.ReporteMantenimientoDTO;
import com.flotasytransportes.infraestructura.web.dto.ReporteProyeccionDTO;
import com.flotasytransportes.infraestructura.web.dto.VehiculoProximoDTO;

import org.springframework.web.bind.annotation.*;
import java.util.List;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/reportes")
public class ReporteMantenimientoController {

    private final ReporteMantenimientoService service;

    public ReporteMantenimientoController(ReporteMantenimientoService service) {
        this.service = service;
    }

    @PostMapping("/mantenimiento")
    public ReporteMantenimiento crear(@Valid @RequestBody ReporteMantenimientoDTO dto) {
        return service.crearReporte(dto);
    }
    
    @GetMapping
    public List<ReporteMantenimiento> listar() {
        return service.listarReportes();
    }

    @GetMapping("/ordenados-por-fecha")
    public List<ReporteMantenimiento> listarOrdenados(@RequestParam(defaultValue = "desc") String dir) {
        return service.listarOrdenadosPorFecha(dir);
    }

    @GetMapping("/por-rango")
    public List<ReporteMantenimiento> listarPorRango(@RequestParam String fechaDesde,
                                                      @RequestParam String fechaHasta) {
        return service.listarPorRangoFechas(fechaDesde, fechaHasta);
    }

    @GetMapping("/proximos")
    public List<ReporteMantenimiento> listarProximos(@RequestParam(defaultValue = "5000") Double kmUmbral) {
        return service.listarProximos(kmUmbral);
    }

    @GetMapping("/vehiculos-proximos")
    public List<VehiculoProximoDTO> listarVehiculosProximos(@RequestParam(defaultValue = "5000") Double kmUmbral) {
        return service.listarVehiculosProximos(kmUmbral);
    }

    @GetMapping("/proyeccion/{placa}")
    public ReporteProyeccionDTO proyectar(@PathVariable String placa) {
        return service.proyectarMantenimiento(placa);
    }

    @DeleteMapping
    public void eliminar(@RequestParam String placaVehiculo,
                         @RequestParam String tipoMantenimiento,
                         @RequestParam String fecha) {
        service.eliminarReporte(placaVehiculo, tipoMantenimiento, fecha);
    }

}
