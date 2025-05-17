// app/[section]/[slug]/page.tsx
import { getArticle } from "@/lib/getArticles";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from 'react-markdown';
import 'github-markdown-css';

interface PageProps {
  params: {
    section: string;
    slug: string;
  };
}

export default async function ArticlePage({ params }: PageProps) {
  const { section, slug } = params;
  const article = await getArticle(section, slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <Link href={`/`} className="text-blue-600 hover:underline">
          &larr; Back to Home
        </Link>
      </div>
      
      <h1 className="text-4xl font-bold mb-4">{article.metadata.title}</h1>
      
      {article.metadata.date && (
        <p className="text-gray-500 mb-6">
          Published: {new Date(article.metadata.date).toLocaleDateString()}
        </p>
      )}
      
      {article.metadata.author && (
        <p className="text-gray-700 mb-6">By: {article.metadata.author}</p>
      )}
      
      <article className="markdown-body">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </article>
    </main>
  );
}