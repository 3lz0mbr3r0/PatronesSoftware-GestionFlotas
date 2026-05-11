package com.flotasytransportes.aplicacion.facade;

import com.flotasytransportes.aplicacion.servicio.OrdenService;
import com.flotasytransportes.dominio.modelo.OrdenTransporte;
import org.springframework.stereotype.Component;

@Component
public class OrdenTransporteFacade {

    private final OrdenService ordenService;

    public OrdenTransporteFacade(OrdenService ordenService) {
        this.ordenService = ordenService;
    }

    public OrdenTransporte crearYAsignarOrden(OrdenTransporte orden) {
        System.out.println("\n========== FACADE - OrdenTransporteFacade ==========");
        System.out.println("[FACADE] Recibiendo solicitud de orden: " + orden.getCodigoOrden());
        System.out.println("[FACADE] Delegando al servicio de órdenes...");
        
        OrdenTransporte resultado = ordenService.crearYAsignarOrden(orden);
        
        System.out.println("[FACADE] Orden procesada exitosamente");
        System.out.println("[FACADE] Vehículo asignado: " + resultado.getVehiculoPlaca());
        System.out.println("=====================================================\n");
        
        return resultado;
    }
}