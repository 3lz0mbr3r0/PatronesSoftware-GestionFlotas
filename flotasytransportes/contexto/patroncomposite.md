¿Qué es el patrón Composite?

El patrón Composite permite tratar objetos individuales y composiciones de
objetos de manera uniforme.

En otras palabras:
Puedes manejar un objeto simple y un conjunto de objetos como si fueran lo mismo.

Idea clave

Organiza los objetos en una estructura de árbol jerárquica , donde:

Leaf (Hoja): objeto individual
Composite: objeto que contiene otros objetos (hojas o composites)
Component: interfaz común
Problema que resuelve

Cuando tienes estructuras como:

Árboles (menús, archivos, UI)
Escenas en videojuegos
Sistemas jerárquicos
Y necesitas:

✔ Ejecutar operaciones iguales sobre todos los elementos

✔ Evitar código diferente para objetos simples y compuestos

Problema

El uso del patrón Composite sólo tiene sentido cuando el modelo central de tu
aplicación puede representarse en forma de árbol.

Por ejemplo, imagina que tienes dos tipos de objetos: Productos y Cajas.
Una Caja puede contener varios Productos así como cierto número de Cajas más
pequeñas. Estas Cajas pequeñas también pueden contener algunos Productos o
incluso Cajas más pequeñas, y así sucesivamente.

Digamos que decides crear un sistema de pedidos que utiliza estas clases. Los
pedidos pueden contener productos sencillos sin envolver, así como cajas llenas de
productos... y otras cajas. ¿Cómo determinarás el precio total de ese pedido?

Un pedido puede incluir varios productos empaquetados en cajas, que a su vez están
empaquetados en cajas más grandes y así sucesivamente. La estructura se asemeja
a un árbol boca abajo.

Puedes intentar la solución directa: desenvolver todas las cajas, repasar todos los
productos y calcular el total. Esto sería viable en el mundo real; pero en un programa
no es tan fácil como ejecutar un bucle. Tienes que conocer de antemano las clases
de Productos y Cajas a iterar, el nivel de anidación de las cajas y otros detalles
desagradables. Todo esto provoca que la solución directa sea demasiado
complicada, o incluso imposible.

Solución

El patrón Composite sugiere que trabajes con Productos y Cajas a través de una
interfaz común que declara un método para calcular el precio total.

¿Cómo funcionaría este método? Para un producto, sencillamente devuelve el precio
del producto. Para una caja, recorre cada artículo que contiene la caja, pregunta su
precio y devuelve un total por la caja. Si uno de esos artículos fuera una caja más
pequeña, esa caja también comenzaría a repasar su contenido y así sucesivamente,

hasta que se calcule el precio de todos los componentes internos. Una caja podría
incluso añadir costos adicionales al precio final, como costos de empaquetado.

La gran ventaja de esta solución es que no tienes que preocuparte por las clases
concretas de los objetos que componen el árbol. No tienes que saber si un objeto es
un producto simple o una sofisticada caja. Puedes tratarlos a todos por igual a través
de la interfaz común. Cuando invocas un método, los propios objetos pasan la
solicitud a lo largo del árbol.

Analogía en el mundo real

Un ejemplo de estructura militar.

Los ejércitos de la mayoría de países se estructuran como jerarquías. Un ejército está
formado por varias divisiones; una división es un grupo de brigadas y una brigada está
formada por pelotones, que pueden dividirse en escuadrones. Por último, un
escuadrón es un pequeño grupo de soldados reales. Las órdenes se dan en la parte
superior de la jerarquía y se pasan hacia abajo por cada nivel hasta que todos los
soldados saben lo que hay que hacer.

Estructura

La interfaz Componente describe operaciones que son comunes a elementos
simples y complejos del árbol.
La Hoja es un elemento básico de un árbol que no tiene subelementos.
Normalmente, los componentes de la hoja acaban realizando la mayoría del trabajo
real, ya que no tienen a nadie a quien delegarle el trabajo.

El Contenedor (también llamado compuesto ) es un elemento que tiene
subelementos: hojas u otros contenedores. Un contenedor no conoce las
clases concretas de sus hijos. Funciona con todos los subelementos
únicamente a través de la interfaz componente.
Al recibir una solicitud, un contenedor delega el trabajo a sus subelementos, procesa
los resultados intermedios y devuelve el resultado final al cliente.

Aplicabilidad

Utilizar el patrón Composite cuando se tenga que implementar una estructura de
objetos con forma de árbol.

El patrón Composite proporciona dos tipos de elementos básicos que comparten
una interfaz común: hojas simples y contenedores complejos. Un contenedor puede
estar compuesto por hojas y por otros contenedores. Esto te permite construir una
estructura de objetos recursivos anidados parecida a un árbol.

Utilizar el patrón cuando se quiera que el código cliente trate elementos simples
y complejos de la misma forma.

Todos los elementos definidos por el patrón Composite comparten una interfaz
común. Utilizando esta interfaz, el cliente no tiene que preocuparse por la clase
concreta de los objetos con los que funciona.

Cómo implementarlo

Asegúrate de que el modelo central de tu aplicación pueda representarse
como una estructura de árbol. Intenta dividirlo en elementos simples y
contenedores. Recuerda que los contenedores deben ser capaces de
contener tanto elementos simples como otros contenedores.
Declara la interfaz componente con una lista de métodos que tengan sentido
para componentes simples y complejos.
Crea una clase hoja para representar elementos simples. Un programa puede
tener varias clases hoja diferentes.
Crea una clase contenedora para representar elementos complejos. Incluye
un campo matriz en esta clase para almacenar referencias a subelementos. La
matriz debe poder almacenar hojas y contenedores, así que asegúrate de
declararla con el tipo de la interfaz componente.
Al implementar los métodos de la interfaz componente, recuerda que un contenedor
debe delegar la mayor parte del trabajo a los subelementos.

Por último, define los métodos para añadir y eliminar elementos hijos dentro
del contenedor.
Ten en cuenta que estas operaciones se pueden declarar en la interfaz componente.
Esto violaría el Principio de segregación de la interfaz porque los métodos de la clase

hoja estarían vacíos. No obstante, el cliente podrá tratar a todos los elementos de la
misma manera, incluso al componer el árbol.

Pros y contras

Puedes trabajar con estructuras de árbol complejas con mayor comodidad:
utiliza el polimorfismo y la recursión en tu favor.
Principio de abierto/cerrado. Puedes introducir nuevos tipos de elemento en
la aplicación sin descomponer el código existente, que ahora funciona con el
árbol de objetos.
Puede resultar difícil proporcionar una interfaz común para clases cuya
funcionalidad difiere demasiado. En algunos casos, tendrás que generalizar en
exceso la interfaz componente, provocando que sea más difícil de
comprender.
Relaciones con otros patrones

Puedes utilizar Builder al crear árboles Composite complejos porque puedes
programar sus pasos de construcción para que funcionen de forma recursiva.
Chain of Responsibility se utiliza a menudo junto a Composite. En este caso,
cuando un componente hoja recibe una solicitud, puede pasarla a lo largo de
la cadena de todos los componentes padre hasta la raíz del árbol de objetos.
Puedes utilizar Iteradores para recorrer árboles Composite.
Puedes utilizar el patrón Visitor para ejecutar una operación sobre un
árbol Composite entero.
Puedes implementar nodos de hoja compartidos del
árbol Composite como Flyweights para ahorrar memoria RAM.
Composite y Decorator tienen diagramas de estructura similares ya que
ambos se basan en la composición recursiva para organizar un número
indefinido de objetos.
Un Decorator es como un Composite pero sólo tiene un componente hijo. Hay otra
diferencia importante: Decorator añade responsabilidades adicionales al objeto
envuelto, mientras que Composite se limita a “recapitular” los resultados de sus
hijos.

No obstante, los patrones también pueden colaborar: puedes utilizar
el Decorator para extender el comportamiento de un objeto específico del
árbol Composite.

Los diseños que hacen un uso amplio de Composite y Decorator a menudo
pueden beneficiarse del uso del Prototype. Aplicar el patrón te permite clonar
estructuras complejas en lugar de reconstruirlas desde cero.
Ejemplo en código (C# – aplicable a Unity)

// Componente base

public abstract class Componente

{

public abstract void Operacion();

}

// Hoja

public class Hoja : Componente

{

public override void Operacion()

{

Debug.Log("Soy una hoja");

}

}

// Composite

using System.Collections.Generic;

public class Compuesto : Componente

{

private List hijos = new List();

public void Agregar(Componente c)

{

hijos.Add(c);

}

public void Remover(Componente c)

{

hijos.Remove(c);

}

public override void Operacion()

{

foreach (var hijo in hijos)

{

hijo.Operacion();

}

}

}

Ejemplo aplicado a Unity

Imagina una jerarquía de objetos:

Jugador
Enemigos
UI
Puedes crear:

Objeto individual: enemigo
Grupo: todos los enemigos
Y aplicar:

grupoEnemigos.Operacion(); // afecta a todos

Muy útil para:

Manejo de escenas
Sistemas de UI (paneles dentro de paneles)
GameObjects con jerarquías
Ejemplo conceptual (vida real)

Sistema de archivos:

Archivo (Leaf)
Carpeta (Composite)
Puedes hacer:

calcularTamaño(carpeta)

Y automáticamente incluye todo su contenido.

Ventajas

Simplifica el código cliente
Permite trabajar con estructuras complejas fácilmente
Facilita la recursividad
Escalable y flexible

Desventajas

Puede hacer el diseño demasiado general
Difícil restringir qué puede ir dentro del composite
Puede complicar el debugging en estructuras grandes

Cuándo usarlo

Úsarlo cuando:

Se necesite representar jerarquías tipo árbol
Se quiere tratar objetos individuales y grupos igual
Se tenga estructuras recursivas
Resumen rápido

El patrón Composite :

Une objetos en estructuras de árbol
Permite tratarlos de forma uniforme
Usa recursividad para operar sobre todos