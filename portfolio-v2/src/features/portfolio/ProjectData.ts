import genesis_preview from "../../assets/images/genesis/dermaware.webp";
import genesis1 from "../../assets/images/genesis/genesis1.webp";
import genesis2 from "../../assets/images/genesis/genesis2.webp";
import genesis3 from "../../assets/images/genesis/genesis3.webp";
import genesis4 from "../../assets/images/genesis/genesis4.webp";

import homecare_preview  from "../../assets/images/homecare/homecare_preview.webp";
import homecare1 from "../../assets/images/homecare/homecare1.webp";
import homecare2 from "../../assets/images/homecare/homecare2.webp";
import homecare3 from "../../assets/images/homecare/homecare3.webp";
import homecare4 from "../../assets/images/homecare/homecare4.webp";

import oxxocorner_preview from "../../assets/images/oxxocorner/oxxocorner_preview.webp";
import oxxocorner1 from "../../assets/images/oxxocorner/oxxocorner1.webp";
import oxxocorner2 from "../../assets/images/oxxocorner/oxxocorner2.webp";
import oxxocorner3 from "../../assets/images/oxxocorner/oxxocorner3.webp";
import oxxocorner4 from "../../assets/images/oxxocorner/oxxocorner4.webp";

import { Project } from "../../types/project";

export const projects: Project[] = [
  {
    id: "01",
    title: "Dermaware - Genesis",
    role: "Development lead • Full-stack developer",
    description:
      "Dermaware is a mobile application that allows users to track their skin health and receive personalized recommendations. Genesis is the first version of the app, which includes a skin health tracker, an integrated chat system, and a community forum. I led a team of 5 developers to build the app using SwiftUI and Flask.",
    category: "Mobile - iOS",
    projectCategory: "Mobile",
    previewImage: genesis_preview,
    images: [
      {
        src: genesis1,
        alt: "Genesis Dashboard",
        platform: "Mobile"
      },
      {
        src: genesis4,
        alt: "Genesis Chat",
        platform: "Mobile"
      },
      {
        src: genesis3,
        alt: "Genesis Profile",
        platform: "Mobile"
      },
      {
        src: genesis2,
        alt: "Genesis Login",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Flask", "Python", "SQLite", "AWS"],
    featuresList: [
      "Skin health tracking with image analysis",
      "Personalized recommendations based on skin type",
      "Integrated chat system for dermatologist consultations",
      "Community forum for sharing experiences",
      "User profile management"
    ],
    url: "https://example.com/dermaware",
    github: "https://github.com/example/dermaware"
  },
  {
    id: "02",
    title: "Homecare - Nemesis",
    role: "Team lead • Backend developer",
    description:
      "Homecare is a mobile application that allows users to measure their energy consumption through computational vision in order to provide personalized recommendations. Nemesis is the first version of the app, which includes an energy consumption tracker, and a generative AI. I led a team of 5 developers to build the app using SwiftUI and Django.",
    category: "Mobile - iOS",
    projectCategory: "Mobile",
    previewImage: homecare_preview,
    images: [
      {
        src: homecare1,
        alt: "Homecare Dashboard",
        platform: "Mobile"
      },
      {
        src: homecare2,
        alt: "Homecare Energy Chart",
        platform: "Mobile"
      },
      {
        src: homecare3,
        alt: "Homecare Room Energy Consumption",
        platform: "Mobile"
      },
      {
        src: homecare4,
        alt: "Homecare profile settings",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Django", "Python", "PostgreSQL", "Computer Vision", "AI"],
    featuresList: [
      "Energy consumption tracking with computer vision",
      "Personalized recommendations for energy saving",
      "Room-by-room energy analysis",
      "Generative AI for predictive consumption patterns",
      "User profile and settings management",
      "Historical data visualization"
    ],
    url: "https://example.com/homecare",
    github: "https://github.com/example/homecare"
  },
  {
    id: "03",
    title: "Oxxo Corner - Femsa",
    role: "Product Owner • Full-stack developer",
    description:
      "Oxxo Corner is a mobile application that allows users to interact with Oxxo stores in a new way, by providing an augmented reality experience in order to receive personalized recommendations. This is the first version of the app, which includes an AR experience, image filtering by generative AI, and a community forum. I led a team of 4 developers to build the app using SwiftUI and Flask.",
    category: "Mobile - iOS",
    projectCategory: "Mobile",
    previewImage: oxxocorner_preview,
    images: [
      {
        src: oxxocorner1,
        alt: "Oxxo Corner Dashboard",
        platform: "Mobile"
      },
      {
        src: oxxocorner2,
        alt: "Oxxo Corner AR Experience",
        platform: "Mobile"
      },
      {
        src: oxxocorner3,
        alt: "Oxxo Corner Profile",
        platform: "Mobile"
      },
      {
        src: oxxocorner4,
        alt: "Oxxo Corner Login",
        platform: "Mobile"
      },
    ],
    technologies: ["SwiftUI", "Flask", "Python", "ARKit", "CoreML", "Generative AI"],
    featuresList: [
      "Augmented reality store navigation",
      "Personalized product recommendations",
      "Image recognition for product information",
      "Generative AI for image filtering",
      "Community forum for product reviews",
      "User profile management",
      "Store locator with AR directions"
    ],
    url: "https://example.com/oxxocorner",
    github: "https://github.com/example/oxxocorner"
  },
];
