// src\actions\collections.js
import Api from "@/apis/Api";

export async function uploadArtifact({
    name,
    category,
    keywords,
    imageUrl
}) {
    try {
        const response = await Api.post("/artifex-collections", {
            body: {
                name,
                category,
                keywords: JSON.stringify(keywords),
                imageUrl
            },
            fields: "id,name"
        });
        return response;
    } catch (error) {
        console.error('Error uploading artifact:', error);
        throw error;
    }
}

/**
 * Fetch all collections from FrontQL (up to 1000, sorted by newest first).
 * @returns {Promise<any[]>}  The array of rows (response.result) or throws on error.
 */
// export async function getCollections() {
//     try {
//         const response = await Api.get("/artifex-collections", {
//             fields: "id,name,category,keywords,imageUrl,created_at,updated_at",
//             sort: "-created_at",
//             page: "1,1000",
//         });

//         console.log("getCollections → raw response:", response);
//         // FrontQL v5 returns { err: false, result: [...], count: N }
//         // so extract `result`, not `data`.
//         if (Array.isArray(response.result)) {
//             return response.result;
//         } else {
//             console.warn("Unexpected getCollections shape:", response);
//             return [];
//         }
//     } catch (error) {
//         console.error("Error in getCollections:", error);
//         throw error;
//     }
// }


export async function getCollections() {
    try {
        const response = await Api.get("/artifex-collections", {
            fields: "id,name,category,keywords,imageUrl,created_at,updated_at",
            sort: "-created_at",
            page: "1,1000",
        });

        if (Array.isArray(response.result)) {
            return response.result.map(item => {
                // Properly parse keywords
                let keywords = [];
                try {
                    keywords = typeof item.keywords === 'string'
                        ? JSON.parse(item.keywords)
                        : item.keywords || [];
                } catch (e) {
                    console.error('Error parsing keywords:', e);
                }

                return {
                    ...item,
                    keywords: Array.isArray(keywords) ? keywords : []
                };
            });
        } else {
            return [];
        }
    } catch (error) {
        throw error;
    }
}

export async function deleteArtifact(id) {
    try {
        // Use Api.delete() as per FrontQL docs
        await Api.delete(`/artifex-collections/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting artifact:', error);
        return { success: false, error: error.message };
    }
}

export async function updateArtifact(id, data) {
    try {
        // Use Api.put() instead of Api.patch()
        const response = await Api.put(`/artifex-collections/${id}`, {
            body: {
                ...data,
                keywords: JSON.stringify(data.keywords),
            }
        });
        return response;
    } catch (error) {
        console.error('Error updating artifact:', error);
        throw error;
    }
}
