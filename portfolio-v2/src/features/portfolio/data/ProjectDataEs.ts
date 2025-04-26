import genesis_preview from "../../../assets/images/genesis/dermaware.webp";
import genesis1 from "../../../assets/images/genesis/genesis1.webp";
import genesis2 from "../../../assets/images/genesis/genesis2.webp";
import genesis3 from "../../../assets/images/genesis/genesis3.webp";
import genesis4 from "../../../assets/images/genesis/genesis4.webp";

import homecare_preview  from "../../../assets/images/homecare/homecare_preview.webp";
import homecare1 from "../../../assets/images/homecare/homecare1.webp";
import homecare2 from "../../../assets/images/homecare/homecare2.webp";
import homecare3 from "../../../assets/images/homecare/homecare3.webp";
import homecare4 from "../../../assets/images/homecare/homecare4.webp";

import oxxocorner_preview from "../../../assets/images/oxxocorner/oxxocorner_preview.webp";
import oxxocorner1 from "../../../assets/images/oxxocorner/oxxocorner1.webp";
import oxxocorner2 from "../../../assets/images/oxxocorner/oxxocorner2.webp";
import oxxocorner3 from "../../../assets/images/oxxocorner/oxxocorner3.webp";
import oxxocorner4 from "../../../assets/images/oxxocorner/oxxocorner4.webp";

import upocket_preview from "../../../assets/images/upocket/upocket_preview.webp";
import upocket1 from "../../../assets/images/upocket/upocket1.webp";
import upocket2 from "../../../assets/images/upocket/upocket2.webp";
import upocket3 from "../../../assets/images/upocket/upocket3.webp";
import upocket4 from "../../../assets/images/upocket/upocket4.webp";

import stackup_preview from "../../../assets/images/stackup/stackup_preview.webp";
import stackup1 from "../../../assets/images/stackup/stackup1.webp";
import stackup2 from "../../../assets/images/stackup/stackup2.webp";
import stackup3 from "../../../assets/images/stackup/stackup3.webp";
import stackup4 from "../../../assets/images/stackup/stackup4.webp";


import { Project } from "../../../types/project";

export const projects: Project[] = [
  {
    id: "01",
    title: "Dermaware - Genesis",
    role: "Líder de desarrollo • Desarrollador Full-stack",
    description:
      "Dermaware es una aplicación móvil que permite a los usuarios monitorear su salud cutánea y recibir recomendaciones personalizadas. Genesis es la primera versión de la aplicación, que incluye un rastreador de salud cutánea, un sistema de chat integrado y un foro comunitario. Lideré un equipo de 5 desarrolladores para construir la aplicación utilizando SwiftUI y Flask.",
    shortDescription: "Aplicación móvil para el seguimiento de la salud cutánea con recomendaciones impulsadas por IA y consultas con dermatólogos.",
    category: "Móvil - iOS",
    projectCategory: "Mobile",
    previewImage: genesis_preview,
    images: [
      {
        src: genesis1,
        alt: "Panel de Genesis",
        platform: "Mobile"
      },
      {
        src: genesis4,
        alt: "Chat de Genesis",
        platform: "Mobile"
      },
      {
        src: genesis3,
        alt: "Perfil de Genesis",
        platform: "Mobile"
      },
      {
        src: genesis2,
        alt: "Inicio de sesión de Genesis",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Flask", "Python", "SQLite", "AWS"],
    featuresList: [
      "Seguimiento de salud cutánea con análisis de imágenes",
      "Recomendaciones personalizadas basadas en el tipo de piel",
      "Sistema de chat integrado para consultas con dermatólogos",
      "Foro comunitario para compartir experiencias",
      "Gestión de perfiles de usuario"
    ],
    url: "",
    github: "https://github.com/ios-lab-up/Genesis-API"
  },
  {
    id: "02",
    title: "Homecare - Nemesis",
    role: "Líder de equipo • Desarrollador Backend",
    description:
      "Homecare es una aplicación móvil que permite a los usuarios medir su consumo de energía a través de visión computacional para proporcionar recomendaciones personalizadas. Nemesis es la primera versión de la aplicación, que incluye un rastreador de consumo de energía y una IA generativa. Lideré un equipo de 5 desarrolladores para construir la aplicación utilizando SwiftUI y Django.",
    shortDescription: "Aplicación de monitoreo de energía que utiliza visión por computadora para analizar el consumo y proporcionar recomendaciones de ahorro impulsadas por IA.",
    category: "Móvil - iOS",
    projectCategory: "Mobile",
    previewImage: homecare_preview,
    images: [
      {
        src: homecare1,
        alt: "Panel de Homecare",
        platform: "Mobile"
      },
      {
        src: homecare2,
        alt: "Gráfico de energía de Homecare",
        platform: "Mobile"
      },
      {
        src: homecare3,
        alt: "Consumo de energía por habitación de Homecare",
        platform: "Mobile"
      },
      {
        src: homecare4,
        alt: "Configuración de perfil de Homecare",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Django", "Python", "PostgreSQL", "Computer Vision", "AI", "Docker"],
    featuresList: [
      "Seguimiento del consumo de energía con visión por computadora",
      "Recomendaciones personalizadas para el ahorro de energía",
      "Análisis de energía habitación por habitación",
      "IA generativa para patrones de consumo predictivos",
      "Gestión de perfiles y configuraciones de usuario",
      "Visualización de datos históricos"
    ],
    url: "",
    github: "https://github.com/ios-lab-up/Homecare-Back"
  },
  {
    id: "03",
    title: "Oxxo Corner - Femsa",
    role: "Product Owner • Desarrollador Full-stack",
    description:
      "Oxxo Corner es una aplicación móvil que permite a los usuarios interactuar con las tiendas Oxxo de una nueva manera, proporcionando una experiencia de realidad aumentada para recibir recomendaciones personalizadas. Esta es la primera versión de la aplicación, que incluye una experiencia de RA, filtrado de imágenes por IA generativa y un foro comunitario. Lideré un equipo de 4 desarrolladores para construir la aplicación utilizando SwiftUI y Flask.",
    shortDescription: "Aplicación de realidad aumentada para retail que mejora la experiencia de compra con navegación RA y recomendaciones de productos con IA.",
    category: "Móvil - iOS",
    projectCategory: "Mobile",
    previewImage: oxxocorner_preview,
    images: [
      {
        src: oxxocorner1,
        alt: "Panel de Oxxo Corner",
        platform: "Mobile"
      },
      {
        src: oxxocorner2,
        alt: "Experiencia de RA de Oxxo Corner",
        platform: "Mobile"
      },
      {
        src: oxxocorner3,
        alt: "Perfil de Oxxo Corner",
        platform: "Mobile"
      },
      {
        src: oxxocorner4,
        alt: "Inicio de sesión de Oxxo Corner",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Flask", "Python", "ARKit", "CoreML", "Generative AI", "Docker"],
    featuresList: [
      "Navegación de tienda con realidad aumentada",
      "Recomendaciones personalizadas de productos",
      "Reconocimiento de imágenes para información de productos",
      "IA generativa para filtrado de imágenes",
      "Foro comunitario para reseñas de productos",
      "Gestión de perfiles de usuario",
      "Localizador de tiendas con direcciones en RA"
    ],
    url: "",
    github: "https://github.com/example/oxxocorner"
  },
  {
    id: "04",
    title: "UPocket",
    role: "Desarrollador Full-stack",
    description: "UPocket es una aplicación móvil todo en uno diseñada para optimizar y mejorar la experiencia académica de los estudiantes universitarios. Con una interfaz moderna e intuitiva, la aplicación centraliza datos académicos clave, permitiendo a los estudiantes ver sus horarios de clases, seguir la asistencia, monitorear el rendimiento académico y acceder a enlaces académicos relevantes, todo en un solo lugar.",
    shortDescription: "UPocket es una aplicación móvil enfocada en estudiantes que centraliza información académica como horarios de clases, calificaciones y asistencia en una interfaz elegante y fácil de usar.",
    category: "Móvil - Frontend",
    projectCategory: "Mobile",
    previewImage: upocket_preview,
    images: [
      {
        src: upocket1,
        alt: "Panel de UPocket con resumen académico",
        platform: "Mobile"
      },
      {
        src: upocket2,
        alt: "Vista de horario de UPocket",
        platform: "Mobile"
      },
      {
        src: upocket3,
        alt: "Seguimiento de asistencia de UPocket",
        platform: "Mobile"
      },
      {
        src: upocket4,
        alt: "Pantalla de resumen de calificaciones de UPocket",
        platform: "Mobile"
      }
    ],
    technologies: ["FastAPI", "Python", "PostgreSQL", "SwiftUI", "Kubernetes", "Docker"],
    featuresList: [
      "Panel de estudiante personalizado",
      "Seguimiento de asistencia y calificaciones",
      "Vista interactiva de horario de clases",
      "Soporte para modo oscuro",
      "Rendimiento optimizado para móviles"
    ],
    url: "",
    github: "https://github.com/ios-lab-up/UPOCKET"
  },
  {
    id: "05",
    title: "StackUp - Gestor de Canales",
    role: "Desarrollador Backend",
    description: "StackUp es un Gestor de Canales basado en web que automatiza el inventario de hoteles, precios y gestión de promociones a través de múltiples OTAs como Booking.com, Expedia y más. Diseñado para administradores de hoteles, simplifica configuraciones complejas a través de un panel unificado, ahorrando tiempo y reduciendo errores manuales.",
    shortDescription: "Plataforma web para gestionar listados de hoteles, precios y disponibilidad en múltiples agencias de viajes como Booking y Expedia.",
    category: "Web - Sistema de Administración",
    projectCategory: "Web",
    previewImage: stackup_preview,
    images: [
      {
        src: stackup1,
        alt: "Interfaz de selección de hotel de StackUp",
        platform: "Web"
      },
      {
        src: stackup2,
        alt: "Editor de precios de habitaciones de StackUp",
        platform: "Web"
      },
      {
        src: stackup3,
        alt: "Vista de configuración de hotel de StackUp",
        platform: "Web"
      },
      {
        src: stackup4,
        alt: "Gestión de promociones de StackUp",
        platform: "Web"
      }
    ],
    technologies: ["Svelte", "Javascript", "FastAPI", "PostgreSQL", "Docker", "AWS"],
    featuresList: [
      "Sincronización de canales multi-hotel",
      "Automatización de inventario y precios",
      "Motor de reglas para promociones y descuentos",
      "Acceso basado en roles y registros de auditoría",
      "Panel de administración responsivo"
    ],
    url: "https://flowlink.stack-up.com/",
    github: "https://github.com/NyxTech/stackup-backend"
  }
];
