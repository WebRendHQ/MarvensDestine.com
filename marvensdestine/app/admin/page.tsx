"use client";

import { useEffect, useState } from 'react';
import { onAuthStateChanged, signOut, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db, storage } from '@/lib/firebase';
import { doc, setDoc, collection, getDocs, getDoc, deleteDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

type MediaItem = { type: 'image'|'video'; url: string; alt?: string; caption?: string };
type ProjectListItem = { slug: string; title: string };

export default function AdminPage() {
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  // Existing projects
  const [list3d, setList3d] = useState<ProjectListItem[]>([]);
  const [listNft, setListNft] = useState<ProjectListItem[]>([]);

  // Form state
  const [formType, setFormType] = useState<'3d'|'nft'>('3d');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fullDescription, setFullDescription] = useState('');
  const [scene, setScene] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [technologies, setTechnologies] = useState('');
  const [results, setResults] = useState('');
  const [services, setServices] = useState('');
  const [deliverables, setDeliverables] = useState('');
  const [challenges, setChallenges] = useState('');
  const [solutions, setSolutions] = useState('');
  const [projectDuration, setProjectDuration] = useState('');
  const [budget, setBudget] = useState('');
  const [clientType, setClientType] = useState('');
  const [testimonialQuote, setTestimonialQuote] = useState('');
  const [testimonialAuthor, setTestimonialAuthor] = useState('');
  const [testimonialCompany, setTestimonialCompany] = useState('');
  // NFT-specific
  const [collectionSize, setCollectionSize] = useState<number | ''>('');
  const [blockchain, setBlockchain] = useState('');
  const [mintPrice, setMintPrice] = useState('');
  const [status, setStatus] = useState('');
  const [inspiration, setInspiration] = useState('');
  const [creationProcess, setCreationProcess] = useState('');
  const [utilities, setUtilities] = useState('');
  const [roadmap, setRoadmap] = useState('');
  const [communitySize, setCommunitySize] = useState('');
  const [rarityCommon, setRarityCommon] = useState<number | ''>('');
  const [rarityUncommon, setRarityUncommon] = useState<number | ''>('');
  const [rarityRare, setRarityRare] = useState<number | ''>('');
  const [rarityLegendary, setRarityLegendary] = useState<number | ''>('');

  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUserEmail(u?.email ?? null);
      const admins = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || '').split(',').map(s=>s.trim()).filter(Boolean);
      setIsAdmin(!!u?.email && admins.includes(u.email!));
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [a, b] = await Promise.all([
          getDocs(collection(db, 'projects')),
          getDocs(collection(db, 'nftProjects')),
        ]);
        setList3d(a.docs.map(d=>{
          const data = d.data() as Record<string, unknown>;
          return { slug: (data.slug as string) || d.id, title: (data.title as string) || '' };
        }));
        setListNft(b.docs.map(d=>{
          const data = d.data() as Record<string, unknown>;
          return { slug: (data.slug as string) || d.id, title: (data.title as string) || '' };
        }));
      } catch {}
    };
    void load();
  }, [saving]);

  const uploadMedia = async (file: File) => {
    const path = `projects/${Date.now()}_${file.name}`;
    const r = ref(storage, path);
    await uploadBytes(r, file);
    return await getDownloadURL(r);
  };

  const addGalleryItem = (item: MediaItem) => setGallery(prev => [...prev, item]);
  const removeGalleryItem = (idx: number) => setGallery(prev => prev.filter((_,i)=>i!==idx));

  const onSave = async () => {
    try {
      setSaving(true); setMessage('');
      if (!slug) throw new Error('slug is required');
      const base: Record<string, unknown> = {
        slug, title, description, fullDescription, scene, heroImage,
        gallery, projectDuration, budget, clientType,
        technologies: technologies ? technologies.split(',').map(s=>s.trim()).filter(Boolean) : [],
        results: results ? results.split('\n').filter(Boolean) : [],
        services: services ? services.split('\n').filter(Boolean) : [],
        deliverables: deliverables ? deliverables.split('\n').filter(Boolean) : [],
        challenges: challenges ? challenges.split('\n').filter(Boolean) : [],
        solutions: solutions ? solutions.split('\n').filter(Boolean) : [],
        testimonial: testimonialQuote ? { quote: testimonialQuote, author: testimonialAuthor, company: testimonialCompany } : undefined,
      };
      if (formType === 'nft') {
        base.collectionSize = typeof collectionSize === 'string' ? Number(collectionSize) : collectionSize;
        base.blockchain = blockchain; base.mintPrice = mintPrice; base.status = status;
        base.inspiration = inspiration;
        base.creationProcess = creationProcess ? creationProcess.split('\n').filter(Boolean) : [];
        base.utilities = utilities ? utilities.split('\n').filter(Boolean) : [];
        base.roadmap = roadmap ? roadmap.split('\n').filter(Boolean) : [];
        base.communitySize = communitySize;
        base.rarity = (rarityCommon || rarityUncommon || rarityRare || rarityLegendary) ? {
          common: Number(rarityCommon||0), uncommon: Number(rarityUncommon||0), rare: Number(rarityRare||0), legendary: Number(rarityLegendary||0)
        } : undefined;
      }
      const col = formType === 'nft' ? 'nftProjects' : 'projects';
      await setDoc(doc(db, col, slug), base, { merge: true });
      setMessage('Saved.');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Failed';
      setMessage(message);
    } finally {
      setSaving(false);
    }
  };

  const loadForEdit = async (type: '3d'|'nft', id: string) => {
    try {
      const snap = await getDoc(doc(db, type==='nft'?'nftProjects':'projects', id));
      if (!snap.exists()) return;
      const d = snap.data() as Record<string, unknown>;
      setFormType(type);
      setSlug((d.slug as string) || id);
      setTitle((d.title as string) || '');
      setDescription((d.description as string) || '');
      setFullDescription((d.fullDescription as string) || '');
      setScene((d.scene as string) || '');
      setHeroImage((d.heroImage as string) || '');
      const galleryArr = Array.isArray(d.gallery) ? (d.gallery as unknown[]).map((m)=>{
        const mm = m as Record<string, unknown>;
        return { type: (mm.type as 'image'|'video') || 'image', url: (mm.src as string) || (mm.url as string) || '', alt: (mm.alt as string) || '', caption: (mm.caption as string) || '' } as MediaItem;
      }) : [];
      setGallery(galleryArr);
      setTechnologies(Array.isArray(d.technologies) ? (d.technologies as string[]).join(',') : '');
      setResults(Array.isArray(d.results) ? (d.results as string[]).join('\n') : '');
      setServices(Array.isArray(d.services) ? (d.services as string[]).join('\n') : '');
      setDeliverables(Array.isArray(d.deliverables) ? (d.deliverables as string[]).join('\n') : '');
      setChallenges(Array.isArray(d.challenges) ? (d.challenges as string[]).join('\n') : '');
      setSolutions(Array.isArray(d.solutions) ? (d.solutions as string[]).join('\n') : '');
      setProjectDuration((d.projectDuration as string) || '');
      setBudget((d.budget as string) || '');
      setClientType((d.clientType as string) || '');
      setTestimonialQuote((d.testimonial as Record<string, unknown>)?.quote as string || '');
      setTestimonialAuthor((d.testimonial as Record<string, unknown>)?.author as string || '');
      setTestimonialCompany((d.testimonial as Record<string, unknown>)?.company as string || '');
      setCollectionSize((d.collectionSize as number) ?? '');
      setBlockchain((d.blockchain as string) || '');
      setMintPrice((d.mintPrice as string) || '');
      setStatus((d.status as string) || '');
      setInspiration((d.inspiration as string) || '');
      setCreationProcess(Array.isArray(d.creationProcess) ? (d.creationProcess as string[]).join('\n') : '');
      setUtilities(Array.isArray(d.utilities) ? (d.utilities as string[]).join('\n') : '');
      setRoadmap(Array.isArray(d.roadmap) ? (d.roadmap as string[]).join('\n') : '');
      setCommunitySize((d.communitySize as string) || '');
      setRarityCommon((d.rarity as Record<string, unknown>)?.common as number ?? '');
      setRarityUncommon((d.rarity as Record<string, unknown>)?.uncommon as number ?? '');
      setRarityRare((d.rarity as Record<string, unknown>)?.rare as number ?? '');
      setRarityLegendary((d.rarity as Record<string, unknown>)?.legendary as number ?? '');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {}
  };

  const deleteProject = async (type: '3d'|'nft', id: string) => {
    try {
      if (!confirm(`Delete ${type.toUpperCase()} project “${id}”? This cannot be undone.`)) return;
      setSaving(true); setMessage('');
      const col = type === 'nft' ? 'nftProjects' : 'projects';
      await deleteDoc(doc(db, col, id));
      setMessage('Deleted.');
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Delete failed';
      setMessage(message);
    } finally {
      setSaving(false);
    }
  };

  if (!userEmail) {
    return (
      <main style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 360, padding: 24, borderRadius: 16, background: 'rgba(16,18,20,0.8)', border: '1px solid rgba(255,255,255,0.12)' }}>
          <h1 style={{ color: '#fff', fontSize: 20, marginBottom: 16 }}>Admin Sign In</h1>
          <button onClick={async()=>{
            const provider = new GoogleAuthProvider();
            await signInWithPopup(auth, provider);
          }} style={{ width:'100%', padding: '12px 14px', borderRadius: 10 }}>Continue with Google</button>
          <div style={{ marginTop: 12, color:'#bbb' }}>Or go to <a href="/admin/login">email sign in</a></div>
        </div>
      </main>
    );
  }
  if (!isAdmin) {
    return <main style={{ padding: 24, color: '#fff' }}>Not authorized.</main>;
  }

  return (
    <main style={{ padding: 24 }}>
      <div style={{ marginBottom: 12 }}>
        <h1 style={{ color: '#fff', marginBottom: 8 }}>Admin – Projects</h1>
        <button onClick={()=>signOut(auth)}>Sign Out</button>
      </div>

      {/* Project Form */}
      <section style={{ marginTop: 16, padding: 16, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 12 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap: 12 }}>
          <label style={{ color:'#ccc' }}>Type
            <select value={formType} onChange={(e)=>setFormType(e.target.value === 'nft' ? 'nft' : '3d')} style={{ width:'100%' }}>
              <option value="3d">3D</option>
              <option value="nft">NFT</option>
            </select>
          </label>
          <label style={{ color:'#ccc' }}>Slug
            <input value={slug} onChange={(e)=>setSlug(e.target.value)} placeholder="operation-watchkeeper" style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Title
            <input value={title} onChange={(e)=>setTitle(e.target.value)} style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Scene (Spline URL)
            <input value={scene} onChange={(e)=>setScene(e.target.value)} style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Hero (image/video URL)
            <input value={heroImage} onChange={(e)=>setHeroImage(e.target.value)} style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Project Duration
            <input value={projectDuration} onChange={(e)=>setProjectDuration(e.target.value)} style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Budget
            <input value={budget} onChange={(e)=>setBudget(e.target.value)} style={{ width:'100%' }} />
          </label>
          <label style={{ color:'#ccc' }}>Client Type
            <input value={clientType} onChange={(e)=>setClientType(e.target.value)} style={{ width:'100%' }} />
          </label>
        </div>
        <label style={{ color:'#ccc', display:'block', marginTop:12 }}>Short Description
          <textarea value={description} onChange={(e)=>setDescription(e.target.value)} style={{ width:'100%', minHeight:60 }} />
        </label>
        <label style={{ color:'#ccc', display:'block', marginTop:12 }}>Full Description
          <textarea value={fullDescription} onChange={(e)=>setFullDescription(e.target.value)} style={{ width:'100%', minHeight:90 }} />
        </label>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12 }}>
          <label style={{ color:'#ccc' }}>Technologies (comma)
            <input value={technologies} onChange={(e)=>setTechnologies(e.target.value)} />
          </label>
          <label style={{ color:'#ccc' }}>Results (one per line)
            <textarea value={results} onChange={(e)=>setResults(e.target.value)} style={{ minHeight:60 }} />
          </label>
          <label style={{ color:'#ccc' }}>Services (one per line)
            <textarea value={services} onChange={(e)=>setServices(e.target.value)} style={{ minHeight:60 }} />
          </label>
          <label style={{ color:'#ccc' }}>Deliverables (one per line)
            <textarea value={deliverables} onChange={(e)=>setDeliverables(e.target.value)} style={{ minHeight:60 }} />
          </label>
          <label style={{ color:'#ccc' }}>Challenges (one per line)
            <textarea value={challenges} onChange={(e)=>setChallenges(e.target.value)} style={{ minHeight:60 }} />
          </label>
          <label style={{ color:'#ccc' }}>Solutions (one per line)
            <textarea value={solutions} onChange={(e)=>setSolutions(e.target.value)} style={{ minHeight:60 }} />
          </label>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:12, marginTop:12 }}>
          <label style={{ color:'#ccc' }}>Testimonial Quote
            <input value={testimonialQuote} onChange={(e)=>setTestimonialQuote(e.target.value)} />
          </label>
          <label style={{ color:'#ccc' }}>Author
            <input value={testimonialAuthor} onChange={(e)=>setTestimonialAuthor(e.target.value)} />
          </label>
          <label style={{ color:'#ccc' }}>Company
            <input value={testimonialCompany} onChange={(e)=>setTestimonialCompany(e.target.value)} />
          </label>
        </div>

        {formType === 'nft' && (
          <div style={{ marginTop:12, borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:12 }}>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12 }}>
              <label style={{ color:'#ccc' }}>Collection Size
                <input value={collectionSize} onChange={(e)=>setCollectionSize(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
              <label style={{ color:'#ccc' }}>Blockchain
                <input value={blockchain} onChange={(e)=>setBlockchain(e.target.value)} />
              </label>
              <label style={{ color:'#ccc' }}>Mint Price
                <input value={mintPrice} onChange={(e)=>setMintPrice(e.target.value)} />
              </label>
              <label style={{ color:'#ccc' }}>Status
                <input value={status} onChange={(e)=>setStatus(e.target.value)} />
              </label>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, marginTop:12 }}>
              <label style={{ color:'#ccc' }}>Inspiration
                <textarea value={inspiration} onChange={(e)=>setInspiration(e.target.value)} style={{ minHeight:60 }} />
              </label>
              <label style={{ color:'#ccc' }}>Creation Process (one per line)
                <textarea value={creationProcess} onChange={(e)=>setCreationProcess(e.target.value)} style={{ minHeight:60 }} />
              </label>
              <label style={{ color:'#ccc' }}>Utilities (one per line)
                <textarea value={utilities} onChange={(e)=>setUtilities(e.target.value)} style={{ minHeight:60 }} />
              </label>
              <label style={{ color:'#ccc' }}>Roadmap (one per line)
                <textarea value={roadmap} onChange={(e)=>setRoadmap(e.target.value)} style={{ minHeight:60 }} />
              </label>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12, marginTop:12 }}>
              <label style={{ color:'#ccc' }}>Rarity Common
                <input value={rarityCommon} onChange={(e)=>setRarityCommon(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
              <label style={{ color:'#ccc' }}>Uncommon
                <input value={rarityUncommon} onChange={(e)=>setRarityUncommon(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
              <label style={{ color:'#ccc' }}>Rare
                <input value={rarityRare} onChange={(e)=>setRarityRare(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
              <label style={{ color:'#ccc' }}>Legendary
                <input value={rarityLegendary} onChange={(e)=>setRarityLegendary(e.target.value === '' ? '' : Number(e.target.value))} />
              </label>
            </div>
          </div>
        )}

        {/* Gallery builder */}
        <div style={{ marginTop:12, borderTop:'1px solid rgba(255,255,255,0.1)', paddingTop:12 }}>
          <h3 style={{ color:'#fff', marginBottom:8 }}>Gallery</h3>
          {gallery.map((g, i)=> (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'120px 1fr 1fr auto', gap:8, alignItems:'center', marginBottom:6 }}>
              <select value={g.type} onChange={(e)=>{
                const val = e.target.value as 'image'|'video';
                setGallery(prev=> prev.map((it,idx)=> idx===i ? { ...it, type: val } : it));
              }}>
                <option value="image">image</option>
                <option value="video">video</option>
              </select>
              <input value={g.url} onChange={(e)=>setGallery(prev=> prev.map((it,idx)=> idx===i ? { ...it, url: e.target.value } : it))} placeholder="https://..." />
              <input value={g.alt||''} onChange={(e)=>setGallery(prev=> prev.map((it,idx)=> idx===i ? { ...it, alt: e.target.value } : it))} placeholder="alt" />
              <button onClick={()=>removeGalleryItem(i)}>Remove</button>
            </div>
          ))}
          <div style={{ display:'flex', gap:8, marginTop:6 }}>
            <button onClick={()=>addGalleryItem({ type:'image', url:'' })}>Add Image</button>
            <button onClick={()=>addGalleryItem({ type:'video', url:'' })}>Add Video</button>
            <label>Upload
              <input type="file" accept="image/*,video/*" onChange={async (e)=>{
                const f = e.target.files?.[0]; if (!f) return;
                const url = await uploadMedia(f);
                addGalleryItem({ type: (/\.(mp4|webm|mov)(\?.*)?$/i.test(f.name) ? 'video' : 'image'), url });
              }} />
            </label>
          </div>
        </div>

        <div style={{ marginTop:12 }}>
          <button disabled={saving} onClick={onSave}>{saving ? 'Saving…' : 'Save Project'}</button>
          {message && <span style={{ marginLeft:12, color:'#9cf' }}>{message}</span>}
        </div>
      </section>

      {/* Existing Projects */}
      <section style={{ marginTop:24 }}>
        <h2 style={{ color:'#fff' }}>Existing</h2>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
          <div>
            <h3 style={{ color:'#ccc' }}>3D Projects</h3>
            <ul>
              {list3d.map(p=> (
                <li key={p.slug} style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span style={{ color:'#bbb' }}>{p.slug} – {p.title}</span>
                  <span>
                    <a href={`/projects/${p.slug}`} target="_blank">View</a>
                    <button style={{ marginLeft:8 }} onClick={()=>loadForEdit('3d', p.slug)}>Edit</button>
                    <button style={{ marginLeft:8, color:'#ff6b6b' }} onClick={()=>deleteProject('3d', p.slug)}>Delete</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 style={{ color:'#ccc' }}>NFT Collections</h3>
            <ul>
              {listNft.map(p=> (
                <li key={p.slug} style={{ display:'flex', justifyContent:'space-between', gap:8 }}>
                  <span style={{ color:'#bbb' }}>{p.slug} – {p.title}</span>
                  <span>
                    <a href={`/projects/${p.slug}`} target="_blank">View</a>
                    <button style={{ marginLeft:8 }} onClick={()=>loadForEdit('nft', p.slug)}>Edit</button>
                    <button style={{ marginLeft:8, color:'#ff6b6b' }} onClick={()=>deleteProject('nft', p.slug)}>Delete</button>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}


