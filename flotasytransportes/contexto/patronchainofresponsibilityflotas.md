PATRÓN CHAIN OF RESPONSIBILITY
OSCAR YAIR PARDO PINEDA
JORGE ALFREDO LEAL CRUZ

INTRODUCCIÓN
El patrón Chain of Responsibility es un patrón de diseño de comportamiento que permite pasar solicitudes a lo largo de una cadena de handlers, donde cada handler decide si procesa la solicitud o la pasa al siguiente handler en la cadena. Este patrón desacopla al emisor de la solicitud de los receptores, permitiendo que múltiples objetos tengan la oportunidad de procesar la solicitud sin que el emisor necesite conocer qué objeto la procesará.

El patrón Chain of Responsibility se compone de dos elementos principales. El Handler define la interfaz común para procesar solicitudes y mantiene una referencia al siguiente handler en la cadena. Los Concrete Handlers implementan la lógica de procesamiento y deciden si procesan la solicitud o la pasan al siguiente handler. El patrón puede configurarse como una cadena lineal donde la solicitud se procesa secuencialmente, o permitir que cualquier handler detenga el flujo si encuentra una condición de error.

La principal ventaja del patrón Chain of Responsibility es que permite agregar, eliminar o reordenar handlers sin modificar el código existente. Cada handler tiene una única responsabilidad y puede ser probado de forma independiente. Además, el patrón sigue el principio de responsabilidad única al distribuir el procesamiento en múltiples clases especializadas.

En el contexto del frontend del Sistema de Gestión de Flotas, el patrón Chain of Responsibility se implementó para estructurar el flujo de comparación de vehículos. La cadena consta de 5 handlers que procesan secuencialmente la solicitud: validación de selección, enriquecimiento de datos, cálculo de métricas, determinación del mejor valor y formateo de resultados.

PROBLEMA QUE RESUELVE
El componente Comparador.jsx permitía a los usuarios seleccionar entre 2 y 5 vehículos y comparar sus métricas en una tabla lado a lado. La lógica de comparación estaba implementada en una única función handleCompare que realizaba todas las operaciones: validar la selección, consultar la API, calcular métricas, identificar el mejor valor y formatear los resultados.

Esta función monolítica presentaba varios problemas graves. El primer problema era la violación del principio de responsabilidad única, ya que una sola función manejaba validación, consultas API, cálculos, lógica de negocio y formateo. El segundo problema era la dificultad para probar y mantener el código, porque cualquier cambio en una de las etapas requería modificar la función completa. El tercer problema era la falta de flexibilidad, ya que no era posible reordenar las etapas ni agregar nuevas etapas intermedias sin reescribir la función.

Además, la función handleCompare mezclaba lógica de diferentes niveles de abstracción. La validación (contar vehículos seleccionados) estaba al mismo nivel que las consultas API (Promise.all) y que el cálculo de métricas (bucles map/filter/reduce). Esto dificultaba la legibilidad del código y aumentaba la probabilidad de errores cuando se modificaba una etapa sin considerar el impacto en las demás.

SOLUCIÓN IMPLEMENTADA
La solución consistió en implementar el patrón Chain of Responsibility en seis archivos de la carpeta frontend/src/patterns/chain/. Se creó una clase base ManejadorComparacion que define el contrato común con el método setSiguiente() para encadenar handlers y el método manejar(contexto) que por defecto pasa la solicitud al siguiente handler.

Se implementaron cinco handlers concretos que forman la cadena completa. El primer handler es ValidarSeleccionHandler, que verifica que el usuario haya seleccionado entre 2 y 5 vehículos. Si la selección no cumple el rango, lanza un error y detiene la cadena. Si cumple, pasa el contexto al siguiente handler.

El segundo handler es EnriquecerDatosHandler, que consulta el backend para obtener los reportes de mantenimiento y las órdenes de transporte de todos los vehículos seleccionados. Utiliza Promise.all para realizar ambas consultas en paralelo. Si los datos ya están cargados en el contexto (por ejemplo, en una segunda ejecución), los salta para evitar consultas innecesarias.

El tercer handler es CalcularMetricasHandler, que itera sobre los vehículos seleccionados y calcula 13 métricas para cada uno: tipo, estado, energía, km actual, límite de mantenimiento, porcentaje de vida útil, total de reportes, costo total de mantenimiento, costo promedio, órdenes completadas, total de órdenes, horas de mantenimiento y fecha del último reporte.

El cuarto handler es DeterminarMejorHandler, que analiza las métricas numéricas de todos los vehículos y determina cuál tiene el mejor valor en cada una. Utiliza una configuración que indica si cada métrica es "menor es mejor" (por ejemplo, porcentaje de vida útil, costos) o "mayor es mejor" (por ejemplo, órdenes completadas). El resultado es un objeto mejores que asocia cada métrica con su valor óptimo.

El quinto y último handler es FormatearResultadoHandler, que construye el output final agregando flags _mejores a cada resultado. Estos flags indican qué vehículo tiene el valor óptimo en cada métrica, permitiendo que la UI muestre el indicador visual ★ en las celdas correspondientes.

IMPLEMENTACIÓN EN EL CÓDIGO
La implementación del patrón Chain of Responsibility se encuentra en seis archivos de la carpeta frontend/src/patterns/chain/. La clase base ManejadorComparacion es una clase de JavaScript con dos métodos: setSiguiente(handler) que establece el siguiente handler y retorna el handler para permitir el encadenamiento fluido (fluent interface), y manejar(contexto) que pasa la solicitud al siguiente handler si existe.

Cada handler concreto extiende ManejadorComparacion y sobrescribe el método manejar(contexto). Los handlers que pueden detener la cadena (ValidarSeleccionHandler) lanzan una excepción con throw new Error(...) si la condición no se cumple. Esto interrumpe inmediatamente la ejecución de la cadena y propaga el error al cliente.

En el componente Comparador.jsx, la integración se realiza mediante un hook useEffect que se ejecuta una vez al montar el componente. Dentro del efecto, se instancian los 5 handlers y se encadenan con setSiguiente(): validar.setSiguiente(enriquecer).setSiguiente(calcular).setSiguiente(mejor).setSiguiente(formatear). La referencia a la cadena se almacena en una ref (cadenaRef) para evitar que se recreé en cada renderizado.

Cuando el usuario hace clic en "Comparar", el componente llama a cadenaRef.current.manejar(contexto) con el contexto que contiene los vehículos seleccionados. La cadena procesa la solicitud secuencialmente y retorna el contexto con los resultados. Si algún handler lanza un error (por ejemplo, menos de 2 vehículos seleccionados), el error se captura con try/catch y se muestra al usuario mediante una notificación.

Cada handler registra su ejecución en la consola del navegador con el prefijo [CoR], indicando el nombre del handler, el resultado de su procesamiento y si pasa la solicitud al siguiente. Esto permite seguir visualmente el flujo a través de la cadena durante la depuración o demostración.

DIAGRAMA UML
A continuación se presenta el diagrama UML que ilustra la estructura del patrón Chain of Responsibility implementado en el sistema:

@startuml
title Patrón Chain of Responsibility - Sistema de Gestión de Flotas (Frontend)

skinparam classAttributeIconSize 0

class ManejadorComparacion {
  # siguiente : ManejadorComparacion
  + setSiguiente(handler) : ManejadorComparacion
  + manejar(contexto) : contexto
}

note top of ManejadorComparacion
  Clase base. El método manejar()
  por defecto pasa la solicitud
  al siguiente handler en la cadena.
end note

class ValidarSeleccionHandler {
  + manejar(contexto) : contexto
}

note right of ValidarSeleccionHandler
  Valida que haya entre 2 y 5
  vehículos seleccionados.
  Si no cumple, lanza error y
  detiene la cadena.
end note

class EnriquecerDatosHandler {
  + manejar(contexto) : contexto
}

note right of EnriquecerDatosHandler
  Consulta reportes y órdenes
  desde el backend con Promise.all.
  Solo ejecuta si no están cargados.
end note

class CalcularMetricasHandler {
  + manejar(contexto) : contexto
}

note right of CalcularMetricasHandler
  Calcula 13 métricas por vehículo:
  kmActual, pctVida, costoTotal,
  costoPromedio, ordenesCompletadas,
  totalOrdenes, horasMantenimiento,
  ultimoReporte.
end note

class DeterminarMejorHandler {
  + manejar(contexto) : contexto
}

note right of DeterminarMejorHandler
  Identifica el mejor valor (★)
  para cada métrica numérica.
  menorEsMejor: pctVida, costos, horas.
  mayorEsMejor: órdenes completadas.
end note

class FormatearResultadoHandler {
  + manejar(contexto) : contexto
}

note right of FormatearResultadoHandler
  Construye el output final con
  flags _mejores que indican qué
  vehículo tiene el valor óptimo
  en cada métrica.
end note

ManejadorComparacion <|-- ValidarSeleccionHandler : extends
ManejadorComparacion <|-- EnriquecerDatosHandler : extends
ManejadorComparacion <|-- CalcularMetricasHandler : extends
ManejadorComparacion <|-- DeterminarMejorHandler : extends
ManejadorComparacion <|-- FormatearResultadoHandler : extends
@enduml

El diagrama muestra claramente la estructura del patrón Chain of Responsibility. ManejadorComparacion es la clase base con el método manejar() que pasa la solicitud al siguiente handler. Los cinco handlers concretos extienden la clase base y sobrescriben manejar() con su lógica específica. La cadena se ensambla mediante setSiguiente(), creando un flujo secuencial: ValidarSeleccion → EnriquecerDatos → CalcularMetricas → DeterminarMejor → FormatearResultado.

PRUEBAS
La implementación del patrón Chain of Responsibility fue probada mediante la interacción directa con la interfaz de usuario y la verificación de la consola del navegador.

La primera prueba consistió en seleccionar exactamente 2 vehículos y hacer clic en "Comparar". Se verificó que la tabla de comparación se mostrara correctamente con ambos vehículos lado a lado y las 13 métricas calculadas. Se abrió la consola y se confirmó que los 5 handlers se ejecutaron en orden: ValidarSeleccionHandler mostró "✅ 2 vehículos OK → pasando...", seguido de EnriquecerDatosHandler, CalcularMetricasHandler, DeterminarMejorHandler y FormatearResultadoHandler.

La segunda prueba consistió en seleccionar 5 vehículos (máximo permitido) y hacer clic en "Comparar". Se verificó que la tabla mostrara los 5 vehículos correctamente y que la consola registrara "✅ 5 vehículos OK → pasando...".

La tercera prueba consistió en seleccionar solo 1 vehículo y hacer clic en "Comparar". Se verificó que apareciera un mensaje de error indicando "Selecciona al menos 2 vehículos para comparar" y que la tabla no se generara. En la consola se registró "❌ solo 1 seleccionados, mínimo 2". Esto confirmó que ValidarSeleccionHandler detuvo la cadena correctamente.

La cuarta prueba consistió en seleccionar 6 vehículos y hacer clic en "Comparar". Se verificó que apareciera el mensaje "Máximo 5 vehículos para comparar" y que la cadena se detuviera en el validador.

La quinta prueba consistió en verificar que los valores ★ se resaltaran correctamente en la tabla. Se seleccionaron 3 vehículos con diferentes costos de mantenimiento y se confirmó que el vehículo con menor costo total apareciera con el indicador ★ y el texto en color teal, indicando que DeterminarMejorHandler identificó correctamente el mejor valor.

La sexta prueba consistió en verificar la reutilización de datos. Se realizó una primera comparación con 3 vehículos, y luego una segunda comparación con los mismos vehículos. Se verificó que EnriquecerDatosHandler saltara las consultas API en la segunda ejecución mostrando "datos ya presentes, saltando...".

CONCLUSIONES
La implementación del patrón Chain of Responsibility en el frontend del Sistema de Gestión de Flotas demostró ser una solución efectiva para estructurar el flujo de procesamiento de comparación de vehículos en etapas independientes y reutilizables.

Los principales beneficios observados fueron la separación clara de responsabilidades, ya que cada handler encapsula una etapa específica del procesamiento (validación, consultas API, cálculos, lógica de negocio, formateo); la facilidad para modificar el orden de la cadena, porque solo se necesita cambiar el orden de los setSiguiente() en el ensamble; la capacidad de detener el flujo ante errores, ya que cualquier handler puede lanzar una excepción para interrumpir la cadena; la reutilización de datos entre ejecuciones, porque EnriquecerDatosHandler verifica si los datos ya están cargados antes de consultar la API; y la trazabilidad del flujo mediante los mensajes en consola con prefijo [CoR].

El patrón Chain of Responsibility se integra con los demás patrones del frontend. El patrón Observer se utiliza para notificar al Dashboard cuando se completa una comparación. El patrón State determina el color y los permisos de los vehículos cuyas métricas se calculan en CalcularMetricasHandler. El patrón Strategy proporciona los criterios de filtrado que pueden alimentar los datos de entrada de la cadena.

La implementación demuestra que el patrón Chain of Responsibility es ideal para flujos de procesamiento que deben ejecutarse en etapas secuenciales, donde cada etapa puede decidir si continuar o detener el flujo. La cadena de 5 handlers proporciona una arquitectura limpia y mantenible para la funcionalidad de comparación de vehículos del sistema.
