# Proyecto Sector Logístico/Transporte
## Sistema de Gestión de Flotas
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Maven](https://img.shields.io/badge/Maven-Build-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![JWT](https://img.shields.io/badge/JWT-Security-black)

---

## Descripción

Este proyecto implementa un Sistema de Gestión de Flotas desarrollado como una API REST con Spring Boot, aplicando el patrón de arquitectura en capas (Controller – Service – Repository).

El sistema permite administrar vehículos y controlar su operación logística mediante:

- Monitoreo en tiempo real (simulado)

- Optimización de rutas y asignación de cargas

- Mantenimiento predictivo por kilometraje

- Generación de enlaces de navegación

Es un proyecto académico enfocado en aplicar patrones de software, buenas prácticas de desarrollo backend y diseño limpio.

---

## Objetivos

Desarrollar una API que permita gestionar la operación básica de una flota de transporte de forma organizada, modular y escalable.

## Funcionalidades Principales
### Monitoreo en Tiempo Real de Vehículos

Implementado de forma simulada mediante coordenadas almacenadas en la base de datos.

Permite:
- Registrar latitud y longitud del vehículo

- Consultar ubicación actual

- Cambiar el estado del vehículo:

  - DISPONIBLE

  - EN_RUTA

- MANTENIMIENTO

Endpoints principales:

- `PUT /vehiculos/{id}/ubicacion`
- `GET /vehiculos`

---

## Optimización de Rutas y Asignación de Cargas

Flujo básico:

1. Se registra una orden de transporte con origen y destino

2. El sistema busca vehículos disponibles

3. Se selecciona el más cercano (cálculo por coordenadas)

4. Se asigna automáticamente

5. El vehículo cambia a estado EN_RUTA

Esto permite simular un proceso real de despacho logístico sin depender de APIs externas.

---

## Mantenimiento Predictivo de Vehículos

Basado en el kilometraje.

Cada vehículo tiene:

- kilometrajeActual

- limiteMantenimiento

Cuando el límite es superado:

- Se genera una alerta

- El vehículo puede pasar a estado MANTENIMIENTO

Endpoint:

- `PUT /vehiculos/{id}/kilometraje`

---

## Integración con Sistemas de Navegación

Se genera dinámicamente un enlace de navegación hacia Google Maps:

- Ejemplo: `https://www.google.com/maps/dir/{origen}/{destino}`

Este enlace se consulta desde la orden de transporte asignada.

---

## Seguridad

Implementada con:

- Spring Security

- Autenticación con usuario y contraseña

- JWT

- Control de acceso por roles

Roles:

- ADMIN → Gestión completa

- OPERADOR → Operación logística

---

## Arquitectura del Sistema

### Arquitectura en Capas

- Controller → Exposición de endpoints REST

- Service → Lógica de negocio

- Repository → Acceso a datos

Este enfoque permite:

- Separación de responsabilidades

- Código mantenible

- Facilidad de pruebas

---

## Tecnologías Utilizadas

- Spring Boot

- Spring Web

- Spring Data JPA

- Spring Security

- JWT

- MySQL / PostgreSQL

- Maven

---

## Entidades Principales

- Vehiculo

- OrdenTransporte

- Usuario
