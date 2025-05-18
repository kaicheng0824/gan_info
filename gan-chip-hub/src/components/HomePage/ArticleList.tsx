import React from 'react';
import Link from 'next/link';

interface Article {
  slug: string;
  metadata: Record<string, any>;
  content: string;
}

interface ArticleListProps {
  articles: Article[];
  activeTab: string;
}

export const ArticleList: React.FC<ArticleListProps> = ({ articles, activeTab }) => {
  return (
    <div className="space-y-6">
      {articles.map((article) => (
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
          <Link
            href={`/${activeTab}/${article.slug}`}
            className="inline-block mt-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            Read more →
          </Link>
        </article>
      ))}
    </div>
  );
};