// src\apis\visitorApi.js
import Api from "@/apis/Api";

// Helper function to format date as DD-MM-YY
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2); // Last 2 digits
    return `${day}-${month}-${year}`;
};

// Get current visitor count
export const getVisitorCount = async () => {
    try {
        // Get the latest visitor record
        const response = await Api.get("/artifex-visitors", {
            sort: "-created_at",
            page: "1,1"
        });

        if (response.result && response.result.length > 0) {
            // Convert count to number
            return Number(response.result[0].count);
        }

        // If no records exist, create one
        const newRecord = await Api.post("/artifex-visitors", {
            body: { count: 1 }
        });
        return 1;
    } catch (error) {
        console.error("Error getting visitor count:", error);
        throw error;
    }
};

// Increment visitor count
export const incrementVisitorCount = async () => {
    try {
        // Get the latest record
        const response = await Api.get("/artifex-visitors", {
            sort: "-created_at",
            page: "1,1"
        });

        if (response.result && response.result.length > 0) {
            const record = response.result[0];
            // Convert current count to number and increment
            const currentCount = Number(record.count);
            const newCount = currentCount + 1;

            // Update the count using PUT
            await Api.put(`/artifex-visitors/${record.id}`, {
                body: { count: newCount }
            });

            console.log(`Incrementing count. Current: ${record.count} (type: ${typeof record.count}), New: ${newCount}`);

            return newCount;
        }

        // Create first record if none exists
        const newRecord = await Api.post("/artifex-visitors", {
            body: { count: 1 }
        });
        return 1;
    } catch (error) {
        console.error("Error incrementing visitor count:", error);
        throw error;
    }
};

// Get visitor history (last 30 days by default)
export const getVisitorHistory = async (period = 'week') => {
    try {
        // Calculate date range based on period
        const endDate = new Date();
        let startDate = new Date();

        switch (period) {
            case 'week':
                startDate.setDate(endDate.getDate() - 7);
                break;
            case 'month':
                startDate.setDate(endDate.getDate() - 30);
                break;
            case 'year':
                startDate.setFullYear(endDate.getFullYear() - 1);
                break;
        }

        // Fetch all data since we need to aggregate
        const response = await Api.get("/artifex-visitors-history", {
            sort: "date",
            page: "1,1000"
        });

        if (!response.result || response.err) {
            console.error("Invalid response format:", response);
            return [];
        }

        return response.result;

    } catch (error) {
        console.error("Error getting visitor history:", error);
        throw error;
    }
};

// Update the updateVisitorHistory function
export const updateVisitorHistory = async () => {
    try {
        const today = formatDate(new Date());
        console.log(`Checking history for date: ${today}`); // Debug log

        // Check if today's record exists
        const response = await Api.get("/artifex-visitors-history", {
            filter: `date=${today}`,  // Changed from : to = for exact match
            page: "1,1"
        });

        console.log('History check response:', response); // Debug log

        if (response.result && response.result.length > 0) {
            const record = response.result[0];
            const newCount = Number(record.count) + 1;

            console.log(`Updating existing record (ID: ${record.id}) with count: ${newCount}`);

            const updateResponse = await Api.put(`/artifex-visitors-history/${record.id}`, {
                body: { count: newCount }
            });

            console.log('Update response:', updateResponse);
            return newCount;
        }

        console.log('Creating new history record for today');

        const newRecord = await Api.post("/artifex-visitors-history", {
            body: {
                date: today,
                count: 1
            }
        });

        console.log('New record created:', newRecord);
        return 1;
    } catch (error) {
        console.error("Error updating visitor history:", error);
        throw error;
    }
};