import React from 'react';

interface ContentSectionProps {
  title: string;
  isLoading: boolean;
  error: string | null;
  placeholder: string;
  isEmpty: boolean;
  children: React.ReactNode;
}

export const ContentSection: React.FC<ContentSectionProps> = ({ 
  title, 
  isLoading, 
  error, 
  placeholder, 
  isEmpty, 
  children 
}) => {
  return (
    <section className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl text-gray-700 font-semibold mb-4">
        {title}
      </h2>
      {isLoading && <p className="text-gray-700">{placeholder}</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && !isEmpty && children}
      {!isLoading && !error && isEmpty && (
        <p className="text-gray-700">No articles found for this section.</p>
      )}
    </section>
  );
};