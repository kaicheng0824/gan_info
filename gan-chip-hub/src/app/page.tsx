"use client";
import { useState, useEffect } from "react";
import { getArticles } from "@/lib/getArticles";
import Image from "next/image"; // Make sure to import Next.js Image component

interface Article {
  slug: string;
  metadata: Record<string, any>;
  content: string;
}

const tabs = [
  { key: "news", label: "Latest News" },
  { key: "groups", label: "Research Groups" },
  { key: "companies", label: "Companies" },
  { key: "applications", label: "Applications" },
  { key: "gallery", label: "GaN Chip Gallery" },
  { key: "fundamentals", label: "Fundamentals / Circuits / Design Methodology" },
  { key: "reddit", label: "Reddit Discussions" }
];

const tabContentPlaceholders: Record<string, string> = {
  news: "Loading latest news...",
  groups: "Fetching research group information...",
  companies: "Getting company profiles...",
  applications: "Exploring GaN applications...",
  gallery: "Loading GaN chip images...",
  fundamentals: "Fetching fundamental concepts...",
  reddit: "Fetching fundamental concepts...",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("news");
  const [articles, setArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticlesForTab = async (tabKey: string) => {
        if (articles[tabKey]) return; // prevent duplicate fetches

        setLoading(prev => ({...prev, [tabKey]: true}));
        setError(prev => ({...prev, [tabKey]: null}));

        try {
            const fetchedArticles = await getArticles(tabKey);
            setArticles(prev => ({...prev, [tabKey]: fetchedArticles}));
        } catch (e: any) {
            setError(prev => ({...prev, [tabKey]: `Error loading ${tabKey}: ${e.message}`}));
        } finally {
            setLoading(prev => ({...prev, [tabKey]: false}));
        }
    }

    fetchArticlesForTab(activeTab);
  }, [activeTab, articles]);

  const currentTabLabel = tabs.find((t) => t.key === activeTab)?.label;
  const currentArticles = articles[activeTab] || [];
  const currentLoading = loading[activeTab];
  const currentError = error[activeTab];

  const renderGalleryContent = () => {
    if (currentArticles.length === 0) {
      return <p className="text-gray-700">No images found in the gallery.</p>;
    }
  
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentArticles.map((article) => {
          const imageUrl = article.metadata?.image || 
                          extractFirstImageFromContent(article.content);
          
          return (
            <div 
              key={article.slug} 
              className="group relative cursor-pointer flex flex-col"
              onClick={() => setSelectedImage(imageUrl)}
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
  
  // Helper function to extract first image from markdown content
  function extractFirstImageFromContent(content: string): string | null {
    const imgRegex = /!\[.*?\]\((.*?)\)/;
    const match = content.match(imgRegex);
    return match ? match[1] : null;
  }
  

  // Function to render regular article content
  const renderArticleContent = () => {
    return (
      <div className="space-y-6">
        {currentArticles.map((article) => (
          <article key={article.slug} className="border-b pb-4 last:border-b-0">
            <h3 className="text-xl font-semibold mb-2">
              {article.metadata?.title || article.slug}
            </h3>
            {article.metadata?.date && (
              <p className="text-sm text-gray-500">
                {new Date(article.metadata.date).toLocaleDateString()}
              </p>
            )}
            <p className="text-gray-700">
              {article.metadata?.excerpt || article.content.substring(0, 200)}...
            </p>
            <a
              href={`/${activeTab}/${article.slug}`}
              className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
            >
              Read more →
            </a>
          </article>
        ))}
      </div>
    );
  };

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">GaN Chip Design Hub</h1>
        <p className="text-4xl text-lg">
          Your source for GaN chip insights and developments
        </p>
      </header>

      <nav className="flex flex-wrap justify-center gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 rounded-full text-sm font-medium ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-2xl text-gray-700 font-semibold mb-4">
          {currentTabLabel}
        </h2>
        {currentLoading && <p className="text-gray-700">{tabContentPlaceholders[activeTab]}</p>}
        {currentError && <p className="text-red-500">{currentError}</p>}

        {!currentLoading && !currentError && currentArticles.length > 0 && (
          <>
            {activeTab === "gallery" ? renderGalleryContent() : renderArticleContent()}
          </>
        )}
        {!currentLoading && !currentError && currentArticles.length === 0 && (
          <p className="text-gray-700">No articles found for this section.</p>
        )}
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <button 
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedImage(null);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <Image
              src={selectedImage}
              alt="Expanded GaN Chip Image"
              width={1200}
              height={800}
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </main>
  );
}