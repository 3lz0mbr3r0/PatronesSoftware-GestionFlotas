 / Patrones de diseño / Patrones estructurales

Proxy
Propósito
Proxy es un patrón de diseño estructural que te permite proporcionar un sustituto o marcador de

posición para otro objeto. Un proxy controla el acceso al objeto original, permitiéndote hacer algo

antes o después de que la solicitud llegue al objeto original.

 Problema

  
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
¿Por qué querrías controlar el acceso a un objeto? Imagina que tienes un objeto enorme que

consume una gran cantidad de recursos del sistema. Lo necesitas de vez en cuando, pero no

siempre.

Las consultas a las bases de datos pueden ser muy lentas.

Puedes llevar a cabo una implementación diferida, es decir, crear este objeto sólo cuando sea

realmente necesario. Todos los clientes del objeto tendrán que ejecutar algún código de

inicialización diferida. Lamentablemente, esto seguramente generará una gran cantidad de código

duplicado.

En un mundo ideal, querríamos meter este código directamente dentro de la clase de nuestro

objeto, pero eso no siempre es posible. Por ejemplo, la clase puede ser parte de una biblioteca

cerrada de un tercero.

 Solución
El patrón Proxy sugiere que crees una nueva clase proxy con la misma interfaz que un objeto de

servicio original. Después actualizas tu aplicación para que pase el objeto proxy a todos los

clientes del objeto original. Al recibir una solicitud de un cliente, el proxy crea un objeto de

servicio real y le delega todo el trabajo.

¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
El proxy se camufla como objeto de la base de datos. Puede gestionar la inicialización diferida y el caché de
resultados sin que el cliente o el objeto real de la base de datos lo sepan.
Pero, ¿cuál es la ventaja? Si necesitas ejecutar algo antes o después de la lógica primaria de la

clase, el proxy te permite hacerlo sin cambiar esa clase. Ya que el proxy implementa la misma

interfaz que la clase original, puede pasarse a cualquier cliente que espere un objeto de servicio

real.

 Analogía en el mundo real
Las tarjetas de crédito pueden utilizarse para realizar pagos tanto como el efectivo.

Una tarjeta de crédito es un proxy de una cuenta bancaria, que, a su vez, es un proxy de un manojo

de billetes. Ambos implementan la misma interfaz, por lo que pueden utilizarse para realizar un

pago. El consumidor se siente genial porque no necesita llevar un montón de efectivo encima. El

dueño de la tienda también está contento porque los ingresos de la transacción se añaden

electrónicamente a la cuenta bancaria de la tienda sin el riesgo de perder el depósito o sufrir un

robo de camino al banco.

 Estructura
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
 Pseudocódigo
Este ejemplo ilustra cómo el patrón Proxy puede ayudar a introducir la inicialización diferida y el

almacenamiento en caché a una biblioteca de integración de YouTube de un tercero.

La Interfaz de Servicio declara la interfaz del Servicio. El proxy debe seguir esta interfaz para
poder camuflarse como objeto de servicio.
Servicio es una clase que proporciona una lógica de negocio útil.
La clase Proxy tiene un campo de referencia que apunta a un objeto de servicio. Cuando el
proxy finaliza su procesamiento (por ejemplo, inicialización diferida, registro, control de acceso,
almacenamiento en caché, etc.), pasa la solicitud al objeto de servicio.
Normalmente los proxies gestionan el ciclo de vida completo de sus objetos de servicio.

El Cliente debe funcionar con servicios y proxies a través de la misma interfaz. De este modo
puedes pasar un proxy a cualquier código que espere un objeto de servicio.
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
Resultados del almacenamiento en caché de un servicio con un proxy.

La biblioteca nos proporciona la clase de descarga de videos. Sin embargo, es muy ineficiente. Si la

aplicación cliente solicita el mismo video muchas veces, la biblioteca lo descarga una y otra vez, en

lugar de guardarlo en caché y reutilizar el primer archivo descargado.

La clase proxy implementa la misma interfaz que el descargador original y le delega todo el

trabajo. No obstante, mantiene un seguimiento de los archivos descargados y devuelve los

resultados en caché cuando la aplicación solicita el mismo video varias veces.

// La interfaz de un servicio remoto.
interface ThirdPartyYouTubeLib is
method listVideos()
method getVideoInfo(id)
method downloadVideo(id)
// La implementación concreta de un conector de servicio. Los
// métodos de esta clase pueden solicitar información a YouTube.
// La velocidad de la solicitud depende de la conexión a
// internet del usuario y de YouTube. La aplicación se
// ralentizará si se lanzan muchas solicitudes al mismo tiempo,
// incluso aunque todas soliciten la misma información.
class ThirdPartyYouTubeClass implements ThirdPartyYouTubeLib is
method listVideos() is
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
// Envía una solicitud API a YouTube.

method getVideoInfo(id) is
// Obtiene metadatos de algún video.

method downloadVideo(id) is
// Descarga un archivo de video de YouTube.

// Para ahorrar ancho de banda, podemos guardar en caché
// resultados de la solicitud durante algún tiempo, pero se
// puede colocar este código directamente dentro de la clase de
// servicio. Por ejemplo, puede haberse proporcionado como parte
// de la biblioteca de un tercero y/o definido como final. Por
// eso colocamos el código de almacenamiento en caché dentro de
// una nueva clase proxy que implementa la misma interfaz que la
// clase servicio. Delega al objeto de servicio únicamente
// cuando deben enviarse las solicitudes reales.
class CachedYouTubeClass implements ThirdPartyYouTubeLib is
private field service: ThirdPartyYouTubeLib
private field listCache, videoCache
field needReset

constructor CachedYouTubeClass(service: ThirdPartyYouTubeLib) is
this .service = service

method listVideos() is
if (listCache == null || needReset)
listCache = service.listVideos()
return listCache

method getVideoInfo(id) is
if (videoCache == null || needReset)
videoCache = service.getVideoInfo(id)
return videoCache

method downloadVideo(id) is
if (!downloadExists(id) || needReset)
service.downloadVideo(id)

// La clase GUI, que solía trabajar directamente con un objeto
// de servicio, permanece sin cambios siempre y cuando trabaje
// con el objeto de servicio a través de una interfaz. Podemos
// pasar sin riesgo un objeto proxy en lugar de un objeto de
// servicio real, ya que ambos implementan la misma interfaz.
class YouTubeManager is
protected field service: ThirdPartyYouTubeLib

constructor YouTubeManager(service: ThirdPartyYouTubeLib) is
this .service = service

¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
 Aplicabilidad
Hay decenas de formas de utilizar el patrón Proxy. Repasemos los usos más populares.

 Inicialización diferida (proxy virtual). Es cuando tienes un objeto de servicio muy pesado que
utiliza muchos recursos del sistema al estar siempre funcionando, aunque solo lo necesites de
vez en cuando.
 En lugar de crear el objeto cuando se lanza la aplicación, puedes retrasar la inicialización del
objeto a un momento en que sea realmente necesario.

 Control de acceso (proxy de protección). Es cuando quieres que únicamente clientes específicos
sean capaces de utilizar el objeto de servicio, por ejemplo, cuando tus objetos son partes
fundamentales de un sistema operativo y los clientes son varias aplicaciones lanzadas
(incluyendo maliciosas).
 El proxy puede pasar la solicitud al objeto de servicio tan sólo si las credenciales del cliente
cumplen ciertos criterios.

method renderVideoPage(id) is
info = service.getVideoInfo(id)
// Representa la página del video.
method renderListPanel() is
list = service.listVideos()
// Representa la lista de miniaturas de los videos.
method reactOnUserInput() is
renderVideoPage()
renderListPanel()
// La aplicación puede configurar proxies sobre la marcha.
class Application is
method init() is
aYouTubeService = new ThirdPartyYouTubeClass()
aYouTubeProxy = new CachedYouTubeClass(aYouTubeService)
manager = new YouTubeManager(aYouTubeProxy)
manager.reactOnUserInput()
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
 Ejecución local de un servicio remoto (proxy remoto). Es cuando el objeto de servicio se ubica
en un servidor remoto.

 En este caso, el proxy pasa la solicitud del cliente por la red, gestionando todos los detalles
desagradables de trabajar con la red.

 Solicitudes de registro (proxy de registro). Es cuando quieres mantener un historial de
solicitudes al objeto de servicio.

 El proxy puede registrar cada solicitud antes de pasarla al servicio.
 Resultados de solicitudes en caché (proxy de caché). Es cuando necesitas guardar en caché
resultados de solicitudes de clientes y gestionar el ciclo de vida de ese caché, especialmente si
los resultados son muchos.
 El proxy puede implementar el caché para solicitudes recurrentes que siempre dan los mismos
resultados. El proxy puede utilizar los parámetros de las solicitudes como claves de caché.

 Referencia inteligente. Es cuando debes ser capaz de desechar un objeto pesado una vez que no
haya clientes que lo utilicen.

 El proxy puede rastrear los clientes que obtuvieron una referencia del objeto de servicio o sus
resultados. De vez en cuando, el proxy puede recorrer los clientes y comprobar si siguen
activos. Si la lista del cliente se vacía, el proxy puede desechar el objeto de servicio y liberar
los recursos subyacentes del sistema.
El proxy también puede rastrear si el cliente ha modificado el objeto de servicio. Después, los
objetos sin cambios pueden ser reutilizados por otros clientes.
 Cómo implementarlo
Si no hay una interfaz de servicio preexistente, crea una para que los objetos de proxy y de
servicio sean intercambiables. No siempre resulta posible extraer la interfaz de la clase servicio,
porque tienes que cambiar todos los clientes del servicio para utilizar esa interfaz. El plan B
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
consiste en convertir el proxy en una subclase de la clase servicio, de forma que herede la
interfaz del servicio.
Crea la clase proxy. Debe tener un campo para almacenar una referencia al servicio.
Normalmente los proxies crean y gestionan el ciclo de vida completo de sus servicios. En raras
ocasiones, el cliente pasa un servicio al proxy a través de un constructor.
Implementa los métodos del proxy según sus propósitos. En la mayoría de los casos, después de
hacer cierta labor, el proxy debería delegar el trabajo a un objeto de servicio.
Considera introducir un método de creación que decida si el cliente obtiene un proxy o un
servicio real. Puede tratarse de un simple método estático en la clase proxy o de todo un
método de fábrica.
Considera implementar la inicialización diferida para el objeto de servicio.
 Pros y contras
 Relaciones con otros patrones
Con Adapter se accede a un objeto existente a través de una interfaz diferente. Con Proxy , la
interfaz sigue siendo la misma. Con Decorator se accede al objeto a través de una interfaz
mejorada.
Facade es similar a Proxy en el sentido de que ambos pueden almacenar temporalmente una
entidad compleja e inicializarla por su cuenta. Al contrario que Facade, Proxy tiene la misma
 Puedes controlar el objeto de servicio sin
que los clientes lo sepan.
 Puedes gestionar el ciclo de vida del
objeto de servicio cuando a los clientes no
les importa.
 El proxy funciona incluso si el objeto de
servicio no está listo o no está disponible.
 Principio de abierto/cerrado. Puedes
introducir nuevos proxies sin cambiar el
servicio o los clientes.
 El código puede complicarse ya que debes
introducir gran cantidad de clases nuevas.
 La respuesta del servicio puede retrasarse.

¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
interfaz que su objeto de servicio, lo que hace que sean intercambiables.

Decorator y Proxy tienen estructuras similares, pero propósitos muy distintos. Ambos patrones
se basan en el principio de composición, por el que un objeto debe delegar parte del trabajo a
otro. La diferencia es que, normalmente, un Proxy gestiona el ciclo de vida de su objeto de
servicio por su cuenta, mientras que la composición de los Decoradores siempre está controlada
por el cliente.
 Ejemplos de código
VOLVER LEER SIGUIENTE
¡Apoya nuestro sitio web gratuito y compra el libro!
22 patrones de diseño y 8 principios explicados en profundidad
436 páginas bien estructuradas, fáciles de leer y libres de tecnicismos
225 ilustraciones y diagramas claros y útiles
Un archivo con ejemplos de código en 11 lenguajes
Todos los dispositivos soportados: Formatos PDF/EPUB/MOBI/KFX
 Saber más...

¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!
 Flyweight Patrones de comportamiento 

Inicio Refactorización Patrones de diseño

Contenido Premium Curso de Git Foro Contáctanos

  

 2014-2026 Refactoring.Guru.
Todos los derechos reservados.
 Ilustraciones por Dmitry Zhart

Términos y condiciones Política de privacidad
Política de uso de contenido About us
Ukrainian office:
FOP Olga Skobeleva
Abolmasova 7
Kyiv, Ukraine, 02002
 Email:
support@refactoring.guru

Spanish office:
Oleksandr Shvets
Avda Pamplona 64
Pamplona, Spain, 31009
 Email:
support@refactoring.guru
¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!¡Ey! Mi curso nuevo de Git está en GitByBit.com, ¡míralo!