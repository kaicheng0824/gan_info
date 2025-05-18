import React from 'react';

interface HeaderProps {
  title: string;
  subtitle: string;
}

export const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <header className="text-center space-y-2">
      <h1 className="text-4xl font-bold">{title}</h1>
      <p className="text-4xl text-lg">{subtitle}</p>
    </header>
  );
};