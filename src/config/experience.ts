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
        endDate: "August 2026",
        location: "Edison, NJ",

        summary:
            "Built and led development of multi-agent AI systems using Strands Agents, Amazon Bedrock, and AWS.",

        highlights: [
            "Built an agentic AI workflow with 10+ specialized agents for reasoning, retrieval, validation, execution, and response generation.",
            "Designed reusable orchestration patterns combining LLM agents with deterministic validation, structured state, and controlled tool execution.",
            "Built semantic retrieval and caching workflows using Amazon Bedrock Knowledge Bases and S3.",
            "Deployed and monitored AI services with AWS Lambda, S3, and CloudWatch.",
            "Led intern development, coordinated integrations, reviewed contributions, and resolved system-level engineering issues.",
        ],

        technologies: [
            "Python",
            "Strands Agents",
            "Amazon Bedrock",
            "AWS Lambda",
            "Amazon S3",
            "Amazon CloudWatch",
            "PostgreSQL",
            "Git",
            "Agentic AI",
        ],
    },
    {
        id: "njit-data-science-research-assistant",
        year: 2025,

        role: "Undergraduate Research Assistant",
        company: "Department of Data Science, NJIT",
        type: "Research",

        startDate: "August 2025",
        endDate: "April 2026",
        location: "Newark, NJ",

        summary:
            "Built scalable machine learning research workflows for epidemic forecasting across real-world time-series datasets.",

        highlights: [
            "Built reusable data pipelines for preprocessing and standardizing 20+ real-world epidemic time-series datasets.",
            "Developed a benchmarking framework for evaluating 10+ forecasting models, including LSTM, GNN, and VAR approaches.",
            "Standardized model evaluation across datasets using forecasting metrics including RMSE and MAE.",
            "Parallelized training and evaluation workloads, reducing end-to-end experimentation runtime by approximately 75%.",
            "Presented the research and forecasting framework at the NEBEC Conference.",
        ],

        technologies: [
            "Python",
            "Pandas",
            "NumPy",
            "PyTorch",
            "PyTorch Geometric",
            "Statsmodels",
            "LSTM",
            "Graph Neural Networks",
            "VAR",
            "Multiprocessing",
            "Time-Series Forecasting",
        ],
    },
    {
        id: "break-through-tech-ai-ml-fellow",
        year: 2025,

        role: "Artificial Intelligence and Machine Learning Fellow",
        company:
            "Break Through Tech @ Cornell Tech | Chambers Capital Ventures",
        type: "Fellowship",

        startDate: "June 2025",
        endDate: "May 2026",
        location: "Remote",

        summary:
            "Applied end-to-end machine learning and data science through a selective fellowship and industry-sponsored project.",

        highlights: [
            "Selected from 3,000+ applicants for applied AI, machine learning, and data science training.",
            "Worked with Chambers Capital Ventures on predictive modeling using behavioral survey data related to founder grit.",
            "Built an end-to-end workflow spanning data cleaning, EDA, feature engineering, model training, and evaluation.",
            "Reduced 60+ survey features to 15 meaningful predictors through feature analysis and selection.",
            "Built a Streamlit application and presented model results and feature insights to industry stakeholders.",
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
