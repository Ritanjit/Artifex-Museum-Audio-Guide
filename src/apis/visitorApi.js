// src\apis\visitorApi.js
import Api from "@/apis/Api";

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
export const getVisitorHistory = async () => {
    try {
        // Get visitor history records
        const response = await Api.get("/artifex-visitors-history", {
            sort: "-date",
            page: "1,30"
        });

        if (response.result && response.result.length > 0) {
            return response.result.map(item => ({
                date: item.date,
                count: Number(item.count)
            }));
        }

        // If no records exist, return empty array
        return [];
    } catch (error) {
        console.error("Error getting visitor history:", error);
        throw error;
    }
};

// Update visitor history (increment today's count)
export const updateVisitorHistory = async () => {
    try {
        const today = new Date().toISOString().split('T')[0];
        
        // Check if today's record exists
        const response = await Api.get("/artifex-visitors-history", {
            filter: `date:${today}`,
            page: "1,1"
        });

        if (response.result && response.result.length > 0) {
            // Update existing record
            const record = response.result[0];
            const newCount = Number(record.count) + 1;
            
            await Api.put(`/artifex-visitors-history/${record.id}`, {
                body: { count: newCount }
            });
        } else {
            // Create new record
            await Api.post("/artifex-visitors-history", {
                body: { 
                    date: today,
                    count: 1
                }
            });
        }
    } catch (error) {
        console.error("Error updating visitor history:", error);
        throw error;
    }
};