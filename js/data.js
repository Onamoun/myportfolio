/* ============================================================================
   PORTFOLIO — DONNÉES CENTRALISÉES
   ----------------------------------------------------------------------------
   ★ FICHIER LE PLUS IMPORTANT POUR LA PERSONNALISATION ★

   Modifiez TOUTES vos informations personnelles ici, sans toucher au HTML
   ni à la logique JavaScript (app.js).

   Priorité :  data.js  →  JavaScript  →  HTML
   ============================================================================ */

const portfolioData = {

  /* ------------------------------- PROFIL -------------------------------- */
  personal: {
    firstName: "Oguira Konan Gaël",
    lastName: "Onamoun",
    fullName: "Onamoun Oguira Konan Gaël",
    role: "Développeur d'Applications Full-Stack & Assistant IT",
    tagline: "Des applications web, desktop et mobiles robustes — et un support IT de confiance.",
    bio: "Développeur d'applications full-stack (Web, Desktop, Mobile) et Assistant IT, " +
         "titulaire d'une Licence Professionnelle Réseaux & Génie Logiciel (Pigier Côte d'Ivoire). " +
         "J'ai mené des missions en entreprise — assurance, ESN, solutions digitales : " +
         "sites Laravel, applications Windev, dashboards Power BI et support helpdesk.",
    philosophy: "Ma philosophie : des solutions utiles et fiables, un code propre et un " +
                "support attentif.",
    location: "Koumassi, Côte d'Ivoire",
    availability: "Ouvert aux opportunités · Missions & CDI",
    email: "onamoungael@gmail.com",
    phone: "(+225) 01-41-09-97-93",
    phone2: "(+225) 01-02-32-12-39",
    whatsapp: "https://wa.me/2250141099793?text=Bonjour%20Ga%C3%ABl%2C%20je%20vous%20contacte%20depuis%20votre%20portfolio.",
    github: "https://github.com/Onamoun",
    linkedin: "https://www.linkedin.com/in/gaël-onamoun-b89612255",
    cv: "assets/documents/CV.pdf"
  },

  /* ------------------------- TITRES DYNAMIQUES (HERO) --------------------- */
  roles: [
    "Développeur d'Applications Full-Stack",
    "Développeur Web · Laravel & ASP.Net",
    "Développeur Desktop · Windev & VB.Net",
    "Développeur Mobile · Windev Mobile & Dart",
    "Assistant IT & Support Helpdesk",
    "Data & BI · Power BI & Excel"
  ],

  /* ------------------------------ STATISTIQUES ---------------------------- */
  stats: [
    { value: 3,  suffix: "+", label: "Années d'expérience" },
    { value: 10, suffix: "+", label: "Projets réalisés" },
    { value: 20, suffix: "+", label: "Technologies pratiquées" },
    { value: 4,  suffix: "",  label: "Entreprises & missions" }
  ],

  /* ------------------------------- COMPÉTENCES ---------------------------- */
  skills: [
    {
      category: "Frontend",
      icon: "bi-window-sidebar",
      items: [
        { name: "HTML5",      level: 90 },
        { name: "CSS3",       level: 90 },
        { name: "Bootstrap",  level: 88 },
        { name: "JavaScript", level: 70 },
        { name: "jQuery",     level: 68 }
      ]
    },
    {
      category: "Backend & Web",
      icon: "bi-hdd-stack",
      items: [
        { name: "PHP",      level: 85 },
        { name: "Laravel",  level: 85 },
        { name: "WordPress", level: 82 },
        { name: "Python",   level: 70 },
        { name: "Webdev",   level: 70 },
        { name: "API REST", level: 75 }
      ]
    },
    {
      category: "Desktop & Mobile",
      icon: "bi-pc-display",
      items: [
        { name: "Windev",        level: 85 },
        { name: "VB.Net",        level: 82 },
        { name: "Windev Mobile", level: 82 },
        { name: "C#",            level: 80 },
        { name: "Dart",          level: 78 }
      ]
    },
    {
      category: "Bases de données",
      icon: "bi-database",
      items: [
        { name: "MySQL",      level: 80 },
        { name: "SQL Server", level: 75 },
        { name: "SQLite",     level: 75 },
        { name: "PostgreSQL", level: 72 },
        { name: "Oracle",     level: 68 }
      ]
    },
    {
      category: "Data & BI",
      icon: "bi-bar-chart-line",
      items: [
        { name: "Excel/VBA",       level: 90 },
        { name: "MS Office",   level: 90 },
        { name: "Power BI",    level: 85 },
        { name: "Power Query", level: 85 },
        { name: "Power Pivot", level: 82 }
      ]
    },
    {
      category: "IT & Support",
      icon: "bi-headset",
      items: [
        { name: "Helpdesk & Support & Inventaire",  level: 88 },
        { name: "Réseau & Maintenance", level: 82 },
        { name: "GLPI & Sysaid",   level: 80 },
        { name: "Windows Server",      level: 72 },
        { name: "Active Directory/Entra ID",    level: 72 },
        { name: "Virtualisation Hyper-V", level: 70 }
      ]
    }
  ],

  /* ------------------------------- EXPÉRIENCE ----------------------------- */
  experiences: [
    {
      period: "Déc 2025 — Sept 2026",
      role: "Stagiaire IT Support",
      company: "Digital Business Solutions — Riviera Golf",
      description: "Support utilisateur et gestion du parc informatique : helpdesk, traitement de données et maintenance de premier niveau.",
      achievements: [
        "Support utilisateur à distance : helpdesk, assistance téléphonique",
        "Extraction, analyse et traitement de fichiers via Excel et Power BI",
        "Suivi, escalades et relances des incidents sur SysAid",
        "Gestion et configuration des équipements du parc informatique"
      ],
      technologies: ["SysAid", "Excel", "Power BI", "Helpdesk", "Réseau"]
    },
    {
      period: "Déc 2024 — Nov 2025",
      role: "Stagiaire Assistant Informatique",
      company: "Atlantique Assurances Vie — Plateau",
      description: "Assistance informatique complète : support, infrastructure, virtualisation et reporting décisionnel.",
      achievements: [
        "Mise en place d'un serveur virtuel GLPI intégré au LAN sous Ubuntu",
        "Configuration de Microsoft Authenticator avec les utilisateurs",
        "Extraction et analyse de données via Excel, Power Query et Power BI",
        "Pratique : AD DS, Windows Server, Hyper-V, SQL Server, FortiGate 100D & FortiVPN"
      ],
      technologies: ["GLPI", "Windows Server", "Power BI", "SQL Server", "FortiGate"]
    },
    {
      period: "Sept 2024 — Nov 2024",
      role: "Stagiaire Développeur Web",
      company: "SMILETECH CI — Angré Nouveau CHU",
      description: "Création et maintenance de sites web sous Laravel : développement, intégration et suivi en production.",
      achievements: [
        "Création du site usdtetrix.com avec Laravel et Bootstrap 5",
        "Intégration et maintenance de l'ensemble des sites Laravel existants",
        "Corrections, évolutions et support des sites en production"
      ],
      technologies: ["Laravel", "Bootstrap 5", "PHP", "MySQL"]
    },
    {
      period: "Mars 2023 — Août 2023",
      role: "Stagiaire Développeur d'applications",
      company: "SNEDAI — II Plateaux Vallons",
      description: "Développement d'applications métier : conception Windev, intégration web et initiation à la BI.",
      achievements: [
        "Conception et déploiement d'une application d'impression de badges (Windev)",
        "Intégrateur web sur les projets de l'entreprise",
        "Interventions sur les projets E-Santé et archivage de documents",
        "Apprentissage de Power BI appliqué aux besoins métiers"
      ],
      technologies: ["Windev", "Power BI", "HTML/CSS", "JavaScript"]
    }
  ],

  /* -------------------------------- PROJETS ------------------------------- */
  projectCategories: ["Tous", "Web", "Mobile", "Desktop", "Data"],

  projects: [

    {
      title: "Site vitrine USDTetrix",
      category: "Web",
      description: "Création du site usdtetrix.com avec Laravel et Bootstrap 5 : pages vitrines, formulaires et back-office.",
      problem: "Le client avait besoin d'une présence web moderne et administrable pour présenter ses services de mining.",
      solution: "Site développé sous Laravel avec templates Blade, mise en page Bootstrap 5 responsive et contenus gérables.",
      architecture: "Laravel (routes, contrôleurs, Blade), MySQL, Bootstrap 5, déploiement sur hébergement mutualisé.",
      features: ["Pages vitrines responsives", "Formulaires de contact", "Back-office d'administration", "SEO de base"],
      technologies: ["Laravel", "Bootstrap 5", "PHP", "MySQL"],
      result: "Site livré et maintenu en production · 100 % responsive",
      icon: "bi-window-sidebar",
      gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
      github: "#",
      demo: "#",
      video: "#",
    },

    {
        title: "Application de suivi d'achats et de stocks",
        category: "Desktop",
        description: "Application desktop développée en VB.NET pour la gestion des achats, des articles, des fournisseurs et le suivi des mouvements de stock.",
        problem: "L'entreprise suivait ses achats et ses stocks de manière manuelle, ce qui compliquait le contrôle des approvisionnements, des quantités disponibles et de l'historique des mouvements.",
        solution: "Développement d'une application desktop permettant de centraliser les achats, gérer les articles et fournisseurs, enregistrer les entrées et sorties de stock et suivre les niveaux de disponibilité.",
        architecture: "VB.NET, Access, architecture orientée gestion des données et interface desktop",
        features: [
            "Gestion des articles",
            "Gestion des fournisseurs",
            "Enregistrement des achats",
            "Suivi des entrées et sorties de stock",
            "Consultation des stocks disponibles",
            "Historique des mouvements",
            "Recherche et filtrage des données",
        ],
        technologies: [
            "VB.NET",
            "Access",
            "Windows"
        ],
        result: "Application permettant d'améliorer le suivi des approvisionnements, la visibilité sur les stocks et la traçabilité des mouvements.",
        icon: "bi-box-seam",
        gradient: "linear-gradient(135deg, #2563EB, #7C3AED)",
        github: "#",
        demo: "#",
        video: "assets/videos/App_scheguen.mp4"
    },

    {
      title: "Application d'archivage et de gestion des documents utilisateurs",
      category: "Desktop",
      description: "Application desktop développée avec WinDev permettant de centraliser, archiver, rechercher et consulter rapidement les documents associés aux utilisateurs.",
      problem: "Les documents des utilisateurs, tels que les CNI, attestations et photos, étaient dispersés ou archivés manuellement, rendant leur recherche et leur consultation longues et difficiles.",
      solution: "Développement d'une application centralisant les documents numériques des utilisateurs avec classement par profil, recherche rapide et accès immédiat aux pièces archivées.",
      architecture: "WinDev, HFSQL, gestion documentaire et interface desktop",
      features: [
          "Création et gestion des profils utilisateurs",
          "Archivage des CNI",
          "Archivage des attestations",
          "Archivage des photos",
          "Association des documents à chaque utilisateur",
          "Recherche rapide par nom, identifiant ou référence",
          "Prévisualisation des documents",
          "Ouverture et consultation des fichiers archivés",
          "Mise à jour et remplacement des documents",
          "Historique des documents archivés"
      ],
      technologies: [
          "WinDev",
          "HFSQL",
          "Windows"
      ],
      result: "Solution permettant de centraliser les documents utilisateurs et de réduire considérablement le temps nécessaire pour rechercher et retrouver une pièce justificative.",
      icon: "bi-folder2-open",
      gradient: "linear-gradient(135deg, #0EA5E9, #6366F1)",
      github: "#",
      demo: "#",
      video: "assets/videos/Archivage.mp4"
    },

    {
      title: "Tableaux de bord Power BI",
      category: "Data",
      description: "Dashboards interactifs Power BI : extraction, transformation (Power Query) et visualisation des indicateurs.",
      problem: "Les équipes pilotaient l'activité sur des fichiers Excel dispersés, difficiles à consolider.",
      solution: "Modèles de données nettoyés avec Power Query et rapports Power BI interactifs et partageables.",
      architecture: "Excel (sources), Power Query / Power Pivot, Power BI Desktop, exports et présentation PowerPoint.",
      features: ["Nettoyage via Power Query", "Modèle de données relationnel", "Visuels interactifs", "Exports automatisés"],
      technologies: ["Power BI", "Power Query", "Excel"],
      result: "Indicateurs fiables et actualisables en 1 clic",
      icon: "bi-bar-chart-line",
      gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
      github: "#",
      demo: "#",
      video: "#",
    },

    {
    title: "Application mobile de calcul des calories",
    category: "Mobile",
    description: "Mini-application mobile conçue et développée personnellement avec Flutter pour estimer les besoins caloriques journaliers à partir des données de l'utilisateur.",
    problem: "Besoin personnel de disposer d'un outil simple, rapide et accessible permettant d'estimer les besoins caloriques quotidiens sans utiliser de solution externe.",
    solution: "Conception et développement personnel d'une application mobile permettant de renseigner les informations de l'utilisateur, de prendre en compte son niveau d'activité et de calculer automatiquement une estimation de ses besoins caloriques journaliers.",
    architecture: "Flutter, Dart, interface mobile responsive et logique de calcul embarquée",
    features: [
        "Saisie de l'âge",
        "Saisie du poids et de la taille",
        "Sélection du sexe",
        "Choix du niveau d'activité",
        "Calcul automatique des besoins caloriques",
        "Affichage du résultat",
        "Interface simple et intuitive",
        "Réinitialisation des données"
    ],
    technologies: [
        "Flutter",
        "Dart",
        "Android"
    ],
    result: "Projet personnel réalisé de bout en bout, de la conception de l'interface à l'implémentation de la logique de calcul et aux tests de l'application.",
    icon: "bi-fire",
    gradient: "linear-gradient(135deg, #F97316, #EF4444)",
    github: " #",
    demo: "#",
    video: "assets/videos/Calories.mp4"
    },

    {
    title: "Mini application e-commerce mobile",
    category: "Mobile",
    description: "Mini-application mobile e-commerce conçue et développée personnellement avec WinDev Mobile pour mettre en pratique la conception d'une solution de vente sur mobile.",
    problem: "Projet personnel initié afin d'explorer la conception d'une application e-commerce mobile et de reproduire les principales fonctionnalités d'une boutique en ligne.",
    solution: "Conception et développement d'une application mobile permettant de consulter un catalogue de produits, rechercher des articles, gérer un panier et simuler un parcours de commande.",
    architecture: "WinDev Mobile, MySQL, interface mobile et gestion des données",
    features: [
        "Catalogue de produits",
        "Recherche de produits",
        "Filtrage par catégories",
        "Consultation des détails des produits",
        "Ajout et suppression des articles du panier",
        "Gestion des quantités",
        "Calcul automatique du total",
        "Simulation du processus de commande",
        "Interface Admin/Utilisateurs adaptée aux appareils mobiles"
    ],
    technologies: [
        "WinDev Mobile",
        "WLanguage",
        "MySQL",
        "Android"
    ],
    result: "Projet personnel réalisé de bout en bout afin de renforcer mes compétences en développement mobile, en gestion des données et en conception d'interfaces e-commerce.",
    icon: "bi-cart3",
    gradient: "linear-gradient(135deg, #8B5CF6, #EC4899)",
    github: "#",
    demo: "#",
    video: "assets/videos/ecomm_Kakashi_App.mp4"
    },

    {
    title: "Mini application mobile de quiz",
    category: "Mobile",
    description: "Mini-application mobile de quiz conçue et développée personnellement avec Flutter pour proposer une expérience interactive de questions-réponses.",
    problem: "Projet personnel initié afin d'explorer le développement d'une application mobile interactive et de mettre en pratique la gestion des interactions, des réponses et des scores.",
    solution: "Conception et développement d'une application mobile permettant de répondre à une série de questions, de valider les réponses et d'obtenir un score à la fin du quiz.",
    architecture: "Flutter, Dart, gestion d'état locale et interface mobile responsive",
    features: [
        "Affichage des questions",
        "Questions à choix multiples",
        "Sélection et validation des réponses",
        "Calcul automatique du score",
        "Progression du quiz",
        "Affichage du résultat final",
        "Possibilité de recommencer le quiz",
        "Interface interactive et intuitive"
    ],
    technologies: [
        "Flutter",
        "Dart",
        "Android"
    ],
    result: "Projet personnel réalisé de bout en bout afin de renforcer mes compétences en développement mobile Flutter, en conception d'interfaces interactives et en gestion de la logique applicative.",
    icon: "bi-patch-question",
    gradient: "linear-gradient(135deg, #6366F1, #8B5CF6)",
    github: "#",
    demo: "#",
    video: "assets/videos/Quiz_Flutter.mp4"
    },

    {
    title: "Application OCR d'extraction et de gestion des utilisateurs",
    category: "Desktop",
    description: "Application d'entreprise permettant d'importer une image contenant les informations d'un utilisateur, d'extraire automatiquement les données via OCR, de les afficher pour vérification et modification, puis de les enregistrer dans la base de données HFSQL.",
    problem: "La saisie manuelle des informations utilisateurs à partir de documents ou d'images était chronophage et pouvait entraîner des erreurs de transcription.",
    solution: "Développement d'une application intégrant un moteur OCR capable d'analyser une image, d'identifier et d'extraire automatiquement les informations de l'utilisateur, puis de les présenter dans un formulaire afin de permettre leur vérification et leur correction avant enregistrement.",
    architecture: "Application desktop, moteur OCR, interface de vérification des données et base de données HFSQL",
    features: [
        "Import d'images contenant les informations utilisateur",
        "Extraction automatique des informations par OCR",
        "Identification des différentes données utilisateur",
        "Affichage des informations extraites dans un formulaire",
        "Modification et correction manuelle des données",
        "Validation des informations avant enregistrement",
        "Enregistrement automatique dans la table User",
        "Connexion à la base de données HFSQL",
        "Consultation et gestion des données utilisateurs"
    ],
    technologies: [
        "WinDev",
        "WLanguage",
        "OCR",
        "HFSQL"
    ],
    result: "Automatisation de la saisie des informations utilisateurs, réduction des manipulations manuelles et amélioration de la fiabilité des données enregistrées dans la base HFSQL.",
    icon: "bi-card-text",
    gradient: "linear-gradient(135deg, #06B6D4, #2563EB)",
    github: "#",
    demo: "#",
    video: "assets/videos/ocr_windev.mp4"
    }

  ],

  /* -------------------------------- SERVICES ------------------------------ */
  services: [
    {
      icon: "bi-code-slash",
      title: "Développement Web",
      description: "Sites vitrines et applications web avec Laravel, PHP et Bootstrap : du besoin au déploiement."
    },
    {
      icon: "bi-pc-display",
      title: "Applications Desktop",
      description: "Logiciels métier Windows avec Windev et VB.Net : gestion, impressions, bases de données."
    },
    {
      icon: "bi-headset",
      title: "Support IT & Helpdesk",
      description: "Assistance utilisateurs, gestion des incidents (GLPI, SysAid) et maintenance de premier niveau."
    },
    {
      icon: "bi-bar-chart-line",
      title: "Data & BI",
      description: "Tableaux de bord Power BI, reporting Excel automatisé (VBA, Power Query) et aide à la décision."
    },
    {
      icon: "bi-layout-text-window-reverse",
      title: "Intégration Web",
      description: "Intégration de maquettes Figma en HTML/CSS responsive et sites WordPress administrables."
    },
    {
      icon: "bi-hdd-network",
      title: "Réseau & Parc informatique",
      description: "Inventaire (GLPI), configuration réseau LAN, virtualisation et suivi des équipements."
    }
  ],

  /* ------------------------------ STACK TECHNIQUE ------------------------- */
  techStack: [
    { name: "HTML5",      icon: "bi-filetype-html" },
    { name: "CSS3",       icon: "bi-filetype-css" },
    { name: "Bootstrap",  icon: "bi-bootstrap" },
    { name: "JavaScript", icon: "bi-filetype-js" },
    { name: "jQuery",     icon: "bi-code-square" },
    { name: "PHP",        icon: "bi-filetype-php" },
    { name: "Laravel",    icon: "bi-fire" },
    { name: "C#",         icon: "bi-braces" },
    { name: "Dart",       icon: "bi-phone" },
    { name: "Python",     icon: "bi-filetype-py" },
    { name: "Windev",     icon: "bi-window-desktop" },
    { name: "VB.Net",     icon: "bi-app" },
    { name: "WordPress",  icon: "bi-wordpress" },
    { name: "MySQL",      icon: "bi-database" },
    { name: "SQL Server", icon: "bi-server" },
    { name: "PostgreSQL", icon: "bi-hdd-stack" },
    { name: "Power BI",   icon: "bi-bar-chart-fill" },
    { name: "Excel / VBA", icon: "bi-file-earmark-spreadsheet" },
    { name: "Git",        icon: "bi-git" },
    { name: "GitHub",     icon: "bi-github" }
  ],

  /* ----------------------------- CERTIFICATIONS --------------------------- */
  certifications: [
    {
      icon: "bi-mortarboard",
      title: "Licence Professionnelle Réseaux & Génie Logiciel",
      issuer: "Pigier Côte d'Ivoire — Abidjan Plateau",
      year: "2025",
      link: "#"
    },
    {
      icon: "bi-mortarboard",
      title: "BTS Informatique Développeur d'Applications",
      issuer: "Pigier Côte d'Ivoire — Abidjan Plateau",
      year: "2024",
      link: "#"
    },
    {
      icon: "bi-patch-check",
      title: "Certification MOS Excel 2016",
      issuer: "Microsoft Office Specialist — Pigier CI",
      year: "2021",
      link: "#"
    },
    {
      icon: "bi-laptop",
      title: "+100 h de formations en ligne",
      issuer: "Udemy & plateformes — en continu",
      year: "2024 – 2025",
      link: "#"
    },
    {
      icon: "bi-award",
      title: "BAC D (Baccalauréat série D)",
      issuer: "Collège PASCAL — Koumassi",
      year: "2020",
      link: "#"
    }
  ],

};

/* ============================================================================
   CONFIGURATION DES PARTICULES (Hero — réseau interactif)
   ============================================================================ */
const particleConfig = {
  desktop: { count: 85, speed: 0.55, linkDistance: 150, particleSize: 2.6, opacity: 0.65 },
  tablet:  { count: 55, speed: 0.45, linkDistance: 130, particleSize: 2.3, opacity: 0.55 },
  mobile:  { count: 26, speed: 0.35, linkDistance: 100, particleSize: 2.0, opacity: 0.45 },
  breakpoints: { tablet: 992, mobile: 576 }
};

/* ============================================================================
   CONFIGURATION DE L'INTERACTION SOURIS
   ============================================================================ */
const mouseInteraction = {
  enabled: true,          // false = désactive toute interaction souris
  radius: 180,            // rayon d'influence du curseur (px)
  grabDistance: 170,      // distance max des lignes "grab" curseur ↔ particule
  repulseDistance: 120,   // rayon de répulsion douce autour du curseur
  attractionStrength: 0.12,
  repulsionStrength: 0.35,
  clickParticles: 4,      // particules temporaires générées au clic
  velocityBoost: 0.6      // perturbation supplémentaire liée à la vitesse du curseur
};
