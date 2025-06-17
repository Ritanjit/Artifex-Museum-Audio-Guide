// src\actions\questionnaire.js
import Api from "@/apis/Api";

/**
 * Submit questionnaire to FrontQL
 * Returns the full response including created ID
 */
export async function submitQuestionnaire(data) {
    try {
        const response = await Api.post("/artifex-questionnaire", {
            body: data
        });
        return response; // Return full response
    } catch (error) {
        console.error("Error submitting questionnaire:", error);
        throw error;
    }
}

/**
 * Get all questionnaires from FrontQL
 * @returns {Promise<Array>} - Array of questionnaire entries
 */
export async function getAllQuestionnaires() {
    try {
        const response = await Api.get("/artifex-questionnaire", {
            fields: "id,name,email,score,passed,collectedCertificate",
            sort: "-created_at",
            page: "1,1000"
        });
        return response.result || [];
    } catch (error) {
        console.error("Error fetching questionnaires:", error);
        throw error;
    }
}

/**
 * Update questionnaire by ID
 */
export async function updateQuestionnaire(id, data) {
    try {
        await Api.put(`/artifex-questionnaire/${id}`, {
            body: data
        });
    } catch (error) {
        console.error("Error updating questionnaire:", error);
        throw error;
    }
}