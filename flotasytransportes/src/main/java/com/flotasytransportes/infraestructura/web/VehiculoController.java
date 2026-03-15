package com.flotasytransportes.infraestructura.web;

import com.flotasytransportes.aplicacion.servicio.VehiculoService;
import com.flotasytransportes.dominio.modelo.Vehiculo;
import com.flotasytransportes.dominio.modelo.TipoVehiculo;
import com.flotasytransportes.infraestructura.web.dto.VehiculoDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/vehiculos")
public class VehiculoController {

    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }
    
    @PostMapping
    public Vehiculo crear(@RequestBody Vehiculo vehiculo) {
        return vehiculoService.guardar(vehiculo);
    }

    @PutMapping("/{placa}/ubicacion")
    public Vehiculo actualizarUbicacion(@PathVariable String placa,
                                        @RequestParam Double lat,
                                        @RequestParam Double lng) {
        return vehiculoService.actualizarUbicacion(placa, lat, lng);
    }

    @PutMapping("/{placa}/kilometraje")
    public Vehiculo actualizarKilometraje(@PathVariable String placa,
                                          @RequestParam Double km) {
        return vehiculoService.actualizarKilometraje(placa, km);
    }

    @GetMapping
    public List<Vehiculo> listar() {
        return vehiculoService.listar();
    }
    
    @GetMapping("/{placa}")
    public Vehiculo buscar(@PathVariable("placa") String placa) {
        return vehiculoService.buscarVehiculo(placa);
    }
    
    @DeleteMapping("/{placa}")
    public void eliminar(@PathVariable("placa") String placa) {
        vehiculoService.eliminarVehiculo(placa);
    }
    
    @PostMapping("/{tipo}")
    public Vehiculo crear(@PathVariable("tipo") TipoVehiculo tipo,
                          @RequestBody VehiculoDTO dto) {
        return vehiculoService.crearVehiculo(tipo, dto);
    }
}
