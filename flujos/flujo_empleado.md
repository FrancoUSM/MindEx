==========Empleado==========

Página /auth 

Aparece un formulario de inicio de sesión.

En caso de no estar registrado para iniciar sesión, presione botón 'Registrarse'

USUARIO: Click botón 'Registrarse'

Aparece un formulario de registro que contiene:

Nombre
Apellido
Email 
Contraseña
Turno 
Faena
Razón social de tu empresa (distinto de lo que decía la página /empresa)
Y tres radio buttons rotulados como 'Consentimientos'. Son:
Acepto participar en encuestas de salud mental
Acepto compartir datos de dispositivos wearables
Acepto el análisis predictivo con IA

USUARIO: llena formulario.
PRUEBA 1:
Datos con que llené:
Nombre: frrrr
Apellido: frrrr
Email: usuario.minera@gmail.com
Contraseña: usuario.minera
Turno: Noche
Faena: Faena Norte
Razón social de tu empresa: Minera1
=========================================

PRUEBA 2:
Nombre: minero
Apellido: mineral
Email: minero.mineral@minera
Contraseña: minerote
Turno: Día
Faena: Faena Sur
Razón social de tu empresa: Minera4


Presiono botón 'Registrar'

El empleado entra a una página de dirección localhost > checkin. Pero si lo analizamos según la sucesión, podría ser
localhost > auth > checkin 
Y por conveniencia: localhost > empleado > checkin 

La página está dividida en dos:
* Un sidebar (o barra lateral) que sirve para navegar por el contenido
* Un section (o sección) determinada por el sidebar; expone el contenido.

Explicaremos los elementos de la sidebar y haremos su flujo, uno a uno.

SIDEBAR: sirve para moverse entre páginas. 
1. Check-in Diario: 

localhost > checkin 

Página que sirve para hacer el check-in diario, compuesto de 8 preguntas y 6 respuestas por cada pregunta.

USUARIO: contesta todas las preguntas. Presiona botón 'Completar registro'

Aparece un pop-up que avisa del estado actual del usuario, el puntaje ganado, la racha diaria, y un botón azul que dice 'Ver mi estado de hoy'

USUARIO: presiona el botón. 

Aparece una página que muestra:
* Puntos
* Días 
* Insignias (?)
* Porcentaje de constancia
* Total de registros (no se especifica de qué)

También hay dos botones:
* Editar Check-in: sirve para modificar el check-in de la página anterior. Volvemos a la página que muestra los puntajes, los registros y los días. No aumentan los días, pero sí los registros y el puntaje también.
* Ver Historial (pasamos a la página Mi Historial). La página dice 'Error al obtener historial'


2. Mis evaluaciones: 

localhost > evaluations

Página que muestra las evaluaciones psicológicas en el haber del usuario. Aparecen 4 opciones (bloqueadas):

* PHQ-9 - Depresión
* GAD-7 - Ansiedad
* DASS-21 - Estado Emocional
* CEAL-SM - Evaluación Organizacional

USUARIO: elige una

Elegí PHQ-9

Aparece un pop-up, ya que el test se desbloquea pagando supuestamente. 

USUARIO: elige el método de pago, "paga" y se desbloquean todos los test. 

COMENTARIO-DEV: /*Considero que este flujo está mal hecho. Porque ¿por qué habría que "pagar" si ya el plan está supuestamente comprado? El empleado no debería pagar, ya que la empresa lo ha hecho ya. Al usuario deberían salirle los tests que le corresponden según el plan que ha pagado la empresa.*/


En los tests aparece un botón que dice 'Iniciar Evaluación'

USUARIO: presiona el botón

En la página (la misma localhost > evaluations) aparece cada una de las preguntas, con 4 opciones cada una y un botón 'Siguiente' y otro 'Volver'. 

USUARIO: responde las preguntas

Al final aparece un botón 'Finalizar'

No funciona. No lanza error tampoco; ni en frontend ni en backend.

3. Mi Historial

localhost > history

'Error al obtener historial'
El backend responde. Al parecer hay una desconexión en la bd

4. Configuración

localhost > settings

Aparece el Perfil del Usuario. 

A pesar de que le puse un apellido ('mineral'), no aparece. El usuario pued colocar su teléfono también aquí. Hay un botón 'Actualizar Perfil'

USUARIO: llena los datos y presiona el botón
Resultado: error en backend

Debajo aparecen las secciones:

* Notificaciones
Muestra las notificaciones
* Privacidad y Seguridad
Permite cambiar contraseña. En el formulario están los inputs:
* Contraseña actual
* Nueva contraseña
* Confirmar nueva contraseña
* Botón 'Actualizar contraseña'

Datos que usé:
* Contraseña actual: minerote
* Nueva contraseña: minerote1
* Confirmar nueva contraseña:minerote1

USUARIO: llena datos y presiona el botón
Resultado: error en backend

5. Hablar con un profesional

localhost

Aparece un calendario para seleccionar el día de atención. Debajo:
* Seleccionar profesional
* Selecciona un horario
* Tipo de consulta
* Motivo de consulta
Datos que usé:
* Seleccionar profesional: Ps Valentina Herrera Campos - Psicóloga Clínica
* Selecciona un horario: 16:30
* Tipo de consulta: Consulta de Seguimiento
* Motivo de consulta: llllllllllllllllllllllllllllllllllllll@|#@|#|@#€~@#€~#€~¬~€¬€
USUARIO: llena los datos y presiona el botón 'Agendar Cita'

Error: No se pudo agendar la cita. Intenta nuevamente.

6. Cerrar sesión

Devuelve a la página principal.

localhost