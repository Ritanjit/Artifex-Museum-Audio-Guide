// src\actions\artifact.js
import Api from "@/apis/Api";

/**
 * Save an artifact with metadata and audio information
 * @param {Object} data - Artifact data to save
 * @returns {Promise} - API response
 */
export async function saveArtifact(data) {
    try {
        const response = await Api.post("/artifex-artifacts", {
            body: data
        });
        return response;
    } catch (error) {
        console.error("Error saving artifact:", error);
        throw error;
    }
}

/**
 * Get all artifacts
 * @returns {Promise<Array>} - Array of artifacts
 */
export async function getAllArtifacts() {
    try {
        const response = await Api.get("/artifex-artifacts", {
            fields: "id,name,category,keywords,imageUrl,english_audio_url,hindi_audio_url,assamese_audio_url,english_description,hindi_description,assamese_description,has_audio,audio_guide_id,created_at,updated_at",
            sort: "-created_at",
            page: "1,1000",
        });
        return response.result || [];
    } catch (error) {
        console.error("Error fetching artifacts:", error);
        throw error;
    }
}

/**
 * Update an artifact
 * @param {string} id - Artifact ID
 * @param {Object} data - Data to update
 * @returns {Promise} - API response
 */
export async function updateArtifact(id, data) {
    try {
        const response = await Api.put(`/artifex-artifacts/${id}`, {
            body: data
        });
        return response;
    } catch (error) {
        console.error("Error updating artifact:", error);
        throw error;
    }
}

/**
 * Delete an artifact
 * @param {string} id - Artifact ID
 * @returns {Promise} - API response
 */
export async function deleteArtifact(id) {
    try {
        await Api.delete(`/artifex-artifacts/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting artifact:", error);
        return { success: false, error: error.message };
    }
}

/**
 * Get artifact by ID
 * @param {string} id - Artifact ID
 * @returns {Promise<Object>} - Artifact data
 */
export async function getArtifactById(id) {
    try {
        const response = await Api.get(`/artifex-artifacts/${id}`);
        // Return the first item from the result array
        return response.result?.[0] || null;
    } catch (error) {
        console.error("Error fetching artifact:", error);
        throw error;
    }
}