package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.servicio.VehiculoService;
import com.flotasytransportes.dominio.modelo.Vehiculo;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @PutMapping("/{id}/ubicacion")
    public Vehiculo actualizarUbicacion(@PathVariable Long id,
                                        @RequestParam Double lat,
                                        @RequestParam Double lng) {
        return vehiculoService.actualizarUbicacion(id, lat, lng);
    }

    @PutMapping("/{id}/kilometraje")
    public Vehiculo actualizarKilometraje(@PathVariable Long id,
                                          @RequestParam Double km) {
        return vehiculoService.actualizarKilometraje(id, km);
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return vehiculoService.listar();
    }
}
