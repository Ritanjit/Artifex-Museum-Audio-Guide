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

        // Format dates to DD-MM-YYYY
        const formatDate = (date) => {
            const day = String(date.getDate()).padStart(2, '0');
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const year = date.getFullYear();
            return `${day}-${month}-${year}`;
        };

        const startDateStr = formatDate(startDate);
        const endDateStr = formatDate(endDate);

        // Fetch data with corrected filter syntax
        const response = await Api.get("/artifex-visitors-history", {
            filter: `date>=${startDateStr},date<=${endDateStr}`,
            sort: "date",
            page: "1,1000"
        });

        if (!response.result || response.err) {
            console.error("Invalid response format:", response);
            return [];
        }

        // Format data for different views
        if (period === 'year') {
            // Group by month
            const monthlyData = response.result.reduce((acc, curr) => {
                const month = curr.date.substring(3, 10); // DD-MM-YYYY -> MM-YYYY
                acc[month] = (acc[month] || 0) + Number(curr.count);
                return acc;
            }, {});

            return Object.entries(monthlyData).map(([month, count]) => ({
                month: new Date(`01-${month}`).toLocaleString('default', { month: 'short' }),
                count,
                date: `01-${month}`
            }));
        }

        return response.result.map(item => ({
            ...item,
            count: Number(item.count),
            // For week/month views, keep daily format
            day: period === 'week'
                ? new Date(item.date.split('-').reverse().join('-')).toLocaleDateString('en-US', { weekday: 'short' })
                : `Day ${item.date.split('-')[0]}` // Get day from DD-MM-YYYY
        }));

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