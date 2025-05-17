"use client";
import { useState, useEffect } from "react";
import { getArticles } from "@/lib/getArticles";

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
];

const tabContentPlaceholders: Record<string, string> = {
  news: "Loading latest news...",
  groups: "Fetching research group information...",
  companies: "Getting company profiles...",
  applications: "Exploring GaN applications...",
  gallery: "Loading GaN chip images...",
  fundamentals: "Fetching fundamental concepts...",
};

export default function HomePage() {
  const [activeTab, setActiveTab] = useState("news");
  const [articles, setArticles] = useState<Record<string, Article[]>>({});
  const [loading, setLoading] = useState<Record<string, boolean>>({});
  const [error, setError] = useState<Record<string, string | null>>({});

  // Add a state to track which tabs have been fetched
  const [fetchedTabs, setFetchedTabs] = useState<Set<string>>(new Set());

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

  }, [activeTab, articles]); // Dependency array includes articles to prevent infinite loop, but only fetch if articles for tab change.

  const currentTabLabel = tabs.find((t) => t.key === activeTab)?.label;
  const currentArticles = articles[activeTab] || [];
  const currentLoading = loading[activeTab];
  const currentError = error[activeTab];


  return (
    <main className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold">GaN Chip Design Hub</h1>
        <p className="text-gray-600 text-lg">
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
        <h2 className="text-2xl font-semibold mb-4">
            {currentTabLabel}
        </h2>
        {currentLoading && <p className="text-gray-700">{tabContentPlaceholders[activeTab]}</p>}
        {currentError && <p className="text-red-500">{currentError}</p>}

        {!currentLoading && !currentError && currentArticles.length > 0 && (
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
        )}
        {!currentLoading && !currentError && currentArticles.length === 0 && (
            <p className="text-gray-700">No articles found for this section.</p>
        )}
      </section>
    </main>
  );
}

