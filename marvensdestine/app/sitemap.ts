import type { MetadataRoute } from 'next';
import { projectsData, nftProjectsData } from '@/lib/projectData';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: new Date(), changeFrequency: 'weekly', priority: 1 },
    { url: `${base}/portfolio`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.9 },
    { url: `${base}/discovery`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
  ];

  const projectRoutes: MetadataRoute.Sitemap = [
    ...projectsData.map(p => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...nftProjectsData.map(p => ({
      url: `${base}/projects/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];

  return [...staticRoutes, ...projectRoutes];
}


