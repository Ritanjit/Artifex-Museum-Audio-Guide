// src\actions\feedback.js
import Api from "@/apis/Api";

/**
 * Submit feedback to FrontQL
 * @param {Object} data - Feedback data
 * @returns {Promise} - API response
 */
export async function submitFeedback(data) {
    try {
        const response = await Api.post("/artifex-feedback", {
            body: data
        });
        return response;
    } catch (error) {
        console.error("Error submitting feedback:", error);
        throw error;
    }
}

/**
 * Get all feedback from FrontQL
 * @returns {Promise<Array>} - Array of feedback entries
 */
export async function getAllFeedback() {
    try {
        const response = await Api.get("/artifex-feedback", {
            fields: "id,name,email,rating,message,created_at,updated_at",
            sort: "-created_at",
            page: "1,1000"
        });
        return response.result || [];
    } catch (error) {
        console.error("Error fetching feedback:", error);
        throw error;
    }
}