import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs } from '@/lib/projectData';
import ProjectPageClient from './ProjectPageClient';

interface ProjectPageProps {
  params: Promise<{
    projectname: string;
  }>;
}

export async function generateStaticParams() {
  const slugs = getAllProjectSlugs();
  return slugs.map((slug) => ({
    projectname: slug,
  }));
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { projectname } = await params;
  const project = getProjectBySlug(projectname);
  
  if (!project) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: `${project.title} - Mission Briefing`,
    description: project.description,
  };
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectname } = await params;
  const project = getProjectBySlug(projectname);

  if (!project) {
    notFound();
  }

  return <ProjectPageClient project={project} />;
} 