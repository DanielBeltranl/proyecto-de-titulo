
## Descripcion
- Este proyecto es una aplicacion que registra marcadores de tenis, asociando la informacion del partido a los participantes. 
- Debe ser capaz de ofrecer una vista global de estadisticas de lmenos los uiltimos 3 meses y l estdistic de cada partido.
- Cada jugador debe tener la posibilidad de ligarse a un entrenador
- Debe dar la posibilidad de transmitir un partido 

## Tecnologias

- React library
- CSS modules de react
- Zod
- React hooks forms
- Zustand


## Arquitectura

- Se usara una arquitectura por capaz tipo Modelo - vista (con sus componentes) - controlador
  - EStructura que se debe impementar
  
    src
    - context-
              |
              view-name
                       |
                        Model
                       | 
                        View
                            |
                             components  
                            |
                             main-view-file.tsx
                       |
                        controller
        

- controller: custom hooks ej -> contendero de funciones como, solo pasarle parametros a una funcion e invocarla
- model: logica del negocio: funciones core como llamadas a api, calculos, filtros etx
- view:  todo lo relativo a las vistas .->todo lo relativo alo visual,logicadel componente en si, invocar hooks etc

## Reglas

- Solo reutiliza los componentes dentro de un mismo context, no los compartas aunque sean iguales
- Separa la logica en funcion de lo planteado enla arquitecturas
- Maneja las vistas con una logica de economia de render, es decir, busca que no se renderice la vista completa, solo lom que se necesite 


## Vistas
**Jugador**

- Dashboard jugador: debe contener el ultimo partido en un componente principal
- Debe mostrar los ultimos 5 partidos del jugador bajo el ultimo destacado. 
- Debe tener una card de jugador, donde se presentan los datos del mismo
- Debe tener un boton para agendar una sesion

## Entrenador

- Debe mostrar destacado el ultimo partidojugado por cualquiera de sus jugadores
- Debe mostrar, bajo el partido destacado, los 5 ultimos partidos de sus jugadores
- Debe tener una card con todos los datos del entrenador

## MARCADOR

- Un marcador de tenis como tal. 
- Debe mostrar puntos, juegos, sets.
- Debe mostrar el marcador junto con los nombres de los jugadores
- Debe tener un panles de estadisticas que pueda desplegarse y colapsarse bajo demanda

## Renderizado fuera del doom

- EL tenis tiene muchos descansos y excepciones, por lo que debemos contar con un componente que se renderice fuera del doom con el fin de soltar eso mensajes



**Para mas contexto sobre las funcionalidades, revisa la carpeta @.claude/docs/user-histories y preguntame de ser necesario**


## Importante

- Si consideras que debes consultar el modelo de datos, puedes encontrarlo en @.claude/docs/data-model/data-model.sql
- Siempre que te pida que hagas la app pensando en integrar un post o un get despues, has que termine en un console log, ya sea aprentando un boton o cualquier accion que lo permita
- TOdas las vistas deben poder verse bien en una tablet, celular y web.
- NO ASUMAS NADA, SIEMPRE PREGUNTA SI TE QUEDAN CABOS SUELTOS EN LAS OPRDENES
- NO HAGAS ARCHIVOS KILOMETRICOS!. Si un componente se tee sta alargando, probablemente esta mal plateado o se puede separar



- Comandos:

 1.- Inicio: npm run dev

