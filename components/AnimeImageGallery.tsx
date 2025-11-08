"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Images } from "lucide-react";
import { ImageGalleryModal } from "@/components/ImageModal";
import { AnimePicture } from "@/lib/types/anime";

interface AnimeImageGalleryProps {
  pictures: AnimePicture[];
  animeTitle: string;
}

export function AnimeImageGallery({
  pictures,
  animeTitle,
}: AnimeImageGalleryProps) {
  // Helper function to get picture image with fallback (moved from server component)
  const getPictureImageSrc = (picture: AnimePicture): string => {
    return (
      picture.webp?.large_image_url ||
      picture.jpg?.large_image_url ||
      picture.webp?.image_url ||
      picture.jpg?.image_url ||
      "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNTAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0iY2VudHJhbCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZm9udC1mYW1pbHk9Im1vbm9zcGFjZSIgZm9udC1zaXplPSIyNnB4IiBmaWxsPSIjYzRjNGM0Ij5JbWFnZTwvdGV4dD48L3N2Zz4="
    );
  };
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!pictures || pictures.length === 0) return null;

  // Create gallery images array for the modal
  const galleryImages = pictures.map((picture, index) => ({
    src: getPictureImageSrc(picture),
    alt: `${animeTitle} screenshot ${index + 1}`,
  }));

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setModalOpen(true);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Images className="w-5 h-5" />
            <h3>Pictures & Screenshots</h3>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {pictures.slice(0, 12).map((picture, index) => (
              <div
                key={index}
                className="relative aspect-video overflow-hidden rounded-lg bg-muted hover:scale-105 transition-transform cursor-pointer group"
                onClick={() => handleImageClick(index)}
              >
                <Image
                  src={getPictureImageSrc(picture)}
                  alt={`${animeTitle} screenshot ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                />
                {/* Overlay to indicate it's clickable */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-2">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {pictures.length > 12 && (
            <p className="text-center text-muted-foreground mt-4">
              Showing 12 of {pictures.length} images. Click any image to view
              full gallery.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Image Gallery Modal */}
      <ImageGalleryModal
        images={galleryImages}
        initialIndex={selectedImageIndex}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
