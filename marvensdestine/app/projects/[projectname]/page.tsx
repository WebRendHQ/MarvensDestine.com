import { notFound } from 'next/navigation';
import { getProjectBySlug, getAllProjectSlugs, getNFTProjectBySlug, getAllNFTProjectSlugs, ProjectData, NFTProjectData } from '@/lib/projectData';
import { getAdminFirestore } from '@/lib/firebaseAdmin';
import { adaptProject } from '@/lib/projectAdapter';
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
  // Prefer Firestore
  let project: ProjectData | null = null;
  let nftProject: NFTProjectData | null = null;
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('projects').doc(projectname).get();
    const nsnap = await db.collection('nftProjects').doc(projectname).get();
    if (snap.exists) project = adaptProject({ type: '3d', ...snap.data() }) as ProjectData;
    if (nsnap.exists) nftProject = adaptProject({ type: 'nft', ...nsnap.data() }) as NFTProjectData;
  } catch {}
  if (!project && !nftProject) {
    project = getProjectBySlug(projectname) ?? null;
    nftProject = getNFTProjectBySlug(projectname) ?? null;
  }
  
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
  let project: ProjectData | null = null;
  let nftProject: NFTProjectData | null = null;
  try {
    const db = getAdminFirestore();
    const snap = await db.collection('projects').doc(projectname).get();
    const nsnap = await db.collection('nftProjects').doc(projectname).get();
    if (snap.exists) project = adaptProject({ type: '3d', ...snap.data() }) as ProjectData;
    if (nsnap.exists) nftProject = adaptProject({ type: 'nft', ...nsnap.data() }) as NFTProjectData;
  } catch {}
  if (!project && !nftProject) {
    project = getProjectBySlug(projectname) ?? null;
    nftProject = getNFTProjectBySlug(projectname) ?? null;
  }

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