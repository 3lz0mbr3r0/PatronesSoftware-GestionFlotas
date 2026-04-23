package com.flotasytransportes.infraestructura.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.flotasytransportes.aplicacion.rutas.RutaRapidaService;
import com.flotasytransportes.aplicacion.rutas.ServicioRutas;
import com.flotasytransportes.aplicacion.servicio.CalculadoraDistanciaService;
import com.flotasytransportes.dominio.puerto.proxy.CacheAlmacenamiento;
import com.flotasytransportes.dominio.puerto.proxy.CacheEnMemoria;
import com.flotasytransportes.dominio.puerto.proxy.DistanciaServiceProxy;
import com.flotasytransportes.dominio.puertos.DistanciaServicePort;
import com.flotasytransportes.infraestructura.integracion.DistanciaAdapter;
import com.flotasytransportes.infraestructura.navegacion.NavegacionAPI;

@Configuration
public class ConfiguracionRutas {

    @Bean
    public ServicioRutas servicioRutas(
            @Qualifier("googleMapsAPI") NavegacionAPI api) {

        return new RutaRapidaService(api);
    }

    @Bean
    public CalculadoraDistanciaService calculadoraDistanciaService() {
        return new CalculadoraDistanciaService();
    }

    @Bean
    public DistanciaAdapter distanciaAdapter(
            CalculadoraDistanciaService calculadora) {
        return new DistanciaAdapter(calculadora);
    }

    @Bean
    public CacheAlmacenamiento<Double> cacheDistancias() {
        return new CacheEnMemoria<>(100);
    }

    @Bean
    public DistanciaServicePort distanciaServicePort(
            DistanciaAdapter adapterReal,
            CacheAlmacenamiento<Double> cache) {
        return new DistanciaServiceProxy(adapterReal, cache);
    }
}