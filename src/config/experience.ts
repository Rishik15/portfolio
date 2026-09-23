export type ExperienceType =
    | "Internship"
    | "Full-time"
    | "Part-time"
    | "Contract"
    | "Research"
    | "Fellowship"
    | "Other";

export type Experience = {
    id: string;
    year: number;

    role: string;
    company: string;
    type: ExperienceType;

    startDate: string;
    endDate: string;
    location: string;

    summary: string;
    highlights: readonly string[];
    technologies: readonly string[];

    companyUrl?: string;
};

export const EXPERIENCES: readonly Experience[] = [
    {
        id: "dimension-consulting-ai-engineering-intern",
        year: 2026,

        role: "AI Engineering Intern",
        company: "Dimension Consulting",
        type: "Internship",

        startDate: "June 2026",
        endDate: "September 2026",
        location: "Edison, NJ",

        summary:
            "Built a client-facing agentic AI platform that transformed complex enterprise analysis into fast, self-service workflows across large databases.",

        highlights: [
            "Built a client-facing agentic AI platform that transformed multi-person enterprise analysis into sub-2-minute self-service workflows across large enterprise databases using 15+ specialized AI agents.",
            "Engineered the platform with Amazon Bedrock, Strands Agents, Python, and AWS SDK, converting natural-language requests into coordinated SQL, analytics, math, and sandboxed-code workflows.",
            "Redesigned the execution architecture with dependency-aware parallelism, cache and schema reuse, and targeted retries, reducing projected execution time by approximately 45% while reducing redundant LLM and database operations.",
        ],

        technologies: [
            "Python",
            "Strands Agents",
            "Amazon Bedrock",
            "AWS SDK",
            "SQL",
            "Agentic AI",
        ],
    },
    {
        id: "njit-data-science-research-assistant",
        year: 2025,

        role: "Deep Learning Forecasting Research Intern",
        company: "Department of Data Science (Grace Hopper AI Research), NJIT",
        type: "Research",

        startDate: "August 2025",
        endDate: "April 2026",
        location: "Newark, NJ",

        summary:
            "Built scalable deep learning forecasting workflows across real-world multi-location epidemic time-series datasets.",

        highlights: [
            "Engineered modular Python preprocessing pipelines with NumPy and Pandas for cleaning, trimming, interpolating, and splitting 10+ multi-location epidemic datasets with 900 weekly observations each across 5 disease types.",
            "Developed rolling-origin forecasting and evaluation workflows across 10+ models, standardizing experimentation and model comparison across datasets and hyperparameters.",
            "Parallelized forecasting workloads with multi-threaded Python execution, reducing experimentation runtime by 75–80%.",
            "Built reusable logging and recovery utilities for automated metric collection and reproducible experiments, and presented the scalable forecasting workflow at the NEBEC Conference.",
        ],

        technologies: [
            "Python",
            "Pandas",
            "NumPy",
            "PyTorch",
            "Time-Series Forecasting",
            "Deep Learning",
            "Model Evaluation",
            "Multithreading",
        ],
    },
    {
        id: "break-through-tech-ai-ml-fellow",
        year: 2025,

        role: "AI and ML Intern",
        company:
            "Chambers Capital Ventures | Break Through Tech @ Cornell Tech",
        type: "Internship",

        startDate: "June 2025",
        endDate: "December 2025",
        location: "Remote",

        summary:
            "Built an end-to-end machine learning pipeline using behavioral survey data to model founder traits and support venture investment analysis.",

        highlights: [
            "Engineered an end-to-end machine learning pipeline on large-scale behavioral survey data to model founder behavioral traits and support data-driven venture investment analysis.",
            "Performed feature engineering and selection across 60+ behavioral variables, reducing the feature space to 15 high-signal predictors and improving downstream model training and evaluation.",
            "Developed a stakeholder-facing application to surface model predictions and feature insights, translating ML outputs into actionable findings for investor review.",
        ],

        technologies: [
            "Python",
            "Pandas",
            "NumPy",
            "Scikit-learn",
            "Streamlit",
            "Machine Learning",
            "Data Analysis",
            "Feature Engineering",
            "Feature Selection",
            "Model Evaluation",
        ],
    },
    {
        id: "njit-computer-science-research-assistant",
        year: 2025,

        role: "Undergraduate Research Assistant",
        company: "Department of Computer Science, NJIT",
        type: "Research",

        startDate: "April 2025",
        endDate: "May 2026",
        location: "Newark, NJ",

        summary:
            "Worked across AI research and research software engineering in computer vision, deep learning, and applied systems.",

        highlights: [
            "Built preprocessing, augmentation, training, and evaluation pipelines for privacy-focused skin disease detection research.",
            "Developed CNN and ResNet-18 variants, contributing to an experimental approach that approximately doubled recall over baseline.",
            "Ran model experiments and contributed to research writing alongside a senior PhD researcher.",
            "Contributed to work accepted at MICAD 2025 and ICECER 2025.",
            "Built, deployed, and maintained a React platform showcasing OAIT researchers, projects, publications, and research activities.",
        ],

        technologies: [
            "Python",
            "PyTorch",
            "OpenCV",
            "ResNet-18",
            "Computer Vision",
            "Deep Learning",
            "React",
            "Research Experimentation",
        ],
    },
    {
        id: "propel2excel-fellow",
        year: 2024,

        role: "Fellow",
        company: "Propel2Excel",
        type: "Fellowship",

        startDate: "December 2024",
        endDate: "August 2025",
        location: "Boston, MA · Remote",

        summary:
            "Completed technical and professional development focused on cloud machine learning, mentorship, networking, and recruiting.",

        highlights: [
            "Completed Azure machine learning fundamentals training and strengthened foundational cloud and ML knowledge.",
            "Worked with mentors on career planning, technical growth, resume development, and recruiting strategy.",
            "Connected with professionals across technology and business through structured networking sessions.",
            "Completed career-readiness training focused on interviewing, professional communication, and presenting technical experience.",
        ],

        technologies: [
            "Azure",
            "Machine Learning Fundamentals",
            "Career Development",
            "Professional Networking",
            "Resume Development",
        ],

        companyUrl: "https://www.propel2excel.org",
    },
    {
        id: "njit-older-adult-online-safety-research",
        year: 2024,

        role: "Undergraduate Research Assistant",
        company: "New Jersey Institute of Technology",
        type: "Research",

        startDate: "May 2024",
        endDate: "December 2024",
        location: "Newark, NJ",

        summary:
            "Conducted human-centered research on online safety and fraud prevention for older adults across Newark.",

        highlights: [
            "Interviewed older adults at Newark-area senior facilities about technology use, online scams, fraud, and digital security.",
            "Transcribed interviews with Otter.ai and categorized responses into recurring behaviors, concerns, and security challenges.",
            "Reviewed peer-reviewed research and adapted established qualitative methods to guide thematic analysis.",
            "Synthesized participant findings into structured insights used to inform a mobile application's research and design direction.",
        ],

        technologies: [
            "Otter.ai",
            "User Research",
            "Qualitative Research",
            "Thematic Analysis",
            "Literature Review",
            "Human-Computer Interaction",
        ],
    },
];
