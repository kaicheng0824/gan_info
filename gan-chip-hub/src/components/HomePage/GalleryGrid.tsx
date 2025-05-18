import React from 'react';
import Image from 'next/image';

interface Article {
  slug: string;
  metadata: Record<string, any>;
  content: string;
}

interface GalleryGridProps {
  articles: Article[];
  onImageSelect: (imageUrl: string) => void;
}

export const GalleryGrid: React.FC<GalleryGridProps> = ({ articles, onImageSelect }) => {
  const extractFirstImageFromContent = (content: string): string | null => {
    const imgRegex = /!\[.*?\]\((.*?)\)/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  };

  if (articles.length === 0) {
    return <p className="text-gray-700">No images found in the gallery.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {articles.map((article) => {
        const imageUrl = article.metadata?.image || 
                        extractFirstImageFromContent(article.content);
        
        return (
          <div 
            key={article.slug} 
            className="group relative cursor-pointer flex flex-col"
            onClick={() => imageUrl && onImageSelect(imageUrl)}
          >
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-100 flex items-center justify-center">
              {imageUrl ? (
                <div className="w-full h-full flex items-center justify-center p-2">
                  <Image
                    src={imageUrl}
                    alt={article.metadata?.title || "GaN Chip Image"}
                    width={400}
                    height={400}
                    className="object-contain w-full h-full transition-transform group-hover:scale-105"
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No Image Available
                </div>
              )}
            </div>
            <div className="mt-2">
              <h3 className="font-medium text-gray-900">
                {article.metadata?.title || article.slug}
              </h3>
              {article.metadata?.description && (
                <p className="text-sm text-gray-500">
                  {article.metadata.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};