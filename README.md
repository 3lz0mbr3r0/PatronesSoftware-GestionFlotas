<h1 align="center"> PROYECTO SECTOR LOGÍSTICO/TRANSPORTE</h1>

<h3 align="center"> Sistema de Gestión de Flotas</h3>

<details align="center">
<summary>Autores</summary>

###### Estudiante 1: Oscar Yair Pardo

###### Estudiante 2: Jorge Alfredo Leal Cruz

###### Docente: Eliecer Montero Ojeda

###### Unidades Tecnológicas de Santander - 2026

</details>

<p align="center">
  
![Spring Boot](https://img.shields.io/badge/SpringBoot-3.x-brightgreen)
![Java](https://img.shields.io/badge/Java-17-orange)
![Maven](https://img.shields.io/badge/Maven-Build-blue)
![MySQL](https://img.shields.io/badge/MySQL-Database-blue)
![JWT](https://img.shields.io/badge/JWT-Security-black)

</p>

---

<h2 align="center"> DESCRIPCIÓN</h2>

Este proyecto implementa un Sistema de Gestión de Flotas desarrollado como una API REST con Spring Boot, aplicando el patrón de arquitectura en capas (Controller – Service – Repository).

El sistema permite administrar vehículos y controlar su operación logística mediante:

- Monitoreo en tiempo real (simulado)

- Optimización de rutas y asignación de cargas

- Mantenimiento predictivo por kilometraje

- Generación de enlaces de navegación

Es un proyecto académico enfocado en aplicar patrones de software, buenas prácticas de desarrollo backend y diseño limpio.

---

<h2 align="center"> OBJETIVOS</h2>

Desarrollar una API que permita gestionar la operación básica de una flota de transporte de forma organizada, modular y escalable.

---

<h2 align="center"> FUNCIONALIDADES PRINCIPALES</h2>

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

<h2 align="center"> OPTIMIZACIÓN DE RUTAS Y ASIGNACIÓN DE CARGAS</h2>

Flujo básico:

1. Se registra una orden de transporte con origen y destino

2. El sistema busca vehículos disponibles

3. Se selecciona el más cercano (cálculo por coordenadas)

4. Se asigna automáticamente

5. El vehículo cambia a estado EN_RUTA

Esto permite simular un proceso real de despacho logístico sin depender de APIs externas.

---

<h2 align="center"> MANTENIMIENTO PREDICTIVO DE VEHÍCULOS</h2>

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

<h2 align="center"> INTEGRACIÓN CON SISTEMAS DE NAVEGACIÓN</h2>

Se genera dinámicamente un enlace de navegación hacia Google Maps:

- Ejemplo: `https://www.google.com/maps/dir/{origen}/{destino}`

Este enlace se consulta desde la orden de transporte asignada.

---

<h2 align="center"> SEGURIDAD</h2>

Implementada con:

- Spring Security

- Autenticación con usuario y contraseña

- JWT

- Control de acceso por roles

Roles:

| Rol | Permisos |
|--------|------|
| ADMIN  | Gestión completa   |
| OPERADOR    | Operación logística   |

---

<h2 align="center"> ARQUITECTURA DEL SISTEMA</h2>

### Arquitectura en Capas - `Controller → Service → Repository → Database`

- Controller → Exposición de endpoints REST

- Service → Lógica de negocio

- Repository → Acceso a datos

Este enfoque permite:

- Separación de responsabilidades

- Código mantenible

- Facilidad de pruebas

---

<h2 align="center"> TECNOLOGÍAS UTILIZADAS</h2>

- Spring Boot

- Spring Web

- Spring Data JPA

- Spring Security

- JWT

- MySQL / PostgreSQL

- Maven

---

<h2 align="center"> ENTIDADES PRINCIPALES</h2>

- Vehiculo

- OrdenTransporte

- Usuario
