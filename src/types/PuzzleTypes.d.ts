export interface PuzzleScore {
    logicScore: number;
    funScore: number;
    difficultyScore: number;
    diversityScore: number;
    totalScore: number;
}
export interface PuzzleData {
    id: number;
    difficultyLevel: string;
    theme: string[];
    prompt: string;
    solution: string;
    keyPoints: string[];
    creator: string;
    modifier: string | null;
    versionNumber: number;
    score: PuzzleScore;
    createdDate: number;
    lastModifiedDate: number;
    active: boolean;
    valid: boolean;
}
export interface SoupData {
    id: string;
    title: string;
    description: string;
    answer: string;
    hints: string[];
    tags: string[];
    playCount: number;
    rating: number;
    status: string;
    createdBy: string;
    aiGenerated: boolean;
    createdAt: string;
    updatedAt: string;
}
export interface SoupFormData {
    id?: string;
    title: string;
    description: string;
    answer: string;
    hints: string[];
    tags: string[];
    status: string;
    aiGenerated: boolean;
    rating?: number;
    playCount?: number;
    createdBy?: string;
    createdAt?: string;
    updatedAt?: string;
}
export interface EnumValue {
    id: number;
    valueCode: string;
    valueName: string;
    description: string;
    sortOrder: number;
    deleted: boolean;
}
export interface EnumData {
    itemId: number;
    itemName: string;
    itemDescription: string;
    enumValues: EnumValue[];
    deleted: boolean;
}
export interface EnumResponse {
    code: string;
    message: string;
    data: EnumData;
}
export interface PageRequest {
    pageNum: number;
    pageSize: number;
}
export interface SoupPageRequest extends PageRequest {
    titleKeyword?: string;
    tags?: string[];
    status?: string;
    createdBy?: string;
    aiGenerated?: boolean;
    minRating?: number;
    createdAtStart?: string;
    createdAtEnd?: string;
}
export interface EnumPageRequest extends PageRequest {
    code?: string;
    description?: string;
}
