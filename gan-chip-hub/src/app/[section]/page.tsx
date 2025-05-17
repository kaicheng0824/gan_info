// app/[section]/page.tsx
import { getArticles } from "@/lib/getArticles";
import Link from "next/link";

interface PageProps {
  params: {
    section: string;
  };
}

export async function generateStaticParams() {
  // Pre-render pages for these sections
  const sections = ["news", "groups", "companies"];
  return sections.map((section) => ({ section }));
}

export default function SectionPage({ params }: PageProps) {
  const { section } = params;
  const articles = getArticles(section);

  return (
    <main className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold capitalize mb-6">{section}</h1>
      {articles.length === 0 ? (
        <p>No articles found in this section.</p>
      ) : (
        <ul className="space-y-4">
          {articles.map(({ slug, metadata }) => (
            <li key={slug} className="border-b pb-2">
              <Link href={`/${section}/${slug}`} className="text-blue-600 hover:underline">
                {metadata.title}
              </Link>
              <p className="text-gray-500 text-sm">{metadata.date}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

