// src\actions\player.js
import Api from "@/apis/Api";

export async function saveAudioPlayerData(data) {
    try {
        const response = await Api.post('/artifex-audio-player', {
            body: data
        });

        return response;
    } catch (error) {
        console.error('Error saving audio player data:', error);
        throw error;
    }
}

export async function getAudioPlayerData(collectionItemId) {
    try {
        const response = await Api.get('/artifex-audio-player', {
            filter: `collection_item_id:${collectionItemId}`,
            // Add fields for descriptions
            fields: "english_audio_url, hindi_audio_url, assamese_audio_url, english_description, hindi_description, assamese_description"
        });
        if (response.result && response.result.length > 0) {
            return response.result[0];
        }
        return null;
    } catch (error) {
        console.error('Error fetching audio player data:', error);
        throw error;
    }
}

// New function to get all audio guides
export async function getAllAudioPlayerData() {
    try {
        const response = await Api.get('/artifex-audio-player', {
            fields: "id,collection_item_id,english_audio_url,hindi_audio_url,assamese_audio_url,english_description,hindi_description,assamese_description,created_at,updated_at",
            sort: "-created_at",
            page: "1,1000",
        });
        return response.result || [];
    } catch (error) {
        console.error('Error fetching all audio player data:', error);
        throw error;
    }
}

// New function to update audio guide
export async function updateAudioPlayerData(id, data) {
    try {
        const response = await Api.put(`/artifex-audio-player/${id}`, {
            body: data
        });
        return response;
    } catch (error) {
        console.error('Error updating audio player data:', error);
        throw error;
    }
}

// New function to delete audio guide
export async function deleteAudioPlayerData(id) {
    try {
        await Api.delete(`/artifex-audio-player/${id}`);
        return { success: true };
    } catch (error) {
        console.error('Error deleting audio player data:', error);
        return { success: false, error: error.message };
    }
}