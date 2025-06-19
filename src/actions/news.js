// src/actions/news.js
import Api from "@/apis/Api";

export async function getAllNews() {
    try {
        const response = await Api.get("/artifex-news", {
            fields: "id,headline,excerpt,category,featured,tags,date,updated_at", // Ensure this matches your DB
            sort: "-date",
            page: "1,1000"
        });
        return Array.isArray(response?.result) ? response.result : [];
    } catch (error) {
        console.error("Error fetching news:", error);
        throw error;
    }
}

export async function createNews(data) {
    try {
        const response = await Api.post("/artifex-news", {
            body: data
        });
        return response;
    } catch (error) {
        console.error("Error creating news:", error);
        throw error;
    }
}

export async function updateNews(id, data) {
    try {
        const response = await Api.put(`/artifex-news/${id}`, {
            body: {
                ...data,
                updated_at: new Date().toISOString() // Changed from lastUpdated
            }
        });
        return response;
    } catch (error) {
        console.error("Error updating news:", error);
        throw error;
    }
}

export async function deleteNews(id) {
    try {
        await Api.delete(`/artifex-news/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting news:", error);
        return { success: false, error: error.message };
    }
}