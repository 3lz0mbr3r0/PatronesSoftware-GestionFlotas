COMPOSITE PARA PATROCINADORES – FACHADA PARA PATROCINADORES
OSCAR YAIR PARDO PINEDA
Jorge Alfredo Leal Cruz
PRESENTADO A:
ELIECER MONTERO OJEDA
GRUPO: E19 6
INGENIERIA DE SISTEMAS
INSTITUCION UNIVERSITARIA TECNOLOGICA DE SANTANDER
BUCARAMANGA
2026 – 1
TABLA DE CONTENIDO
INTRODUCCION
OBJETIVO GENERAL
OBJETIVOS ESPECIFICOS
DESCRIPCION DEL PROYECTO
DIAGRAMA DE CLASES
ARQUITECTURA DEL SISTEMA
PATRONES DE DISEÑO DE SOFTWARE
PATROCINADOR SINGLETON
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
PATRÓN FACTORY METHOD
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
PATRÓN ABSTRACT FACTORY
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
CONSTRUCTOR DE PATROCINADORES
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
PROTOTIPO DE PATROCINADOR
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
PATRÓN DE ADAPTABILIDAD
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
PUENTE DE PATROCINADORES
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
DECORADOR PATROCINADO
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
COMPUESTO DEL PATROCINADOR
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
FACHADA DEL PATROCINADOR
IMPLEMENTACION EN EL CODIGO
DIAGRAMA UML
PRUEBAS
CONCLUSIONES
REFERENCIAS BIBLIOGRAFICAS
INTRODUCCION
El desarrollo de software moderno requiere la aplicación de principios de diseño que
permitan construir sistemas escalables, mantenibles y desacoplados. En el contexto del sector
logístico y de transporte, los sistemas informáticos cumplen un papel fundamental en la
gestión eficiente de flotas de vehículos, el monitoreo de operaciones y la optimización de
recursos.

El presente proyecto plantea el desarrollo de un Sistema de Gestión de Flotas, orientado a
administrar vehículos de transporte, controlar órdenes de operación y facilitar la toma de
decisiones dentro de un entorno logístico. El sistema se apoya en una arquitectura hexagonal,
la cual permite separar claramente la lógica de negocio de las dependencias tecnológicas
externas, favoreciendo la mantenibilidad y evolución del sistema.

Adicionalmente, se implementan diversos patrones de diseño creacionales, tales como
Singleton, Factory Method, Abstract Factory y Builder, con el propósito de mejorar la
organización del código, reducir el acoplamiento entre componentes y facilitar la creación de
objetos complejos dentro del dominio del sistema.

El uso de estos patrones demuestra la aplicación de buenas prácticas de ingeniería de software
orientada a objetos, permitiendo construir una solución robusta que simula un entorno real
de gestión logística y transporte.

OBJETIVO GENERAL
Desarrollar un Sistema de Gestión de Flotas que permita administrar vehículos y operaciones
de transporte mediante el uso de una arquitectura desacoplada y la implementación de
patrones de diseño que mejoren la escalabilidad, mantenibilidad y organización del software.

OBJETIVOS ESPECIFICOS
Diseñar la arquitectura del Sistema de Gestión de Flotas utilizando el modelo de
arquitectura hexagonal, con el fin de separar adecuadamente la lógica de negocio, la
capa de aplicación y la infraestructura, garantizando un sistema desacoplado y
mantenible.
Implementar los módulos del sistema para la gestión de vehículos, permitiendo realizar
operaciones de registro, consulta, actualización y eliminación de información mediante
servicios y endpoints que soporten la administración de la flota.
Evaluar el funcionamiento del sistema mediante pruebas sobre los servicios
implementados, verificando la correcta gestión de los vehículos y la interacción entre
las diferentes capas de la arquitectura del sistema.
DESCRIPCION DEL PROYECTO
El proyecto consiste en el desarrollo de un Sistema de Gestión de Flotas enfocado en el sector
logístico y de transporte, cuyo objetivo es administrar los vehículos que conforman una flota
y facilitar la gestión de las operaciones de transporte.

El sistema permite realizar funciones como:

Monitoreo en tiempo real de los vehículos registrados.
Optimización de rutas para mejorar la eficiencia del transporte.
Gestión y asignación de órdenes de transporte.
Mantenimiento predictivo de los vehículos.
Integración con sistemas de navegación.
DIAGRAMA DE CLASES
ARQUITECTURA DEL SISTEMA
La Arquitectura Hexagonal, también conocida como Arquitectura de Puertos y Adaptadores,
es un modelo arquitectónico propuesto por Alistair Cockburn cuyo objetivo principal es aislar
completamente la lógica de negocio de cualquier dependencia tecnológica externa.

Su principio fundamental establece que:

El núcleo del sistema (dominio) no debe depender de frameworks, bases de datos ni
interfaces externas.
Las dependencias deben apuntar siempre hacia el interior.
En este modelo, el dominio se ubica en el centro de la arquitectura y representa la parte más
estable y crítica del sistema: las reglas del negocio. A diferencia de las arquitecturas
tradicionales en capas donde el dominio suele terminar acoplado a tecnologías como
frameworks web o librerías de persistencia la arquitectura hexagonal protege la lógica del
negocio colocándola en el núcleo y obligando a que todo lo externo dependa de él, y no al
revés.

El sistema se organiza alrededor de un núcleo (dominio) y se conecta con el mundo exterior
mediante puertos y adaptadores.

Puertos : Son interfaces definidas por el dominio que establecen contratos de
comunicación.
o Puertos de entrada: representan los casos de uso que el sistema expone.
o Puertos de salida: representan servicios externos que el dominio necesita
(persistencia, servicios externos, etc.).
Adaptadores : Son implementaciones concretas de esos puertos. Permiten que
tecnologías específicas (como controladores REST, bases de datos o APIs externas)
interactúen con el sistema sin modificar el dominio.
Este enfoque permite que el sistema tenga múltiples puntos de entrada y salida (por ejemplo,
API REST, consola, mensajería, base de datos), todos conectados al núcleo mediante
contratos bien definidos, sin que el dominio conozca detalles técnicos.

CAPA DE DOMINIO
La capa de dominio constituye el centro arquitectónico del sistema. Está conformada por los
siguientes paquetes:

com.flotasytransportes.dominio.modelo
com.flotasytransportes.dominio.factory
com.flotasytransportes.dominio.puertos
com.flotasytransportes.dominio.abstractfactory
Aquí se concentra la lógica real del negocio logístico.

➢ MODELO
En el paquete dominio.modelo se encuentran las entidades principales del sistema, tales
como:

Vehiculo
Camión
Furgoneta
Moto
Transporte de pedidos
ReporteMantenimiento
EstadoVehiculo
Tipo de vehículo
Estas clases representan el modelo conceptual del negocio de flotas. No son simples
estructuras de datos, sino que encapsulan comportamiento y reglas propias del dominio,
como los estados operativos de un vehículo, la relación entre órdenes y unidades de
transporte, o la clasificación por tipo.

Un aspecto fundamental es que estas clases no contienen anotaciones de Spring ni de JPA.
Esto demuestra que el dominio se mantiene completamente aislado de la tecnología,
cumpliendo el principio central de la arquitectura hexagonal: la lógica de negocio no depende
del framework.

➢ FACTORY
En el paquete dominio.factory se encuentran clases como:

Fábrica de vehículos
Fábrica de Camiones
FurgonFactory
MotoFactory
Estas clases encapsulan la lógica de creación de los distintos tipos de vehículos. Desde el
punto de vista arquitectónico, esta decisión es relevante porque la creación de entidades
forma parte del negocio y no debe delegarse a la infraestructura.

Al centralizar la construcción de objetos dentro del dominio:

Se evita la dispersión de lógica de instanciación.
Se mantiene bajo acoplamiento.
Se facilita la extensión del sistema ante nuevos tipos de vehículos.
➢ PUERTO
El paquete dominio.puertos contiene interfaces como:

Puerto del repositorio de órdenes
Puerto de depósito de vehículos
Estos elementos representan los puertos de salida del sistema. Es decir, son contratos
definidos por el dominio para interactuar con el exterior, particularmente con la persistencia.

El dominio declara qué necesita (guardar vehículos, consultar órdenes, persistir
información), pero no define cómo se implementa. La implementación concreta se delega a
la infraestructura.

Este diseño materializa el principio de Inversión de Dependencias, ya que la infraestructura
depende de interfaces del dominio, y no al contrario.

CAPA DE APLICACIÓN
La capa de aplicación está representada por el paquete:

com.flotasytransportes.aplicacion.servicio
Incluye clases como:

Servicio de vehículos
Servicio de pedidos
CalculadoraDistanciaService
ReporteMantenimientoService
Esta capa no contiene lógica técnica ni detalles de persistencia. Su función es ejecutar los
casos de uso del sistema.

Por ejemplo, un servicio puede:

Recibir una solicitud proveniente de la capa web.
Utilizar una fábrica del dominio para crear una entidad.
Invocar un puerto de repositorio para persistir la información.
Coordinar el flujo completo del caso de uso.
Es importante destacar que la capa de aplicación no es infraestructura. No maneja
directamente la base de datos ni detalles de HTTP. Su responsabilidad es coordinar el
dominio, manteniendo la coherencia del flujo operativo.

CAPA DE INFRAESTRUCTURA
La capa de infraestructura contiene las implementaciones técnicas que permiten conectar el
dominio con el entorno externo.

➢ ADAPTADORES
En el paquete infrastructure.persistencia.adaptador se encuentran:

OrdenRepositoryAdapter
Adaptador de repositorio vehicular
Estas clases implementan las interfaces definidas en dominio.puertos. Aquí se concreta la
comunicación con la base de datos.

➢ ENTIDADES
El paquete infrastructure.persistencia.entidad contiene clases como:

Entidad vehicular
Es importante señalar que estas entidades son distintas a las entidades del dominio. Esto evita
que el modelo del negocio quede contaminado con anotaciones técnicas, manteniendo una
separación limpia entre modelo conceptual y modelo de base de datos.

➢ REPOSITORIOS
En infrastructure.persistencia.repositorio se encuentra:

Repositorio de vehículos JPA
Aquí aparece el uso de tecnologías como Spring Data JPA y Spring Boot. Estas dependencias
están correctamente ubicadas en la capa externa, cumpliendo el principio de independencia
tecnológica del dominio.

PATRONES DE DISEÑO DE SOFTWARE
PATROCINADOR SINGLETON
El Singleton es un patrón de diseño creacional cuyo objetivo es garantizar que una clase tenga
una única instancia durante todo el ciclo de vida de la aplicación y proporcionar un punto de
acceso global controlado a dicha instancia.

El patrón se utiliza cuando:

No tiene sentido crear múltiples instancias del mismo objeto.
El componente coordina lógica central del sistema.
Se desea controlar el acceso a recursos compartidos.
Tradicionalmente, en Java, se implementa mediante:

Constructor privado.
Atributo estático.
Método público getInstance().
Sin embargo, en aplicaciones modernas con contenedores IoC, como SPRING , el patrón
puede implementarse de forma gestionada por el framework.

En este proyecto, el patrón Singleton no fue implementado manualmente, sino que se utiliza
el Singleton gestionado por el contenedor de Spring.

En Spring Framework, el alcance por defecto de los componentes es patrón SINGLETON.

Esto significa que:

Se crea una única instancia.
Se reutiliza en toda la aplicación.
No se permite la creación manual repetida.
IMPLEMENTACION EN EL CODIGO
El patrón Singleton se evidencia en las clases anotadas con la siguiente sentencia:

@Servicio
@Repositorio
@Componente
IMPORTANTE
El patrón Singleton se utiliza en tu Sistema de Gestión de Flotas porque:

Los servicios representan coordinadores centrales del negocio.
Los repositorios gestionan recursos compartidos.
No se requiere estado independiente por instancia.
Se busca eficiencia y coherencia global.
El framework utilizado lo implementa de manera natural y segura.
En este contexto, el Singleton no es una elección arbitraria, sino una consecuencia lógica del
diseño del sistema y de la naturaleza de sus componentes.

DIAGRAMA UML
PRUEBAS
La imagen anterior muestra la ejecución de una petición HTTP al endpoint expuesto por
VehiculoController, el cual utiliza internamente la clase VehiculoService, anotada con
@Service.

Durante la ejecución de múltiples solicitudes desde Postman, se imprimió en consola el
hashCode de la instancia de VehiculoService. Se evidenció que el identificador de la
instancia permanece constante en cada petición, lo que confirma que el contenedor de Spring
crea una única instancia de la clase y la reutiliza durante todo el ciclo de vida de la aplicación.

Este comportamiento demuestra la aplicación del patrón Singleton en la capa de servicios,
ya que existe una sola instancia compartida que coordina la lógica de negocio relacionada
con la gestión de vehículos.

PATRÓN FACTORY METHOD
El Factory Method es un patrón de diseño creacional cuyo propósito es definir una interfaz
para la creación de objetos, permitiendo que las subclases decidan qué clase concreta
instanciar.

En lugar de crear objetos directamente mediante new ClaseConcreta() la creación se delega
a una fábrica que encapsula la lógica de instanciación.

Este patrón se utiliza cuando:

Existen múltiples variantes de un mismo tipo de objeto.
La creación depende de una condición.
Se desea reducir el acoplamiento entre el cliente y las clases concretas.
IMPLEMENTACION EN EL CODIGO
En este proyecto, el patrón Factory Method se encuentra en el paquete:

Clases involucradas:

Estas clases encapsulan la lógica de creación de los distintos tipos de vehículos.

En el sistema existen distintos tipos de vehículos:

Camión
Furgón
Moto
Cada uno puede tener características o comportamientos particulares.

Si la creación se hiciera directamente en el servicio con múltiples condicionales:

if(tipo.equals("CAMION")) {
return new Camion(...);
} else if(tipo.equals("FURGON")) {
return new Furgon(...);
}

Esto generaría:

Alto acoplamiento
Violación del principio Open/Closed
Código difícil de mantener
Lógica de creación dispersa
El Factory Method centraliza esa responsabilidad.

DIAGRAMA UML
PRUEBAS
Con el fin de validar la correcta implementación del patrón Factory Method dentro del
sistema de gestión de flotas, se realizaron pruebas de creación de distintos tipos de vehículos
mediante solicitudes enviadas al endpoint correspondiente del módulo de vehículos.

Durante las pruebas se enviaron peticiones desde POSTMAN para registrar vehículos de
diferentes tipos, específicamente Moto, Furgón y Camión. Cada solicitud incluye la
información necesaria del vehículo, como la placa, tipo de vehículo y demás atributos
definidos en el DTO utilizado por el sistema.

Cuando el sistema recibe la solicitud, la clase VehiculoService delega la creación del objeto
a la fábrica correspondiente según el tipo de vehículo indicado. De esta manera, el sistema
selecciona automáticamente la clase de fábrica adecuada ( MotoFactory, FurgonFactory o
CamionFactory ) , la cual se encarga de construir la instancia concreta del vehículo.

Los resultados observados en las respuestas del sistema y en los registros almacenados
evidencian que cada solicitud genera correctamente el tipo de objeto esperado dentro del
dominio. Esto confirma que la lógica de creación de objetos no se encuentra acoplada
directamente al servicio, sino que está centralizada en las fábricas especializadas.

PATRÓN ABSTRACT FACTORY
Es un patrón de diseño creacional cuyo propósito es proporcionar una interfaz para crear
familias de objetos relacionados o dependientes sin especificar sus clases concretas. Este
patrón permite que el código cliente utilice diferentes conjuntos de objetos compatibles entre
sí sin quedar acoplado a sus implementaciones específicas.

La idea principal del patrón es separar la lógica de creación de objetos de su uso, delegando
dicha responsabilidad a una fábrica abstracta que define los métodos de creación, mientras
que las fábricas concretas implementan esos métodos para instanciar los productos
específicos. Este patrón es especialmente útil cuando un sistema necesita trabajar con
múltiples familias de objetos que deben utilizarse conjuntamente, garantizando que los
objetos creados sean compatibles entre sí.

Uno de los aspectos importantes del ABSTRACT FACTORY es que generalmente utiliza
internamente el patrón Factory Method para realizar la instanciación de los productos
concretos. Mientras que el FACTORY METHOD se enfoca en la creación de un solo
producto, el ABSTRACT FACTORY coordina la creación de conjuntos completos de
objetos relacionados. Entre las principales ventajas de este patrón se encuentran el
desacoplamiento entre el cliente y las clases concretas, la facilidad para cambiar o ampliar
familias de productos y el cumplimiento del principio Open/Closed, ya que es posible agregar
nuevas familias de objetos sin modificar el código existente.

Sin embargo, también presenta algunas desventajas, como el aumento en el número de clases
dentro del sistema y la dificultad para agregar nuevos tipos de productos si no fueron
contemplados inicialmente en la interfaz de la fábrica. En sistemas complejos o escalables,
el patrón ABSTRACT FACTORY resulta especialmente útil para mantener una
arquitectura organizada, flexible y extensible, permitiendo que la creación de objetos se
gestione de manera centralizada y coherente con el dominio del sistema.

IMPLEMENTACION EN EL CODIGO
En el proyecto se implementa el patrón ABSTRACT FACTORY para gestionar la creación
de los distintos tipos de vehículos dentro de la flota caracterizados por su tipo de energía.

La clase abstracta definida en el dominio es:

Esta interfaz establece el contrato que deben cumplir todas las clases encargadas de crear
vehículos dentro del sistema.

A partir de esta clase abstracta se implementan las siguientes clases concretas:

Fábrica de Camiones
FurgonFactory
MotoFactory
Cada una de estas clases se encarga de crear un tipo específico de vehículo.

En esta estructura se observa la aplicación del patrón ABSTRACT FACTORY para
organizar la creación de los distintos tipos de vehículos del sistema. La interfaz
VehiculoAbstractFactory actúa como la clase abstracta, ya que define el método
crearVehiculo () que deben implementar todas las fábricas encargadas de crear objetos del
dominio.

A partir de esta abstracción se implementan las clases concretas, como CamionFactory,
FurgonFactory y MotoFactory. Cada una de estas clases se especializa en la creación de un
tipo específico de vehículo según su tipo de energía.

Los objetos que finalmente se crean (Camión, Furgon y Moto) corresponden a los productos
concretos del patrón. Todos ellos pertenecen a la misma familia de objetos del dominio
(Vehículo), pero representan diferentes tipos de vehículos dentro del sistema de gestión de
flotas dado que algunos su tipo de energía es ELECTRICA o mediante el gasto de
GASOLINA.

Dentro de la clase VehiculoService, este método utiliza el patrón ABSTRACT FACTORY
para crear diferentes tipos de vehículos de manera desacoplada.

Primero, se declara una variable de tipo VehiculoAbstractFactory, que representa la clase
abstracta encargada de definir cómo se crean los vehículos. Luego, mediante una estructura
switch, el sistema selecciona la clase concreta correspondiente según el tipo de vehículo
solicitado (CamionFactory, MotoFactory o FurgonFactory).

Una vez elegida la clase, se llama al método crearVehiculo () pasando los datos del
VehiculoDTO. Cada clase concreta se encarga de crear el objeto específico (Camion, Moto
o Furgon).

De esta forma, el servicio no depende directamente de las clases concretas, sino de la
abstracción de la clase, lo que permite mantener el sistema desacoplado y facilita la
incorporación de nuevos tipos de vehículos sin modificar la lógica principal.

DIAGRAMA UML
PRUEBAS
Esta sección presenta las pruebas integrales del módulo de vehículos, en el cual se
implementa el patrón ABSTRACT FACTORY para la creación de distintos tipos de
vehículos dentro del sistema. Las pruebas validan el correcto funcionamiento de las
operaciones CRUD (Crear, Leer, Actualizar y Eliminar) utilizando el endpoint /vehículos,
permitiendo gestionar vehículos a través de su placa como identificador principal.

POST /
PUT vehiculos/{placa}^
Creación de un vehiculo nuevo
/ Actualización del vehiculo
GET vehiculos Lista completa de vehiculos
GET vehiculos/{placa} Buscar un vehiculo
DELETE vehiculos/{placa} Eliminar un vehiculo existente
CREACIÓN DE UN VEHICULO NUEVO

Se envió una solicitud POST al endpoint /vehiculos, proporcionando los datos necesarios
para registrar un nuevo vehículo, incluyendo la placa, el tipo de vehículo y demás atributos
requeridos. Dependiendo del tipo de energía indicado en la solicitud, el sistema utiliza el

patrón Abstract Factory para seleccionar automáticamente la fábrica correspondiente, como
CamionFactory, MotoFactory o FurgonFactory, encargada de crear la instancia concreta del
vehículo ya sea ELECTRICO o a GASOLINA.

ACTUALIZACION DEL VEHICULO

Actualización de vehículos mediante solicitudes PUT al endpoint /vehiculos/{placa}. Estas
pruebas permitieron verificar que el sistema puede modificar correctamente la información
de un vehículo existente manteniendo la coherencia de los datos dentro del sistema.

LISTA COMPLETA DE VEHICULOS

Utilizando solicitudes GET para obtener la lista completa de vehículos registrados y para
buscar un vehículo específico por su placa. Los resultados mostraron que el sistema devuelve

correctamente la información almacenada, confirmando que las entidades creadas mediante
las fábricas concretas se integran correctamente con la lógica del sistema.

ELIMINAR UN VEHICULO EXISTENTE

Finalmente, se realizaron pruebas de eliminación de vehículos mediante solicitudes DELETE
al endpoint /vehiculos/{placa}. Estas pruebas confirmaron que el sistema puede eliminar
correctamente un vehículo existente de la lista registrada.

Los resultados obtenidos en todas estas pruebas demuestran que el patrón Abstract Factory
está funcionando correctamente dentro del sistema, permitiendo crear diferentes tipos de
vehículos de forma desacoplada y manteniendo una arquitectura flexible y extensible.

CONSTRUCTOR DE PATROCINADORES
Es un patrón creacional cuyo propósito principal es construir objetos complejos paso a paso ,
separando el proceso de construcción de la representación final del objeto. Este patrón
permite que un mismo proceso de construcción pueda crear diferentes representaciones de
un objeto dependiendo de los parámetros o configuraciones utilizadas durante su creación.

En el desarrollo de software orientado a objetos, es común encontrar clases que requieren
una gran cantidad de atributos para representar correctamente una entidad del sistema.
Cuando una clase posee muchos atributos, especialmente cuando algunos son obligatorios y
otros opcionales , el uso de constructores tradicionales puede generar código difícil de leer,
mantener o extender. En estos casos, el patrón Builder proporciona una solución estructurada
que permite crear objetos de manera progresiva y controlada.

El patrón Builder propone la creación de una clase constructora que se encarga de configurar
los diferentes atributos del objeto final. En lugar de instanciar directamente el objeto
mediante un constructor con múltiples parámetros, el desarrollador utiliza el Builder para
establecer cada atributo mediante métodos específicos, y finalmente invoca un método el
cual se encarga de generar la instancia completa del objeto.

IMPLEMENTACION EN EL CODIGO
El patrón Builder se implementa en la clase:

Esta clase representa un reporte de mantenimiento de un vehículo, el cual contiene múltiples
atributos relacionados con el mantenimiento realizado.

La clase Builder es una clase interna estática dentro de ReporteMantenimiento cuya función
es implementar el patrón de diseño Builder. Este patrón permite construir objetos complejos
paso a paso, separando los atributos obligatorios de los opcionales. Gracias a esta estructura,
el proceso de creación del objeto se vuelve más organizado, legible y flexible dentro del
sistema.

Dentro del Builder se definen primero los atributos obligatorios del reporte de
mantenimiento, los cuales son placaVehiculo, kilometraje, fecha y tipoMantenimiento. Estos
datos son necesarios para que el sistema pueda identificar correctamente el vehículo y el tipo

de mantenimiento que se realizará. Por esta razón, estos atributos se reciben a través del
constructor del Builder, garantizando que siempre estén presentes cuando se cree un reporte.

Además de los campos obligatorios, el Builder también incluye varios atributos opcionales ,
como observaciones, prioridad, técnico responsable, taller, costo estimado, tiempo estimado
de trabajo, si requiere repuestos, nivel de desgaste y el kilometraje recomendado para el
próximo mantenimiento. Estos atributos permiten agregar información adicional al reporte,
pero no son indispensables para su creación.

En la clase ReporteMantenimientoController la implementación del patrón Builder no se
realiza directamente, pero esta clase participa en su uso dentro del flujo de la aplicación. El
controlador recibe los datos necesarios para crear un reporte de mantenimiento mediante una
solicitud HTTP y los envía a la capa de servicio, donde posteriormente se utiliza el patrón
Builder para construir el objeto ReporteMantenimiento.

La sección donde se relaciona con la implementación del patrón Builder es el método crear(),
anotado con @PostMapping("/mantenimiento"). En este método se recibe un objeto
ReporteMantenimientoDTO a través del cuerpo de la petición (@RequestBody). Este DTO
contiene los datos que el usuario envía para crear el reporte de mantenimiento. Una vez
recibido y validado con @Valid, el controlador envía este objeto al método crearReporte()
del servicio ReporteMantenimientoService.

Es precisamente dentro del servicio donde se utiliza el Builder para construir la instancia de
ReporteMantenimiento utilizando los datos del DTO. Por lo tanto, el controlador cumple el
rol de punto de entrada de los datos que posteriormente serán utilizados por el Builder para
crear el objeto final.

En la clase ReporteMantenimientoService se utiliza directamente el patrón Builder dentro
del método crearReporte(ReporteMantenimientoDTO dto). En este método primero se
verifica si el vehículo existe en el sistema utilizando el repositorio VehiculoRepositoryPort.
Si el vehículo no existe, se lanza una excepción para evitar crear un reporte con una placa
inválida.

Una vez validado el vehículo, se procede a construir el objeto ReporteMantenimiento
utilizando el patrón Builder mediante la instrucción new ReporteMantenimiento.Builder(...).
Allí se pasan los datos obligatorios como la placa del vehículo, el kilometraje, la fecha y el
tipo de mantenimiento. Luego, mediante métodos encadenados se asignan los atributos
opcionales del reporte.

Finalmente, al llamar al método build() se crea el objeto ReporteMantenimiento completo, el
cual se guarda en la lista de reportes y se retorna como resultado del método. De esta manera,
el patrón Builder permite crear el objeto de forma más clara y organizada.

DIAGRAMA UML
PRUEBAS
La primera prueba consistió en la creación de un reporte de mantenimiento enviando una
solicitud POST con todos los datos requeridos. En esta solicitud se incluyen los atributos
obligatorios del reporte, como la placa del vehículo, el kilometraje, la fecha y el tipo de
mantenimiento. Además, se pueden incluir atributos opcionales como observaciones,
prioridad, técnico responsable, taller, costo estimado o nivel de desgaste. Una vez recibida la
solicitud, el sistema utiliza el patrón Builder dentro del servicio
ReporteMantenimientoService para construir el objeto ReporteMantenimiento paso a paso y
finalmente generar la instancia completa mediante el método build().

Otra de las pruebas realizadas fue la creación de un reporte sin diligenciar algunos de los
atributos opcionales. En este caso, el sistema permitió crear el reporte correctamente, lo cual
demuestra el funcionamiento del patrón Builder, ya que permite construir objetos complejos

separando los atributos obligatorios de los opcionales, evitando la necesidad de utilizar
constructores extensos con múltiples parámetros.

Adicionalmente, se realizó una prueba en la cual se intentó crear un reporte de mantenimiento
utilizando una placa de vehículo que no se encuentra registrada en la base de datos. En este
caso, el sistema realiza una validación previa dentro del servicio
ReporteMantenimientoService, consultando el repositorio de vehículos. Si el vehículo no
existe, se genera una excepción y el sistema no permite crear el reporte. Esta validación
garantiza la integridad de la información, evitando que se registren mantenimientos asociados
a vehículos inexistentes.

PROTOTIPO DE PATROCINADOR
El patrón Prototype es un patrón de diseño creacional cuyo propósito es crear nuevos objetos
a partir de la clonación de una instancia existente, evitando la creación directa mediante
constructores tradicionales. En lugar de instanciar objetos desde cero, el sistema utiliza un
objeto base (prototipo) que contiene una configuración inicial, el cual puede ser copiado para
generar nuevas instancias.

Este patrón resulta especialmente útil cuando la creación de objetos es costosa en términos
de tiempo o recursos, o cuando los objetos poseen múltiples configuraciones que se repiten
frecuentemente dentro del sistema. Mediante la clonación, se reduce la complejidad del
proceso de creación y se mejora la eficiencia del sistema.

Desde el punto de vista estructural, el patrón Prototype suele apoyarse en la implementación
de un método como clone(), el cual permite duplicar el objeto manteniendo sus atributos
internos. Dependiendo del caso, la clonación puede ser superficial (shallow copy) o profunda
(deep copy), garantizando que las nuevas instancias sean independientes del objeto original.

En el contexto del sistema de gestión de flotas, el patrón Prototype permite replicar objetos
del domini o , como vehículos o reportes de mantenimiento, que ya han sido previamente
configurados. Por ejemplo, es posible clonar un vehículo existente con ciertas características
operativas y generar una nueva instancia modificando únicamente atributos como la placa o
el estado.

De esta manera, el sistema evita la recreación completa del objeto y facilita la reutilización
de configuraciones existentes, lo cual mejora la productividad del desarrollo y mantiene la
coherencia en la creación de entidades dentro del dominio.

IMPLEMENTACION EN EL CODIGO
El patrón Prototype se implementa en la clase:

En la imagen se observan las clases involucradas en la implementación del patrón Prototype
dentro del sistema. Se identifica la clase principal del dominio, la cual actúa como prototipo
y contiene el método de clonación que permite generar nuevas instancias a partir de un objeto
existente.

Esta estructura evidencia cómo el sistema reutiliza configuraciones previamente definidas,
permitiendo la creación de nuevos objetos de manera eficiente sin necesidad de instanciarlos
desde cero, lo cual reduce el acoplamiento y mejora la organización del código.

En la imagen se observa la implementación del método clonarVehiculo, el cual permite
aplicar el patrón Prototype dentro del sistema. Este método se encarga de generar una copia
de un objeto existente, replicando sus atributos para crear una nueva instancia basada en el
prototipo.

A través de este metodo, el sistema puede reutilizar configuraciones previamente definidas y
crear nuevos objetos de forma más eficiente, evitando la instanciación manual completa y
reduciendo la complejidad en la creación de entidades del dominio.

Además, el uso de este método garantiza que el objeto clonado sea una instancia
independiente del original, permitiendo modificar sus atributos sin afectar el estado del
prototipo inicial. Esto facilita la generación de múltiples objetos con características similares,
manteniendo consistencia en la información y mejorando la flexibilidad del sistema ante
futuros cambios o ampliaciones.

En la imagen se observa la definición del endpoint mediante la anotación @PostMapping, el
cual permite recibir solicitudes externas para la creación de nuevos objetos dentro del
sistema. En este caso, el controlador actúa como punto de entrada para invocar la lógica de
clonación del vehículo.
A través de este endpoint, el sistema recibe la información necesaria y delega la operación al
servicio correspondiente, donde se aplica el patrón Prototype para generar una nueva
instancia basada en un objeto existente. Esto demuestra cómo el patrón se integra con la
arquitectura del sistema y es utilizado en escenarios reales de operación.

El uso de @Override indica que el método está definido en una interfaz o clase base, lo que
permite mantener una estructura organizada y desacoplada. En este punto se aplica
directamente el patrón Prototype, asegurando que la creación del objeto se realice mediante
clonación y no por instanciación directa.

DIAGRAMA UML
PRUEBAS
Para validar la correcta implementación del patrón Prototype dentro del sistema de gestión
de flotas, se realizaron pruebas mediante la herramienta Postman, utilizando el endpoint
expuesto para la clonación de vehículos.

En las pruebas se enviaron solicitudes HTTP de tipo POST hacia el controlador del sistema,
donde se recibe la información necesaria para identificar el objeto base (prototipo) que será
clonado. A partir de esta solicitud, el sistema invoca la lógica del servicio, el cual ejecuta el
método clonarVehiculo para generar una nueva instancia basada en el objeto original.

Los resultados obtenidos en las respuestas del sistema evidencian que se crea correctamente
un nuevo vehículo con atributos similares al prototipo, manteniendo coherencia en la
información. Adicionalmente, se puede observar que el objeto generado es independiente del
original, permitiendo la modificación de sus atributos sin afectar la instancia base.

Estas pruebas confirman que el sistema implementa correctamente el patrón Prototype, ya
que la creación de objetos se realiza mediante clonación en lugar de instanciación directa,
optimizando el proceso y reduciendo la complejidad en la construcción de entidades del
dominio.

PATRÓN DE ADAPTABILIDAD
El patrón Adapter es un patrón de diseño estructural cuyo propósito es permitir la
comunicación entre clases o sistemas con interfaces incompatibles, actuando como un
intermediario que traduce una interfaz en otra que el cliente puede utilizar.

Este patrón resulta fundamental cuando se desea integrar componentes existentes o sistemas
externos sin modificar su código original, ya que encapsula la lógica de conversión necesaria
para que ambos puedan interactuar de manera transparente. De esta forma, el Adapter evita
cambios directos en las clases del dominio, promoviendo el principio de bajo acoplamiento
y facilitando la extensibilidad del sistema.

En el sistema de gestión de flotas, el patrón Adapter se implementa dentro de la arquitectura
hexagonal, específicamente en la capa de infraestructura. Aquí, los adapters permiten
conectar los puertos definidos en el dominio con las implementaciones concretas, como
repositorios basados en JPA o servicios externos.

Este enfoque permite que la lógica de negocio permanezca completamente independiente de
detalles técnicos, facilitando la sustitución de tecnologías (por ejemplo, cambiar de base de
datos o framework) sin afectar el núcleo del sistema.

IMPLEMENTACION EN EL CODIGO
El patrón Adapter se implementa en la clase:

En la imagen se observan las clases involucradas en la implementación del patrón Adapter,
junto con sus relaciones representadas mediante flechas. Se identifica la interfaz del dominio,
la clase DistanceAdapter y la clase concreta encargada del cálculo de distancias.

Las flechas indican la relación de implementación y dependencia entre las clases,
evidenciando cómo el DistanceAdapter actúa como intermediario al implementar la interfaz
esperada y adaptar la funcionalidad de la clase existente.

Esta estructura permite que el sistema utilice el cálculo de distancias sin depender
directamente de la implementación concreta, garantizando un bajo acoplamiento y
facilitando la integración de nuevas funcionalidades sin afectar la lógica principal.

En la imagen se observa la clase DistanceAdapter, la cual implementa el patrón Adapter
dentro del sistema. Esta clase actúa como un intermediario encargado de adaptar el cálculo
de distancias a la interfaz que el sistema espera utilizar.

El DistanceAdapter permite integrar una lógica de cálculo externa o diferente (por ejemplo,
otra forma de medir distancias) sin modificar la estructura del sistema, traduciendo los datos
y operaciones hacia el formato requerido por el dominio.

Se observa la interfaz DistanceServicePort, la cual representa el puerto definido en el
dominio del sistema. Esta interfaz establece las operaciones necesarias para el cálculo de
distancias, sin depender de una implementación específica.

Dentro del patrón Adapter, esta interfaz actúa como el contrato que debe ser implementado
por el DistanceAdapter, permitiendo que el sistema utilice el servicio de cálculo de distancias
de manera desacoplada.

La clase OrdenService, la cual forma parte de la capa de aplicación y se encarga de gestionar
la lógica relacionada con las órdenes dentro del sistema.

Esta clase utiliza la interfaz DistanceServicePort para realizar el cálculo de distancias, sin
depender directamente de una implementación concreta. De esta manera, el servicio delega
esta responsabilidad al Adapter, cumpliendo con el principio de bajo acoplamiento.

DIAGRAMA UML
PRUEBAS
En la imagen se evidencia la ejecución completa del sistema durante una prueba del patrón
Adapter, mostrando los mensajes generados en consola mediante System.out.println.

Inicialmente, el sistema registra la creación de una orden desde la clase OrdenService,
indicando el origen y la búsqueda de vehículos disponibles. Posteriormente, se observa cómo
el flujo pasa al DistanceAdapter, el cual actúa como intermediario y delega el cálculo de
distancia a una implementación específica (CalculadoraDistanciaService).

Durante la ejecución, se muestra el cálculo de la distancia entre dos puntos geográficos,
evidenciando que el Adapter traduce correctamente la solicitud hacia el servicio externo o
adaptado. Finalmente, el sistema selecciona el vehículo más cercano y asigna la orden,
confirmando que toda la operación se realizó correctamente.

PUENTE DE PATROCINADORES
El patrón Bridge es un patrón de diseño estructural cuyo objetivo principal es separar una
abstracción de su implementación, permitiendo que ambas puedan evolucionar de manera
independiente sin generar dependencias directas entre ellas.

Este patrón resulta especialmente útil en escenarios donde una clase puede tener múltiples
variaciones tanto en su estructura como en su comportamiento. En lugar de crear una gran
cantidad de clases combinadas para cubrir todas las posibles variaciones, el patrón Bridge
propone dividir el sistema en dos jerarquías independientes: por un lado, la abstracción, que
define la lógica principal del sistema, y por otro, la implementación, que contiene los detalles
específicos de funcionamiento.

En el entorno del sistema de gestión de flotas, el patrón Bridge permite desacoplar la lógica
principal de ciertos procesos del sistema de las diferentes formas en que estos pueden ser
implementados. Por ejemplo, una misma funcionalidad puede tener distintas maneras de
ejecutarse dependiendo del tipo de servicio o tecnología utilizada, y gracias al uso del Bridge,
estas variaciones pueden manejarse sin necesidad de modificar la estructura principal del
sistema.

IMPLEMENTACION EN EL CODIGO
El patrón Bridge se implementa en la clase:

En las anteriores imágenes se presenta la definición de la interfaz que forma parte de la
implementación del patrón Bridge dentro del sistema. Esta interfaz actúa como un contrato
que define las operaciones que deben ser implementadas por las clases concretas, permitiendo
separar la lógica principal del sistema de los detalles específicos de ejecución.

Mediante esta estructura, la abstracción puede delegar el comportamiento a diferentes
implementaciones sin establecer una dependencia directa con ellas, lo que favorece un bajo
acoplamiento y permite que el sistema sea más flexible y fácilmente extensible ante futuros
cambios.

En esta estructura, la interfaz NavegacionAPI representa la implementación (Implementor)
del patrón, ya que define las operaciones relacionadas con la navegación y el cálculo de rutas.
Por su parte, la clase RutaRapidaService, que implementa la interfaz ServicioRutas, actúa
como la abstracción (Abstraction), encargándose de la lógica del sistema sin depender de una
implementación concreta.

El patrón Bridge se materializa en el momento en que la clase RutaRapidaService recibe
como parámetro una instancia de NavegacionAPI, permitiendo delegar en ella las
operaciones específicas. Esta relación se configura mediante la anotación @Bean, donde se
inyecta una implementación concreta (por ejemplo, googleMapsAPI) sin acoplar
directamente la lógica del servicio a dicha implementación.

En este caso, la clase define un comportamiento específico para la generación de rutas,
correspondiente a una estrategia de tipo económica. A través del método sobrescrito
generarRuta, se delega el cálculo de la ruta a la implementación de NavegacionAPI,
manteniendo desacoplada la lógica de negocio de los detalles concretos de la API de
navegación.

El patrón Bridge se evidencia en la forma en que la clase recibe la implementación mediante
el constructor y la utiliza a través de la composición heredada, sin depender de una
implementación específica. Esto permite que la lógica de generación de rutas pueda variar
(por ejemplo, rápida o económica) sin afectar la forma en que se realiza el cálculo, el cual
queda delegado a la interfaz de navegación.

Esta clase actúa como un objeto de transferencia de datos dentro del sistema, siendo utilizada
como resultado del proceso de cálculo de rutas. En el contexto del patrón Bridge, la clase
Ruta es el objeto que se genera a partir de la interacción entre la abstracción (ServicioRutas
y sus variantes) y la implementación (NavegacionAPI).

En el contexto del sistema, esta interfaz permite desacoplar la lógica de generación de rutas
de los detalles específicos de cómo se realiza el cálculo, ya sea mediante APIs externas o
diferentes algoritmos. De esta forma, las clases que pertenecen a la abstracción, como
ServicioRutas y sus derivadas, interactúan únicamente con esta interfaz sin conocer la
implementación concreta.

El patrón Bridge se evidencia en que NavegacionAPI actúa como punto de conexión entre la
abstracción y las implementaciones concretas, permitiendo que el sistema pueda integrar
diferentes proveedores de navegación (por ejemplo, Google Maps u otros servicios) sin
modificar la lógica principal.

DIAGRAMA UML
PRUEBAS
En la imagen se evidencia la ejecución de una prueba del sistema donde se aplica el patrón
Bridge en el proceso de generación de rutas. Inicialmente, el sistema indica que se está
generando una ruta utilizando la estructura del patrón, mostrando el mensaje “Generando ruta
con Bridge...”.

Posteriormente, se selecciona el tipo de abstracción correspondiente, en este caso Ruta
rápida, lo que indica que se está utilizando una implementación específica de la abstracción
(como RutaRapidaService).

A continuación, se observa el mensaje “Google Maps en uso”, lo que confirma que el sistema
está utilizando una implementación concreta de la interfaz NavegacionAPI, evidenciando
cómo la abstracción delega la ejecución en la implementación sin acoplarse directamente a
ella.

El sistema continúa mostrando el resultado del cálculo, como la distancia de la ruta, y
posteriormente ejecuta operaciones adicionales como la actualización del vehículo en la base
de datos y la asignación de la orden.

DECORADOR PATROCINADO
El patrón Decorator es un patrón de diseño estructural que permite agregar funcionalidades
adicionales a un objeto de manera dinámica, sin necesidad de modificar su estructura original.
Este patrón se fundamenta en el principio de composición sobre herencia, ya que, en lugar
de crear múltiples subclases para extender comportamientos, se utilizan objetos decoradores
que envuelven al objeto base.

El funcionamiento del patrón consiste en crear una jerarquía de clases donde tanto el
componente base como los decoradores comparten una misma interfaz. De esta forma, los
decoradores pueden sustituir al objeto original en cualquier parte del sistema, manteniendo
la compatibilidad y permitiendo la extensión del comportamiento de manera transparente.

A diferencia de otros enfoques, el patrón Decorator permite añadir responsabilidades de
forma incremental, es decir, se pueden combinar múltiples decoradores sobre un mismo
objeto, logrando así una gran flexibilidad en la construcción de funcionalidades sin generar
una explosión de clases en el sistema.

En el contexto del sistema de gestión de flotas, el patrón Decorator se utiliza para extender
funcionalidades sobre componentes existentes, como la generación de reportes, el
procesamiento de información o la adición de características adicionales a ciertos servicios,
sin modificar su implementación base.

IMPLEMENTACION EN EL CODIGO
El patrón Decorator se implementa en la clase:

En la imagen se observa la estructura del proyecto dentro del entorno de desarrollo, donde se
identifica el paquete correspondiente a la implementación del patrón Decorator. En este se

agrupan las diferentes clases que participan en la extensión de funcionalidades relacionadas
con la gestión de rutas.

Se puede apreciar la organización de las clases en torno a un componente base, una
implementación principal y varios decoradores que permiten añadir nuevas características de
manera progresiva. Esta estructura facilita la extensión del comportamiento del sistema sin
modificar las clases originales.

A través del método sobrescrito procesarRuta, el decorador primero delega la ejecución al
objeto base mediante la llamada a super.procesarRuta(ruta), lo que garantiza que se mantenga
el comportamiento original. Posteriormente, se añade una funcionalidad adicional, en este
caso, el ajuste de la distancia de la ruta en función de las condiciones climáticas.

Este comportamiento se refleja en la modificación del atributo distancia, incrementándolo en
un valor específico, lo que simula el impacto del clima sobre la ruta. De esta manera, el
decorador extiende la funcionalidad del objeto sin alterar su implementación base.

En la imagen se observa la clase PeajeDecorator, la cual corresponde a un decorador concreto
dentro del patrón Decorator. Esta clase extiende de RutaDecorator, lo que le permite envolver
un objeto del tipo RutaComponent y añadir nuevas funcionalidades de manera dinámica sin
modificar la implementación base.

En el método procesarRuta, el decorador inicia delegando la ejecución al componente
envuelto mediante la llamada a super.procesarRuta(ruta), asegurando que se conserve el
comportamiento original del sistema. Posteriormente, se incorpora una funcionalidad
adicional relacionada con el cálculo de costos de peajes.

Este comportamiento se refleja en la modificación del atributo distancia de la ruta,
incrementándolo en un valor específico, lo que simula el impacto de los peajes dentro del
recorrido. De esta forma, el decorador añade una nueva responsabilidad sin alterar la lógica
del componente base.

A través del método procesarRuta, se ejecuta la funcionalidad original, retornando la ruta sin
alteraciones y mostrando un mensaje que indica que no se han aplicado cambios. Esta clase
representa el punto de partida sobre el cual se construirán las extensiones mediante los
diferentes decoradores.

En el contexto del patrón Decorator, RutaBaseComponent es el objeto que será envuelto por
los decoradores concretos, permitiendo que se le añadan nuevas funcionalidades de forma
progresiva sin modificar su implementación original.

Esta estructura garantiza el cumplimiento del principio de abierto/cerrado, ya que el
comportamiento del sistema puede ser extendido mediante decoradores sin necesidad de
alterar la clase base, favoreciendo la flexibilidad y mantenibilidad del software.

En la imagen se observa la interfaz RutaComponent, la cual representa el componente base
(Component) dentro de la implementación del patrón Decorator. Esta interfaz define el
contrato común que deben cumplir tanto el componente concreto como los decoradores.

A través del método procesarRuta, se establece la operación principal del sistema relacionada
con el procesamiento de rutas, la cual podrá ser extendida por los diferentes decoradores sin
modificar su definición original.

Esta estructura permite que todos los objetos involucrados en el patrón compartan la misma
interfaz, lo que garantiza que los decoradores puedan sustituir al componente base de manera
transparente dentro del sistema.

En el método procesarRuta, el decorador inicia delegando la ejecución al componente
envuelto mediante la llamada a super.procesarRuta(ruta), garantizando que se mantenga el
comportamiento base previamente definido. Posteriormente, se incorpora una funcionalidad
adicional relacionada con el ajuste de la ruta en función de las condiciones de tráfico.

Este comportamiento se refleja en el incremento del atributo distancia de la ruta, simulando
el impacto del tráfico en el recorrido. De esta manera, el decorador añade una nueva
responsabilidad al objeto sin alterar su implementación original.

DIAGRAMA UML
PRUEBAS
En la imagen se evidencia la ejecución de una prueba del sistema donde se aplica el patrón
Decorator para el procesamiento de rutas. Inicialmente, el sistema indica que se están
aplicando decoradores sobre la ruta, lo que marca el inicio del encadenamiento de
funcionalidades adicionales.

En primer lugar, se ejecuta el componente base, representado por el mensaje “Ruta sin
modificaciones”, lo que confirma que el objeto inicial corresponde a la implementación base
(RutaBaseComponent).

Posteriormente, se observa la aplicación secuencial de los diferentes decoradores: primero el
ajuste por tráfico, luego la adición de costos de peajes y finalmente la modificación por
condiciones climáticas. Cada uno de estos pasos corresponde a un decorador concreto
(TraficoDecorator, PeajeDecorator y ClimaDecorator), los cuales envuelven el objeto base y
añaden nuevas responsabilidades de forma progresiva.

El resultado final muestra una distancia total modificada (“Ruta final con decoradores:
14.5”), lo que evidencia cómo cada decorador aporta un cambio incremental al valor original,
demostrando el funcionamiento acumulativo del patrón.

COMPUESTO DEL PATROCINADOR
El patrón Composite es un patrón de diseño estructural que permite organizar objetos en
estructuras jerárquicas tipo árbol, de tal manera que tanto los objetos individuales como las
composiciones de objetos puedan ser tratados de forma uniforme.

Este patrón se basa en la definición de una interfaz común que es implementada tanto por los
elementos simples (hojas) como por los elementos compuestos, lo que permite que el cliente
no tenga que diferenciar entre ellos al momento de utilizarlos.

En el contexto del sistema de gestión de flotas, el patrón Composite se utiliza para representar
rutas de transporte que están compuestas por múltiples segmentos, permitiendo calcular de
manera unificada la distancia total y gestionar cada parte del recorrido como un componente
dentro de una estructura mayor.

Esto facilita la construcción de soluciones más flexibles, ya que permite combinar rutas
simples en estructuras más complejas sin modificar la lógica del sistema, promoviendo una
arquitectura más modular y escalable.

IMPLEMENTACION EN EL CODIGO
El patrón Composite se implementa en la clase:

En la imagen se observa la clase RutaCompuestaComponent, la cual representa el
componente compuesto (Composite) dentro de la implementación del patrón Composite.
Esta clase implementa la interfaz RutaComponent y tiene la capacidad de contener múltiples
componentes del mismo tipo, permitiendo construir estructuras jerárquicas de rutas.

La clase mantiene una colección de segmentos (List), lo que le permite
agrupar tanto rutas simples como otras rutas compuestas. A través del método addSegmento,
se pueden agregar nuevos componentes, mientras que removeSegmento permite gestionar
dinámicamente la estructura.

El método procesarRuta evidencia el comportamiento recursivo del patrón, ya que recorre
cada uno de los segmentos y delega en ellos el procesamiento de la ruta, permitiendo que
cada componente aplique su propia lógica.

Por su parte, el método getDistanciaTotal calcula la distancia total mediante la suma de las
distancias de todos los segmentos, utilizando programación funcional con streams, lo que
simplifica el cálculo agregado.

Se observa la clase RutaSimpleComponent, la cual representa un componente hoja (Leaf)
dentro de la implementación del patrón Composite. Esta clase implementa la interfaz
RutaComponent y modela un segmento individual de ruta dentro del sistema. Cada instancia
encapsula un objeto Ruta del dominio, el cual contiene la información básica del recorrido
(origen, destino y distancia), además de permitir ajustes adicionales mediante el atributo
ajusteDistancia.

El método getDistanciaTotal retorna la distancia del segmento incluyendo cualquier ajuste
aplicado, mientras que procesarRuta representa la ejecución del comportamiento base para
una ruta individual. Al tratarse de un componente hoja, los métodos addSegmento y
removeSegmento no están permitidos y lanzan una excepción, lo que garantiza que este tipo
de componente no pueda contener otros elementos, manteniendo la integridad de la estructura
del patrón.

La interfaz RutaComponent, la cual representa el componente base (Component) dentro de
la implementación del patrón Composite. Esta interfaz define el contrato común que deben
cumplir tanto los componentes simples como los compuestos, permitiendo que todos puedan
ser tratados de manera uniforme dentro del sistema.

La interfaz incluye métodos fundamentales como getDistanciaTotal, getDescripcionRuta y
la gestión de segmentos mediante addSegmento y removeSegmento, lo que permite construir
estructuras jerárquicas de rutas. Asimismo, el método isCompuesto facilita la identificación
del tipo de componente dentro de la estructura.

Un aspecto importante de esta implementación es que la interfaz extiende la interfaz
RutaComponent del patrón Decorator, lo que permite integrar ambos patrones de diseño.
Gracias a esta decisión, los componentes del Composite pueden ser utilizados junto con los
decoradores, permitiendo aplicar funcionalidades adicionales tanto a rutas simples como a
rutas compuestas.

DIAGRAMA UML
PRUEBAS
Se observa la ejecución de la prueba donde se implementa el patrón Composite para la
construcción de una ruta compuesta. Inicialmente, el sistema crea dos rutas simples que

representan los segmentos del recorrido y las agrega a un componente compuesto, calculando
correctamente la distancia total como la suma de ambos segmentos.

Posteriormente, se muestra la descripción de la ruta compuesta, donde se detallan cada uno
de los segmentos y su distancia individual, confirmando el correcto funcionamiento de la
estructura jerárquica.

Luego, se aplican los decoradores sobre la ruta compuesta, añadiendo ajustes por tráfico,
peajes y condiciones climáticas. Esto se refleja en el incremento de la distancia final,
evidenciando cómo las funcionalidades se combinan dinámicamente sobre el composite.

Finalmente, el sistema completa el proceso asignando la orden correctamente, lo que
confirma que la integración entre los patrones Composite y Decorator funciona de manera
adecuada dentro del flujo del sistema.

FACHADA DEL PATROCINADOR
El patrón Facade es un patrón de diseño estructural que proporciona una interfaz unificada y
simplificada para interactuar con un conjunto de subsistemas complejos. Su objetivo es
ocultar la lógica interna del sistema y ofrecer un punto de acceso único que facilite la
interacción del cliente.

Este patrón no modifica la funcionalidad existente, sino que encapsula la complejidad,
reduciendo el acoplamiento entre los componentes y mejorando la claridad del sistema.

En el contexto del sistema de gestión de flotas, el patrón Facade permite centralizar el proceso
de creación y asignación de órdenes de transporte, evitando que los controladores tengan que
interactuar directamente con múltiples servicios y dependencias internas.

De esta manera, se logra una arquitectura más limpia, donde los clientes acceden al sistema
mediante una interfaz simplificada sin necesidad de conocer los detalles de implementación.

IMPLEMENTACION EN EL CODIGO
El patrón Facade se implementa en la clase:

En la imagen se observa la clase OrdenTransporteFacade, la cual implementa el patrón
Facade dentro del sistema de gestión de flotas. Esta clase actúa como un punto de entrada
único que simplifica la interacción con el subsistema encargado de la gestión de órdenes de
transporte.

La fachada mantiene una referencia al servicio OrdenService, el cual contiene la lógica de
negocio principal. A través del método crearYAsignarOrden, la fachada recibe la solicitud
del cliente y delega la ejecución al servicio correspondiente, ocultando la complejidad interna
del sistema.

Adicionalmente, se incorporan mensajes de control que permiten evidenciar el flujo de
ejecución, mostrando cómo la fachada recibe la solicitud, delega el proceso y retorna el
resultado final con el vehículo asignado.

Esta implementación demuestra la correcta aplicación del patrón Facade, ya que permite
desacoplar al cliente de los detalles internos del sistema, facilitando su uso, mejorando la
mantenibilidad y proporcionando una interfaz más clara y centralizada para la gestión de
órdenes.

Se observa la clase OrdenController, la cual actúa como cliente del patrón Facade dentro del
sistema. Este controlador expone el endpoint /ordenes/asignar, permitiendo la creación y
asignación de órdenes de transporte a través de una solicitud HTTP.

A diferencia de la implementación original, el controlador no interactúa directamente con
múltiples servicios internos, sino que delega toda la operación a la clase
OrdenTransporteFacade, la cual encapsula la complejidad del proceso.

Esta estructura permite que el controlador mantenga una responsabilidad clara y simplificada,
enfocándose únicamente en recibir la solicitud y retornar la respuesta, sin necesidad de
conocer detalles sobre la lógica de negocio, repositorios o servicios adicionales.

La implementación evidencia la correcta aplicación del patrón Facade, ya que reduce el
acoplamiento entre la capa de presentación y la lógica interna del sistema, mejorando la
mantenibilidad y facilitando la evolución del software.

DIAGRAMA UML
PRUEBAS
Se observa la ejecución completa del sistema a través del patrón Facade, el cual actúa como
punto de entrada principal para la creación y asignación de una orden de transporte.

Inicialmente, la fachada OrdenTransporteFacade recibe la solicitud de la orden y delega el
procesamiento al servicio interno, evidenciando su función como intermediario entre el
cliente y el subsistema.

A partir de este punto, se ejecuta todo el flujo interno del sistema sin que el cliente tenga
conocimiento de su complejidad. Se observa cómo se integran múltiples patrones de diseño:
el patrón Adapter para el cálculo de distancias, el patrón Bridge para la generación de rutas,
el patrón Composite para la construcción de rutas compuestas y el patrón Decorator para
aplicar ajustes dinámicos como tráfico, peajes y condiciones climáticas.

Posteriormente, el sistema calcula la distancia total de la ruta compuesta, aplica los
decoradores y finalmente asigna el vehículo más adecuado, completando la operación de
manera exitosa.

Finalmente, la fachada retorna el resultado mostrando que la orden fue procesada
correctamente y que el vehículo fue asignado, lo que confirma que el patrón Facade encapsula
toda la complejidad del sistema y permite ejecutar procesos avanzados mediante una única
llamada.

CONCLUSIONES
El desarrollo del Sistema de Gestión de Flotas permitió aplicar de manera práctica diversos
conceptos fundamentales de la ingeniería de software orientada a objetos, demostrando cómo
una adecuada organización arquitectónica puede contribuir a la construcción de sistemas más
mantenibles, escalables y desacoplados. A través de la implementación de la arquitectura
hexagonal, fue posible separar claramente la lógica del dominio de las dependencias
tecnológicas externas, garantizando que las reglas del negocio permanezcan independientes
de frameworks, bases de datos o interfaces externas.

La utilización de esta arquitectura permitió estructurar el sistema en diferentes capas bien
definidas, como dominio, aplicación e infraestructura, facilitando la comprensión del flujo
de funcionamiento del sistema y promoviendo el principio de inversión de dependencias.
Gracias a este enfoque, el núcleo del sistema se mantiene protegido de cambios tecnológicos,
permitiendo que la aplicación pueda evolucionar o adaptarse a nuevas tecnologías sin afectar
la lógica principal del negocio.

Asimismo, la implementación de distintos patrones de diseño creacionales, como Singleton,
Factory Method, Abstract Factory y Builder, permitió mejorar significativamente la
organización del código y la gestión de la creación de objetos dentro del sistema. El patrón
Singleton fue utilizado mediante el contenedor de Spring para garantizar una única instancia
de los servicios y repositorios, optimizando el uso de recursos y asegurando una gestión
centralizada de la lógica del sistema.

Por su parte, el patrón Factory Method permitió delegar la creación de diferentes tipos de
vehículos a fábricas especializadas, evitando el uso de estructuras condicionales complejas
dentro de los servicios y reduciendo el acoplamiento entre componentes. De manera
complementaria, el patrón Abstract Factory permitió organizar la creación de familias de
objetos relacionados, garantizando que los distintos tipos de vehículos puedan ser generados
de forma flexible y extensible dentro del sistema.

Mientras que, el patrón Builder fue utilizado para la construcción de reportes de
mantenimiento, permitiendo crear objetos complejos de manera progresiva y estructurada.

Este patrón facilitó la separación entre atributos obligatorios y opcionales, mejorando la
legibilidad del código y evitando la necesidad de utilizar constructores extensos con múltiples
parámetros.

Adicionalmente, la implementación del patrón Prototype permitió optimizar la creación de
objetos dentro del sistema mediante la clonación de instancias existentes. Esto facilitó la
reutilización de configuraciones previamente definidas, reduciendo la complejidad en la
instanciación de entidades y permitiendo generar nuevos objetos de manera eficiente sin
afectar el estado del objeto original.

Por otra parte, el patrón Adapter permitió integrar componentes con interfaces diferentes,
especialmente en la comunicación entre la lógica de negocio y servicios externos, como el
cálculo de distancias. A través de este patrón, se logró desacoplar el dominio de las
implementaciones concretas, garantizando que el sistema pueda interactuar con diferentes
servicios sin depender directamente de ellos, lo que mejora la flexibilidad y mantenibilidad
de la aplicación.

De igual manera, el patrón Bridge permitió separar la abstracción de la lógica de rutas de las
implementaciones concretas de los servicios de navegación, facilitando que ambos puedan
evolucionar de forma independiente. Esto fortaleció la capacidad del sistema para adaptarse
a distintos proveedores de servicios sin modificar la lógica central.

Asimismo, el patrón Decorator permitió extender dinámicamente el comportamiento de las
rutas mediante la adición de funcionalidades como condiciones climáticas, tráfico y costos
de peajes, demostrando una alta flexibilidad al permitir combinar múltiples responsabilidades
sin modificar las clases base.

En complemento, la implementación del patrón Composite permitió modelar las rutas de
transporte como estructuras jerárquicas compuestas por múltiples segmentos, facilitando el
cálculo de distancias totales y el tratamiento uniforme de rutas simples y compuestas. Este
enfoque permitió representar de manera más realista los procesos logísticos del sistema,
mejorando la organización del código y la extensibilidad de la solución.

Finalmente, el patrón Facade permitió simplificar la interacción entre la capa de presentación
y los servicios internos del sistema, proporcionando un punto de acceso único para la creación
y asignación de órdenes de transporte. Esto redujo el acoplamiento, mejoró la claridad del
flujo del sistema y facilitó tanto el mantenimiento como la realización de pruebas.

Las pruebas realizadas mediante herramientas como Postman permitieron validar el correcto
funcionamiento de los servicios implementados, confirmando que el sistema puede gestionar
correctamente la creación, consulta, actualización y eliminación de vehículos, así como la
generación de reportes de mantenimiento asociados a los mismos. Estas pruebas evidenciaron
que la arquitectura y los patrones de diseño aplicados cumplen adecuadamente su propósito
dentro del sistema.

En conclusión, el desarrollo de este proyecto permitió demostrar cómo la aplicación adecuada
de principios de diseño, arquitecturas desacopladas y patrones de diseño contribuye a la
construcción de sistemas de software más robustos, organizados y fáciles de mantener. La
integración de múltiples patrones, tanto creacionales como estructurales, evidencia un
enfoque sólido de diseño que permite al sistema evolucionar de manera flexible ante nuevos
requerimientos tecnológicos y de negocio.

REFERENCIAS BIBLIOGRAFICAS
Bloch, J. (2018). Java eficaz (3.ª ed.). Addison-Wesley Professional.
https://www.oreilly.com/library/view/effective-java-3rd/9780134686097/

Cockburn, A. (2005). Arquitectura hexagonal . Recuperado de
https://alistair.cockburn.us/hexagonal-architecture

Evans, E. (2003). Diseño orientado al dominio: Abordando la complejidad en el corazón del software .
Addison-Wesley Professional.
https://domainlanguage.com/ddd/

Fowler, M. (2002). Patrones de arquitectura de aplicaciones empresariales . Addison-Wesley.
https://martinfowler.com/books/eaa.html

Freeman, E., Robson, E., Sierra, K., & Bates, B. (2020). Patrones de diseño de cabeza primero (2.ª
ed.). O'Reilly Media.
https://www.oreilly.com/library/view/head-first-design/9781492077992/

Gamma, E. (1995). Patrones de diseño: Abstracción y reutilización del diseño orientado a objetos .
Conferencia Europea sobre Programación Orientada a Objetos.
https://link.springer.com/chapter/10.1007/BFb0053381

Gamma, E., Helm, R., Johnson, R., & Vlissides, R. (1994). Patrones de diseño: Elementos de
software orientado a objetos reutilizable . Addison-Wesley.
https://www.oreilly.com/library/view/design-patterns-elements/0201633612/

GeeksforGeeks. (2024). Patrón de diseño de adaptador y patrón de diseño de prototipo .
https://www.geeksforgeeks.org

Oracle. (2023). Tutoriales de Java: Conceptos de programación orientada a objetos . Oracle
Corporation.
https://docs.oracle.com/javase/tutorial/java/concepts/

Refactoring Guru. (2024). Catálogo de patrones de diseño .
https://refactoring.guru/design-patterns

Richardson, C. (2018). Patrones de microservicios: con ejemplos en Java . Manning
Publications.
https://microservices.io/book

Spring. (2024). Documentación de referencia de Spring Boot .
https://docs.spring.io/spring-boot/docs/current/reference/html/

Spring. (2024). Documentación de referencia del framework Spring .
https://docs.spring.io/spring-framework/docs/current/reference/html/