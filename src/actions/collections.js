import Api from "@/apis/Api";

export async function uploadArtifact({
    name,
    category,
    keywords,
    imageUrl
}) {
    try {
        // Use snake_case endpoint format
        const response = await Api.post("/artifex-collections", {
            body: {
                name,
                category,
                keywords: JSON.stringify(keywords), // Convert to JSON string
                imageUrl: imageUrl  // Match database column name
            },
            fields: "id,name"
        });

        console.log('Artifact uploaded successfully:', response);
        return response;
    } catch (error) {
        console.error('Error uploading artifact:', error);
        throw error;
    }
}

export async function getCollections() {
    try {
        const response = await Api.get("/artifex-collections", {
            fields: "id,name,category,keywords,image_url",
            sort: "-created_at",
            page: "1,1000"
        });

        // Return the data array directly
        return response.data || [];
    } catch (error) {
        console.error('Error fetching collections:', error);
        throw error;
    }
}