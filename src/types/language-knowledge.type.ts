export enum LanguageKnowledgeLevel {
    Advanced,
    Native,
}

export const LANGUAGE_LEVEL_NAME: Record<LanguageKnowledgeLevel, string> = {
    [LanguageKnowledgeLevel.Advanced]: "Advanced",
    [LanguageKnowledgeLevel.Native]: "Native",
}

export type LanguageKnowledge = {
    id: string;
    lang: string;
    level: LanguageKnowledgeLevel;
}