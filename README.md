# 🌿  Matriz de Costo-Beneficio
**Proyecto Final · Unidad 3 — Pensamiento Estratégico y Liderazgo**

Este proyecto s una herramienta web interactiva diseñada para la evaluación, toma de decisiones y administración estratégica del tiempo. A través de un análisis heurístico multicriterio, permite registrar actividades diarias, evaluarlas según su costo y beneficio, y distribuirlas en una matriz prioritaria de cuatro cuadrantes.

## ✨ Características Principales
*   **Diseño "Glassmorphism" y Estética Limpia:** Interfaz clara pensada para reducir la carga cognitiva, con texturas de "cristal esmerilado", interacciones fluidas y animaciones orgánicas inspiradas en los últimos estándares de diseño UI/UX.
*   **Evaluación Multicriterio Dinámica:** Desglosa el análisis general utilizando calculadoras internas controladas mediante deslizadores (sliders) fluidos que retroalimentan visualmente la decisión.
*   **Matriz Automatizada:** Clasifica de manera automática los listados de rutinas según sus valores en:
    *   **I. Priorizar:** Alto beneficio, Bajo costo.
    *   **II. Gestionar Eficientemente:** Alto beneficio, Alto costo.
    *   **III. Mantener o Delegar:** Bajo beneficio, Bajo costo.
    *   **IV. Reconsiderar o Eliminar:** Bajo beneficio, Alto costo.
*   **Gráfico de Dispersión Integrado:** Visualización inmersiva en formato geométrico de todas tus actividades registradas dentro de un plano cartesiano interactivo.
*   **Generador de Reportes Ejecutivo (PDF):** Usa un proceso de renderizado profundo para empacar automáticamente tu análisis personalizado en una impecable e infográfica hoja horizontal lista para descargar y entregar.

## 🛠️ Tecnologías Empleadas
Este proyecto está construido con un enfoque técnico robusto y moderno utilizando fundamentos limpios sin depender de frameworks complejos o pesados:
*   **HTML5 Semántico:** Arquitectura y accesibilidad en la estructura de interfaz.
*   **CCS3 Avanzado (Vanilla):** Sistema de Custom Properties (`var()`), Flexbox & Auto-Grid, calculados matemáticos de animaciones bezier, y renderizado traslúcido (`backdrop-filter: blur`).
*   **JavaScript (Vanilla ES6):** Programación funcional de estado, manipulación nativa del DOM (Document Object Model) y arquitectura algorítmica para inyección de componentes en el plano X-Y.
*   **[html2pdf.js](https://ekoopmans.github.io/html2pdf.js/):** Inyección remota (CDN) configurada cuidadosamente con un truco matricial inverso *(auto-scaling viewport capture)* para lograr la producción de reportes de gran ancho y calidad láser directamente en el navegador.

## 🚀 Cómo Usar
1. **Clona** este repositorio o descárgalo como un archivo ZIP tradicional.
2. Extrae las carpetas y abre el archivo principal **`index.html`** haciendo doble clic (o arrastrándolo) en cualquier navegador moderno de tu gusto. No necesitas servidores.
3. Ingresa rápidamente y **registra las actividades** en el formulario analítico de la izquierda, apoyándote con los controles para nivelar cada área del *Costo* y *Beneficio*.
4. Explora las secciones de lectura en la parte inferior para descubrir el informe generado por tu propia información en tiempo real.
5. Al terminar de interactuar, presiona el botón inferior **Guardar en PDF** para descargar en instantes de manera elegante tu documento final de la asignatura.

## Link para prueba en vivo

https://bylev.github.io/Matriz_Costo_Beneficio/
