==========Empresa==========


El usuario está en la página principal. Hay 3 opciones distintas: Empresa, Persona, Profesional. Debajo aparecen los posibles planes según:
*Tipo de usuario
*Tipo de plan

USUARIO: Hace click en 'Empresa'

localhost > empresa

La página pasa a un registro de empresa. Con datos como: 
Razón Social (las letras que indican que los empleados usarán el nombre de la razón social para registrarse deberían verse más claramente)
Nombre comercial
Εmail corporativo 
Teléfono
Sitio web
Dirección

Y un botón 'Continuar'  

localhost > empresa

USUARIO: Llena los datos
Datos con que llené:
PRUEBA 1:
Razón Social: Minera4
Nombre comercial: Minera4
Εmail corporativo: minera4@gmail.com
Teléfono: 999999999999999999999999999999
Sitio web: minera.xs
Dirección: Chuquicamata. #~@#~#@~@
=========================================
PRUEBA 2: 
Razón Social: efeeefe
Nombre comercial: efeeefe
Εmail corporativo: efefef@fefefe
Teléfono: fefefefefe
Sitio web: efeef
Dirección: 999999999999999999

Los datos no tienen una validación rigurosa. Se permiten errores para teléfono, email. Se permiten signos raros

Los valores de los planes empresariales en localhost> empresa no se condicen con los valores de la página 'localhost'. 
Valores localhost: $3 (plan core), $6 (plan advanced), $10 (plan enterprise)
Valores localhost > empresa: $5 (plan básico), $12 (plan profesional), $20 (plan enterprise)


COMENTARIO-DEV: /*En ninguna parte del formulario aparece el número de usuarios que usarán el plan, ni se actualiza el precio en relación a esto. Tampoco está contemplado en la tabla de la suscripción.

Dos soluciones:

A) Que a la tabla 'suscripción' se le agregue las columnas 'cantidad_suscritos' y 'precio_total'
B) Que el valor de la suscripción de la empresa aumente dinámicamente en función de la cantidad de inserciones en la tabla 'paciente_suscrito'. Para lo cual podría crearse una columna 'valor_total' en suscripción

*/

Los planes de ambas páginas son por usuario.


USUARIO: Hace click en 'Continuar'

localhost > empresa

Aparece otra página, en la que puede escoger entre 3 planes: Plan Enterprise, Plan Profesional, Plan Básico. 
Los precios son por usuario y tienen una duración específica.

USUARIO: Hace click en un plan y hace click en el botón 'Activar Plan {nombrePlan}'

Aparece una página que dice '¡Todo listo!' {nombreEmpresa} está registrada en el plan {nombrePlan}.
Se detallan instrucciones para que el usuario empleado sea capaz de inscribirse en Mindexa. 

Hay un botón 'Ir a login/registro'. También hay un botón 'Volver al inicio'; ahí se acabaría el flujo. 
Caso contrario:

USUARIO: Click en el botón 'Ir a login/registro'


Ver flujo_empleado.txt









