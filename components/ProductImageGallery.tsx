'use client';

import { useState } from 'react';
import Image from 'next/image';

const PLACEHOLDER =
  'https://images.pexels.com/photos/4489733/pexels-photo-4489733.jpeg?auto=compress&cs=tinysrgb&w=1200';

interface ProductImageGalleryProps {
  images: string[];
  alt: string;
}

export default function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const all = images.length > 0 ? images : [PLACEHOLDER];
  const [selected, setSelected] = useState(0);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative h-96 bg-gray-200">
        <Image
          src={all[selected]!}
          alt={alt}
          fill
          className="object-cover"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
        />
      </div>
      {all.length > 1 && (
        <div className="flex gap-2 p-3 overflow-x-auto bg-gray-50">
          {all.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setSelected(i)}
              className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-colors ${
                selected === i ? 'border-primary-600' : 'border-transparent hover:border-gray-300'
              }`}
            >
              <Image
                src={url}
                alt={`${alt} - image ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
