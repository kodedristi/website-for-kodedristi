"use client";

import { useState } from "react";
import { pickerButtonClass } from "@/components/admin/media-picker";

const inputClasses =
  "focus-ring w-full rounded-xl border-[0.5px] border-border bg-background px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus-visible:border-brand-blue";

/** Same test the public rail uses: YouTube/Vimeo links are embeds, not files,
 *  so there is nothing a `<video>` preview could play. */
function isEmbedLink(url: string): boolean {
  return /youtube\.com|youtu\.be|vimeo\.com/.test(url);
}

type UploadTarget = {
  mode: "signed" | "local";
  uploadUrl: string;
  publicUrl: string;
};

/** PUT with progress — `fetch` cannot report upload progress, and a 40 MB
 *  clip with no feedback looks like a hang. */
function putWithProgress(
  url: string,
  body: XMLHttpRequestBodyInit,
  onProgress: (fraction: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) onProgress(e.loaded / e.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) return resolve();
      let detail = "";
      try {
        const parsed = JSON.parse(xhr.responseText);
        detail = parsed?.error || parsed?.message || "";
      } catch {
        /* non-JSON body */
      }
      if (xhr.status === 413) {
        detail = "The storage service rejected the file as too large. Compress the video, or raise the file size limit in Supabase Storage settings.";
      }
      reject(new Error(detail || `Upload failed (${xhr.status}).`));
    };
    xhr.onerror = () => reject(new Error("Network error during upload."));
    xhr.send(body);
  });
}

/**
 * Video field for the content editor: upload a clip, or paste a link.
 *
 * Uploading and pasting write to the same value, so a YouTube/Vimeo link
 * (which the public rail also supports) keeps working exactly as before.
 */
export function VideoField({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (url: string) => void;
  placeholder?: string;
}) {
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const uploading = progress !== null;

  async function upload(file: File) {
    setError(null);
    setProgress(0);
    try {
      const init = await fetch("/api/admin/uploads/video", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ name: file.name, type: file.type, size: file.size }),
      });
      const target = (await init.json().catch(() => ({}))) as Partial<UploadTarget> & {
        error?: string;
      };
      if (!init.ok || !target.uploadUrl || !target.publicUrl) {
        throw new Error(target.error || "Could not start the upload.");
      }

      let body: XMLHttpRequestBodyInit = file;
      if (target.mode === "signed") {
        // Supabase's signed-upload endpoint takes the SDK's multipart shape.
        const form = new FormData();
        form.append("cacheControl", "31536000");
        form.append("", file);
        body = form;
      }
      await putWithProgress(target.uploadUrl, body, setProgress);

      onChange(target.publicUrl);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setProgress(null);
    }
  }

  return (
    <div className="flex flex-col gap-3">
      {value && !isEmbedLink(value) && (
        <video
          key={value}
          src={value}
          controls
          preload="metadata"
          playsInline
          className="aspect-9/16 w-40 rounded-xl border-[0.5px] border-border bg-black object-cover"
        />
      )}

      <div className="flex flex-wrap items-center gap-2">
        <label
          className={`${pickerButtonClass} ${uploading ? "pointer-events-none opacity-60" : ""}`}
        >
          {uploading ? "Uploading…" : value ? "Replace video" : "Upload video"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
            disabled={uploading}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) void upload(f);
              // Cleared so re-picking the same file fires onChange again.
              e.target.value = "";
            }}
            className="hidden"
          />
        </label>
        {value && !uploading && (
          <button type="button" onClick={() => onChange("")} className={pickerButtonClass}>
            Remove
          </button>
        )}
      </div>

      {uploading && (
        <div
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round((progress ?? 0) * 100)}
          aria-label="Video upload progress"
          className="flex items-center gap-3"
        >
          <div className="h-1.5 w-56 overflow-hidden rounded-full bg-border">
            <div
              className="h-full rounded-full bg-brand-blue transition-[width] duration-200"
              style={{ width: `${Math.round((progress ?? 0) * 100)}%` }}
            />
          </div>
          <span className="text-xs tabular-nums text-text-muted">
            {Math.round((progress ?? 0) * 100)}%
          </span>
        </div>
      )}
      {error && <div className="text-xs text-red-500">{error}</div>}

      {/* Escape hatch: a hosted file or a YouTube/Vimeo link. */}
      <input
        id={id}
        type="text"
        inputMode="url"
        className={inputClasses}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? "…or paste a video link (MP4, YouTube, Vimeo)"}
      />
    </div>
  );
}
