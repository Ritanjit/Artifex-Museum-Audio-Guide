// src/components/imageUpload/UploadImage.tsx
import React, { FC, useState, useRef, ChangeEvent, DragEvent } from "react";
import { useToast } from "../../lib/contexts/ToastContext";
import { compressImage, uploadImage as apiUploadImage } from "../../apis/image";
import {
	CloudUpload,
	Trash2,
	Copy,
	CheckCircle,
	AlertCircle,
	X,
	Loader2,
	File,
	Image as ImageIcon
} from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface UploadImageProps {
	className?: string;
}

const UploadImage: FC<UploadImageProps> = ({ className = "" }) => {
	const { showToast } = useToast();
	const [file, setFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const [isUploading, setIsUploading] = useState(false);
	const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

	const fileInputRef = useRef<HTMLInputElement>(null);

	const [uploadProgress, setUploadProgress] = useState<number>(0);

	const openFileDialog = () => {
		fileInputRef.current?.click();
	};

	const handleFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
		const selectedFile = e.target.files?.[0] || null;
		prepareFile(selectedFile);
	};

	const handleDrop = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
		const dropped = e.dataTransfer.files?.[0] || null;
		prepareFile(dropped);
	};

	const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(true);
	};

	const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
		e.preventDefault();
		setIsDragging(false);
	};

	const prepareFile = (selectedFile: File | null) => {
		if (!selectedFile) return;

		// Validate file size (100MB max)
		if (selectedFile.size > 100 * 1024 * 1024) {
			showToast("File size exceeds 100MB limit", "error");
			return;
		}

		setFile(selectedFile);
		setUploadedUrl(null);

		if (selectedFile.type.startsWith("image/")) {
			const reader = new FileReader();
			reader.onload = (event) => {
				setPreviewUrl(event.target?.result as string);
			};
			reader.readAsDataURL(selectedFile);
		} else {
			setPreviewUrl(null);
		}
	};

	const handleUpload = async () => {
		if (!file) {
			showToast("No file selected!", "error");
			return;
		}
		setIsUploading(true);
		setUploadProgress(0); // Reset

		try {
			let uploadable: File = file;
			if (file.type.startsWith("image/")) {
				uploadable = await compressImage(file);
			}

			const getUploadFolder = (file: File): string => {
				if (file.type.startsWith("image/")) return "artifex/images";
				if (file.type.startsWith("application/pdf")) return "artifex/pdfs";
				if (file.type.startsWith("video/")) return "artifex/videos";
				if (file.type.startsWith("audio/")) return "artifex/audio";
				return "artifex/misc";
			};

			const result = await apiUploadImage(uploadable, getUploadFolder(file), (progressEvent) => {
				if (progressEvent.total) {
					const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
					setUploadProgress(percent);
				}
			});

			if (result) {
				setUploadedUrl(result);
				showToast("Upload successful!", "success");
			} else {
				throw new Error("No URL returned");
			}
		} catch (err) {
			console.error(err);
			showToast("Upload failed. Try again.", "error");
		} finally {
			setIsUploading(false);
		}
	};

	const handleReset = () => {
		setFile(null);
		setPreviewUrl(null);
		setUploadedUrl(null);
		setIsUploading(false);
		if (fileInputRef.current) fileInputRef.current.value = "";
	};

	const copyToClipboard = () => {
		if (!uploadedUrl) return;
		const full = import.meta.env.VITE_IMAGE_URL + uploadedUrl;
		navigator.clipboard.writeText(full).then(
			() => showToast("Copied to clipboard!", "success"),
			() => showToast("Copy failed.", "error")
		);
	};

	const formatFileSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`;
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
	};

	return (
		<div className={`max-w-2xl mx-auto ${className}`}>
			{/* Upload Card */}
			<Card className="bg-white dark:bg-gray-900 border border-red-200 dark:border-gray-700 shadow-md">
				<CardHeader>
					<CardTitle className="text-red-900 dark:text-amber-500 flex items-center gap-2">
						<CloudUpload size={24} />
						Upload Files
					</CardTitle>
				</CardHeader>

				<CardContent>
					{/* Drop Zone */}
					{!file && (
						<div
							className={`
                                border-2 rounded-xl p-8 text-center cursor-pointer transition-all
                                ${isDragging
									? "border-red-900 dark:border-amber-500 bg-red-50 dark:bg-gray-800"
									: "border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"}
                            `}
							onClick={openFileDialog}
							onDrop={handleDrop}
							onDragOver={handleDragOver}
							onDragLeave={handleDragLeave}
						>
							<div className="flex flex-col items-center justify-center space-y-3">
								<div className="p-4 bg-red-100 dark:bg-red-900/20 rounded-full">
									<CloudUpload
										size={40}
										className="text-red-900 dark:text-red-300"
									/>
								</div>
								<h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
									{isDragging ? "Drop your file here" : "Drag & drop or click to browse"}
								</h3>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									Supports: PNG, JPG, GIF, PDF, and more (max 100MB)
								</p>
							</div>
							<input
								ref={fileInputRef}
								type="file"
								onChange={handleFileSelect}
								className="hidden"
							/>
						</div>
					)}

					{/* File Preview Section */}
					{file && !uploadedUrl && (
						<div className="space-y-6">
							<div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
								{previewUrl ? (
									<div className="relative group">
										<img
											src={previewUrl}
											alt="Preview"
											className="w-full h-64 object-contain bg-white dark:bg-gray-800"
										/>
										<button
											onClick={handleReset}
											className="absolute top-2 right-2 p-2 bg-white/80 dark:bg-gray-800/80 rounded-full shadow-md hover:bg-white dark:hover:bg-gray-700 transition-all"
										>
											<X size={18} className="text-gray-700 dark:text-gray-300" />
										</button>
									</div>
								) : (
									<div className="w-full h-64 bg-gray-100 dark:bg-gray-800 flex flex-col items-center justify-center p-6">
										<div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full mb-4">
											<File size={32} className="text-red-900 dark:text-red-300" />
										</div>
										<h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-1">
											{file.name}
										</h3>
										<p className="text-sm text-gray-500 dark:text-gray-400">
											{formatFileSize(file.size)}
										</p>
									</div>
								)}
							</div>

							<div className="space-y-4">
								<div className="grid grid-cols-2 gap-4">
									<button
										onClick={handleReset}
										className="flex items-center justify-center gap-2 border border-gray-300 dark:border-gray-600 rounded-lg py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
									>
										<X size={18} />
										Cancel
									</button>
									<button
										onClick={handleUpload}
										disabled={isUploading}
										className={`
				flex items-center justify-center gap-2 rounded-lg py-2.5 transition-colors
				${isUploading
												? "bg-red-800 cursor-not-allowed"
												: "bg-red-900 hover:bg-red-800 dark:bg-amber-600 dark:hover:bg-amber-500"}
				text-white
			`}
									>
										{isUploading ? (
											<>
												<Loader2 size={18} className="animate-spin" />
												Uploading...
											</>
										) : (
											<>
												<CloudUpload size={18} />
												Upload Now
											</>
										)}
									</button>
								</div>

								{/* Progress Bar */}
								{isUploading && (
									<div className="w-full">
										<div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded overflow-hidden">
											<div
												className="bg-red-800 dark:bg-amber-500 h-full transition-all duration-200"
												style={{ width: `${uploadProgress}%` }}
											/>
										</div>
										<p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-1">
											Uploading... {uploadProgress}%
										</p>
									</div>
								)}
							</div>

						</div>
					)}

					{/* Upload Success Section */}
					{uploadedUrl && (
						<div className="space-y-6">
							<div className="border border-green-200 dark:border-green-900/50 rounded-lg overflow-hidden">
								{previewUrl ? (
									<div className="relative group">
										<img
											src={import.meta.env.VITE_IMAGE_URL + uploadedUrl}
											alt="Uploaded"
											className="w-full h-64 object-contain bg-white dark:bg-gray-800"
										/>
										<div className="absolute inset-0 bg-black/10 dark:bg-white/5 group-hover:opacity-100 opacity-0 transition-opacity flex items-center justify-center">
											<button
												onClick={copyToClipboard}
												className="p-3 bg-white dark:bg-gray-800 rounded-full shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
												title="Copy URL"
											>
												<Copy size={20} className="text-gray-700 dark:text-gray-300" />
											</button>
										</div>
									</div>
								) : (
									<div className="w-full h-64 bg-green-50 dark:bg-green-900/10 flex flex-col items-center justify-center p-6">
										<CheckCircle
											size={48}
											className="text-green-600 dark:text-green-300 mb-4"
										/>
										<h3 className="text-lg font-medium text-green-700 dark:text-green-300 mb-1">
											File Uploaded Successfully
										</h3>
									</div>
								)}
							</div>

							<div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
								<div className="flex items-center justify-between mb-2">
									<h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
										File URL
									</h4>
									<button
										onClick={copyToClipboard}
										className="text-sm flex items-center gap-1 text-red-900 dark:text-amber-500 hover:underline"
									>
										<Copy size={16} />
										Copy
									</button>
								</div>
								<div className="relative">
									<input
										type="text"
										readOnly
										value={import.meta.env.VITE_IMAGE_URL + uploadedUrl}
										className="w-full p-2 pr-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded text-sm text-gray-700 dark:text-gray-300 truncate"
									/>
								</div>
							</div>

							<button
								onClick={handleReset}
								className="w-full bg-red-900 hover:bg-red-800 dark:bg-amber-600 dark:hover:bg-amber-500 text-white py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
							>
								<CloudUpload size={18} />
								Upload Another File
							</button>
						</div>
					)}
				</CardContent>

				{/* Help Text */}
				<CardFooter className="text-xs text-gray-500 dark:text-gray-400">
					Files are securely stored and accessible via the generated URL.
				</CardFooter>
			</Card>
		</div>
	);
};

export default UploadImage;
