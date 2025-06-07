// type file for collections.js

// src/types/collections.ts
export interface Artifact {
    id: string;
    name: string;
    category: string;
    keywords: string[];
    imageUrl: string;
    created_at: string;
    updated_at: string;
}