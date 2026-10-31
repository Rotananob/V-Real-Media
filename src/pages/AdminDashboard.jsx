import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import {
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost
} from '../services/postService';
import {
  getAllPortfolioAdmin,
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem
} from '../services/portfolioService';
import { uploadMedia } from '../services/storageService';
import { detectVideoProvider, getSafeEmbedUrl } from '../utils/videoUtils';
import { formatDate } from '../utils/formatDate';
import ConfirmDialog from '../components/common/ConfirmDialog';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';
import { BRAND } from '../config/brand';

import {
  LayoutDashboard,
  FileText,
  Film,
  Plus,
  Trash2,
  Edit3,
  Search,
  LogOut,
  Upload,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Home,
  Play,
  Globe
} from 'lucide-react';

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const navigate = useNavigate();

  // Active view: 'overview' | 'posts' | 'portfolio'
  const [activeTab, setActiveTab] = useState('overview');

  // Data states
  const [posts, setPosts] = useState([]);
  const [portfolio, setPortfolio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  // Filtering & Pagination
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Editor Modal State
  const [editorModal, setEditorModal] = useState({
    isOpen: false,
    mode: 'create', // 'create' | 'edit'
    type: 'post', // 'post' | 'portfolio'
    item: null,
  });

  // Modal Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    category: 'street-reality',
    videoURL: '',
    thumbnailURL: '',
    thumbnailPath: null,
    status: 'published',
    featured: false,
  });

  // Image Upload State
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Delete Confirm Dialog State
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    type: 'post',
    id: null,
    thumbnailPath: null,
    title: '',
  });

  // Load data
  const loadAllData = async () => {
    setLoading(true);
    try {
      const [postsData, portfolioData] = await Promise.all([
        getAllPostsAdmin(),
        getAllPortfolioAdmin()
      ]);
      setPosts(postsData || []);
      setPortfolio(portfolioData || []);
    } catch (err) {
      console.error('Error fetching CMS data:', err);
      showFeedback('error', (language === 'km' ? 'មិនអាចទាញយកទិន្នន័យបានទេ៖ ' : 'Failed to load data: ') + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => setFeedback({ type: '', message: '' }), 4500);
  };

  // Stats calculation
  const stats = useMemo(() => {
    const totalPosts = posts.length;
    const publishedPosts = posts.filter(p => p.status === 'published').length;
    const draftPosts = posts.filter(p => p.status === 'draft').length;
    const totalPortfolio = portfolio.length;
    const publishedPortfolio = portfolio.filter(p => p.status === 'published').length;
    return { totalPosts, publishedPosts, draftPosts, totalPortfolio, publishedPortfolio };
  }, [posts, portfolio]);

  // Categories list
  const categoryOptions = [
    { id: 'street-reality', label: t.categories['street-reality'] },
    { id: 'social-experiment', label: t.categories['social-experiment'] },
    { id: 'documentary', label: t.categories.documentary },
    { id: 'human-stories', label: t.categories['human-stories'] },
  ];

  // Open Editor Modal
  const openEditor = (type, mode = 'create', item = null) => {
    setEditorModal({ isOpen: true, mode, type, item });
    setImageFile(null);
    setUploadProgress(0);

    if (mode === 'edit' && item) {
      setFormData({
        title: item.title || '',
        description: item.description || '',
        content: item.content || '',
        category: item.category || 'street-reality',
        videoURL: item.videoURL || '',
        thumbnailURL: item.thumbnailURL || '',
        thumbnailPath: item.thumbnailPath || null,
        status: item.status || 'published',
        featured: Boolean(item.featured),
      });
      setImagePreview(item.thumbnailURL || '');
    } else {
      setFormData({
        title: '',
        description: '',
        content: '',
        category: 'street-reality',
        videoURL: '',
        thumbnailURL: '',
        thumbnailPath: null,
        status: 'published',
        featured: false,
      });
      setImagePreview('');
    }
  };

  // Image Selection Handler
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showFeedback('error', language === 'km' ? 'សូមជ្រើសរើសឯកសាររូបភាពត្រឹមត្រូវ (JPG, PNG, WEBP)' : 'Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showFeedback('error', language === 'km' ? 'ទំហំរូបភាពលើសពីកម្រិតកំណត់ ១០MB' : 'Image exceeds maximum 10MB limit.');
      return;
    }

    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle Form Submit (Create / Edit)
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showFeedback('error', language === 'km' ? 'សូមបញ្ចូលចំណងជើង' : 'Please enter a title.');
      return;
    }

    setActionLoading(true);
    try {
      let finalThumbnailURL = formData.thumbnailURL;
      let finalThumbnailPath = formData.thumbnailPath;

      // If user uploaded a new image file, upload to Firebase Storage
      if (imageFile) {
        const folder = editorModal.type === 'post' ? 'posts' : 'portfolio';
        const docPrefix = editorModal.item?.id || Date.now().toString(36);
        const storagePath = `uploads/${folder}/${docPrefix}/${Date.now()}_${imageFile.name.replace(/\s+/g, '_')}`;

        const uploadResult = await uploadMedia(imageFile, storagePath, (progress) => {
          setUploadProgress(progress);
        });

        finalThumbnailURL = uploadResult.downloadURL;
        finalThumbnailPath = uploadResult.fullPath;
      }

      const payload = {
        ...formData,
        thumbnailURL: finalThumbnailURL,
        thumbnailPath: finalThumbnailPath,
      };

      if (editorModal.type === 'post') {
        if (editorModal.mode === 'create') {
          await createPost(payload, user?.uid || 'admin');
          showFeedback('success', language === 'km' ? 'បានបង្កើតរឿងរ៉ាវថ្មីជោគជ័យ!' : 'Story created successfully!');
        } else {
          await updatePost(editorModal.item.id, payload);
          showFeedback('success', language === 'km' ? 'បានកែប្រែរឿងរ៉ាវជោគជ័យ!' : 'Story updated successfully!');
        }
      } else {
        if (editorModal.mode === 'create') {
          await createPortfolioItem(payload);
          showFeedback('success', language === 'km' ? 'បានបន្ថែមស្នាដៃវីដេអូថ្មីជោគជ័យ!' : 'Portfolio item created successfully!');
        } else {
          await updatePortfolioItem(editorModal.item.id, payload);
          showFeedback('success', language === 'km' ? 'បានកែប្រែស្នាដៃវីដេអូជោគជ័យ!' : 'Portfolio item updated successfully!');
        }
      }

      setEditorModal({ isOpen: false, mode: 'create', type: 'post', item: null });
      await loadAllData();
    } catch (err) {
      console.error('Error saving content:', err);
      showFeedback('error', (language === 'km' ? 'បរាជ័យក្នុងការរក្សាទុក៖ ' : 'Failed to save: ') + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Delete Confirmation
  const confirmDeleteAction = async () => {
    setActionLoading(true);
    try {
      if (confirmDelete.type === 'post') {
        await deletePost(confirmDelete.id, confirmDelete.thumbnailPath);
        showFeedback('success', language === 'km' ? 'បានលុបរឿងរ៉ាវដោយជោគជ័យ' : 'Story deleted successfully.');
      } else {
        await deletePortfolioItem(confirmDelete.id, confirmDelete.thumbnailPath);
        showFeedback('success', language === 'km' ? 'បានលុបស្នាដៃវីដេអូដោយជោគជ័យ' : 'Portfolio entry deleted successfully.');
      }
      setConfirmDelete({ isOpen: false, type: 'post', id: null, thumbnailPath: null, title: '' });
      await loadAllData();
    } catch (err) {
      console.error('Error deleting item:', err);
      showFeedback('error', (language === 'km' ? 'បរាជ័យក្នុងការលុប៖ ' : 'Failed to delete: ') + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Filtered dataset for active tab
  const filteredItems = useMemo(() => {
    const list = activeTab === 'posts' ? posts : portfolio;
    return list.filter((item) => {
      const matchSearch =
        !searchQuery.trim() ||
        item.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchCategory = categoryFilter === 'all' || item.category === categoryFilter;
      return matchSearch && matchStatus && matchCategory;
    });
  }, [activeTab, posts, portfolio, searchQuery, statusFilter, categoryFilter]);

  // Paginated items
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage) || 1;
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredItems.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredItems, currentPage]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const detectedVideo = formData.videoURL ? detectVideoProvider(formData.videoURL) : null;
  const safeVideoEmbed = formData.videoURL ? getSafeEmbedUrl(formData.videoURL) : null;

  return (
    <div className="min-h-screen bg-background-primary text-white flex flex-col md:flex-row font-khmer">
      
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-background-secondary border-b md:border-b-0 md:border-r border-border shrink-0 flex flex-col justify-between">
        <div>
          {/* Top Branding */}
          <div className="p-6 border-b border-border flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-border bg-surface p-0.5 shadow-human-card">
                <img src="/assets/logo.jpg" alt="V-Real Media" className="w-full h-full object-cover rounded-lg" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-tight text-white">
                  V-REAL CMS
                </span>
                <span className="text-[10px] text-accent-red font-mono font-semibold">
                  {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'ADMIN DASHBOARD'}
                </span>
              </div>
            </Link>

            <Link to="/" title={language === 'km' ? 'មើលគេហទំព័រផ្ទាល់' : 'View Live Site'} className="text-content-muted hover:text-white transition">
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <button
              onClick={() => { setActiveTab('overview'); setCurrentPage(1); }}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-accent-red text-white shadow-rec-glow'
                  : 'text-content-secondary hover:text-white hover:bg-surface'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.admin.overview}</span>
            </button>

            <button
              onClick={() => { setActiveTab('posts'); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'posts'
                  ? 'bg-accent-red text-white shadow-rec-glow'
                  : 'text-content-secondary hover:text-white hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4" />
                <span>{t.admin.postsTab}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-content-primary">
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('portfolio'); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'portfolio'
                  ? 'bg-accent-red text-white shadow-rec-glow'
                  : 'text-content-secondary hover:text-white hover:bg-surface'
              }`}
            >
              <div className="flex items-center gap-3">
                <Film className="w-4 h-4" />
                <span>{t.admin.portfolioTab}</span>
              </div>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/50 text-content-primary">
                {portfolio.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-border bg-surface/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-mono text-content-primary truncate max-w-[130px]">
                {user?.email || 'admin@v-real.com'}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-accent-red/20 text-accent-red font-mono font-bold">
              ADMIN
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-surface hover:bg-surface-elevated border border-border text-xs text-content-secondary hover:text-white transition"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="px-6 py-4 bg-background-secondary border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-accent-red animate-rec-pulse" />
            <h1 className="text-lg font-bold text-white tracking-wider">
              {activeTab === 'overview' && t.admin.overview}
              {activeTab === 'posts' && t.admin.postsTab}
              {activeTab === 'portfolio' && t.admin.portfolioTab}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {/* Language toggle inside CMS */}
            <div className="flex items-center bg-surface border border-border rounded-lg p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2 py-0.5 rounded transition ${language === 'km' ? 'bg-accent-red text-white font-bold' : 'text-content-secondary'}`}
              >
                🇰🇭 ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition ${language === 'en' ? 'bg-accent-red text-white font-bold' : 'text-content-secondary'}`}
              >
                🇬🇧 EN
              </button>
            </div>

            {activeTab !== 'overview' && (
              <button
                onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'create')}
                className="px-4 py-2 rounded-xl bg-accent-red hover:bg-accent-darkRed text-white text-xs font-bold shadow-rec-glow transition flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>{activeTab === 'posts' ? t.admin.newPost : t.admin.newPortfolio}</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              disabled={loading}
              title={language === 'km' ? 'ទាញយកទិន្នន័យឡើងវិញ' : 'Refresh Data'}
              className="p-2 rounded-xl bg-surface border border-border text-content-muted hover:text-white transition"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Feedback Banner */}
        {feedback.message && (
          <div
            className={`px-6 py-3 border-b text-xs flex items-center gap-2 font-khmer ${
              feedback.type === 'error'
                ? 'bg-accent-red/10 border-accent-red/30 text-accent-red'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
            }`}
          >
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-8">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-8">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="p-5 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-content-muted">{t.admin.totalPosts}</span>
                    <FileText className="w-4 h-4 text-accent-red" />
                  </div>
                  <span className="text-3xl font-display font-extrabold text-white block mb-1">
                    {stats.totalPosts}
                  </span>
                  <span className="text-xs text-content-secondary">
                    {stats.publishedPosts} {t.admin.publishedCount} • {stats.draftPosts} {t.admin.draftCount}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-content-muted">{t.admin.totalPortfolio}</span>
                    <Film className="w-4 h-4 text-accent-red" />
                  </div>
                  <span className="text-3xl font-display font-extrabold text-white block mb-1">
                    {stats.totalPortfolio}
                  </span>
                  <span className="text-xs text-content-secondary">
                    {stats.publishedPortfolio} {language === 'km' ? 'វីដេអូចាក់ផ្សាយ' : 'live productions'}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-content-muted">{t.admin.securityStatus}</span>
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  </div>
                  <span className="text-base font-bold text-emerald-400 block mb-1">
                    {t.admin.authenticated}
                  </span>
                  <span className="text-[11px] text-content-secondary font-mono">
                    Firebase Auth: {user?.email}
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-content-muted">HOSTING TARGET</span>
                    <ExternalLink className="w-4 h-4 text-content-muted" />
                  </div>
                  <span className="text-base font-bold text-white block mb-1 font-mono">
                    v-real-media.web.app
                  </span>
                  <span className="text-xs text-accent-red">
                    {language === 'km' ? 'ផ្សាយផ្ទាល់លើអ៊ីនធឺណិត' : 'Production Live'}
                  </span>
                </div>
              </div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Posts */}
                <div className="p-6 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {language === 'km' ? 'អត្ថបទថ្មីៗ' : 'Recent Posts'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('posts')}
                      className="text-xs text-accent-red hover:underline font-semibold"
                    >
                      {language === 'km' ? 'មើលទាំងអស់' : 'View All'}
                    </button>
                  </div>

                  {posts.length === 0 ? (
                    <p className="text-xs text-content-muted">{language === 'km' ? 'មិនទាន់មានអត្ថបទឡើយ។' : 'No posts available.'}</p>
                  ) : (
                    <div className="space-y-3">
                      {posts.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/60">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                              <img src={p.thumbnailURL || '/assets/logo.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white truncate max-w-[200px]">{p.title}</p>
                              <span className="text-[11px] text-content-muted font-mono">{formatDate(p.publishedAt || p.createdAt)}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${p.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Portfolio Items */}
                <div className="p-6 rounded-2xl bg-surface border border-border shadow-human-card">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                      {language === 'km' ? 'ស្នាដៃវីដេអូថ្មីៗ' : 'Recent Portfolio Works'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-xs text-accent-red hover:underline font-semibold"
                    >
                      {language === 'km' ? 'មើលទាំងអស់' : 'View All'}
                    </button>
                  </div>

                  {portfolio.length === 0 ? (
                    <p className="text-xs text-content-muted">{language === 'km' ? 'មិនទាន់មានវីដេអូឡើយ។' : 'No portfolio entries.'}</p>
                  ) : (
                    <div className="space-y-3">
                      {portfolio.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-surface-elevated border border-border/60">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                              <img src={item.thumbnailURL || '/assets/logo.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-white truncate max-w-[200px]">{item.title}</p>
                              <span className="text-[11px] text-accent-red">{t.categories[item.category] || item.category}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase ${item.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-neutral-800 text-neutral-400'}`}>
                            {item.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {/* TAB 2 & 3: DATA TABLES (POSTS & PORTFOLIO) */}
          {(activeTab === 'posts' || activeTab === 'portfolio') && (
            <div className="space-y-6">
              
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 rounded-2xl bg-surface border border-border shadow-human-card">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-content-muted" />
                  <input
                    type="text"
                    placeholder={language === 'km' ? `ស្វែងរកក្នុង ${activeTab === 'posts' ? 'អត្ថបទ' : 'ស្នាដៃវីដេអូ'}...` : `Search ${activeTab}...`}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2 rounded-xl bg-background-primary border border-border text-xs text-white placeholder-content-muted focus:border-accent-red focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-xl bg-background-primary border border-border text-xs text-content-primary focus:border-accent-red focus:outline-none"
                >
                  <option value="all">{language === 'km' ? 'ស្ថានភាពទាំងអស់' : 'All Statuses'}</option>
                  <option value="published">{language === 'km' ? 'បានចេញផ្សាយ (Published)' : 'Published'}</option>
                  <option value="draft">{language === 'km' ? 'សេចក្តីព្រាង (Draft)' : 'Draft'}</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-2 rounded-xl bg-background-primary border border-border text-xs text-content-primary focus:border-accent-red focus:outline-none"
                >
                  <option value="all">{t.categories.all}</option>
                  {categoryOptions.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Data Table */}
              {loading ? (
                <Loader size="lg" text="កំពុងទាញយកទិន្នន័យ..." />
              ) : paginatedItems.length === 0 ? (
                <EmptyState
                  title={language === 'km' ? 'រកមិនឃើញទិន្នន័យឡើយ' : `No ${activeTab} found`}
                  description={language === 'km' ? 'មិនមានទិន្នន័យដែលត្រូវនឹងតម្រូវការស្វែងរកឡើយ។ អ្នកអាចបង្កើតទិន្នន័យថ្មីបាន។' : 'No items match your criteria.'}
                  action={
                    <button
                      onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'create')}
                      className="px-4 py-2 rounded-xl bg-accent-red text-white text-xs font-semibold"
                    >
                      {activeTab === 'posts' ? t.admin.newPost : t.admin.newPortfolio}
                    </button>
                  }
                />
              ) : (
                <div className="rounded-2xl overflow-hidden border border-border bg-surface shadow-human-card">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-surface-elevated border-b border-border text-content-muted uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">{t.admin.tableItem}</th>
                          <th className="py-3 px-4">{t.admin.tableCategory}</th>
                          <th className="py-3 px-4">{t.admin.tableStatus}</th>
                          <th className="py-3 px-4">{t.admin.tableVideo}</th>
                          <th className="py-3 px-4">{t.admin.tableDate}</th>
                          <th className="py-3 px-4 text-right">{t.admin.tableActions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {paginatedItems.map((item) => (
                          <tr key={item.id} className="hover:bg-surface-elevated/40 transition">
                            {/* Item Title & Thumb */}
                            <td className="py-3.5 px-4">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 rounded-lg overflow-hidden bg-black shrink-0 border border-border">
                                  <img
                                    src={item.thumbnailURL || '/assets/logo.jpg'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.jpg'; }}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold text-white block max-w-xs truncate text-sm">
                                    {item.title}
                                  </span>
                                  <span className="text-[10px] text-content-muted font-mono block">
                                    /{item.slug}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3.5 px-4 text-content-secondary">
                              {t.categories[item.category] || item.category}
                            </td>

                            {/* Status */}
                            <td className="py-3.5 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase font-bold ${
                                  item.status === 'published'
                                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                    : 'bg-neutral-800 text-neutral-400 border border-neutral-700'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-400' : 'bg-neutral-400'}`} />
                                {item.status}
                              </span>
                            </td>

                            {/* Video */}
                            <td className="py-3.5 px-4">
                              {item.videoURL ? (
                                <a
                                  href={item.videoURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-red hover:underline flex items-center gap-1 font-mono"
                                >
                                  <span>{item.videoProvider || 'Video'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-content-muted">—</span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="py-3.5 px-4 text-content-muted font-mono">
                              {formatDate(item.publishedAt || item.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="py-3.5 px-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                  onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'edit', item)}
                                  className="p-2 rounded-xl bg-surface-elevated hover:bg-surface border border-border text-content-secondary hover:text-white transition"
                                  title={language === 'km' ? 'កែប្រែ' : 'Edit'}
                                >
                                  <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete({
                                    isOpen: true,
                                    type: activeTab === 'posts' ? 'post' : 'portfolio',
                                    id: item.id,
                                    thumbnailPath: item.thumbnailPath || null,
                                    title: item.title,
                                  })}
                                  className="p-2 rounded-xl bg-accent-red/10 hover:bg-accent-red/20 border border-accent-red/30 text-accent-red transition"
                                  title={language === 'km' ? 'លុប' : 'Delete'}
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="p-4 bg-surface-elevated border-t border-border flex items-center justify-between text-xs text-content-muted">
                    <span>
                      {language === 'km' 
                        ? `ទំព័រ ${currentPage} នៃ ${totalPages} (សរុប ${filteredItems.length})`
                        : `Page ${currentPage} of ${totalPages} (${filteredItems.length} total)`}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-surface border border-border disabled:opacity-40"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-surface border border-border disabled:opacity-40"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* CREATE / EDIT MODAL (100% HUMAN DESIGN) */}
      {editorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-surface border border-border rounded-2xl shadow-2xl p-6 sm:p-8 my-8 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 mb-6 border-b border-border">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-accent-red animate-rec-pulse" />
                <h3 className="text-lg font-bold text-white">
                  {editorModal.mode === 'create' ? t.admin.createTitle : t.admin.editTitle} {editorModal.type === 'post' ? (language === 'km' ? 'អត្ថបទរឿងរ៉ាវ' : 'Story Post') : (language === 'km' ? 'ស្នាដៃវីដេអូ' : 'Portfolio Video')}
                </h3>
              </div>
              <button
                onClick={() => setEditorModal({ isOpen: false, mode: 'create', type: 'post', item: null })}
                className="text-content-muted hover:text-white text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-5 text-xs">
              
              {/* Title */}
              <div>
                <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                  {t.admin.titleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'km' ? "ឧ. តថភាពតាមដងផ្លូវ៖ ២៤ ម៉ោងជាមួយអ្នករត់កង់បី" : "e.g. STREET REALITY: Phnom Penh Tuk-Tuk Drivers"}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white text-sm focus:outline-none"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                    {t.admin.categoryLabel}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white focus:outline-none"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                    {t.admin.statusLabel}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white focus:outline-none"
                  >
                    <option value="published">{t.admin.statusPublished}</option>
                    <option value="draft">{t.admin.statusDraft}</option>
                  </select>
                </div>
              </div>

              {/* Video URL with Live Provider Detection */}
              <div>
                <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                  {t.admin.videoLabel}
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoURL}
                  onChange={(e) => setFormData({ ...formData, videoURL: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white font-mono focus:outline-none"
                />
                
                {/* Live Video Preview Box */}
                {detectedVideo && (
                  <div className="mt-3 p-3 rounded-xl bg-background-primary border border-border/80">
                    <div className="flex items-center justify-between text-[11px] text-content-secondary mb-2">
                      <span className="font-mono text-accent-red font-semibold">
                        Provider: {detectedVideo.provider.toUpperCase()}
                      </span>
                      <span>Live Embed Preview</span>
                    </div>

                    {safeVideoEmbed ? (
                      <div className="aspect-video w-full rounded-lg overflow-hidden bg-black">
                        <iframe
                          src={safeVideoEmbed}
                          title="Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-content-muted">
                        {language === 'km' ? 'វីដេអូនេះនឹងត្រូវបើកតាមរយៈតំណភ្ជាប់ផ្ទាល់។' : 'Video will open directly via external link.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Upload (Firebase Storage) */}
              <div>
                <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                  {t.admin.thumbnailLabel}
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl border border-border bg-background-primary">
                  {imagePreview ? (
                    <div className="w-20 h-20 rounded-xl overflow-hidden border border-border bg-black shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-xl border border-dashed border-border flex items-center justify-center text-content-muted shrink-0">
                      <Upload className="w-6 h-6" />
                    </div>
                  )}

                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-content-secondary file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-surface-elevated file:text-white hover:file:bg-border cursor-pointer"
                    />
                    <p className="text-[10px] text-content-muted">
                      {language === 'km' ? 'ជ្រើសរើសរូបភាព JPG, PNG, WEBP (ទំហំអតិបរមា 10MB)' : 'Upload JPG, PNG, WEBP (Max 10MB)'}
                    </p>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-surface-elevated rounded-full h-1.5">
                        <div
                          className="bg-accent-red h-1.5 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                  {t.admin.descLabel}
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder={language === 'km' ? "សង្ខេបអំពីវីដេអូ ឬរឿងរ៉ាវនេះ..." : "Brief synopsis or teaser of this production..."}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white text-xs focus:outline-none"
                />
              </div>

              {/* Full Content (Especially for Posts) */}
              {editorModal.type === 'post' && (
                <div>
                  <label className="block text-content-secondary font-semibold uppercase tracking-wider mb-1.5">
                    {t.admin.contentLabel}
                  </label>
                  <textarea
                    rows={6}
                    placeholder={language === 'km' ? "សរសេររឿងរ៉ាវលម្អិត បទពិសោធន៍ពីទីតាំងថត..." : "Write the full story, interview quotes, field notes..."}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-background-primary border border-border focus:border-accent-red text-white text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Featured Checkbox */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-border text-accent-red focus:ring-accent-red"
                />
                <label htmlFor="featuredToggle" className="text-white font-medium cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-red" />
                  <span>{t.admin.featuredToggle}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditorModal({ isOpen: false, mode: 'create', type: 'post', item: null })}
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-xl bg-surface-elevated border border-border text-content-secondary hover:text-white"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2 rounded-xl bg-accent-red hover:bg-accent-darkRed text-white font-bold uppercase tracking-wider shadow-rec-glow flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{language === 'km' ? 'កំពុងរក្សាទុក...' : 'Saving...'}</span>
                    </>
                  ) : (
                    <span>{t.admin.saveBtn}</span>
                  )}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM DIALOG */}
      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title={t.admin.confirmDeleteTitle}
        message={t.admin.confirmDeleteMsg}
        confirmText={t.admin.deleteBtn}
        cancelText={t.admin.cancelBtn}
        isLoading={actionLoading}
        onConfirm={confirmDeleteAction}
        onClose={() => setConfirmDelete({ isOpen: false, type: 'post', id: null, thumbnailPath: null, title: '' })}
      />

    </div>
  );
}
