// src/pages/audioPlayer/DynamicAudioPlayer.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getArtifactById } from "@/actions/upload";
import AudioPlayer from "./AudioPlayer";
import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';

const DynamicAudioPlayer: React.FC = () => {
    const { artifactId } = useParams<{ artifactId: string }>();
    const [artifactData, setArtifactData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const artifact = await getArtifactById(artifactId!);

                if (!artifact) {
                    throw new Error("Artifact not found");
                }

                setArtifactData(artifact);
            } catch (err) {
                setError(err instanceof Error ? err.message : "An error occurred");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [artifactId]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen text-red-600">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading audio player</div>}>
            <AudioPlayer artifactData={artifactData} />
        </ErrorBoundary>
    );
};

export default DynamicAudioPlayer;



// import React, { useState, useEffect } from "react";
// import { useParams } from "react-router-dom";
// import { getAudioPlayerData } from "@/actions/player";
// import { getCollections } from "@/actions/collections";
// import AudioPlayer from "./AudioPlayer";
// import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';

// const DynamicAudioPlayer: React.FC = () => {
//     const { collectionItemId } = useParams<{ collectionItemId: string }>();
//     const [audioData, setAudioData] = useState<any>(null);
//     const [artifactData, setArtifactData] = useState<any>(null);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         const fetchData = async () => {
//             try {
//                 setLoading(true);

//                 // Fetch artifact data first
//                 const collections = await getCollections();
//                 const artifact = collections.find(
//                     (c: any) => c.id.toString() === collectionItemId
//                 );

//                 if (!artifact) {
//                     throw new Error("Artifact not found");
//                 }

//                 // Fetch audio player data
//                 const audioResponse = await getAudioPlayerData(collectionItemId!);

//                 // If no audio data, use static player
//                 if (!audioResponse) {
//                     setAudioData(null);
//                     setArtifactData(artifact);
//                     return;
//                 }

//                 setAudioData(audioResponse);
//                 setArtifactData(artifact);
//             } catch (err) {
//                 setError(err instanceof Error ? err.message : "An error occurred");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchData();
//     }, [collectionItemId]);

//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen">
//                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-500"></div>
//             </div>
//         );
//     }

//     if (error) {
//         return (
//             <div className="flex justify-center items-center h-screen text-red-600">
//                 <p>{error}</p>
//             </div>
//         );
//     }

//     return (
//         <ErrorBoundary fallback={<div className="text-red-500 p-4">Error loading audio player</div>}>
//             <AudioPlayer
//                 audioData={audioData}
//                 artifactData={artifactData}
//             />
//         </ErrorBoundary>
//     );
// };

// export default DynamicAudioPlayer;