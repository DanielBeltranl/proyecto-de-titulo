# 🎾 Stich - MVP (Tennis Stats Platform)

Bienvenido al repositorio de **Stich**. Este proyecto busca digitalizar la experiencia del scouting y estadísticas de tenis, permitiendo un análisis profundo del rendimiento en cancha.

Actualmente, el proyecto se encuentra en fase de **Refactorización de Arquitectura**, migrando de un código monolítico (Spaghetti) hacia una estructura modular basada en componentes y patrones de diseño profesional.

---

## 🏗️ Arquitectura del Proyecto

Hemos adoptado el patrón **MVC (Modelo-Vista-Controlador)** adaptado a ecosistemas modernos de React, priorizando la separación de responsabilidades:

-   **Model (M):** Definición de esquemas de datos y lógica de validación (Zod/Yup).
-   **View (V):** Componentes funcionales de React, diseñados bajo la metodología de **Atomic Design**.
-   **Controller (C):** Hooks personalizados y funciones de orquestación que gestionan el estado y la comunicación con servicios.

---

## 📂 Estructura de Directorios
- Cada componente o vista, debe separarse de la siguiente manera internamente

```text
src/
├── assets/             # Recursos estáticos (Logos, iconos de raquetas/pelotas).
├── config/             # Configuración de entornos y constantes.
├── controllers/        # Lógica de negocio y orquestación (Auth, MatchLogic).
├── models/             # Esquemas de datos y reglas de validación.
├── services/           # Clientes de API y persistencia de datos.
├── styles/             # Variables CSS globales y tokens de diseño.
└── views/              # Capa de presentación (React)
    ├── components/     # Átomos y Moléculas reutilizables (UI).
    └── pages/          # Pantallas completas (Registro, Dashboard, Match).+

https://stitch.withgoogle.com/projects/2070428508672897333
