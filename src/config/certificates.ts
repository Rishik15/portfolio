export type Certificate = {
    name: string;
    issuer: string;
    credentialUrl?: string;
};

export const CERTIFICATES: readonly Certificate[] = [
    {
        name: "AWS Certified Machine Learning Engineer - Associate",
        issuer: "Amazon Web Services",
    },
    {
        name: "Azure Data Scientist - Associate",
        issuer: "Microsoft",
    },
    {
        name: "Machine Learning Certificate",
        issuer: "Cornell University",
    },
];
