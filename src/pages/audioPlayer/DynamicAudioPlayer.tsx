import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { getArtifactById } from "@/actions/artifact";
import AudioPlayer from "./AudioPlayer";
import ErrorBoundary from '@/components/errorBoundary/ErrorBoundary';

const DynamicAudioPlayer: React.FC = () => {
    const { artifactId } = useParams<{ artifactId: string }>();
    const location = useLocation();
    const [artifactData, setArtifactData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo({ top: 0, behavior: "instant" });

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

    // Optional: Handle scroll if coming from specific locations
    useEffect(() => {
        if (location.state?.shouldScroll) {
            window.scrollTo({ top: 0, behavior: "instant" });
        }
    }, [location.state]);

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