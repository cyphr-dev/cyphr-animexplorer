"use client";

import { useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { ImageModal } from "@/components/ImageModal";
import { Anime } from "@/lib/types/anime";

interface ClickablePosterProps {
  anime: Anime;
}

export function ClickablePoster({ anime }: ClickablePosterProps) {
  const [modalOpen, setModalOpen] = useState(false);

  const posterSrc =
    anime.images.webp.large_image_url || anime.images.jpg.large_image_url;
  const fullResSrc =
    anime.images.webp.large_image_url || anime.images.jpg.large_image_url;

  return (
    <>
      <Card
        className="overflow-hidden p-0 cursor-pointer group"
        onClick={() => setModalOpen(true)}
      >
        <div className="relative aspect-3/4 w-full">
          <Image
            src={posterSrc}
            alt={anime.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            priority
            sizes="(max-width: 1024px) 100vw, 33vw"
          />
          {/* Overlay to indicate it's clickable */}
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/60 rounded-full p-3">
              <svg
                className="w-8 h-8 text-white"
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
      </Card>

      {/* Image Modal */}
      <ImageModal
        src={fullResSrc}
        alt={`${anime.title} poster`}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </>
  );
}
