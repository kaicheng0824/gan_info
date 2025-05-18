"use client";
import { useState, useEffect } from "react";
import { getArticles } from "@/lib/getArticles";
import dynamic from "next/dynamic";
import { 
  Header, 
  TabNavigation, 
  ArticleList, 
  GalleryGrid, 
  ImageModal,
  ContentSection,
} from "@/src/components/HomePage";

// Import MapView dynamically with SSR disabled
const MapView = dynamic(
  () => import("@/src/components/HomePage/MapView"),
  { 
    ssr: false,
    loading: () => (
      <div className="h-[70vh] w-full rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
        Loading Map...
      </div>
    )
  }
);

interface Article {
  slug: string;
  metadata: Record<string, any>;
  content: string;
}

const tabs = [
  { key: "news", label: "Latest News" },
  { key: "conference", label: "Conference Summaries" },
  { key: "companies", label: "Companies" },
  { key: "applications", label: "Applications" },
  { key: "gallery", label: "GaN Chip Gallery" },
  { key: "fundamentals", label: "Fundamentals / Circuits / Design Methodology" },
  { key: "reddit", label: "Reddit Discussions" },
  { key: "worldmap", label: "World Map" }
];

const tabContentPlaceholders: Record<string, string> = {
  news: "Loading latest news...",
  conference: "Fetching research group information...",
  companies: "Getting company profiles...",
  applications: "Exploring GaN applications...",
  gallery: "Loading GaN chip images...",
  fundamentals: "Fetching fundamental concepts...",
  reddit: "Fetching fundamental concepts...",
  worldmap: "Loading world map...",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("news");
  const [articles, setArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticlesForTab = async (tabKey: string) => {
      if (tabKey === "worldmap") return; // Skip fetching for worldmap
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

  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <Header 
        title="GaN Chip Design Hub" 
        subtitle="Your source for GaN chip insights and developments" 
      />

      <TabNavigation 
        tabs={tabs} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />

      <ContentSection
        title={currentTabLabel || ''}
        isLoading={currentLoading}
        error={currentError || null}
        placeholder={tabContentPlaceholders[activeTab] || 'Loading...'}
        isEmpty={currentArticles.length === 0}
      >
        {activeTab === "gallery" ? (
          <GalleryGrid 
            articles={currentArticles} 
            onImageSelect={setSelectedImage} 
          />
        ) : activeTab === "worldmap" ? (
          <MapView />
        ) : (
          <ArticleList 
            articles={currentArticles} 
            activeTab={activeTab} 
          />
        )}
      </ContentSection>

      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </main>
  );
}