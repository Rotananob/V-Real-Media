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
import { AUTHORIZED_ADMIN_EMAILS } from '../components/common/ProtectedRoute';

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
  Globe,
  X
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

  // Zero-Bypass Internal RBAC Defense Verification
  useEffect(() => {
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }
    const cleanEmail = (user.email || '').toLowerCase().trim();
    const isWhitelisted = AUTHORIZED_ADMIN_EMAILS.some(
      (email) => email.toLowerCase() === cleanEmail
    );
    if (!isWhitelisted) {
      console.error(`[SECURITY BREACH ATTEMPT] Blocked unauthorized dashboard access for: ${cleanEmail}`);
      if (logout) logout();
      navigate('/login?error=unauthorized', { replace: true });
    }
  }, [user, navigate, logout]);

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
      showFeedback('error', language === 'km' ? 'សូមជ្រើសរើសរូបភាពត្រឹមត្រូវ (JPG, PNG, WEBP)' : 'Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showFeedback('error', language === 'km' ? 'ទំហំរូបភាពលើសពីកម្រិតកំណត់ 10MB' : 'Image exceeds maximum 10MB limit.');
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
          showFeedback('success', language === 'km' ? 'បានបង្កើតរឿងរ៉ាវថ្មីជោគជ័យ' : 'Story created successfully');
        } else {
          await updatePost(editorModal.item.id, payload);
          showFeedback('success', language === 'km' ? 'បានកែប្រែរឿងរ៉ាវជោគជ័យ' : 'Story updated successfully');
        }
      } else {
        if (editorModal.mode === 'create') {
          await createPortfolioItem(payload);
          showFeedback('success', language === 'km' ? 'បានបន្ថែមស្នាដៃវីដេអូថ្មីជោគជ័យ' : 'Portfolio item created successfully');
        } else {
          await updatePortfolioItem(editorModal.item.id, payload);
          showFeedback('success', language === 'km' ? 'បានកែប្រែស្នាដៃវីដេអូជោគជ័យ' : 'Portfolio item updated successfully');
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
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 flex flex-col md:flex-row font-khmer">
      
      {/* Sidebar Navigation (GitHub 2026 Style) */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-neutral-200 shrink-0 flex flex-col justify-between">
        <div>
          {/* Top Branding */}
          <div className="p-5 border-b border-neutral-200 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg overflow-hidden border border-neutral-200 bg-white p-0.5 shadow-xs">
                <img src="/assets/logo.jpg" alt="V-Real Media" className="w-full h-full object-cover rounded-md" />
              </div>
              <div className="flex flex-col">
                <span className="font-display font-bold text-sm tracking-tight text-neutral-900">
                  V-REAL CMS
                </span>
                <span className="text-[10px] text-accent-red font-mono font-semibold">
                  {language === 'km' ? 'ផ្ទាំងគ្រប់គ្រង' : 'DASHBOARD'}
                </span>
              </div>
            </Link>

            <Link to="/" title={language === 'km' ? 'មើលគេហទំព័រ' : 'View Site'} className="text-neutral-400 hover:text-neutral-900 transition">
              <Home className="w-4 h-4" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            <button
              onClick={() => { setActiveTab('overview'); setCurrentPage(1); }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{t.admin.overview}</span>
            </button>

            <button
              onClick={() => { setActiveTab('posts'); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'posts'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <FileText className="w-4 h-4" />
                <span>{t.admin.postsTab}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'posts' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                {posts.length}
              </span>
            </button>

            <button
              onClick={() => { setActiveTab('portfolio'); setCurrentPage(1); }}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition ${
                activeTab === 'portfolio'
                  ? 'bg-neutral-900 text-white shadow-xs'
                  : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Film className="w-4 h-4" />
                <span>{t.admin.portfolioTab}</span>
              </div>
              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded ${activeTab === 'portfolio' ? 'bg-neutral-800 text-white' : 'bg-neutral-100 text-neutral-600'}`}>
                {portfolio.length}
              </span>
            </button>
          </nav>
        </div>

        {/* User Info & Logout */}
        <div className="p-4 border-t border-neutral-200 bg-neutral-50/70">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-neutral-700 truncate max-w-[130px] font-mono">
                {user?.email || 'admin@v-real.com'}
              </span>
            </div>
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-700 font-mono font-semibold">
              ADMIN
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 transition shadow-xs"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{t.admin.signOut}</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="px-6 py-4 bg-white border-b border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-accent-red" />
            <h1 className="text-base font-bold text-neutral-900 tracking-wide">
              {activeTab === 'overview' && t.admin.overview}
              {activeTab === 'posts' && t.admin.postsTab}
              {activeTab === 'portfolio' && t.admin.portfolioTab}
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Language toggle inside CMS */}
            <div className="flex items-center bg-neutral-100 border border-neutral-200 rounded-lg p-0.5 text-xs font-medium">
              <button
                type="button"
                onClick={() => setLanguage('km')}
                className={`px-2 py-0.5 rounded transition ${language === 'km' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'}`}
              >
                ខ្មែរ
              </button>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`px-2 py-0.5 rounded transition font-mono ${language === 'en' ? 'bg-white text-neutral-900 font-bold shadow-xs' : 'text-neutral-600'}`}
              >
                EN
              </button>
            </div>

            {activeTab !== 'overview' && (
              <button
                onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'create')}
                className="px-3.5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>{activeTab === 'posts' ? t.admin.newPost : t.admin.newPortfolio}</span>
              </button>
            )}

            <button
              onClick={loadAllData}
              disabled={loading}
              title={language === 'km' ? 'ទាញយកទិន្នន័យឡើងវិញ' : 'Refresh Data'}
              className="p-1.5 rounded-lg bg-white border border-neutral-200 text-neutral-600 hover:text-neutral-900 transition shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </header>

        {/* Feedback Banner */}
        {feedback.message && (
          <div
            className={`px-6 py-2.5 border-b text-xs flex items-center gap-2 font-khmer ${
              feedback.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-700'
                : 'bg-emerald-50 border-emerald-200 text-emerald-800'
            }`}
          >
            {feedback.type === 'error' ? <AlertCircle className="w-4 h-4 shrink-0" /> : <CheckCircle className="w-4 h-4 shrink-0" />}
            <span>{feedback.message}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 max-w-7xl w-full mx-auto space-y-6">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500">{t.admin.totalPosts}</span>
                    <FileText className="w-4 h-4 text-accent-red" />
                  </div>
                  <span className="text-3xl font-extrabold text-neutral-900 block font-display mb-1">
                    {stats.totalPosts}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {stats.publishedPosts} {t.admin.publishedCount} • {stats.draftPosts} {t.admin.draftCount}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500">{t.admin.totalPortfolio}</span>
                    <Film className="w-4 h-4 text-accent-red" />
                  </div>
                  <span className="text-3xl font-extrabold text-neutral-900 block font-display mb-1">
                    {stats.totalPortfolio}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {stats.publishedPortfolio} {language === 'km' ? 'វីដេអូចាក់ផ្សាយ' : 'live productions'}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500">{t.admin.securityStatus}</span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>
                  <span className="text-base font-bold text-emerald-700 block mb-1">
                    {t.admin.authenticated}
                  </span>
                  <span className="text-xs text-neutral-500 font-mono truncate block">
                    {user?.email}
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-neutral-500">HOSTING</span>
                    <ExternalLink className="w-4 h-4 text-neutral-400" />
                  </div>
                  <span className="text-base font-bold text-neutral-900 block mb-1 font-mono">
                    v-real-media.web.app
                  </span>
                  <span className="text-xs text-accent-red font-medium">
                    {language === 'km' ? 'ផ្សាយផ្ទាល់' : 'Production Live'}
                  </span>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Recent Posts */}
                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
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
                    <p className="text-xs text-neutral-500">{language === 'km' ? 'មិនទាន់មានអត្ថបទឡើយ។' : 'No posts available.'}</p>
                  ) : (
                    <div className="space-y-2.5">
                      {posts.slice(0, 4).map((p) => (
                        <div key={p.id} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                              <img src={p.thumbnailURL || '/assets/logo.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-neutral-900 truncate max-w-[200px]">{p.title}</p>
                              <span className="text-[10px] text-neutral-500 font-mono">{formatDate(p.publishedAt || p.createdAt)}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${p.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-200 text-neutral-600'}`}>
                            {p.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Recent Portfolio Items */}
                <div className="p-5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                  <div className="flex items-center justify-between mb-3.5 pb-2 border-b border-neutral-100">
                    <h3 className="text-sm font-bold text-neutral-900">
                      {language === 'km' ? 'ស្នាដៃវីដេអូថ្មីៗ' : 'Recent Productions'}
                    </h3>
                    <button
                      onClick={() => setActiveTab('portfolio')}
                      className="text-xs text-accent-red hover:underline font-semibold"
                    >
                      {language === 'km' ? 'មើលទាំងអស់' : 'View All'}
                    </button>
                  </div>

                  {portfolio.length === 0 ? (
                    <p className="text-xs text-neutral-500">{language === 'km' ? 'មិនទាន់មានវីដេអូឡើយ។' : 'No portfolio entries.'}</p>
                  ) : (
                    <div className="space-y-2.5">
                      {portfolio.slice(0, 4).map((item) => (
                        <div key={item.id} className="flex items-center justify-between p-2.5 rounded-lg bg-neutral-50 border border-neutral-200/60">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded overflow-hidden bg-neutral-200 shrink-0 border border-neutral-200">
                              <img src={item.thumbnailURL || '/assets/logo.jpg'} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-neutral-900 truncate max-w-[200px]">{item.title}</p>
                              <span className="text-[10px] text-accent-red">{t.categories[item.category] || item.category}</span>
                            </div>
                          </div>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${item.status === 'published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-neutral-200 text-neutral-600'}`}>
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
            <div className="space-y-4">
              
              {/* Search & Filters */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-white border border-neutral-200 shadow-xs">
                {/* Search */}
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input
                    type="text"
                    placeholder={language === 'km' ? `ស្វែងរក...` : `Search...`}
                    value={searchQuery}
                    onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-900 placeholder-neutral-400 focus:border-neutral-900 focus:outline-none"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:border-neutral-900 focus:outline-none"
                >
                  <option value="all">{language === 'km' ? 'ស្ថានភាពទាំងអស់' : 'All Statuses'}</option>
                  <option value="published">{language === 'km' ? 'បានចេញផ្សាយ' : 'Published'}</option>
                  <option value="draft">{language === 'km' ? 'សេចក្តីព្រាង' : 'Draft'}</option>
                </select>

                {/* Category Filter */}
                <select
                  value={categoryFilter}
                  onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
                  className="px-3 py-1.5 rounded-lg bg-neutral-50 border border-neutral-200 text-xs text-neutral-800 focus:border-neutral-900 focus:outline-none"
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
                  description={language === 'km' ? 'មិនមានទិន្នន័យដែលត្រូវនឹងតម្រូវការស្វែងរកឡើយ។' : 'No items match your criteria.'}
                  action={
                    <button
                      onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'create')}
                      className="px-4 py-2 rounded-lg bg-neutral-900 text-white text-xs font-semibold"
                    >
                      {activeTab === 'posts' ? t.admin.newPost : t.admin.newPortfolio}
                    </button>
                  }
                />
              ) : (
                <div className="rounded-xl overflow-hidden border border-neutral-200 bg-white shadow-xs">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-600 uppercase tracking-wider font-semibold">
                        <tr>
                          <th className="py-3 px-4">{t.admin.tableItem}</th>
                          <th className="py-3 px-4">{t.admin.tableCategory}</th>
                          <th className="py-3 px-4">{t.admin.tableStatus}</th>
                          <th className="py-3 px-4">{t.admin.tableVideo}</th>
                          <th className="py-3 px-4">{t.admin.tableDate}</th>
                          <th className="py-3 px-4 text-right">{t.admin.tableActions}</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                        {paginatedItems.map((item) => (
                          <tr key={item.id} className="hover:bg-neutral-50 transition">
                            {/* Item Title & Thumb */}
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-10 h-10 rounded-lg overflow-hidden bg-neutral-100 shrink-0 border border-neutral-200">
                                  <img
                                    src={item.thumbnailURL || '/assets/logo.jpg'}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.onerror = null; e.target.src = '/assets/logo.jpg'; }}
                                  />
                                </div>
                                <div>
                                  <span className="font-semibold text-neutral-900 block max-w-xs truncate text-xs">
                                    {item.title}
                                  </span>
                                  <span className="text-[10px] text-neutral-400 font-mono block">
                                    /{item.slug}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Category */}
                            <td className="py-3 px-4 text-neutral-600">
                              {t.categories[item.category] || item.category}
                            </td>

                            {/* Status */}
                            <td className="py-3 px-4">
                              <span
                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase font-semibold ${
                                  item.status === 'published'
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : 'bg-neutral-100 text-neutral-600 border border-neutral-200'
                                }`}
                              >
                                <span className={`w-1.5 h-1.5 rounded-full ${item.status === 'published' ? 'bg-emerald-600' : 'bg-neutral-400'}`} />
                                {item.status}
                              </span>
                            </td>

                            {/* Video */}
                            <td className="py-3 px-4">
                              {item.videoURL ? (
                                <a
                                  href={item.videoURL}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-accent-red hover:underline flex items-center gap-1 font-mono text-[11px]"
                                >
                                  <span>{item.videoProvider || 'Video'}</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              ) : (
                                <span className="text-neutral-400">—</span>
                              )}
                            </td>

                            {/* Date */}
                            <td className="py-3 px-4 text-neutral-500 font-mono text-[11px]">
                              {formatDate(item.publishedAt || item.createdAt)}
                            </td>

                            {/* Actions */}
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button
                                  onClick={() => openEditor(activeTab === 'posts' ? 'post' : 'portfolio', 'edit', item)}
                                  className="p-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 transition"
                                  title={language === 'km' ? 'កែប្រែ' : 'Edit'}
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => setConfirmDelete({
                                    isOpen: true,
                                    type: activeTab === 'posts' ? 'post' : 'portfolio',
                                    id: item.id,
                                    thumbnailPath: item.thumbnailPath || null,
                                    title: item.title,
                                  })}
                                  className="p-1.5 rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition"
                                  title={language === 'km' ? 'លុប' : 'Delete'}
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  <div className="p-3.5 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500">
                    <span>
                      {language === 'km' 
                        ? `ទំព័រ ${currentPage} នៃ ${totalPages} (សរុប ${filteredItems.length})`
                        : `Page ${currentPage} of ${totalPages} (${filteredItems.length} total)`}
                    </span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                        disabled={currentPage === 1}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 disabled:opacity-40"
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="p-1.5 rounded-lg bg-white border border-neutral-200 disabled:opacity-40"
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}

        </div>
      </main>

      {/* CREATE / EDIT MODAL (CLEAN LIGHT THEME) */}
      {editorModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white border border-neutral-200 rounded-2xl shadow-xl p-6 sm:p-7 my-8 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3.5 mb-5 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-red" />
                <h3 className="text-base font-bold text-neutral-900">
                  {editorModal.mode === 'create' ? t.admin.createTitle : t.admin.editTitle} {editorModal.type === 'post' ? (language === 'km' ? 'អត្ថបទ' : 'Story') : (language === 'km' ? 'ស្នាដៃវីដេអូ' : 'Production')}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setEditorModal({ isOpen: false, mode: 'create', type: 'post', item: null })}
                className="text-neutral-400 hover:text-neutral-800 p-1 rounded-lg hover:bg-neutral-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs">
              
              {/* Title */}
              <div>
                <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                  {t.admin.titleLabel}
                </label>
                <input
                  type="text"
                  required
                  placeholder={language === 'km' ? "ចំណងជើង..." : "Title..."}
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 text-xs focus:outline-none"
                />
              </div>

              {/* Category & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                    {t.admin.categoryLabel}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 focus:outline-none"
                  >
                    {categoryOptions.map((opt) => (
                      <option key={opt.id} value={opt.id}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                    {t.admin.statusLabel}
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 focus:outline-none"
                  >
                    <option value="published">{t.admin.statusPublished}</option>
                    <option value="draft">{t.admin.statusDraft}</option>
                  </select>
                </div>
              </div>

              {/* Video URL with Live Provider Detection */}
              <div>
                <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                  {t.admin.videoLabel}
                </label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={formData.videoURL}
                  onChange={(e) => setFormData({ ...formData, videoURL: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 font-mono focus:outline-none"
                />
                
                {/* Live Video Preview Box */}
                {detectedVideo && (
                  <div className="mt-2.5 p-3 rounded-lg bg-neutral-50 border border-neutral-200">
                    <div className="flex items-center justify-between text-[11px] text-neutral-600 mb-2">
                      <span className="font-mono text-accent-red font-semibold">
                        Provider: {detectedVideo.provider.toUpperCase()}
                      </span>
                      <span>Preview</span>
                    </div>

                    {safeVideoEmbed ? (
                      <div className="aspect-video w-full rounded-md overflow-hidden bg-black">
                        <iframe
                          src={safeVideoEmbed}
                          title="Preview"
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        />
                      </div>
                    ) : (
                      <p className="text-[11px] text-neutral-500">
                        {language === 'km' ? 'វីដេអូនេះនឹងត្រូវបើកតាមរយៈតំណភ្ជាប់ផ្ទាល់។' : 'Video will open directly via external link.'}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                  {t.admin.thumbnailLabel}
                </label>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50">
                  {imagePreview ? (
                    <div className="w-16 h-16 rounded-md overflow-hidden border border-neutral-200 bg-white shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-md border border-dashed border-neutral-300 flex items-center justify-center text-neutral-400 shrink-0">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageChange}
                      className="block w-full text-xs text-neutral-600 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-md file:border file:border-neutral-200 file:text-xs file:font-medium file:bg-white file:text-neutral-800 hover:file:bg-neutral-100 cursor-pointer"
                    />
                    <p className="text-[10px] text-neutral-500">
                      JPG, PNG, WEBP (Max 10MB)
                    </p>
                    {uploadProgress > 0 && uploadProgress < 100 && (
                      <div className="w-full bg-neutral-200 rounded-full h-1">
                        <div
                          className="bg-accent-red h-1 rounded-full transition-all"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                  {t.admin.descLabel}
                </label>
                <textarea
                  required
                  rows={2}
                  placeholder={language === 'km' ? "ការពិពណ៌នាសង្ខេប..." : "Brief synopsis..."}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 text-xs focus:outline-none"
                />
              </div>

              {/* Full Content */}
              {editorModal.type === 'post' && (
                <div>
                  <label className="block text-neutral-700 font-semibold uppercase tracking-wider mb-1">
                    {t.admin.contentLabel}
                  </label>
                  <textarea
                    rows={5}
                    placeholder={language === 'km' ? "ខ្លឹមសាររឿងរ៉ាវពេញលេញ..." : "Full story text..."}
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg bg-white border border-neutral-200 focus:border-neutral-900 text-neutral-900 text-xs focus:outline-none"
                  />
                </div>
              )}

              {/* Featured Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 rounded border-neutral-300 text-accent-red focus:ring-accent-red"
                />
                <label htmlFor="featuredToggle" className="text-neutral-800 font-medium cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-accent-red" />
                  <span>{t.admin.featuredToggle}</span>
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-neutral-200">
                <button
                  type="button"
                  onClick={() => setEditorModal({ isOpen: false, mode: 'create', type: 'post', item: null })}
                  disabled={actionLoading}
                  className="px-3.5 py-1.5 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700"
                >
                  {t.admin.cancelBtn}
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white font-semibold shadow-xs flex items-center gap-2 disabled:opacity-50"
                >
                  {actionLoading ? (
                    <>
                      <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
