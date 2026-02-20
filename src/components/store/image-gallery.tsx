"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "~/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from "~/components/ui/carousel";

export function ImageGallery({ images }: { images: string[] }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselApi, setCarouselApi] = useState<CarouselApi>();

  const fallbackImage =
    "https://via.https://2ryc0965uu.ufs.sh/f/4eZ295a0yxSvv715LWVYlHGwm1E7g0NJYAURF4WPncp6rt2h";
  const safeImages =
    Array.isArray(images) && images.length > 0 ? images : [fallbackImage];
  const hasMultiple = safeImages.length > 1;

  function showNextImage() {
    setActiveIndex((current) => {
      const next = current === safeImages.length - 1 ? 0 : current + 1;
      carouselApi?.scrollTo(next);
      return next;
    });
  }

  function showPreviousImage() {
    setActiveIndex((current) => {
      const prev = current === 0 ? safeImages.length - 1 : current - 1;
      carouselApi?.scrollTo(prev);
      return prev;
    });
  }

  function handleThumbnailClick(index: number) {
    setActiveIndex(index);
    carouselApi?.scrollTo(index);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="group relative aspect-square w-full overflow-hidden rounded-lg bg-stone-100">
        <Image
          src={safeImages[activeIndex] || fallbackImage}
          alt={`Product preview ${activeIndex + 1}`}
          fill
          className="object-cover"
          priority
        />

        {hasMultiple && (
          <>
            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 left-4 -translate-y-1/2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              onClick={showPreviousImage}
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5 text-stone-900" />
            </Button>

            <Button
              variant="secondary"
              size="icon"
              className="absolute top-1/2 right-4 -translate-y-1/2 opacity-0 shadow-sm transition-opacity group-hover:opacity-100"
              onClick={showNextImage}
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5 text-stone-900" />
            </Button>
          </>
        )}
      </div>

      {hasMultiple && (
        <div className="px-12">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2">
              {safeImages.map((image, index) => (
                <CarouselItem
                  key={`${image}-${index}`}
                  className="basis-1/4 pl-2 lg:basis-1/5"
                >
                  <button
                    onClick={() => handleThumbnailClick(index)}
                    className={`relative flex aspect-square h-24 w-full shrink-0 overflow-hidden rounded-md border-2 bg-stone-100 transition-colors focus:outline-none ${
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
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      )}
    </div>
  );
}
