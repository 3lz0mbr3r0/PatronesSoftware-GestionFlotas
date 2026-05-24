package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.facade.OrdenTransporteFacade;
import com.flotasytransportes.aplicacion.servicio.OrdenService;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ordenes")
public class OrdenController {

    private final OrdenTransporteFacade ordenTransporteFacade;
    private final OrdenService ordenService;

    public OrdenController(OrdenTransporteFacade ordenTransporteFacade,
                           OrdenService ordenService) {
        this.ordenTransporteFacade = ordenTransporteFacade;
        this.ordenService = ordenService;
    }

    @PostMapping("/asignar")
    public OrdenTransporte crearYAsignar(@RequestBody OrdenTransporte orden) {
        return ordenTransporteFacade.crearYAsignarOrden(orden);
    }

    @GetMapping
    public List<OrdenTransporte> listar() {
        return ordenService.listarOrdenes();
    }

    @DeleteMapping("/{codigoOrden}")
    public void eliminar(@PathVariable String codigoOrden) {
        ordenService.eliminarOrden(codigoOrden);
    }
}