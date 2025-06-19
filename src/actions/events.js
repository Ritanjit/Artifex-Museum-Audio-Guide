// src\actions\events.js
import Api from "@/apis/Api";

export async function getAllEvents() {
    try {
        const response = await Api.get("/artifex-events", {
            fields: "id,title,description,date,time,location,category,featured",
            sort: "-date",
            page: "1,1000",
        });
        return response.result || [];
    } catch (error) {
        console.error("Error fetching events:", error);
        throw error;
    }
}

export async function createEvent(eventData) {
    try {
        const response = await Api.post("/artifex-events", {
            body: eventData
        });
        return response;
    } catch (error) {
        console.error("Error creating event:", error);
        throw error;
    }
}

export async function updateEvent(id, eventData) {
    try {
        const response = await Api.put(`/artifex-events/${id}`, {
            body: eventData
        });
        return response;
    } catch (error) {
        console.error("Error updating event:", error);
        throw error;
    }
}

export async function deleteEvent(id) {
    try {
        await Api.delete(`/artifex-events/${id}`);
        return { success: true };
    } catch (error) {
        console.error("Error deleting event:", error);
        return { success: false, error: error.message };
    }
}