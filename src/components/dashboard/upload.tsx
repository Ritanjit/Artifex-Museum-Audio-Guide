// src/pages/CollectionsUpload.tsx
import React, { useState } from "react";

const CollectionsUpload: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [artifactName, setArtifactName] = useState("");
  const [artifactType, setArtifactType] = useState("");
  const [collectionCategory, setCollectionCategory] = useState("");

  const artifactTypes = ["Weapon", "Manuscript", "Royal Attire", "Tool", "Architecture"];
  const collectionCategories = ["Ahom Dynasty", "Folk Traditions", "Royal Seals", "Language & Scripts"];

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Artifact Name:", artifactName);
    console.log("Type:", artifactType);
    console.log("Category:", collectionCategory);
    console.log("Image Preview URL:", imagePreview);
    alert("Dummy data submitted successfully!");
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Upload to Collections</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload and Preview */}
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-full sm:w-1/2">
            <label className="block font-medium text-gray-700 mb-2">Upload Artifact Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="file-input file-input-bordered w-full file:bg-amber-500 file:text-white file:border-none file:rounded-md"
            />
          </div>

          <div className="w-full sm:w-1/2">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="rounded-lg shadow-md w-full h-48 object-cover border border-gray-300"
              />
            ) : (
              <div className="flex items-center justify-center h-48 border-2 border-dashed rounded-md text-gray-400">
                Image Preview
              </div>
            )}
          </div>
        </div>

        {/* Artifact Name */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Artifact Name</label>
          <input
            type="text"
            value={artifactName}
            onChange={(e) => setArtifactName(e.target.value)}
            placeholder="e.g. Royal Sword of Sukapha"
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          />
        </div>

        {/* Artifact Type Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Artifact Type</label>
          <select
            value={artifactType}
            onChange={(e) => setArtifactType(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
            required
          >
            <option value="">Select Type</option>
            {artifactTypes.map((type, index) => (
              <option key={index} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Collection Category Dropdown */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">Collection Category</label>
          <select
            value={collectionCategory}
            onChange={(e) => setCollectionCategory(e.target.value)}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
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

        {/* Submit Button */}
        <button
          type="submit"
          className="bg-amber-500 text-white px-6 py-2 rounded-md hover:bg-amber-600 transition"
        >
          Upload Collection
        </button>
      </form>
    </div>
  );
};

export default CollectionsUpload;
