"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, X, Loader2, Link as LinkIcon, Image as ImageIcon } from "lucide-react";

interface ImageUploadProps {
  defaultValue?: string;
  name?: string;
  onChange?: (url: string) => void;
}

export function ImageUpload({
  defaultValue = "",
  name = "imageUrl",
  onChange,
}: ImageUploadProps) {
  const [imageUrl, setImageUrl] = useState(defaultValue);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    if (onChange) onChange(url);
  };

  async function handleFile(file: File) {
    if (!file.type.startsWith("image/")) {
      setError("Please select an image file (JPG, PNG, WebP, GIF).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image size exceeds 5MB limit. Please choose a smaller image.");
      return;
    }

    setError("");
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to upload image.");
      }

      handleUrlChange(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  }

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = () => {
    setDragOver(false);
  };

  return (
    <div className="space-y-3">
      {/* Hidden input for form submission */}
      <input type="hidden" name={name} value={imageUrl} />

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {imageUrl ? (
        /* Image Preview Card */
        <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-white p-3 shadow-2xs">
          <div className="flex items-center gap-4">
            <div className="relative size-20 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 border border-slate-200">
              <Image
                src={imageUrl}
                alt="Product preview"
                fill
                sizes="80px"
                className="object-cover"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-semibold text-slate-800">
                Product Image
              </p>
              <p className="truncate text-[11px] text-slate-400 mt-0.5 max-w-sm">
                {imageUrl}
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Change image
                </button>
                <button
                  type="button"
                  onClick={() => handleUrlChange("")}
                  className="rounded-md px-2.5 py-1 text-xs font-semibold text-red-600 hover:bg-red-50 transition flex items-center gap-1"
                >
                  <X size={13} /> Remove
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Dropzone Card */
        <div
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !uploading && fileInputRef.current?.click()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition cursor-pointer ${
            dragOver
              ? "border-indigo-600 bg-indigo-50/50"
              : "border-slate-200 bg-slate-50/50 hover:border-slate-300 hover:bg-slate-50"
          }`}
        >
          {uploading ? (
            <div className="flex flex-col items-center py-2">
              <Loader2 size={32} className="animate-spin text-indigo-600" />
              <p className="mt-3 text-sm font-semibold text-slate-700">
                Uploading to cloud...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Saving image securely to Vercel Blob
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center py-2">
              <div className="grid size-12 place-items-center rounded-full bg-indigo-50 text-indigo-600 mb-3 shadow-2xs">
                <UploadCloud size={24} />
              </div>
              <p className="text-sm font-semibold text-slate-800">
                <span className="text-indigo-600 hover:underline">Click to upload</span> or drag and drop
              </p>
              <p className="mt-1 text-xs text-slate-400">
                PNG, JPG, WebP, GIF or SVG (max 5MB)
              </p>
            </div>
          )}
        </div>
      )}

      {/* Alternative URL Link toggle */}
      <div className="flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="inline-flex items-center gap-1 text-slate-500 hover:text-indigo-600 transition"
        >
          <LinkIcon size={12} />
          {showUrlInput ? "Hide image URL input" : "Or enter image URL manually"}
        </button>

        {imageUrl && (
          <span className="flex items-center gap-1 text-emerald-600 font-medium">
            <ImageIcon size={12} /> Ready
          </span>
        )}
      </div>

      {showUrlInput && (
        <div className="pt-1">
          <input
            type="url"
            value={imageUrl}
            onChange={(e) => handleUrlChange(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="w-full rounded-lg border border-slate-200 p-2.5 text-xs text-slate-800 outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200"
          />
        </div>
      )}

      {/* Error alert */}
      {error && (
        <div className="rounded-lg bg-red-50 p-2.5 text-xs text-red-700">
          {error}
        </div>
      )}
    </div>
  );
}
