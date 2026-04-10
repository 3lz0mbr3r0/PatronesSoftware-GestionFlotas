package com.flotasytransportes.infraestructura.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.flotasytransportes.aplicacion.rutas.RutaRapidaService;
import com.flotasytransportes.aplicacion.rutas.ServicioRutas;
import com.flotasytransportes.infraestructura.navegacion.NavegacionAPI;

@Configuration
public class ConfiguracionRutas {

    @Bean
    public ServicioRutas servicioRutas(
            @Qualifier("googleMapsAPI") NavegacionAPI api) {

        return new RutaRapidaService(api);
    }
}
