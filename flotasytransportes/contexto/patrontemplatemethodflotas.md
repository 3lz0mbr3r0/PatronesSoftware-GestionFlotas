PATRÓN TEMPLATE METHOD
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Template Method es un patrón de diseño de comportamiento que define el esqueleto de un algoritmo en un método de la superclase, permitiendo que las subclases sobrescriban pasos específicos sin cambiar la estructura general del algoritmo. Este patrón promueve la reutilización de código al colocar la lógica común en la clase base y delegar las variaciones a las subclases.

El patrón Template Method se compone de dos elementos principales. La Abstract Class define el template method que contiene la secuencia de pasos del algoritmo, algunos de los cuales son abstractos (deben ser implementados por las subclases) y otros son hooks (métodos opcionales con implementación vacía). Los Concrete Classes implementan los pasos abstractos y, opcionalmente, sobrescriben los hooks para agregar comportamiento específico.

La principal ventaja del patrón Template Method es que evita la duplicación de código al centralizar la estructura del algoritmo en un solo lugar. Las subclases solo necesitan implementar las variaciones, sin repetir la secuencia de ejecución. Además, el patrón sigue el principio de Hollywood: "no nos llames, nosotros te llamamos", ya que la superclase controla el flujo y las subclases solo proporcionan implementaciones específicas.

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón Template Method se implementó para generar reportes con diferentes niveles de detalle. La clase base PlantillaReporte define el flujo de generación de reportes en 6 pasos, y tres subclases concretas (ReporteCompleto, ReporteResumido, ReporteProyeccion) implementan cada paso según el tipo de reporte seleccionado por el usuario.

PROBLEMA QUE RESUELVE
El componente GenerarReporte.jsx permitía a los usuarios generar reportes con diferentes secciones seleccionables mediante checkboxes. Sin embargo, la lógica de generación del reporte estaba completamente acoplada al componente de React, con múltiples condicionales que verificaban qué secciones estaban habilitadas para construir el contenido correspondiente.

Este enfoque presentaba varios problemas graves. El primer problema era la mezcla de responsabilidades, ya que el componente manejaba simultáneamente la UI (checkboxes, filtros, vista previa) y la lógica de negocio (filtrado de datos, cálculo de métricas, construcción de secciones). El segundo problema era la dificultad para agregar nuevos tipos de reporte, porque cada nuevo tipo requería modificar el componente existente con más condicionales y lógica adicional. El tercer problema era la falta de una estructura clara y reutilizable, ya que el algoritmo de generación de reportes no estaba formalizado en una clase independiente.

Además, los diferentes tipos de reporte (completo, resumido, proyección) compartían gran parte de la estructura: todos necesitaban validar parámetros, aplicar filtros, calcular métricas y construir secciones. Sin embargo, cada tipo variaba en la forma de filtrar los datos, las métricas calculadas y las secciones generadas. Sin el patrón Template Method, cada tipo de reporte tendría que implementar el algoritmo completo desde cero, duplicando la lógica común y aumentando el riesgo de inconsistencias.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Template Method en tres archivos de la carpeta frontend/src/patterns/template/. Se creó una clase base PlantillaReporte que define el template method generar() con la secuencia completa de 6 pasos, y tres subclases concretas que implementan los pasos abstractos según el tipo de reporte.

La clase PlantillaReporte define el siguiente flujo en su método generar(): el primer paso es validarParametros, que verifica que los datos recibidos (vehículos y órdenes) no sean nulos. Este paso es concreto y compartido por todas las subclases. El segundo paso es aplicarFiltros, un método abstracto que cada subclase implementa según sus necesidades de filtrado. El tercer paso es calcularMetricas, también abstracto, donde cada subclase calcula las métricas relevantes para su tipo de reporte. El cuarto paso es hookPreConstruir, un hook opcional vacío que las subclases pueden sobrescribir para ejecutar lógica antes de construir las secciones. El quinto paso es construirSecciones, el método abstracto principal donde cada subclase genera las secciones visuales del reporte. El sexto y último paso es hookPostConstruir, otro hook opcional que permite ejecutar lógica después de construir las secciones.

La clase ReporteCompleto implementa el reporte más detallado. Su método aplicarFiltros filtra por fecha (desde/hasta) y por placa de vehículo. Su método calcularMetricas calcula estadísticas generales como el total de vehículos, órdenes, reportes, costo total, costo promedio y horas de mantenimiento. Su método construirSecciones genera hasta 5 secciones: resumen general con stats, tabla de vehículos, tabla de órdenes de transporte, tabla de reportes de mantenimiento y tabla de próximos mantenimientos. Además, sobrescribe hookPostConstruir para agregar un timestamp a cada sección generada.

La clase ReporteResumido implementa un reporte compacto con solo los KPIs principales. Su método aplicarFiltros es idéntico al de ReporteCompleto, pero su método calcularMetricas se enfoca en indicadores clave: vehículos disponibles, en ruta y en mantenimiento, y conteo de reportes por prioridad. Su método construirSecciones genera solo 3 secciones: resumen ejecutivo con 6 KPIs, tabla de reportes agrupados por prioridad y tabla de los próximos 5 mantenimientos.

La clase ReporteProyeccion implementa un reporte enfocado en el mantenimiento futuro. Su método aplicarFiltros solo filtra por placa, ignorando las fechas. Su método calcularMetricas calcula una proyección individual para cada vehículo: km recorrido desde el último reporte, intervalo promedio entre mantenimientos, próximo km estimado, porcentaje de vida útil y nivel de riesgo (CRÍTICO >= 80%, MEDIO 50-80%, BAJO < 50%). Su método construirSecciones genera 2 secciones: resumen con el total de vehículos analizados, críticos y medios, y una tabla de los vehículos que requieren atención prioritaria.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Template Method se encuentra en cuatro archivos de la carpeta frontend/src/patterns/template/. La clase base PlantillaReporte se implementa como una clase de JavaScript con un método generar() que define el template method. Los métodos abstractos aplicarFiltros, calcularMetricas y construirSecciones lanzan un Error con un mensaje indicando que deben ser implementados por la subclase, simulando el comportamiento de métodos abstractos en lenguajes como Java o TypeScript. Los hooks hookPreConstruir y hookPostConstruir tienen implementaciones vacías por defecto.

Cada subclase importa PlantillaReporte y extiende la clase base. ReporteCompleto sobrescribe los tres métodos abstractos más el hookPostConstruir. ReporteResumido sobrescribe solo los tres métodos abstractos. ReporteProyeccion sobrescribe los tres métodos abstractos más el hookPostConstruir.

En el componente GenerarReporte.jsx, la integración se realiza mediante el estado tipoReporte que el usuario selecciona mediante botones en la UI. Cuando el usuario hace clic en "Generar Vista Previa", el componente selecciona la clase concreta según el tipo de reporte: "completo" crea una instancia de ReporteCompleto, "resumido" crea una instancia de ReporteResumido, y "proyeccion" crea una instancia de ReporteProyeccion. Luego llama a generar() con los datos crudos y los filtros, y las secciones resultantes se renderizan en la vista previa.

Cada paso del template method registra su ejecución en la consola del navegador con el prefijo [Template Method], lo que permite seguir visualmente el flujo del algoritmo durante la depuración o demostración.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Template Method implementado en el sistema:

@startuml
title Patrón Template Method - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

abstract class PlantillaReporte {
  + {abstract} generar(datosCrudos, filtros) : secciones
  # validarParametros(datos, filtros) : void
  # {abstract} aplicarFiltros(datos, filtros) : datos
  # {abstract} calcularMetricas(datos) : metricas
  # hookPreConstruir(metricas) : void
  # {abstract} construirSecciones(metricas, filtros) : secciones
  # hookPostConstruir(secciones) : void
}

note top of PlantillaReporte
  Template Method que define el
  esqueleto del algoritmo en 6 pasos.
end note

note right of PlantillaReporte
  Template Method:
  1. validarParametros
  2. aplicarFiltros
  3. calcularMetricas
  4. hookPreConstruir
  5. construirSecciones
  6. hookPostConstruir
end note

class ReporteCompleto {
  # aplicarFiltros(datos, filtros) : datos
  # calcularMetricas(datos) : metricas
  # construirSecciones(metricas, filtros) : secciones
  # hookPostConstruir(secciones) : void
}

note bottom of ReporteCompleto
  Sobrescribe hookPostConstruir
  para agregar timestamp.
  Genera 5 secciones: resumen,
  vehículos, órdenes, reportes,
  próximos mantenimientos.
end note

class ReporteResumido {
  # aplicarFiltros(datos, filtros) : datos
  # calcularMetricas(datos) : metricas
  # construirSecciones(metricas, filtros) : secciones
}

note bottom of ReporteResumido
  Genera 3 secciones compactas:
  resumen ejecutivo con KPIs,
  reportes por prioridad,
  próximos mantenimientos (top 5).
end note

class ReporteProyeccion {
  # aplicarFiltros(datos, filtros) : datos
  # calcularMetricas(datos) : metricas
  # construirSecciones(metricas, filtros) : secciones
  # hookPostConstruir(secciones) : void
}

note bottom of ReporteProyeccion
  Enfoque en mantenimiento futuro.
  Calcula proyección por vehículo:
  km restante, % vida, próx. estimado.
  Identifica CRÍTICOS (>=80%) y MEDIO (50-80%).
end note

PlantillaReporte <|-- ReporteCompleto : extends
PlantillaReporte <|-- ReporteResumido : extends
PlantillaReporte <|-- ReporteProyeccion : extends
@enduml

El diagrama muestra claramente la estructura del patrón Template Method. PlantillaReporte es la clase abstracta que define el template method generar() con la secuencia de 6 pasos. ReporteCompleto, ReporteResumido y ReporteProyeccion son las subclases concretas que implementan los pasos abstractos. La relación de herencia (extends) conecta cada subclase con la clase base. Las notas explican qué genera cada subclase y qué hooks sobrescribe.

PRUEBAS
La implementación del patrón Template Method fue probada mediante la interacción directa con la interfaz de usuario, verificando que cada tipo de reporte generara las secciones correctas según su implementación.

La primera prueba consistió en seleccionar el tipo de reporte "Completo" y hacer clic en "Generar Vista Previa". Se verificó que aparecieran 5 secciones con el contenido correspondiente: Resumen General con 4 estadísticas, tabla de Vehículos con 6 columnas, tabla de Órdenes de Transporte con 5 columnas, tabla de Reportes de Mantenimiento con 6 columnas, y tabla de Próximos Mantenimientos con 5 columnas. Se verificó que cada sección tuviera un timestamp en la parte inferior, indicando que hookPostConstruir se ejecutó correctamente.

La segunda prueba consistió en seleccionar "Resumido" y generar la vista previa. Se verificó que aparecieran solo 3 secciones: Resumen Ejecutivo con 6 KPIs, tabla de Reportes por Prioridad, y tabla de Próximos Mantenimientos con solo 5 vehículos. Se verificó que las secciones no tuvieran timestamp, indicando que hookPostConstruir no se ejecutó (correcto, ReporteResumido no lo sobrescribe).

La tercera prueba consistió en seleccionar "Proyección" y generar la vista previa. Se verificó que aparecieran 2 secciones: Resumen de Proyección con estadísticas de vehículos críticos y medios, y tabla de Vehículos que Requieren Atención con 7 columnas. Se verificó que los vehículos con % vida >= 80 aparecieran marcados como CRÍTICO y los de 50-80% como MEDIO.

La cuarta prueba consistió en verificar la consola del navegador durante la generación de cada tipo de reporte. Se abrió F12 Console y se confirmó que aparecieran los mensajes con el prefijo [Template Method] mostrando cada paso: "1. validarParametros", "2. aplicarFiltros", "3. calcularMetricas", "4. hookPreConstruir", "5. construirSecciones", "6. hookPostConstruir".

CONCLUSIONES
La implementación del patrón Template Method en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para estructurar el algoritmo de generación de reportes de manera reutilizable y extensible.

Los principales beneficios observados fueron la centralización del algoritmo, ya que la secuencia de 6 pasos está definida una sola vez en PlantillaReporte.generar() y es reutilizada por todas las subclases; la eliminación de código duplicado, porque la validación de parámetros y la estructura del algoritmo no se repiten en cada subclase; la facilidad para agregar nuevos tipos de reporte, ya que solo se necesita crear una nueva clase que extienda PlantillaReporte e implemente los tres métodos abstractos; la flexibilidad de los hooks, que permiten a las subclases ejecutar lógica adicional sin modificar la estructura del algoritmo; y la trazabilidad del flujo mediante los mensajes en consola con prefijo [Template Method].

El patrón Template Method se integra con los demás patrones del frontend. El patrón Strategy proporciona filtros intercambiables que pueden utilizarse dentro de los métodos aplicarFiltros de las subclases. El patrón Observer notifica al Dashboard cuando se genera un nuevo reporte. El patrón Command encapsula la operación de generación de reportes, permitiendo deshacerla si es necesario.

La implementación demuestra que el patrón Template Method es ideal para situaciones donde múltiples variantes de un algoritmo comparten la misma estructura pero difieren en pasos específicos. La combinación del template method con hooks opcionales proporciona un equilibrio entre control y flexibilidad que se adapta perfectamente a las necesidades de generación de reportes del sistema.
