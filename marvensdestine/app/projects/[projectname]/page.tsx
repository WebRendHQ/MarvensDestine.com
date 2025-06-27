import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs, getNFTProjectBySlug, getAllNFTProjectSlugs } from '@/lib/projectData';
import ProjectPageClient from './ProjectPageClient';
import NFTProjectPageClient from './NFTProjectPageClient';

interface ProjectPageProps {
  params: Promise<{
    projectname: string;
  }>;
}

export async function generateStaticParams() {
  const regularSlugs = getAllProjectSlugs();
  const nftSlugs = getAllNFTProjectSlugs();
  const allSlugs = [...regularSlugs, ...nftSlugs];
  
  return allSlugs.map((slug) => ({
    projectname: slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { projectname } = await params;
  const project = getProjectBySlug(projectname);
  const nftProject = getNFTProjectBySlug(projectname);
  
  const foundProject = project || nftProject;
  
  if (!foundProject) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${foundProject.title} - ${project ? 'Mission Briefing' : 'Collection Details'}`,
    description: foundProject.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectname } = await params;
  const project = getProjectBySlug(projectname);
  const nftProject = getNFTProjectBySlug(projectname);

  if (!project && !nftProject) {
    notFound();
  }

  // Render appropriate client component based on project type
  if (project) {
  return <ProjectPageClient project={project} />;
  } else {
    return <NFTProjectPageClient project={nftProject!} />;
  }
} 