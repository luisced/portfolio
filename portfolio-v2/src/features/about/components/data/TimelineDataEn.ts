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

// Array containing experience data in English
export const experiences: TimelineExperience[] = [
  {
    title: "President – Engineering Student Council",
    company: "Universidad Panamericana",
    icon: "/assets/images/logos/up_logo.webp",
    start: "2024-01",
    end: "Present", // End date set to "Present"
    location: "Mexico City",
    badges: ["Leadership", "Community", "Mentorship"],
    responsibilities: [
      "Led the organization of 5+ academic and social events.",
      "Established mentorships for 30+ students."
    ],
    color: "#FF6B6B" // Reddish
  },
  {
    title: "Tech Lead – Nyx Technology",
    company: "Nyx Technology",
    icon: "/assets/images/logos/nyx_logo.webp",
    start: "2024-01",
    end: "2025-01",
    location: "Mexico City",
    badges: ["Backend", "Architecture", "AWS", "Leadership"],
    responsibilities: [
      "Led Flowlink project for Marriott/City Express, reducing manual work by 120%.",
      "Built scalable backend with FastAPI, RDS, Lambda, and Svelte.",
      "Maintained 99% system uptime."
    ],
    color: "#4ECDC4" // Teal
  },
  {
    title: "Asst. Manager – iOS Lab",
    company: "Universidad Panamericana",
    icon: "/assets/images/logos/ioslab_logo.webp",
    start: "2023-01",
    end: "Present", // End date set to "Present"
    location: "Mexico City",
    badges: ["iOS", "Swift", "Agile"],
    responsibilities: [
      "Developed 4 iOS apps for students and staff.",
      "Led Agile sprints, shortening delivery by 3 weeks."
    ],
    color: "#6A0572" // Purple
  },
  {
    title: "Freelance Developer",
    company: "Independent",
    // Using a generic freelance/code icon
    icon: "https://img.icons8.com/fluency/48/code.png",
    start: "2022-06",
    end: "2022-11",
    location: "Mexico City",
    badges: ["Chatbot", "Twilio", "Automation"],
    responsibilities: [
      "Automated Airbnb reservations via WhatsApp bot.",
      "Reduced reply time from 5 min to 30 sec."
    ],
    color: "#3498DB" // Blue
  },
  {
    title: "Jr. Backend Developer – Zenco",
    company: "Zenco",
    icon: "https://img.icons8.com/external-flatart-icons-outline-flatarticons/64/external-server-cloud-computing-flatart-icons-outline-flatarticons.png",
    start: "2021-02",
    end: "2022-02",
    location: "Mexico City",
    badges: ["Python", "Flask", "MySQL", "AWS"],
    responsibilities: [
      "Created CRM systems with Python, Flask, MySQL, AWS.",
      "Built automated data sync, reducing manual entry by 75%."
    ],
    color: "#FF8A5B" // Orangish
  }
];
