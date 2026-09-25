import type { ReactNode } from 'react';
export type MarketingLink = { label: string; href: string };
export type MarketingFeature = {
  title: string;
  description: string;
  icon?: ReactNode;
};
