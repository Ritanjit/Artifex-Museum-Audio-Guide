// src\components\dashboard\upload.tsx
import React, { useState } from "react";
import { X, Plus } from "lucide-react";
import UploadCollectionsImage from "./uploadCollectionsImage";
import { uploadArtifact } from "@/actions/collections";

const CollectionsUpload: React.FC = () => {
  const [imageURL, setImageURL] = useState("");
  const [artifactName, setArtifactName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [collectionCategory, setCollectionCategory] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(
    null
  );
  const [showToast, setShowToast] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetImageComponent, setResetImageComponent] = useState(false);

  const collectionCategories = [
    "Satras",
    "Mukhas",
    "Ahom Dynasty",
    "Folk Traditions",
    "Royal Seals",
    "Language & Scripts",
  ];

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 4000);
  };

  const handleAddKeyword = () => {
    if (currentKeyword.trim() && !keywords.includes(currentKeyword.trim())) {
      setKeywords((prev) => [...prev, currentKeyword.trim()]);
      setCurrentKeyword("");
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    setKeywords(keywords.filter((k) => k !== keyword));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!artifactName || !collectionCategory || keywords.length === 0 || !imageURL) {
      triggerToast("Please fill all required fields and upload an image.", "error");
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await uploadArtifact({
        name: artifactName,
        category: collectionCategory,
        keywords,
        imageUrl: imageURL,
      });

      if (result?.error) {
        triggerToast(result.message || "Upload failed. Please try again.", "error");
      } else {
        triggerToast("Artifact uploaded successfully!", "success");

        // Reset form and image upload component
        setArtifactName("");
        setKeywords([]);
        setCurrentKeyword("");
        setCollectionCategory("");
        setImageURL("");
        setResetImageComponent(true);
        setTimeout(() => setResetImageComponent(false), 100);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      triggerToast("An unexpected error occurred. Please try again.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-visible sm:mt-10 mb-70 sm:mb-50 bg-gray-100 dark:bg-zinc-900 text-zinc-900 dark:text-white transition-all duration-300">
      {/* Toast notification */}
      {showToast && toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm ${toast.type === "success"
            ? "bg-red-800 dark:bg-amber-600 text-white"
            : "bg-red-900 text-white"}
            animate-slide-in`}
        >
          <div className="flex justify-between items-center gap-4">
            <span>{toast.message}</span>
            <button onClick={() => setShowToast(false)} className="cursor-pointer">
              <X size={18} className="hover:text-gray-200" />
            </button>
          </div>
          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
            <div className="h-full bg-white animate-progress-bar"></div>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-800 p-8 sm:px-15 sm:py-10 rounded-xl shadow-xl border border-gray-200 dark:border-zinc-700">
        <h2 className="text-3xl font-bold mb-8 text-center">Upload to Collections</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1) Image Upload Component */}
          <UploadCollectionsImage
            onUploadSuccess={(url) => setImageURL(url)}
            resetTrigger={resetImageComponent}
          />

          {/* 2) Image URL Field (auto-filled after upload) */}
          <div>
            <label className="block mb-2 font-semibold">Image URL</label>
            <input
              type="text"
              value={imageURL}
              onChange={(e) => setImageURL(e.target.value)}
              placeholder="Image URL will appear here after upload"
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
              required
              readOnly
            />
            <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
              After uploading an image, the URL will automatically populate here. Do not change it manually.
            </p>
          </div>

          {/* 3) Artifact Name */}
          <div>
            <label className="block mb-2 font-semibold">Artifact Name</label>
            <input
              type="text"
              value={artifactName}
              onChange={(e) => setArtifactName(e.target.value)}
              placeholder="e.g. Royal Sword of Sukapha"
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
              required
            />
          </div>

          {/* 4) Category Dropdown */}
          <div>
            <label className="block mb-2 font-semibold">Collection Category</label>
            <select
              value={collectionCategory}
              onChange={(e) => setCollectionCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {collectionCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* 5) Keywords Input */}
          <div>
            <label className="block mb-2 font-semibold">
              Artifact Keywords <span className="text-gray-500 dark:text-gray-400 text-xs">(press enter to add)</span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="flex items-center bg-red-800 dark:bg-amber-600 text-white px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    className="ml-1 hover:text-red-300 dark:hover:text-amber-300"
                    onClick={() => handleRemoveKeyword(keyword)}
                  >
                    <X size={16} />
                  </button>
                </span>
              ))}
            </div>
            <input
              type="text"
              value={currentKeyword}
              onChange={(e) => setCurrentKeyword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a keyword and press Enter"
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 border-gray-300 dark:border-zinc-600 focus:ring-2 focus:ring-red-800 dark:focus:ring-amber-600 focus:outline-none"
            />
          </div>

          {/* 6) Submit Button (Bottom Right) */}
          <div className="relative h-20">
            <div className="absolute bottom-0 right-0">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`${isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-red-800 hover:bg-red-900 dark:bg-amber-600 dark:hover:bg-amber-700"} 
        text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 justify-center`}
              >
                {isSubmitting ? (
                  <span className="animate-pulse">Uploading...</span>
                ) : (
                  <>
                    <span>Upload Artifact</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionsUpload;