// src\components\dashboard\upload.tsx file :
import React, { useState } from "react";
import { X } from "lucide-react";

const CollectionsUpload: React.FC = () => {

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [artifactName, setArtifactName] = useState("");
  const [keywords, setKeywords] = useState<string[]>([]);
  const [currentKeyword, setCurrentKeyword] = useState("");
  const [collectionCategory, setCollectionCategory] = useState("");
  const [fileName, setFileName] = useState("");
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [showToast, setShowToast] = useState(false);

  const collectionCategories = [
    "Ahom Dynasty",
    "Folk Traditions",
    "Royal Seals",
    "Language & Scripts",
  ];

  const triggerToast = (message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 4000); // toast visible for 4 seconds
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!artifactName || !collectionCategory || keywords.length === 0) {
      triggerToast("Please fill all required fields and add at least one keyword.", "error");
      return;
    }

    if (!imagePreview) {
      triggerToast("Please upload an image!", "error");
      return;
    }

    console.log("Artifact Name:", artifactName);
    console.log("Keywords:", keywords);
    console.log("Category:", collectionCategory);
    console.log("Image Preview URL:", imagePreview);

    triggerToast("Artifact uploaded successfully!", "success");

    // ✅ Reset the form
    setArtifactName("");
    setKeywords([]);
    setCurrentKeyword("");
    setCollectionCategory("");
    setImagePreview(null);
    setFileName("");
  };



  return (

    <div className="w-full h-full overflow-y-visible sm:mt-10 mb-70 sm:mb-50 bg-gray-100 dark:bg-zinc-900 
    text-zinc-900 dark:text-white transition-all duration-300">

      {showToast && toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-4 rounded-sm shadow-lg text-sm max-w-sm 
          ${toast.type === "success" ? 
          "bg-green-500 text-white" : 
          "bg-red-500 text-white"} animate-slide-in`}
        >
          <div className="flex justify-between items-center gap-4">
            <span>{toast.message}</span>
            <button onClick={() => setShowToast(false)} className="cursor-pointer">
              <X size={18} className="hover:text-gray-200" />
            </button>
          </div>

          {/* Progress bar as bottom border */}
          <div className="absolute bottom-0 left-0 w-full h-[4px] bg-white/30 rounded-b-md overflow-hidden">
            <div className="h-full bg-white animate-progress-bar"></div>
          </div>
        </div>
      )}


      <div className="max-w-6xl mx-auto bg-white dark:bg-zinc-800 p-8 sm:px-15sm:py-10 rounded-xl shadow-xl">
        <h2 className="text-3xl font-bold mb-8 text-center">Upload to Collections</h2>

        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Image Upload */}
          <div className="flex flex-col sm:flex-row sm:items-start md:flex-row md:items-start gap-x-4 gap-y-4">

            {/* Smaller Square Preview */}
            <div className="mx-auto sm:mx-0 border-2 border-dashed rounded-md bg-gray-50 dark:bg-zinc-700 w-56 h-56">
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="object-cover w-full h-full rounded-md"
                />
              ) : (
                <span className="text-gray-400 text-sm flex justify-center items-center h-full text-center">
                  Image Preview
                </span>
              )}
            </div>

            {/* Upload Section */}
            <div className="sm:mt-38">
              <label className="block mb-2 font-semibold">Upload Artifact Image</label>

              <div className="flex items-center gap-3">
                <input
                  id="file-upload"
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        setImagePreview(reader.result as string);
                      };
                      reader.readAsDataURL(file);
                      setFileName(file.name); // Save file name in state
                    }
                  }}
                  className="hidden"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer inline-block px-4 py-2 text-sm bg-amber-500 hover:bg-amber-600 
                  text-white rounded-md transition"
                >
                  {imagePreview ? "Change Uploaded Image" : "Upload Image"}
                </label>

                <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[200px]">
                  {fileName || "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          {/* Artifact Name */}
          <div>
            <label className="block mb-2 font-semibold">Artifact Name</label>
            <input
              type="text"
              value={artifactName}
              onChange={(e) => setArtifactName(e.target.value)}
              placeholder="e.g. Royal Sword of Sukapha"
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            />
          </div>

          {/* Category Dropdown */}
          <div>
            <label className="block mb-2 font-semibold">Collection Category</label>
            <select
              value={collectionCategory}
              onChange={(e) => setCollectionCategory(e.target.value)}
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
              required
            >
              <option value="">Select Category</option>
              {collectionCategories.map((cat, index) => (
                <option key={index} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Keywords Input */}
          <div>
            <label className="block mb-2 font-semibold">
              Artifact Keywords <span> </span>
              <span className="text-stone-500 text-xs">
                (note: press enter to add keyword)
              </span>
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {keywords.map((keyword, idx) => (
                <span
                  key={idx}
                  className="flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-sm"
                >
                  {keyword}
                  <button
                    type="button"
                    className="ml-1 hover:text-red-500"
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
              className="w-full px-4 py-2 rounded-md border bg-white dark:bg-zinc-700 dark:border-zinc-600 focus:ring-2 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          {/* Submit Button */}
          <div className="text-right">
            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-3 rounded-lg font-medium 
              transition-all duration-300 cursor-pointer"
            >
              Upload Artifact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CollectionsUpload;
