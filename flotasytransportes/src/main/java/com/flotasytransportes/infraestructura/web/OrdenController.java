package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.servicio.OrdenService;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ordenes")
public class OrdenController {

    private final OrdenService ordenService;

    public OrdenController(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    @PostMapping("/asignar")
    public OrdenTransporte crearYAsignar(@RequestBody OrdenTransporte orden) {
        return ordenService.crearYAsignarOrden(orden);
    }
}