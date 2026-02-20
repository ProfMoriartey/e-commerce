"use client";

import { useState } from "react";
import Image from "next/image";

export function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const fallbackImage = "https://via.placeholder.com/800";
  const displayImages = images && images.length > 0 ? images : [fallbackImage];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
        <Image
          src={displayImages[activeIndex] || fallbackImage}
          alt="Product image"
          fill
          className="object-cover"
          priority
        />
      </div>

      {displayImages.length > 1 && (
        <div className="scrollbar-hide flex gap-4 overflow-x-auto pb-2">
          {displayImages.map((image, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex h-24 w-24 shrink-0 overflow-hidden rounded-md border-2 bg-stone-100 transition-colors focus:outline-none ${
                activeIndex === index
                  ? "border-stone-900"
                  : "border-transparent hover:border-stone-300"
              }`}
            >
              <Image
                src={image || fallbackImage}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
