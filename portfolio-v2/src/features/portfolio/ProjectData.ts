import genesis1 from "../../assets/images/genesis/genesis1.webp";
import genesis2 from "../../assets/images/genesis/genesis2.webp";
import genesis3 from "../../assets/images/genesis/genesis3.webp";
import genesis4 from "../../assets/images/genesis/genesis4.webp";

import homecare1 from "../../assets/images/homecare/homecare1.webp";
import homecare2 from "../../assets/images/homecare/homecare2.webp";
import homecare3 from "../../assets/images/homecare/homecare3.webp";
import homecare4 from "../../assets/images/homecare/homecare4.webp";

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
  },
  {
    id: "02",
    title: "Homecare - Nemesis",
    role: "Team lead • Backend developer",
    description:
      "Homecare is a mobile application that allows users to measure their energy consumption through computational vision in order to provide personalized recommendations. Nemesis is the first version of the app, which includes an energy consumption tracker, and a generative AI. I led a team of 5 developers to build the app using SwiftUI and Django.",
    category: "Mobile - iOS",
    projectCategory: "Mobile",
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
  },
  {
    id: "03",
    title: "Oxxo Corner - Femsa",
    role: "Product Owner • Full-stack developer",
    description:
      "Oxxo Corner is a mobile application that allows users to interact with Oxxo stores in a new way, by providing an augmented reality experience in order to receive personalized recommendations. This is the first version of the app, which includes an AR experience, image filtering by generative AI, and a community forum. I led a team of 4 developers to build the app using SwiftUI and Flask.",
    category: "Mobile - iOS",
    projectCategory: "Mobile",
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
  },
];
