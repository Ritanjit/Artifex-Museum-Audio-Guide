// src\actions\contact.js
import Api from "@/apis/Api";

/**
 * Submit contact form data
 * @param {Object} data - Contact form data
 * @returns {Promise} - API response
 */
export async function submitContact(data) {
    try {
        return await Api.post("/artifex-contactUs", {
            body: {
                ...data,
                status: "new",
                starred: false
            }
        });
    } catch (error) {
        console.error("Error submitting contact:", error);
        throw error;
    }
}

/**
 * Get all contact submissions
 * @returns {Promise<Array>} - Array of contact submissions
 */
export async function getAllContactSubmissions() {
    try {
        const response = await Api.get("/artifex-contactUs", {
            fields: "id,fullName,email,phone,message,created_at,status,starred",
            sort: "-created_at",
            page: "1,1000"
        });
        return response.result || [];
    } catch (error) {
        console.error("Error fetching contacts:", error);
        throw error;
    }
}

/**
 * Update contact submission
 * @param {string} id - Submission ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} - API response
 */
export async function updateContactSubmission(id, updates) {
    try {
        return await Api.put(`/artifex-contactUs/${id}`, {
            body: updates
        });
    } catch (error) {
        console.error("Error updating contact:", error);
        throw error;
    }
}

/**
 * Send reply email
 * @param {Object} data - {to, subject, message}
 * @returns {Promise} - API response
 */
export async function sendReplyEmail(data) {
    try {
        return await Api.post("/send-email", {
            body: data
        });
    } catch (error) {
        console.error("Error sending email:", error);
        throw error;
    }
}

export async function deleteContactSubmission(id) {
    try {
        return await Api.delete(`/artifex-contactUs/${id}`);
    } catch (error) {
        console.error("Error deleting contact:", error);
        throw error;
    }
}