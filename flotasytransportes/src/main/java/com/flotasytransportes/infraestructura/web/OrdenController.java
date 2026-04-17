package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.facade.OrdenTransporteFacade;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;

import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/ordenes")
public class OrdenController {

    private final OrdenTransporteFacade ordenTransporteFacade;

    public OrdenController(OrdenTransporteFacade ordenTransporteFacade) {
        this.ordenTransporteFacade = ordenTransporteFacade;
    }

    @PostMapping("/asignar")
    public OrdenTransporte crearYAsignar(@RequestBody OrdenTransporte orden) {
        return ordenTransporteFacade.crearYAsignarOrden(orden);
    }
}