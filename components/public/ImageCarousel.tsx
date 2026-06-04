"use client";

import Image from "next/image";
import { useState } from "react";

type ImageCarouselProps = {
  images: string[];
  alt: string;
};

/**
 * Gallery UI matching the PHP slider layout. Uses mock images only;
 * full carousel logic will be finalized when real uploads are wired.
 */
export function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [index, setIndex] = useState(0);

  if (images.length === 0) {
    return <p className="text-[#4b3621]">No images available.</p>;
  }

  const total = images.length;
  const canPrev = index > 0;
  const canNext = index < total - 1;

  return (
    <div className="space-y-3">
      <div className="relative mx-auto h-96 w-full max-w-3xl overflow-hidden rounded-lg shadow">
        <div
          className="flex h-full transition-transform duration-500 ease-in-out"
          style={{
            width: `${total * 100}%`,
            transform: `translateX(-${(100 / total) * index}%)`,
          }}
        >
          {images.map((src, i) => (
            <div
              key={`${src}-${i}`}
              className="relative h-full shrink-0"
              style={{ width: `${100 / total}%` }}
            >
              <Image
                src={src}
                alt={`${alt} — photo ${i + 1}`}
                fill
                className="object-contain"
                sizes="(max-width: 768px) 100vw, 768px"
                priority={i === 0}
              />
            </div>
          ))}
        </div>

        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="Previous image"
              disabled={!canPrev}
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/80 p-3 text-[#5C4033] shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#8B2C2C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft />
            </button>
            <button
              type="button"
              aria-label="Next image"
              disabled={!canNext}
              onClick={() => setIndex((i) => Math.min(total - 1, i + 1))}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full border border-gray-300 bg-white/80 p-3 text-[#5C4033] shadow-md backdrop-blur-md transition hover:bg-white hover:text-[#8B2C2C] disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <p className="text-center text-sm text-[#4b3621]">
          {index + 1} of {total}
        </p>
      )}
    </div>
  );
}

function ChevronLeft() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M15 19l-7-7 7-7"
      />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 5l7 7-7 7"
      />
    </svg>
  );
}
