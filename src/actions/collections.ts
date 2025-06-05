// src/actions/collections.ts
import Api from "@/apis/Api";
import { uploadImage } from "@/apis/image";

export interface ArtifactData {
    name: string;
    category: string;
    keywords: string[];
    image: File;
}

export interface Artifact {
    id: string;
    name: string;
    category: string;
    keywords: string[];
    imageUrl: string;
    createdAt: string;
}

/**
 * 1. Upload the image file via `uploadImage(...)`.
 * 2. Send metadata (name, category, keywords, imageUrl) to FrontQL.
 */
export async function uploadArtifact(data: ArtifactData): Promise<Artifact> {
    try {
        // Upload the image first
        const imageUrl = await uploadImage(data.image, "artifacts");

        // Then create the artifact record
        const response = await Api.post("/artifacts", {
            body: {
                name: data.name,
                category: data.category,
                keywords: data.keywords,
                imageUrl: imageUrl
            },
        });

        // Return the created artifact
        return response.data as Artifact;
    } catch (error) {
        console.error("Error uploading artifact:", error);
        throw new Error("Failed to upload artifact");
    }
}

/**
 * Fetch all artifacts (optionally filtered by search or category).
 * Returns an array of Artifact objects.
 */
export async function getAllArtifacts({
    search = "",
    category = "",
}: { search?: string; category?: string } = {}): Promise<Artifact[]> {
    const params = new URLSearchParams();
    if (search) params.append("search", search);
    if (category) params.append("category", category);

    // GET /artifacts?search=...&category=...
    // FrontQL returns something like { data: [ { ... }, ... ], … }
    const response = await Api.get(`/artifacts?${params.toString()}`);

    // Return only the inner .data array:
    return (response.data as Artifact[]) || [];
}
