// lib/getArticles.ts
import matter from "gray-matter";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

export async function getArticles(section: string) {
  try {
    const response = await fetch(`${BASE_URL}/content/${section}/_list.json`);
    if (!response.ok) throw new Error(`Failed to fetch file list for ${section}`);
    
    const filenames = await response.json();
    
    const articles = await Promise.all(
      filenames.map(async (filename: string) => {
        const fileResponse = await fetch(`${BASE_URL}/content/${section}/${filename}`);
        if (!fileResponse.ok) throw new Error(`Failed to fetch ${filename}`);
        const fileContents = await fileResponse.text();
        const { data, content } = matter(fileContents);
        return {
          slug: filename.replace(/\.md$/, ""),
          metadata: data,
          content,
        };
      })
    );
    
    return articles;
  } catch (error) {
    console.error(`Error loading articles for ${section}:`, error);
    throw error;
  }
}

export async function getArticle(section: string, slug: string) {
  try {
    const response = await fetch(`${BASE_URL}/content/${section}/${slug}.md`);
    if (!response.ok) return null;
    
    const fileContents = await response.text();
    const { data: metadata, content } = matter(fileContents);
    
    return {
      slug,
      metadata,
      content,
    };
  } catch (error) {
    console.error(`Error loading article ${section}/${slug}:`, error);
    throw error;
  }
}