import { useState } from 'react'
import { ArrowDownToLine, ChevronDown, Disc3, Home, Library, ListMusic, LogIn, Menu, Mic2, Music2, Pause, Play, Plus, Radio, Search, Sparkles, Upload, X } from 'lucide-react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || '/api'
const tracks = [
  { id: '1', title: 'pink noise', artist: 'Sofi Nox', mood: 'late night', color: 'coral', duration: '2:48' },
  { id: '2', title: 'afterglow.exe', artist: 'Mira Vale', mood: 'main character', color: 'lime', duration: '3:22' },
  { id: '3', title: 'soft launch', artist: 'juniper', mood: 'daydream', color: 'sky', duration: '2:56' },
  { id: '4', title: 'ctrl + feel', artist: '404 hearts', mood: 'focus mode', color: 'violet', duration: '3:08' },
  { id: '5', title: 'offline angel', artist: 'Lena Bloom', mood: 'golden hour', color: 'yellow', duration: '2:41' },
]

function App() {
  const [activeTab, setActiveTab] = useState('home')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTrack, setCurrentTrack] = useState(tracks[1])
  const [authMode, setAuthMode] = useState(null)
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('sonora-user') || 'null'))
  const [toast, setToast] = useState('')
  const showToast = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3200) }
  const playTrack = (track) => { setCurrentTrack(track); setIsPlaying(true) }
  const handleAuth = async (event) => {
    event.preventDefault()
    const mode = authMode
    const payload = Object.fromEntries(new FormData(event.currentTarget).entries())
    try {
      const response = await fetch(`${API_URL}/auth/${mode}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, credentials: 'include', body: JSON.stringify(payload) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Something went wrong')
      setUser(data.user); localStorage.setItem('sonora-user', JSON.stringify(data.user)); setAuthMode(null)
      showToast(mode === 'login' ? 'Welcome back to the frequency.' : 'Your profile is officially live.')
    } catch (error) { showToast(error.message) }
  }
  return <div className="app-shell">
    <aside className="sidebar">
      <div className="brand"><span className="brand-mark"><Music2 size={18} /></span>sonora<span className="brand-dot">.</span></div>
      <nav className="main-nav" aria-label="Main navigation">
        <NavButton active={activeTab === 'home'} onClick={() => setActiveTab('home')} icon={<Home size={18} />}>Home</NavButton>
        <NavButton active={activeTab === 'discover'} onClick={() => setActiveTab('discover')} icon={<Sparkles size={18} />}>Discover</NavButton>
        <NavButton active={activeTab === 'radio'} onClick={() => setActiveTab('radio')} icon={<Radio size={18} />}>Radio</NavButton>
      </nav>
      <div className="library-heading"><span>Your space</span><button title="Add playlist"><Plus size={17} /></button></div>
      <nav className="library-nav"><NavButton icon={<Library size={18} />}>Your library</NavButton><NavButton icon={<ListMusic size={18} />}>Daily rotation</NavButton><NavButton icon={<Disc3 size={18} />}>Liked tracks</NavButton></nav>
      <div className="playlist-list"><span>PLAYLISTS</span><button>brain food <i>12</i></button><button>walking soundtrack <i>28</i></button><button>hyperpop starter pack <i>19</i></button></div>
      <div className="sidebar-foot"><div className="install"><ArrowDownToLine size={15} /> Install app</div><div className="made-note">made for <strong>your era</strong> ✦</div></div>
    </aside>
    <main className="main-content">
      <header className="topbar"><button className="mobile-menu" title="Open menu"><Menu size={21} /></button><div className="search-box"><Search size={17} /><input placeholder="What are you in the mood for?" aria-label="Search music" /><kbd>/</kbd></div><div className="top-actions">{!user ? <><button className="text-button" onClick={() => setAuthMode('login')}>Log in</button><button className="pill-button" onClick={() => setAuthMode('register')}>Join free <Sparkles size={14} /></button></> : <button className="profile-chip" onClick={() => { localStorage.removeItem('sonora-user'); setUser(null) }}><span>{user.username?.slice(0, 1).toUpperCase()}</span>{user.username}<ChevronDown size={14} /></button>}</div></header>
      <div className="content-wrap">
        {activeTab === 'home' && <HomeView user={user} playTrack={playTrack} onArtist={() => setActiveTab('artist')} />}
        {activeTab === 'discover' && <DiscoverView playTrack={playTrack} />}
        {activeTab === 'radio' && <RadioView playTrack={playTrack} />}
        {activeTab === 'artist' && <ArtistView showToast={showToast} />}
      </div>
    </main>
    <Player track={currentTrack} isPlaying={isPlaying} setIsPlaying={setIsPlaying} playTrack={playTrack} />
    {toast && <div className="toast"><Sparkles size={16} /> {toast}</div>}
    {authMode && <AuthModal mode={authMode} setMode={setAuthMode} onSubmit={handleAuth} />}
  </div>
}

function NavButton({ active, onClick, icon, children }) { return <button className={active ? 'nav-item active' : 'nav-item'} onClick={onClick}>{icon} {children}</button> }
function HomeView({ user, playTrack, onArtist }) { return <>
  <section className="hero-panel"><div className="hero-copy"><p className="eyebrow"><span className="pulse-dot" /> {user ? `made for ${user.username}` : 'your daily frequency'}</p><h1>sound good.<br /><em>feel better.</em></h1><p className="hero-sub">A little serotonin for your ears. Curated picks, new obsessions, and zero skips.</p><button className="lime-button" onClick={() => playTrack(tracks[1])}>Start listening <Play size={15} fill="currentColor" /></button></div><div className="hero-art"><div className="orb orb-one" /><div className="orb orb-two" /><div className="hero-record"><Disc3 size={70} /><span>SONORA<br />FM 001</span></div><span className="sticker sticker-top">NO SKIPS</span><span className="sticker sticker-bottom">VOL. 04 ✦</span></div></section>
  <section className="section-block"><SectionTitle eyebrow="picked for right now" title="Keep the vibe going" /><div className="track-grid">{tracks.slice(0, 4).map((track, index) => <TrackCard key={track.id} track={track} index={index} onClick={() => playTrack(track)} />)}</div></section>
  <section className="section-block split-section"><div><SectionTitle eyebrow="curated energy" title="Made for your plot twist" /><div className="mix-card"><div className="mix-art">main<br />character<br /><b>energy</b></div><div><h3>main character energy</h3><p>42 tracks · confident, chaotic, cute</p><button className="round-play" onClick={() => playTrack(tracks[0])}><Play size={18} fill="currentColor" /></button></div></div></div><div className="artist-cta"><p className="eyebrow">got a sound?</p><h2>Put your art<br /><em>on repeat.</em></h2><p>Upload a track or build an album for the next wave.</p><button className="outline-button" onClick={onArtist}>Open artist tools <Upload size={15} /></button></div></section>
</> }
function DiscoverView({ playTrack }) { return <section className="view-page"><p className="eyebrow">freshly dropped</p><h1 className="page-title">Discover your<br /><em>next obsession.</em></h1><div className="discover-banner"><div><span className="tiny-label">SONORA SELECTS / 04</span><h2>soft chaos,<br /><strong>loud feelings.</strong></h2></div><div className="banner-shape">✦</div></div><SectionTitle eyebrow="new this week" title="On your radar" /><div className="track-grid">{tracks.map((track, index) => <TrackCard key={track.id} track={track} index={index} onClick={() => playTrack(track)} />)}</div></section> }
function RadioView({ playTrack }) { return <section className="view-page radio-page"><div className="radio-head"><div><p className="eyebrow"><span className="pulse-dot" /> live-ish radio</p><h1 className="page-title">No thoughts.<br /><em>Just frequency.</em></h1><p className="hero-sub">A continuous stream of hand-picked tracks for wherever the day takes you.</p><button className="lime-button" onClick={() => playTrack(tracks[2])}>Tune in <Radio size={15} /></button></div><div className="waveform">{Array.from({ length: 36 }, (_, index) => <i key={index} style={{ height: `${18 + ((index * 17) % 62)}px` }} />)}</div></div><div className="radio-stats"><div><strong>24/7</strong><span>good energy</span></div><div><strong>∞</strong><span>skip responsibly</span></div><div><strong>01</strong><span>channel right now</span></div></div></section> }
function SectionTitle({ eyebrow, title }) { return <div className="section-title"><div><p className="eyebrow">{eyebrow}</p><h2>{title}</h2></div><button className="arrow-link">See all <span>↗</span></button></div> }
function TrackCard({ track, index, onClick }) { return <button className="track-card" onClick={onClick}><div className={`cover ${track.color}`}><span>{String(index + 1).padStart(2, '0')}</span><Music2 size={28} /></div><div className="track-info"><strong>{track.title}</strong><span>{track.artist}</span><small>{track.mood}</small></div><span className="track-duration">{track.duration}</span><span className="card-play"><Play size={14} fill="currentColor" /></span></button> }
function Player({ track, isPlaying, setIsPlaying, playTrack }) { return <footer className="player"><div className="now-playing"><div className={`mini-cover ${track.color}`}><Music2 size={16} /></div><div><strong>{track.title}</strong><span>{track.artist}</span></div><button title="Save track"><Plus size={16} /></button></div><div className="player-controls"><div className="control-buttons"><button title="Previous track">↶</button><button className="player-play" onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause size={16} fill="currentColor" /> : <Play size={16} fill="currentColor" />}</button><button title="Next track" onClick={() => playTrack(tracks[(tracks.findIndex((item) => item.id === track.id) + 1) % tracks.length])}>↷</button></div><div className="progress"><span>0:42</span><div><i /></div><span>{track.duration}</span></div></div><div className="player-extra"><Mic2 size={16} /><span className="volume"><i /></span></div></footer> }
function ArtistView({ showToast }) { const [file, setFile] = useState(null); const [title, setTitle] = useState(''); const [albumTitle, setAlbumTitle] = useState(''); const [musicIds, setMusicIds] = useState(''); const [busy, setBusy] = useState(false); const upload = async (event) => { event.preventDefault(); if (!file || !title) return showToast('Add a title and a music file first.'); setBusy(true); const body = new FormData(); body.append('title', title); body.append('music', file); try { const response = await fetch(`${API_URL}/music/upload`, { method: 'POST', credentials: 'include', body }); const data = await response.json(); if (!response.ok) throw new Error(data.message); showToast('Track uploaded. The timeline just got better.'); setTitle(''); setFile(null) } catch (error) { showToast(error.message || 'Upload failed') } finally { setBusy(false) } }; const createAlbum = async (event) => { event.preventDefault(); setBusy(true); try { const response = await fetch(`${API_URL}/music/album`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title: albumTitle, musicIds: musicIds.split(',').map((id) => id.trim()).filter(Boolean) }) }); const data = await response.json(); if (!response.ok) throw new Error(data.message); showToast('Album created. Put it on repeat.'); setAlbumTitle(''); setMusicIds('') } catch (error) { showToast(error.message || 'Could not create album') } finally { setBusy(false) } }; return <section className="view-page artist-page"><p className="eyebrow">artist workspace</p><h1 className="page-title">Make some<br /><em>noise.</em></h1><p className="hero-sub">Upload your sound and shape the next moment. Artist access is checked by the backend.</p><div className="artist-grid"><form className="tool-card" onSubmit={upload}><div className="tool-icon"><Upload size={20} /></div><h2>Drop a track</h2><p>Share an mp3, wav, or the sound stuck in your head.</p><label className="field-label">Track title<input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="e.g. neon aftercare" /></label><label className="file-drop"><input type="file" accept="audio/*" onChange={(event) => setFile(event.target.files?.[0] || null)} /><span>{file ? file.name : 'Choose an audio file'}</span><small>browse files</small></label><button className="lime-button" disabled={busy}>{busy ? 'Uploading...' : 'Upload track'} <ArrowDownToLine size={15} /></button></form><form className="tool-card alt-tool" onSubmit={createAlbum}><div className="tool-icon"><Disc3 size={20} /></div><h2>Build an album</h2><p>Bundle your tracks into a little universe.</p><label className="field-label">Album title<input value={albumTitle} onChange={(event) => setAlbumTitle(event.target.value)} placeholder="e.g. everything at once" /></label><label className="field-label">Music IDs<input value={musicIds} onChange={(event) => setMusicIds(event.target.value)} placeholder="paste IDs, separated by commas" /></label><button className="outline-button" disabled={busy}>Create album <Plus size={15} /></button></form></div></section> }
function AuthModal({ mode, setMode, onSubmit }) { const isLogin = mode === 'login'; return <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && setMode(null)}><div className="auth-modal"><button className="close-modal" onClick={() => setMode(null)} title="Close"><X size={19} /></button><div className="auth-art"><Sparkles size={28} /><span>sound good.<br /><em>feel better.</em></span></div><div className="auth-content"><p className="eyebrow">{isLogin ? 'welcome back' : 'join the frequency'}</p><h2>{isLogin ? 'Your ears missed you.' : 'Find your people.'}</h2><form onSubmit={onSubmit}>{!isLogin && <input name="username" placeholder="username" required />}{!isLogin && <select name="role" defaultValue="user"><option value="user">I just want to listen</option><option value="artist">I make music</option></select>}{!isLogin ? <input name="email" type="email" placeholder="email" required /> : <input name="username" placeholder="username or email" required />}<input name="password" type="password" placeholder="password" required /><button className="lime-button" type="submit">{isLogin ? 'Log me in' : 'Create my profile'} <LogIn size={15} /></button></form><button className="switch-auth" onClick={() => setMode(isLogin ? 'register' : 'login')}>{isLogin ? 'New here? Join free' : 'Already have an account? Log in'}</button></div></div></div> }

export default App
