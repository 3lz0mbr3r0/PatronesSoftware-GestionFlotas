package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.servicio.ReporteMantenimientoService;
import com.flotasytransportes.dominio.modelo.ReporteMantenimiento;
import com.flotasytransportes.infraestructura.web.dto.ReporteMantenimientoDTO;

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

}
