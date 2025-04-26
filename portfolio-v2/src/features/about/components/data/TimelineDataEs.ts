// Define the TypeScript interface for timeline experience data
export interface TimelineExperience {
  title: string;
  company: string;
  icon: string;
  start: string;
  end: string;
  location: string;
  badges: string[];
  responsibilities: string[];
  color?: string; // Optional color for gradient effect
}

// Array containing experience data in Spanish
export const experiences: TimelineExperience[] = [
  {
    title: "Presidente – Consejo Estudiantil de Ingeniería",
    company: "Universidad Panamericana",
    icon: "/assets/images/logos/up_logo.webp",
    start: "2024-01",
    end: "Present", // End date set to "Present"
    location: "Ciudad de México",
    badges: ["Liderazgo", "Comunidad", "Mentoría"],
    responsibilities: [
      "Lideré la organización de más de 5 eventos académicos y sociales.",
      "Establecí mentorías para más de 30 estudiantes."
    ],
    color: "#FF6B6B" // Reddish
  },
  {
    title: "Líder Técnico – Nyx Technology",
    company: "Nyx Technology",
    icon: "/assets/images/logos/nyx_logo.webp",
    start: "2024-01",
    end: "2025-01",
    location: "Ciudad de México",
    badges: ["Backend", "Arquitectura", "AWS", "Liderazgo"],
    responsibilities: [
      "Lideré el proyecto Flowlink para Marriott/City Express, reduciendo el trabajo manual en un 120%.",
      "Construí un backend escalable con FastAPI, RDS, Lambda y Svelte.",
      "Mantuve un tiempo de actividad del sistema del 99%."
    ],
    color: "#4ECDC4" // Teal
  },
  {
    title: "Gerente Asistente – iOS Lab",
    company: "Universidad Panamericana",
    icon: "/assets/images/logos/ioslab_logo.webp",
    start: "2023-01",
    end: "Present", // End date set to "Present"
    location: "Ciudad de México",
    badges: ["iOS", "Swift", "Agile"],
    responsibilities: [
      "Desarrollé 4 aplicaciones iOS para estudiantes y personal.",
      "Lideré sprints Agile, acortando la entrega en 3 semanas."
    ],
    color: "#6A0572" // Purple
  },
  {
    title: "Desarrollador Freelance",
    company: "Independiente",
    // Using a generic freelance/code icon
    icon: "https://img.icons8.com/fluency/48/code.png",
    start: "2022-06",
    end: "2022-11",
    location: "Ciudad de México",
    badges: ["Chatbot", "Twilio", "Automatización"],
    responsibilities: [
      "Automaticé reservas de Airbnb a través de un bot de WhatsApp.",
      "Reduje el tiempo de respuesta de 5 min a 30 seg."
    ],
    color: "#3498DB" // Blue
  },
  {
    title: "Desarrollador Backend Jr. – Zenco",
    company: "Zenco",
    icon: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/external-server-cloud-computing-flatart-icons-outline-flatarticons.png",
    start: "2021-02",
    end: "2022-02",
    location: "Ciudad de México",
    badges: ["Python", "Flask", "MySQL", "AWS"],
    responsibilities: [
      "Creé sistemas CRM con Python, Flask, MySQL, AWS.",
      "Construí sincronización automática de datos, reduciendo la entrada manual en un 75%."
    ],
    color: "#FF8A5B" // Orangish
  }
];
