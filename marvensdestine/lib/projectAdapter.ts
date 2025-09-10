import { ProjectData, NFTProjectData, MediaItem } from '@/lib/projectData';

type AnyProject = Partial<ProjectData & NFTProjectData> & { type?: '3d'|'nft'; slug?: string };

export function adaptProject(doc: Record<string, unknown>): AnyProject {
  if (!doc) return {};
  const p = { ...doc } as Record<string, unknown>;
  // Normalize media
  const normGallery: MediaItem[] = Array.isArray(p.gallery) ? (p.gallery as unknown[]).map((m) => {
    const mm = m as Record<string, unknown>;
    const src = (mm.src as string) || (mm.url as string) || '';
    const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
    return {
      type: (mm.type as 'image'|'video') || (isVideo ? 'video' : 'image'),
      src,
      alt: (mm.alt as string) || '',
      caption: (mm.caption as string) || '',
    };
  }) : [];

  const normProcess = Array.isArray(p.process) ? (p.process as unknown[]).map((step) => {
    const st = step as Record<string, unknown>;
    const mediaArr: MediaItem[] = Array.isArray(st.media) ? (st.media as unknown[]).map((m) => {
      const mm = m as Record<string, unknown>;
      const src = (mm.src as string) || (mm.url as string) || '';
      const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
      return { type: (mm.type as 'image'|'video') || (isVideo ? 'video' : 'image'), src, alt: (mm.alt as string) || '' };
    }) : [];
    return {
      title: (st.title as string) || '',
      description: (st.description as string) || '',
      media: mediaArr,
    };
  }) : [];

  const normShowcase = Array.isArray(p.artworkShowcase) ? (p.artworkShowcase as unknown[]).map((s) => {
    const ss = s as Record<string, unknown>;
    const mediaArr: MediaItem[] = Array.isArray(ss.media) ? (ss.media as unknown[]).map((m) => {
      const mm = m as Record<string, unknown>;
      const src = (mm.src as string) || (mm.url as string) || '';
      const isVideo = /\.(mp4|webm|mov)(\?.*)?$/i.test(src);
      return { type: (mm.type as 'image'|'video') || (isVideo ? 'video' : 'image'), src, alt: (mm.alt as string) || '' };
    }) : [];
    return {
      title: (ss.title as string) || '',
      description: (ss.description as string) || '',
      media: mediaArr,
    };
  }) : [];

  return {
    ...p,
    gallery: normGallery,
    process: normProcess,
    artworkShowcase: normShowcase,
  } as AnyProject;
}


