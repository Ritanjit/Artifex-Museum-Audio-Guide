// src\components\dashboard\uploadCollectionsImage.tsx
import React, { FC, useState, useRef, ChangeEvent } from "react";
import { compressImage, uploadImage as apiUploadImage } from "../../apis/image";
import { CloudUpload, X, Loader2 } from "lucide-react";
import { useEffect } from "react";

interface UploadCollectionsImageProps {
    onUploadSuccess: (url: string) => void;
    resetTrigger?: boolean;
}

const UploadCollectionsImage: FC<UploadCollectionsImageProps> = ({ onUploadSuccess, resetTrigger }) => {
    const [file, setFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState<number>(0);
    const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (resetTrigger) {
            handleRemove();
        }
    }, [resetTrigger]);

    // Open the native file dialog
    const openFileDialog = () => {
        fileInputRef.current?.click();
    };

    // When a file is selected, show preview but do NOT auto-upload
    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0] || null;
        if (!selectedFile) return;

        // Only allow images under 100 MB
        if (!selectedFile.type.startsWith("image/") || selectedFile.size > 10 * 1024 * 1024) {
            return;
        }

        setFile(selectedFile);
        setUploadedUrl(null);
        onUploadSuccess(""); // Clear any prior URL

        // Generate a data URL for preview
        const reader = new FileReader();
        reader.onload = (event) => {
            setPreviewUrl(event.target?.result as string);
        };
        reader.readAsDataURL(selectedFile);
    };

    // Only when “Upload Image” is clicked
    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // Compress the image
            const compressed = await compressImage(file);
            // Upload into “artifex/collections” folder
            const folder = "artifex/collections";
            const result = await apiUploadImage(
                compressed,
                folder,
                (progressEvent) => {
                    if (progressEvent.total) {
                        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress(percent);
                    }
                }
            );

            if (result) {
                // Build the full URL and send it back
                const fullUrl = import.meta.env.VITE_IMAGE_URL + result;
                setUploadedUrl(fullUrl);
                onUploadSuccess(fullUrl);
            }
        } catch (err) {
            console.error("Upload failed:", err);
        } finally {
            setIsUploading(false);
        }
    };

    // Remove the current image and clear everything
    const handleRemove = () => {
        setFile(null);
        setPreviewUrl(null);
        setUploadedUrl(null);
        setIsUploading(false);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = "";
        onUploadSuccess("");
    };

    return (
        <div className="space-y-4">
            {/* Image selection / preview box */}
            <div
                className={`border-2 rounded-md p-4 text-center cursor-pointer transition-all ${file
                    ? "border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800"
                    : "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                    }`}
                onClick={openFileDialog}
            >
                {previewUrl ? (
                    <div className="relative mx-auto w-56 h-56">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="object-cover w-full h-full rounded-md"
                        />
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleRemove();
                            }}
                            className="absolute top-2 right-2 p-1 bg-white/80 dark:bg-gray-800/80 rounded-full hover:bg-white dark:hover:bg-gray-700 transition-all"
                        >
                            <X size={16} className="text-gray-700 dark:text-gray-300" />
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-56">
                        <CloudUpload size={40} className="text-red-900 dark:text-red-300 mb-2" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Click to select an image
                        </p>
                    </div>
                )}
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileSelect}
                    className="hidden"
                />
            </div>

            {/* Upload button + progress bar */}
            {file && !uploadedUrl && (
                <div>
                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className={`w-full flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors text-white ${isUploading
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-red-900 hover:bg-red-800 dark:bg-amber-600 dark:hover:bg-amber-500"
                            }`}
                    >
                        {isUploading ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Uploading... {uploadProgress}%
                            </>
                        ) : (
                            <>
                                <CloudUpload size={18} />
                                Upload Image
                            </>
                        )}
                    </button>
                    {isUploading && (
                        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
                            <div
                                className="bg-red-800 dark:bg-amber-500 h-full transition-all duration-200"
                                style={{ width: `${uploadProgress}%` }}
                            />
                        </div>
                    )}
                </div>
            )}

            {/* On success, show URL and “Remove” */}
            {uploadedUrl && (
                <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                    <p>Image uploaded successfully!</p>
                    <p className="truncate">{uploadedUrl}</p>
                    <button
                        onClick={handleRemove}
                        className="mt-1 px-4 py-2 bg-red-900 hover:bg-red-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white rounded-md"
                    >
                        Remove Image
                    </button>
                </div>
            )}
        </div>
    );
};

export default UploadCollectionsImage;
