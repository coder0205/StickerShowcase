// src/components/AdminPanel.tsx
import { useState, useMemo, FormEvent } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  X, 
  Plus, 
  Trash2, 
  Edit, 
  Save, 
  RotateCcw, 
  Sparkles, 
  Upload, 
  Image as ImageIcon, 
  Info, 
  Layers, 
  Settings, 
  Palette, 
  Search, 
  FileText, 
  Check, 
  ChevronRight,
  Eye,
  ArrowRight,
  RefreshCw,
  FolderPlus
} from "lucide-react";
import { 
  WorkItem, 
  CategoryItem, 
  BG_COLORS_PRESET, 
  PHOTO_PRESETS,
  ICON_MAP
} from "../types";
import MediaLibraryModal from "./MediaLibraryModal";

interface AdminPanelProps {
  works: WorkItem[];
  categories: CategoryItem[];
  onSaveWorks: (newWorks: WorkItem[]) => void;
  onSaveCategories: (newCats: CategoryItem[]) => void;
  onResetToDefaults: () => void;
  onClose: () => void;
}

export default function AdminPanel({
  works,
  categories,
  onSaveWorks,
  onSaveCategories,
  onResetToDefaults,
  onClose
}: AdminPanelProps) {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return sessionStorage.getItem("sticker_admin_logged_in") === "true";
  });
  const [usernameInput, setUsernameInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  const handleLoginSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (usernameInput === "stickers" && passwordInput === "GL0t0wC1ge*xF^Xso!") {
      setIsLoggedIn(true);
      sessionStorage.setItem("sticker_admin_logged_in", "true");
      setLoginError("");
    } else {
      setLoginError("账号或密码不正确，请重新输入。 (Incorrect username or password)");
    }
  };

  const [activeTab, setActiveTab] = useState<"works" | "add-edit" | "categories" | "system">("works");
  const [searchQuery, setSearchQuery] = useState("");

  // Edit State
  const [editingWork, setEditingWork] = useState<WorkItem | null>(null);

  // Add/Edit Form fields state
  const [formName, setFormName] = useState("");
  const [formNames, setFormNames] = useState({ en: "", zh: "", fr: "", es: "", ar: "" });
  const [formCategory, setFormCategory] = useState("");
  const [formPrice, setFormPrice] = useState(9.99);
  const [formRating, setFormRating] = useState(5.0);
  const [formReviews, setFormReviews] = useState(1);
  const [formImage, setFormImage] = useState("");
  const [formBgColor, setFormBgColor] = useState("bg-[#FFEAD2]");
  const [formTag, setFormTag] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formDescriptions, setFormDescriptions] = useState({ en: "", zh: "", fr: "", es: "", ar: "" });
  const [formDetailedDesc, setFormDetailedDesc] = useState("");
  const [formDetailedDescs, setFormDetailedDescs] = useState({ en: "", zh: "", fr: "", es: "", ar: "" });
  const [galleryInputs, setGalleryInputs] = useState<string[]>([""]);

  // Category Form fields
  const [catNameInput, setCatNameInput] = useState("");
  const [catNames, setCatNames] = useState({ en: "", zh: "", fr: "", es: "", ar: "" });
  const [catMatchNameInput, setCatMatchNameInput] = useState("");
  const [catIconInput, setCatIconInput] = useState("Palette");

  // WooCommerce Layout Custom States
  const [isProductImageOpen, setIsProductImageOpen] = useState(true);
  const [isProductGalleryOpen, setIsProductGalleryOpen] = useState(true);
  const [isProductCategoriesOpen, setIsProductCategoriesOpen] = useState(true);
  const [categoryTab, setCategoryTab] = useState<"all" | "most-used">("all");
  const [isMainImagePickerOpen, setIsMainImagePickerOpen] = useState(false);
  const [isGalleryPickerOpen, setIsGalleryPickerOpen] = useState(false);
  const [isInlineAddCategoryOpen, setIsInlineAddCategoryOpen] = useState(false);
  const [inlineCatEn, setInlineCatEn] = useState("");
  const [inlineCatZh, setInlineCatZh] = useState("");
  const [inlineCatSlug, setInlineCatSlug] = useState("");

  // Media Modal states
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalMode, setMediaModalMode] = useState<"single" | "gallery">("single");

  // Filter works for list view
  const filteredWorks = useMemo(() => {
    if (!searchQuery.trim()) return works;
    const query = searchQuery.toLowerCase();
    return works.filter(w => 
      w.name.toLowerCase().includes(query) || 
      w.category.toLowerCase().includes(query) || 
      w.description.toLowerCase().includes(query)
    );
  }, [works, searchQuery]);

  // Set form values from editingWork
  const handleEditWorkClick = (work: WorkItem) => {
    setEditingWork(work);
    setFormName(work.name);
    setFormNames({
      en: work.names?.en || work.name || "",
      zh: work.names?.zh || work.name || "",
      fr: work.names?.fr || work.name || "",
      es: work.names?.es || work.name || "",
      ar: work.names?.ar || work.name || "",
    });
    setFormCategory(work.category);
    setFormPrice(work.price || 9.99);
    setFormRating(work.rating || 5.0);
    setFormReviews(work.reviews || 1);
    setFormImage(work.image);
    setFormBgColor(work.bgColor);
    setFormTag(work.tag || "");
    setFormDescription(work.description);
    setFormDescriptions({
      en: work.descriptions?.en || work.description || "",
      zh: work.descriptions?.zh || work.description || "",
      fr: work.descriptions?.fr || work.description || "",
      es: work.descriptions?.es || work.description || "",
      ar: work.descriptions?.ar || work.description || "",
    });
    setFormDetailedDesc(work.detailedDesc);
    setFormDetailedDescs({
      en: work.detailedDescs?.en || work.detailedDesc || "",
      zh: work.detailedDescs?.zh || work.detailedDesc || "",
      fr: work.detailedDescs?.fr || work.detailedDesc || "",
      es: work.detailedDescs?.es || work.detailedDesc || "",
      ar: work.detailedDescs?.ar || work.detailedDesc || "",
    });
    setGalleryInputs(work.gallery && work.gallery.length > 0 ? [...work.gallery] : [""]);
    setActiveTab("add-edit");
  };

  const handleCreateNewClick = () => {
    setEditingWork(null);
    setFormName("Creative Typography Sticker");
    setFormNames({
      en: "Creative Typography Sticker",
      zh: "创意文字贴纸",
      fr: "Autocollant de typographie créative",
      es: "Pegatina de tipografía creativa",
      ar: "ملصق الحروف الإبداعية"
    });
    // Default to first user category if available (excluding 'all')
    const userCats = categories.filter(c => c.id !== "all");
    setFormCategory(userCats.length > 0 ? userCats[0].matchName : "Branding");
    setFormPrice(8.88);
    setFormRating(4.9);
    setFormReviews(10);
    setFormImage(PHOTO_PRESETS[0].url);
    setFormBgColor(BG_COLORS_PRESET[0].class);
    setFormTag("New");
    setFormDescription("A premium typographic design sticker collection.");
    setFormDescriptions({
      en: "A premium typographic design sticker collection highlighting space layouts.",
      zh: "精美的创意排版设计贴纸系列，突显空间律动感。",
      fr: "Une collection d'autocollants au design typographique haut de gamme.",
      es: "Una colección de pegatinas de diseño tipográfico de primera calidad.",
      ar: "مجموعة ملصقات تصميم طباعي متميزة تبرز المساحة والخطوط."
    });
    setFormDetailedDesc("作品详细描述。");
    setFormDetailedDescs({
      en: "This project explores traditional printing layouts translated onto dynamic gloss sticker bases with durable adhesive backing and premium finishing coats.",
      zh: "本项目探索了将传统印刷排版转化为涂层高光贴纸的材质细节，具备出色防泼水耐摩擦能力及工艺手感。",
      fr: "Ce projet explore les mises en page d'impression traditionnelles sur des supports brillants.",
      es: "Este proyecto explora los diseños de impresión tradicionales en pegatinas brillantes.",
      ar: "يستكشف هذا المشروع تخطيطات الطباعة التقليدية المنقولة على ملصقات لامعة."
    });
    setGalleryInputs([PHOTO_PRESETS[0].url]);
    setActiveTab("add-edit");
  };

  // Gallery URL Array utilities
  const handleAddGalleryField = () => {
    setGalleryInputs([...galleryInputs, ""]);
  };

  const handleRemoveGalleryField = (index: number) => {
    const updated = [...galleryInputs];
    updated.splice(index, 1);
    setGalleryInputs(updated.length > 0 ? updated : [""]);
  };

  const handleGalleryUrlChange = (index: number, val: string) => {
    const updated = [...galleryInputs];
    updated[index] = val;
    setGalleryInputs(updated);
  };

  const handleSelectPresetMainImage = (url: string) => {
    setFormImage(url);
    setIsMainImagePickerOpen(false);
  };

  const handleSelectPresetGalleryImage = (url: string) => {
    const cleaned = galleryInputs.filter(item => item && item.trim() !== "");
    if (!cleaned.includes(url)) {
      setGalleryInputs([...cleaned, url]);
    }
  };

  const handleMediaModalSelect = (urls: string[]) => {
    if (mediaModalMode === "single") {
      setFormImage(urls[0] || "");
    } else {
      const cleaned = galleryInputs.filter(item => item && item.trim() !== "");
      const newUrls = [...cleaned];
      urls.forEach(url => {
        if (!newUrls.includes(url)) {
          newUrls.push(url);
        }
      });
      setGalleryInputs(newUrls.length > 0 ? newUrls : [""]);
    }
  };

  // Delete Work
  const handleDeleteWork = (id: number, name: string) => {
    if (confirm(`确定要删除作品《${name}》吗？此操作无法恢复。`)) {
      const remaining = works.filter(w => w.id !== id);
      onSaveWorks(remaining);
    }
  };

  // Submit Work Form
  const handleSaveWorkForm = (e: FormEvent) => {
    e.preventDefault();

    if (!formNames.en.trim() && !formNames.zh.trim()) {
      alert("请输入作品中英文名称！");
      return;
    }
    if (!formImage.trim()) {
      alert("请输入封面图片 URL！");
      return;
    }

    // Filter empty gallery fields
    const validGalleryUrls = galleryInputs.filter(url => url.trim() !== "");

    const payload: WorkItem = {
      id: editingWork ? editingWork.id : (works.length > 0 ? Math.max(...works.map(w => w.id)) + 1 : 1),
      name: formNames.en || formNames.zh || formName,
      names: { ...formNames },
      category: formCategory,
      price: Number(formPrice),
      rating: Number(formRating),
      reviews: Number(formReviews),
      image: formImage,
      gallery: validGalleryUrls.length > 0 ? validGalleryUrls : [formImage],
      bgColor: formBgColor,
      tag: formTag,
      description: formDescriptions.en || formDescriptions.zh || formDescription,
      descriptions: { ...formDescriptions },
      detailedDesc: formDetailedDescs.zh || formDetailedDescs.en || formDetailedDesc,
      detailedDescs: { ...formDetailedDescs }
    };

    let updatedWorks: WorkItem[] = [];
    if (editingWork) {
      updatedWorks = works.map(w => w.id === editingWork.id ? payload : w);
    } else {
      updatedWorks = [payload, ...works];
    }

    onSaveWorks(updatedWorks);
    setEditingWork(null);
    setActiveTab("works");
  };

  // Category Actions
  const handleAddCategory = (e: FormEvent) => {
    e.preventDefault();
    if (!catNames.en.trim() || !catNames.zh.trim()) {
      alert("请完整填写分类显示名称的中外语版本（中英文必填）！");
      return;
    }
    if (!catMatchNameInput.trim()) {
      alert("请完整填写分类匹配标识Slug！");
      return;
    }

    // Check conflict
    const safeId = (catNames.en || catNames.zh).toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === safeId || c.matchName === catMatchNameInput)) {
      alert("核心标识或分类名称已存在，请勿重复添加。");
      return;
    }

    const tKey = `custom_${Date.now()}`;

    const newCat: CategoryItem = {
      id: safeId,
      tKey: tKey,
      matchName: catMatchNameInput.trim(),
      iconName: catIconInput,
      names: { ...catNames }
    };

    const updated = [...categories, newCat];
    onSaveCategories(updated);
    
    // Clear inputs
    setCatNames({ en: "", zh: "", fr: "", es: "", ar: "" });
    setCatNameInput("");
    setCatMatchNameInput("");
    alert(`成功创建全新作品分类: ${catNames.zh || catNames.en}`);
  };

  const handleInlineAddCategorySubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!inlineCatEn.trim() || !inlineCatZh.trim() || !inlineCatSlug.trim()) {
      alert("请完整填写新分类英文、中文以及 Slug 标识！");
      return;
    }
    const safeId = inlineCatEn.toLowerCase().replace(/\s+/g, '-');
    if (categories.some(c => c.id === safeId || c.matchName === inlineCatSlug)) {
      alert("分类 Slug 或核心标识已存在！");
      return;
    }
    const newCat: CategoryItem = {
      id: safeId,
      tKey: `custom_${Date.now()}`,
      matchName: inlineCatSlug.trim(),
      iconName: "Palette",
      names: {
        en: inlineCatEn.trim(),
        zh: inlineCatZh.trim(),
        fr: inlineCatEn.trim(),
        es: inlineCatEn.trim(),
        ar: inlineCatEn.trim()
      }
    };
    onSaveCategories([...categories, newCat]);
    
    // Select the newly added category
    setFormCategory(inlineCatSlug.trim());
    
    // Clear state
    setInlineCatEn("");
    setInlineCatZh("");
    setInlineCatSlug("");
    setIsInlineAddCategoryOpen(false);
  };

  const handleDeleteCategory = (id: string, name: string) => {
    if (id === "all") {
      alert("对不起，系统默认分类「全部分类」不可删除！");
      return;
    }
    if (confirm(`确定要删除分类“${name}”吗？关联在此分类下的作品将不被分类过滤。`)) {
      const updated = categories.filter(c => c.id !== id);
      onSaveCategories(updated);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="fixed inset-0 z-[150] bg-[#f0f0f1] text-[#2c3338] flex flex-col items-center justify-center font-sans select-none overflow-y-auto select-text text-left min-h-screen">
        <div className="w-full max-w-[320px] mx-auto p-4 space-y-4">
          {/* WordPress Styled Logotype */}
          <div className="flex flex-col items-center gap-1">
            <div className="w-20 h-20 rounded-full bg-[#1d2327] flex items-center justify-center text-[#f0f0f1] font-serif font-black text-[46px] italic shadow-md">W</div>
            <span className="font-serif text-[#1d2327] text-xl font-bold mt-2">Sticker Studio Hub</span>
          </div>

          {/* Error display */}
          {loginError && (
            <div className="bg-white border-l-4 border-l-[#d54e21] border border-slate-300 p-3 rounded-sm shadow-sm text-xs text-[#1d2327] leading-relaxed">
              <strong>错误 (Error)</strong>: {loginError}
            </div>
          )}

          {/* Login container */}
          <form onSubmit={handleLoginSubmit} className="bg-white border border-[#ccd0d4] p-6 shadow-md rounded-md space-y-4">
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">用户名 (Username)</label>
              <input
                type="text"
                required
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[3px] text-sm text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
                autoFocus
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wide">密码 (Password)</label>
              <input
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[3px] text-sm text-[#1d2327] focus:border-[#2271b1] focus:outline-none"
              />
            </div>

            <div className="pt-2 flex items-center justify-between">
              <label className="flex items-center gap-1.5 cursor-pointer text-xs text-slate-500 select-none">
                <input type="checkbox" defaultChecked className="rounded-sm border-slate-300" />
                <span>记住我</span>
              </label>

              <button
                type="submit"
                className="bg-[#2271b1] hover:bg-[#135e96] active:bg-[#0a4b78] border border-[#0a4b78] text-white font-semibold py-1.5 px-3 rounded-[3px] text-xs shadow-sm cursor-pointer transition-all"
              >
                登录 (Log In)
              </button>
            </div>
          </form>

          {/* Back links */}
          <div className="flex items-center justify-between px-1 text-xs text-[#2271b1] hover:text-[#135e96]">
            <button 
              type="button" 
              onClick={onClose}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              ← 返回前台网站 (Back to site)
            </button>
            <span className="text-slate-400 font-mono text-[10px]">v1.0.0</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[150] bg-[#f0f0f1] text-[#2c3338] flex flex-col font-sans select-none overflow-hidden select-text text-left">
      
      {/* 1. Wordpress Classic Top Admin Bar */}
      <div className="h-8 bg-[#1d2327] text-[#c3c4c7] text-xs shrink-0 flex items-center justify-between px-3 z-50 select-none">
        <div className="flex items-center gap-4">
          {/* Wordpress Styled Logotype / Logo symbol */}
          <div className="flex items-center gap-1.5 cursor-pointer hover:bg-[#2c3338] hover:text-[#72aee6] h-8 px-2 transition-colors">
            <div className="w-5.5 h-5.5 rounded-full bg-[#8c8f94] hover:bg-[#72aee6] flex items-center justify-center text-[#1d2327] font-serif font-black text-[13px] italic">W</div>
            <span className="font-semibold text-white tracking-wide">Sticker Studio Hub</span>
          </div>

          <div className="hidden sm:flex items-center text-slate-400 gap-1 text-[11px] hover:text-[#72aee6] cursor-pointer" onClick={onClose}>
            <Eye size={12} />
            <span>查看站点首页 (View Site)</span>
          </div>

          <div className="h-4 w-[1px] bg-slate-700 hidden sm:block" />

          <div className="hidden md:flex items-center gap-3">
            <span className="text-[11px] text-[#c3c4c7]">
              文章标签总量: <strong className="text-white">{works.length}</strong>
            </span>
            <span className="text-[11px] text-[#c3c4c7]">
              分类统计: <strong className="text-white">{categories.filter(c => c.id !== 'all').length}</strong>
            </span>
          </div>
        </div>

        {/* User profile section ("Howdy") & Exit button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 hover:bg-[#2c3338] h-8 px-2 cursor-pointer transition-colors text-slate-300">
            <span className="hidden xs:inline">您好，管理员 (Howdy, Admin)</span>
            <div className="w-5 h-5 rounded-full bg-slate-600 border border-slate-500 flex items-center justify-center text-[10px] font-black font-mono text-white">A</div>
          </div>
          
          <button 
            onClick={onClose}
            className="bg-[#d54e21] hover:bg-[#b32317] text-white px-2.5 py-0.5 h-6 rounded-[3px] text-xs font-bold transition-all flex items-center gap-1"
            title="退出WP后台"
          >
            <X size={12} />
            <span>退出后台 (Exit)</span>
          </button>
        </div>
      </div>

      {/* Main workspace layout */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        
        {/* 2. Wordpress Styled Left Sidebar Menu */}
        <nav className="w-60 shrink-0 bg-[#1d2327] flex flex-col justify-between select-none z-10 border-r border-[#101416]">
          <div className="py-2">
            
            {/* Nav category separators */}
            <div className="px-4 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none border-b border-slate-800/50 mb-2">
              仪表盘 (Dashboard)
            </div>

            <div className="space-y-[2px]">
              <button
                onClick={() => setActiveTab("works")}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all text-left ${
                  activeTab === "works" 
                    ? "bg-[#2271b1] text-white font-semibold border-l-4 border-[#72aee6]" 
                    : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                }`}
              >
                <Layers size={16} className={activeTab === "works" ? "text-white" : "text-[#8c8f94]"} />
                <span>所有作品 (Stickers)</span>
              </button>

              <button
                onClick={handleCreateNewClick}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all text-left ${
                  activeTab === "add-edit" && !editingWork
                    ? "bg-[#2271b1] text-white font-semibold border-l-4 border-[#72aee6]" 
                    : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                }`}
              >
                <Plus size={16} className="text-emerald-400" />
                <span>撰写新作品 (Add New)</span>
              </button>

              <button
                onClick={() => setActiveTab("categories")}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all text-left ${
                  activeTab === "categories"
                    ? "bg-[#2271b1] text-white font-semibold border-l-4 border-[#72aee6]" 
                    : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                }`}
              >
                <Palette size={16} className={activeTab === "categories" ? "text-white" : "text-[#8c8f94]"} />
                <span>分类目录 (Categories)</span>
              </button>

              <button
                onClick={() => setActiveTab("system")}
                className={`w-full flex items-center gap-2.5 px-4 py-2 text-sm transition-all text-left ${
                  activeTab === "system"
                    ? "bg-[#2271b1] text-white font-semibold border-l-4 border-[#72aee6]" 
                    : "text-[#f0f0f1] hover:bg-[#2c3338] hover:text-[#72aee6]"
                }`}
              >
                <Settings size={16} className={activeTab === "system" ? "text-white" : "text-[#8c8f94]"} />
                <span>工具与维护 (Tools)</span>
              </button>
            </div>

            {/* Sub-menu section imitating real WP sub-menus */}
            <div className="mt-6 px-4 py-2 text-[10px] text-slate-500 font-bold uppercase tracking-wider select-none border-b border-slate-800/50 mb-2">
              快速发布预设 (Posts Presets)
            </div>
            <div className="px-4 py-2 space-y-2">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                点击一键跳转撰写界面进行编辑，或进行画廊的多维高清视觉测试。
              </p>
              <button 
                onClick={handleCreateNewClick}
                className="text-[11px] text-[#72aee6] hover:underline font-bold block"
              >
                + 新建空白草稿 (Draft Case)
              </button>
            </div>
          </div>

          {/* Quick tips & Core Local Storage sync indicator */}
          <div className="p-4 border-t border-slate-800 bg-[#15191c] text-[11px] text-slate-400 space-y-2 select-none">
            <div className="font-bold text-[#f0f0f1] flex items-center gap-1.5">
              <Info size={13} className="text-[#72aee6]" />
              <span>WordPress 样式后台:</span>
            </div>
            <p className="leading-snug">
              本页面完全按照 WordPress 经久不衰的经典黑白蓝三色管理控制台进行重新拟物重构。
            </p>
            <div className="pt-1 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse inline-block" />
              <span className="text-[9px] text-emerald-400 uppercase font-mono font-bold">本地存储已就绪</span>
            </div>
          </div>
        </nav>

        {/* 3. Content Area with WP Gray Canvas color */}
        <div className="flex-1 overflow-y-auto p-5 md:p-8 bg-[#f0f0f1]">
          <AnimatePresence mode="wait">
            
            {/* Tab 1: WP LIST TABLE ITEMS */}
            {activeTab === "works" && (
              <motion.div
                key="works-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                {/* Header & Add button */}
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-normal text-[#1d2327] font-serif">作品贴纸 (Stickers)</h1>
                  <button 
                    onClick={handleCreateNewClick}
                    className="border border-[#2271b1] text-[#2271b1] hover:bg-[#f6f9fc] active:bg-[#edf2f7] hover:text-[#135e96] rounded-[3px] text-xs font-semibold px-2.5 py-1 transition-all cursor-pointer bg-white"
                  >
                    写作品 (Add New)
                  </button>
                </div>

                {/* Subtitle status lines */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-[#50575e] font-medium pt-1">
                  <span className="text-slate-800 font-bold">全部 ({works.length})</span>
                  <span className="text-slate-350 font-normal">|</span>
                  <span className="hover:text-[#2271b1] cursor-pointer">已发布 ({works.length})</span>
                  <span className="text-slate-350 font-normal">|</span>
                  <span className="hover:text-[#2271b1] cursor-pointer">草稿箱 (0)</span>
                </div>

                {/* Search Bar / Filter tools */}
                <div className="flex flex-col sm:flex-row gap-3 justify-between items-start sm:items-center bg-white border border-[#ccd0d4] p-3 rounded-sm shadow-sm">
                  
                  {/* Bulk Select mimicking WordPress */}
                  <div className="flex items-center gap-2 text-xs">
                    <select className="border border-[#8c8f94] rounded-[3px] bg-white px-2.5 py-1 text-xs text-[#2c3338] outline-none focus:border-[#2271b1]">
                      <option>批量操作 (Bulk actions)</option>
                      <option>永久删除 (Delete Permanently)</option>
                    </select>
                    <button className="border border-[#3c434a] hover:bg-[#f6f7f7] text-[#2c3338] font-semibold py-1 px-3 rounded-[3px] transition-colors text-xs cursor-pointer">
                      应用
                    </button>
                  </div>

                  {/* Right search filter box */}
                  <div className="relative w-full sm:w-72">
                    <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={13} />
                    <input
                      type="text"
                      placeholder="搜索所有贴纸作品..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-white border border-[#8c8f94] py-1 pl-3 pr-8 rounded-[3px] text-xs focus:outline-none focus:border-[#2271b1] focus:ring-1 focus:ring-[#2271b1] transition-all font-medium text-slate-800 shadow-inner"
                    />
                  </div>
                </div>

                {filteredWorks.length === 0 ? (
                  <div className="bg-white border border-[#ccd0d4] rounded-sm p-12 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
                      <ArchiveIconWrapper />
                    </div>
                    <h3 className="text-sm font-bold text-[#1d2327]">找不到匹配的作品数据</h3>
                    <p className="text-xs text-slate-500 max-w-sm mx-auto">建议尝试更改检索词、分类名称，或点击按钮撰写。 </p>
                    <button 
                      onClick={handleCreateNewClick}
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white font-bold py-1.5 px-4 text-xs rounded-[3px] transition-all shadow-sm cursor-pointer border border-[#0a4b78]"
                    >
                      撰写第一篇贴纸作品
                    </button>
                  </div>
                ) : (
                  /* WordPress Striped Posts List Table style */
                  <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="bg-[#f6f7f7] border-b border-[#ccd0d4] font-bold text-[#1d2327] select-none text-[11px]">
                            <th className="py-3 px-4 w-20">封面图</th>
                            <th className="py-3 px-4">名称 / 作者 (Title)</th>
                            <th className="py-3 px-4 w-32">分类目录 (Categories)</th>
                            <th className="py-3 px-4 w-20">多图画廊</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#dcdcde] text-slate-700">
                          {filteredWorks.map((work) => (
                            <tr key={work.id} className="hover:bg-[#f6f7f7] transition-colors group">
                              <td className="py-3 px-4">
                                <div className={`w-10 h-10 rounded-sm overflow-hidden border border-[#ccd0d4] flex-shrink-0 ${work.bgColor || 'bg-[#FAFAFA]'} p-0.5`}>
                                  <img src={work.image} className="w-full h-full object-cover" alt="" />
                                </div>
                              </td>
                              <td className="py-2.5 px-4">
                                <div className="space-y-1">
                                  {/* Title link and Classic Inline Actions upon hover */}
                                  <div className="font-bold text-[#2271b1] hover:text-[#135e96] text-sm leading-tight cursor-pointer" onClick={() => handleEditWorkClick(work)}>
                                    {work.name}
                                  </div>
                                  
                                  {/* WP Signature Hover row actions! */}
                                  <div className="flex items-center gap-1.5 text-[11px] font-normal text-slate-400 opacity-20 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    <button 
                                      onClick={() => handleEditWorkClick(work)}
                                      className="text-[#2271b1] hover:text-[#135e96] hover:underline"
                                    >
                                      编辑 (Edit)
                                    </button>
                                    <span>|</span>
                                    <button 
                                      onClick={() => handleDeleteWork(work.id, work.name)}
                                      className="text-red-600 hover:text-red-700 hover:underline"
                                    >
                                      移至回收站 (Trash)
                                    </button>
                                    <span>|</span>
                                    <span className="text-slate-500 font-semibold font-mono">
                                      ID: #{work.id}
                                    </span>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <span className="text-[#2271b1] hover:underline font-semibold cursor-pointer">
                                  {work.category}
                                </span>
                              </td>
                              <td className="py-3 px-4 font-mono font-semibold text-slate-500">
                                {work.gallery ? `${work.gallery.length} 张` : "1 张 (单图)"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* WP List Footer details */}
                    <div className="bg-[#f6f7f7] border-t border-[#ccd0d4] px-4 py-2 flex items-center justify-between text-[11px] text-slate-500 font-semibold select-none">
                      <div>
                        正在显示第 1-{filteredWorks.length} 项，共 {filteredWorks.length} 项
                      </div>
                      <div className="font-mono text-[10px] text-slate-400">
                        WP Engine Custom Database v2.5
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Tab 2: Classic Block/Post Editor Style Layout */}
            {activeTab === "add-edit" && (
              <motion.div
                key="add-edit-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-normal text-[#1d2327] font-serif">
                    {editingWork ? `编辑作品属灵属性 (Edit Post)` : "撰写并发布新设计贴纸 (Add New Post)"}
                  </h1>
                  <p className="text-xs text-slate-500 mt-1">
                    WordPress 深度可视渲染器提供实效草稿预览和多图画廊。
                  </p>
                </div>

                <form onSubmit={handleSaveWorkForm} className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                  
                  {/* LEFT: Main Content Post area (8 Columns) */}
                  <div className="lg:col-span-9 space-y-5">
                    
                    {/* Title field - 5 languages multilingual input boxes */}
                    <div className="bg-white border border-[#ccd0d4] p-4 rounded-sm shadow-sm space-y-3">
                      <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide border-b border-slate-100 pb-1.5 flex items-center justify-between">
                        <span>产品名称 (Product Title in 5 Languages)</span>
                        <span className="text-[10px] text-red-500 lowercase">* English/Chinese 必填 (Required)</span>
                      </h3>
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block">EN - 英语 Version (English Title)</label>
                          <input
                            type="text"
                            required
                            placeholder="English Name of the product..."
                            value={formNames.en}
                            onChange={(e) => setFormNames({ ...formNames, en: e.target.value })}
                            className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs font-medium focus:border-[#2271b1]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block">ZH - 中文 Version (中文产品名称)</label>
                          <input
                            type="text"
                            required
                            placeholder="产品设计中文名称..."
                            value={formNames.zh}
                            onChange={(e) => setFormNames({ ...formNames, zh: e.target.value })}
                            className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs font-medium focus:border-[#2271b1]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block">FR - 法语 Version (Titre du produit en Français)</label>
                          <input
                            type="text"
                            required
                            placeholder="Nom Français du produit..."
                            value={formNames.fr}
                            onChange={(e) => setFormNames({ ...formNames, fr: e.target.value })}
                            className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs font-medium focus:border-[#2271b1]"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block">ES - 西班牙语 Version (Título del producto en Español)</label>
                          <input
                            type="text"
                            required
                            placeholder="Nombre Español del producto..."
                            value={formNames.es}
                            onChange={(e) => setFormNames({ ...formNames, es: e.target.value })}
                            className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs font-medium focus:border-[#2271b1]"
                          />
                        </div>
                        <div className="space-y-1 text-right" dir="rtl">
                          <label className="text-[10px] font-mono font-bold text-slate-500 block text-right">AR - 阿拉伯语 Version (العنوان باللغة العربية)</label>
                          <input
                            type="text"
                            required
                            placeholder="العنوان باللغة العربية..."
                            value={formNames.ar}
                            onChange={(e) => setFormNames({ ...formNames, ar: e.target.value })}
                            className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs text-right font-medium focus:border-[#2271b1]"
                          />
                        </div>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono mt-1 pt-1 border-t border-dashed border-slate-200">
                        <span>永久链接(Permalink)基准:</span>
                        <span className="text-[#2271b1] underline truncate ml-1.5">
                          https://sticker.studio/works/{(formNames.en || "").toLowerCase().replace(/\s+/g, '-')}
                        </span>
                      </div>
                    </div>

                    {/* TinyMCE imitating text editor box */}
                    <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm overflow-hidden">
                      <div className="bg-[#f6f7f7] border-b border-[#ccd0d4] p-2 flex flex-wrap items-center gap-2 select-none">
                        <span className="text-slate-500 font-bold text-xs pr-2 border-r border-slate-300 mr-1">内容编辑器</span>
                        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
                          <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-150">B</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-150 italic">I</span>
                          <span className="px-1.5 py-0.5 bg-white border border-slate-300 rounded-[2px] cursor-pointer hover:bg-slate-150 underline">U</span>
                          <span className="px-1.5 py-0.5 bg-[#f0f0f1] border border-slate-300 rounded-[2px] cursor-normal">Markdown已勾选</span>
                        </div>
                      </div>

                      <div className="p-4 space-y-5">
                        {/* 1. Brief Highlights (5 Language inputs) */}
                        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                          <label className="text-xs font-bold text-slate-700 block border-b border-dashed border-slate-300 pb-1.5 flex items-center justify-between">
                            <span>产品简要提炼亮点 (Brief Highlights in 5 Languages)</span>
                            <span className="text-[10px] text-slate-400 font-normal">多国语言精炼亮点 (English & Chinese are required)</span>
                          </label>
                          
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">EN - 英语 Version (English Highlights)</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="English summary..."
                                value={formDescriptions.en}
                                onChange={(e) => setFormDescriptions({ ...formDescriptions, en: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs leading-normal text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">ZH - 中文 Version (中文提炼亮点)</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="中文提炼亮点..."
                                value={formDescriptions.zh}
                                onChange={(e) => setFormDescriptions({ ...formDescriptions, zh: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs leading-normal text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">FR - 法语 Version (Highlights en Français)</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="Description en Français..."
                                value={formDescriptions.fr}
                                onChange={(e) => setFormDescriptions({ ...formDescriptions, fr: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs leading-normal text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">ES - 西文 Version (Highlights en Español)</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="Descripción en Español..."
                                value={formDescriptions.es}
                                onChange={(e) => setFormDescriptions({ ...formDescriptions, es: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs leading-normal text-slate-800"
                              />
                            </div>
                            <div className="space-y-1 text-right" dir="rtl">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block text-right">AR - 阿文 Version (ملخص باللغة العربية)</span>
                              <textarea
                                rows={2}
                                required
                                placeholder="ملخص باللغة العربية..."
                                value={formDescriptions.ar}
                                onChange={(e) => setFormDescriptions({ ...formDescriptions, ar: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs leading-normal text-slate-800 text-right"
                              />
                            </div>
                          </div>
                        </div>

                        {/* 2. Detailed stories (5 Language inputs) */}
                        <div className="space-y-3 p-3 bg-slate-50 border border-slate-200 rounded-sm">
                          <label className="text-xs font-bold text-slate-700 block border-b border-dashed border-slate-300 pb-1.5">
                            产品详细工艺灵感叙事说明 (Detailed Narrative in 5 Languages)
                          </label>
                          
                          <div className="space-y-3">
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">EN - 英语 (English Craft Details)</span>
                              <textarea
                                rows={3}
                                required
                                placeholder="English detailed production details and design inspirations..."
                                value={formDetailedDescs.en}
                                onChange={(e) => setFormDetailedDescs({ ...formDetailedDescs, en: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs leading-relaxed text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">ZH - 中文 (中文详细叙事说明)</span>
                              <textarea
                                rows={3}
                                required
                                placeholder="中文详细材料、工艺配合、印金、防伪纹理及背胶触觉叙事..."
                                value={formDetailedDescs.zh}
                                onChange={(e) => setFormDetailedDescs({ ...formDetailedDescs, zh: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs leading-relaxed text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">FR - 法语 (Détail de fabrication Français)</span>
                              <textarea
                                rows={3}
                                required
                                placeholder="Spécifications détaillées en Français..."
                                value={formDetailedDescs.fr}
                                onChange={(e) => setFormDetailedDescs({ ...formDetailedDescs, fr: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs leading-relaxed text-slate-800"
                              />
                            </div>
                            <div className="space-y-1">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block">ES - 西班牙语 (Detalles de producción Español)</span>
                              <textarea
                                rows={3}
                                required
                                placeholder="Especificaciones detalladas en Español..."
                                value={formDetailedDescs.es}
                                onChange={(e) => setFormDetailedDescs({ ...formDetailedDescs, es: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs leading-relaxed text-slate-800"
                              />
                            </div>
                            <div className="space-y-1 text-right" dir="rtl">
                              <span className="text-[10px] font-mono font-bold text-slate-500 block text-right">AR - 阿拉伯语 (شرح التفاصيل باللغة العربية)</span>
                              <textarea
                                rows={3}
                                required
                                placeholder="المواصفات الفنية والتفاصيل الكاملة باللغة العربية..."
                                value={formDetailedDescs.ar}
                                onChange={(e) => setFormDetailedDescs({ ...formDetailedDescs, ar: e.target.value })}
                                className="w-full bg-white border border-[#8c8f94] p-2 rounded-[2px] text-xs leading-relaxed text-slate-800 text-right"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                  </div>

                  {/* RIGHT: Publish Actions Sidebar (3 Columns) */}
                  <div className="lg:col-span-3 space-y-4">
                    
                    {/* Sidebar Card 1: Publish panel */}
                    <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm select-none">
                      <div className="bg-[#f6f7f7] border-b border-[#ccd0d4] px-3 py-2">
                        <span className="font-semibold text-xs text-[#1d2327]">发布 (Publish Meta Box)</span>
                      </div>

                      <div className="p-3 space-y-3.5 text-xs text-[#50575e]">
                        
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span>状态: <strong className="text-slate-800">已设计草稿</strong></span>
                          <span className="text-[#2271b1] hover:underline cursor-pointer">编辑</span>
                        </div>

                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span>公开度: <strong className="text-slate-800">公开 (Public)</strong></span>
                          <span className="text-[#2271b1] hover:underline cursor-pointer">编辑</span>
                        </div>

                        <div className="flex justify-between items-center">
                          <span>发布时间: <strong className="text-slate-800">立即 (Immediately)</strong></span>
                        </div>

                        {/* Publish Footer buttons */}
                        <div className="bg-[#f6f7f7] -mx-3 -mb-3 p-2.5 border-t border-[#ccd0d4] flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingWork(null);
                              setActiveTab("works");
                            }}
                            className="text-[#2271b1] hover:text-red-600 underline text-xs cursor-pointer font-medium"
                          >
                            放弃草稿 (Discard)
                          </button>

                          <button
                            type="submit"
                            className="bg-[#2271b1] hover:bg-[#135e96] hover:border-[#0a4b78] text-white font-medium py-1.5 px-3.5 rounded-[3px] text-xs border border-[#0a4b78] shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            <Save size={13} />
                            <span>{editingWork ? "更新作品" : "发布作品"}</span>
                          </button>
                        </div>

                      </div>
                    </div>

                    {/* Sidebar Card 2: WooCommerce Product Categories (Mockup 2) */}
                    <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm select-none">
                      {/* Header */}
                      <div 
                        onClick={() => setIsProductCategoriesOpen(!isProductCategoriesOpen)}
                        className="bg-white border-b border-[#ccd0d4] px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-xs text-[#1d2327]">Product categories (分类目录)</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                          </span>
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                          </span>
                          <span className={`hover:text-slate-600 transition-transform ${isProductCategoriesOpen ? "" : "rotate-180"}`}>
                            <svg className="w-3 h-3 fill-current text-slate-500" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                          </span>
                        </div>
                      </div>

                      {/* Content Panel */}
                      {isProductCategoriesOpen && (
                        <div className="p-3 text-xs space-y-2">
                          {/* Tabs Header */}
                          <div className="flex items-center gap-1 border-b border-[#ccd0d4] -mx-3 px-3 mb-2">
                            <button
                              type="button"
                              onClick={() => setCategoryTab("all")}
                              className={`px-3 py-1.5 border-t border-x rounded-t-[3px] text-xs font-semibold -mb-[1px] ${
                                categoryTab === "all"
                                  ? "bg-white border-[#ccd0d4] text-[#2c3338]"
                                  : "border-transparent text-[#2271b1] hover:text-[#135e96] bg-[#f6f7f7]"
                              }`}
                            >
                              All categories
                            </button>
                            <button
                              type="button"
                              onClick={() => setCategoryTab("most-used")}
                              className={`px-3 py-1.5 border-t border-x rounded-t-[3px] text-xs font-semibold -mb-[1px] ${
                                categoryTab === "most-used"
                                  ? "bg-white border-[#ccd0d4] text-[#2c3338]"
                                  : "border-transparent text-[#2271b1] hover:text-[#135e96] bg-[#f6f7f7]"
                              }`}
                            >
                              Most Used
                            </button>
                          </div>

                          {/* Categories Checkbox List */}
                          <div className="h-[150px] overflow-y-auto border border-[#ccd0d4] p-2.5 bg-white space-y-1.5 rounded-[2px] font-sans">
                            {categoryTab === "all" ? (
                              <div className="space-y-1.5">
                                {/* Root "Products" Checkbox as in mockup */}
                                <div className="flex items-start gap-1.5 font-semibold text-[#1d2327]">
                                  <input 
                                    type="checkbox" 
                                    defaultChecked 
                                    className="rounded-[3px] border-[#8c8f94] text-[#2271b1] focus:ring-[#2271b1] mt-0.5" 
                                  />
                                  <span>Products / 产品</span>
                                </div>

                                {/* Dynamic Subcategories */}
                                <div className="pl-4 space-y-1.5 border-l border-slate-100">
                                  {categories.filter(c => c.id !== 'all').map((cat) => {
                                    const isChecked = formCategory === cat.matchName;
                                    return (
                                      <label 
                                        key={cat.id} 
                                        className="flex items-start gap-2 cursor-pointer hover:text-[#2271b1] transition-colors leading-tight"
                                      >
                                        <input
                                          type="checkbox"
                                          checked={isChecked}
                                          onChange={() => setFormCategory(cat.matchName)}
                                          className="rounded-[3px] border-[#8c8f94] text-[#2271b1] focus:ring-[#2271b1] mt-0.5"
                                        />
                                        <span className="text-slate-700">
                                          {cat.matchName} <span className="text-[10px] text-slate-400">({cat.names?.zh})</span>
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            ) : (
                              // Most Used tab filters to active categories with any historical counts
                              <div className="space-y-1.5">
                                {categories.slice(0, 3).filter(c => c.id !== 'all').map((cat) => {
                                  const isChecked = formCategory === cat.matchName;
                                  return (
                                    <label key={cat.id} className="flex items-center gap-2 cursor-pointer hover:text-[#2271b1]">
                                      <input
                                        type="checkbox"
                                        checked={isChecked}
                                        onChange={() => setFormCategory(cat.matchName)}
                                        className="rounded-[3px] border-[#8c8f94]"
                                      />
                                      <span className="text-slate-700">{cat.matchName}</span>
                                    </label>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* Add New Category Trigger */}
                          <div>
                            <button
                              type="button"
                              onClick={() => setIsInlineAddCategoryOpen(!isInlineAddCategoryOpen)}
                              className="text-[#2271b1] hover:text-[#135e96] hover:underline hover:underline-offset-2 font-medium text-xs text-left inline-block"
                            >
                              + Add new category
                            </button>
                          </div>

                          {/* Drawer Form for inline adding category */}
                          <AnimatePresence>
                            {isInlineAddCategoryOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#f6f7f7] border border-[#ccd0d4] p-3 rounded-[3px] space-y-2 mt-1 overflow-hidden"
                              >
                                <h4 className="text-[11px] font-bold text-[#1d2327]">Quick Add Category (快速建类)</h4>
                                <div className="space-y-1 text-slate-700">
                                  <input 
                                    type="text" 
                                    placeholder="English (e.g. Holo Stickers)" 
                                    value={inlineCatEn}
                                    onChange={(e) => setInlineCatEn(e.target.value)}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xxs rounded-[2px]"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="中文名 (例: 炫彩激光贴)" 
                                    value={inlineCatZh}
                                    onChange={(e) => setInlineCatZh(e.target.value)}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xxs rounded-[2px]"
                                  />
                                  <input 
                                    type="text" 
                                    placeholder="Slug Match ID (e.g. Holographic)" 
                                    value={inlineCatSlug}
                                    onChange={(e) => setInlineCatSlug(e.target.value)}
                                    className="w-full bg-white border border-[#8c8f94] p-1 text-xxs font-mono rounded-[2px]"
                                  />
                                </div>
                                <div className="flex justify-end gap-1.5 pt-1">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setIsInlineAddCategoryOpen(false);
                                      setInlineCatEn("");
                                      setInlineCatZh("");
                                      setInlineCatSlug("");
                                    }}
                                    className="px-2 py-0.5 bg-slate-200 text-slate-600 rounded-[2px] text-[10px]"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="button"
                                    onClick={handleInlineAddCategorySubmit}
                                    className="px-2 py-0.5 bg-[#2271b1] text-white hover:bg-[#135e96] rounded-[2px] text-[10px]"
                                  >
                                    Add New
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>


                    {/* Sidebar Card 3: WooCommerce Product Image (Mockup 1 Left) */}
                    <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm select-none">
                      {/* Header */}
                      <div 
                        onClick={() => setIsProductImageOpen(!isProductImageOpen)}
                        className="bg-white border-b border-[#ccd0d4] px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-xs text-[#1d2327]">Product image (产品特色图片)</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                          </span>
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                          </span>
                          <span className={`hover:text-slate-600 transition-transform ${isProductImageOpen ? "" : "rotate-180"}`}>
                            <svg className="w-3 h-3 fill-current text-slate-500" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                          </span>
                        </div>
                      </div>

                      {/* Content Panel */}
                      {isProductImageOpen && (
                        <div className="p-3.5 space-y-3">
                          {/* Image Box Container */}
                          <div className="border border-[#ccd0d4] p-1.5 bg-[#f6f7f7] rounded-[2px] relative group hover:border-slate-400 transition-colors max-w-full">
                            <div 
                              onClick={() => {
                                setMediaModalMode("single");
                                setIsMediaModalOpen(true);
                              }}
                              className={`aspect-square w-full rounded-[1px] overflow-hidden relative cursor-pointer flex items-center justify-center p-2 border border-slate-250 shadow-inner ${formBgColor}`}
                            >
                              {formImage ? (
                                <img 
                                  src={formImage} 
                                  referrerPolicy="no-referrer"
                                  className="max-w-full max-h-full object-contain transition-transform group-hover:scale-105 duration-300" 
                                  alt="Product graphic preview" 
                                />
                              ) : (
                                <div className="text-slate-400 text-[11px] flex flex-col items-center gap-1">
                                  <ImageIcon size={20} className="text-slate-300" />
                                  <span>Set product image</span>
                                </div>
                              )}
                              
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-semibold">
                                Click to change image
                              </div>
                            </div>

                            {/* Question mark helper as in the screenshot bottom-left of the picture border */}
                            <div className="absolute -bottom-2 -left-2 bg-white rounded-full p-0.5 z-10">
                              <span 
                                className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 font-bold text-[9px] cursor-help select-none shadow-sm"
                                title="This image will represent your design in lists, grids and detail covers."
                              >
                                ?
                              </span>
                            </div>
                          </div>

                          {/* Quick Instruction Text */}
                          <p 
                            onClick={() => {
                              setMediaModalMode("single");
                              setIsMediaModalOpen(true);
                            }}
                            className="text-[#50575e] hover:text-[#2271b1] text-xs cursor-pointer select-none leading-normal text-left"
                          >
                            Click the image to browse & modify (点击图片打开经典媒体库)
                          </p>

                          {/* Custom Expandable Preset Image Selector */}
                          <AnimatePresence>
                            {isMainImagePickerOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#f0f0f1] border border-[#ccd0d4] p-2.5 rounded-[3px] space-y-2 mt-1 overflow-hidden"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-700 uppercase">Select Sticker Image Preset</span>
                                  <button
                                    type="button"
                                    onClick={() => setIsMainImagePickerOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>
                                
                                {/* Photo Presets Grid */}
                                <div className="grid grid-cols-5 gap-1 max-h-[100px] overflow-y-auto pr-1">
                                  {PHOTO_PRESETS.map((p, idx) => (
                                    <div 
                                      key={p.url}
                                      onClick={() => handleSelectPresetMainImage(p.url)}
                                      className="aspect-square bg-white border border-slate-350 hover:border-[#2271b1] p-0.5 rounded-[2px] cursor-pointer"
                                      title={p.name}
                                    >
                                      <img src={p.url} className="w-full h-full object-contain" alt="" />
                                    </div>
                                  ))}
                                </div>

                                {/* Manual Input Field */}
                                <div className="space-y-1 bg-white p-1.5 border border-[#ccd0d4] rounded-[2px]">
                                  <label className="text-[9px] text-slate-500 font-bold block">Or Paste Image URL (或粘贴任何网络图片地址):</label>
                                  <input 
                                    type="text" 
                                    value={formImage}
                                    onChange={(e) => setFormImage(e.target.value)}
                                    placeholder="Enter image URL..."
                                    className="w-full bg-white border border-slate-300 p-1 text-[11px] font-mono rounded-[1px] focus:outline-none focus:border-[#2271b1]"
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500">
                                  <span>选择贴纸底色:</span>
                                  <select 
                                    value={formBgColor}
                                    onChange={(e) => setFormBgColor(e.target.value)}
                                    className="border border-slate-300 bg-white p-0.5 text-[9px] font-semibold"
                                  >
                                    {BG_COLORS_PRESET.map(bg => (
                                      <option key={bg.class} value={bg.class}>{bg.name}</option>
                                    ))}
                                  </select>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Remove Action Link */}
                          {formImage && (
                            <div className="pt-1 text-left">
                              <button
                                type="button"
                                onClick={() => setFormImage("")}
                                className="text-[#a24021] hover:text-red-700 underline text-xs cursor-pointer font-medium"
                              >
                                Remove product image
                              </button>
                            </div>
                          )}
                        </div>
                      )}
                    </div>


                    {/* Sidebar Card 4: WooCommerce Product Gallery (Mockup 1 Right) */}
                    <div className="bg-white border border-[#ccd0d4] rounded-sm shadow-sm select-none">
                      {/* Header */}
                      <div 
                        onClick={() => setIsProductGalleryOpen(!isProductGalleryOpen)}
                        className="bg-white border-b border-[#ccd0d4] px-3 py-2.5 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                      >
                        <span className="font-semibold text-xs text-[#1d2327]">Product gallery (产品画廊多图)</span>
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M12 8l-6 6 1.41 1.41L12 10.83l4.59 4.58L18 14z"/></svg>
                          </span>
                          <span className="hover:text-slate-600">
                            <svg className="w-2.5 h-2.5 fill-current" viewBox="0 0 24 24"><path d="M16.59 8.59L12 13.17 7.41 8.59 6 10l6 6 6-6z"/></svg>
                          </span>
                          <span className={`hover:text-slate-600 transition-transform ${isProductGalleryOpen ? "" : "rotate-180"}`}>
                            <svg className="w-3 h-3 fill-current text-slate-500" viewBox="0 0 24 24"><path d="M7 14l5-5 5 5z"/></svg>
                          </span>
                        </div>
                      </div>

                      {/* Content Panel */}
                      {isProductGalleryOpen && (
                        <div className="p-3.5 space-y-3">
                          {/* Grid layout of small thumbnail gallery items */}
                          {galleryInputs.filter(g => g.trim() !== "").length > 0 ? (
                            <div className="grid grid-cols-4 gap-2">
                              {galleryInputs.map((inputUrl, idx) => {
                                if (!inputUrl.trim()) return null;
                                return (
                                  <div 
                                    key={idx} 
                                    className="aspect-square bg-[#f6f7f7] border border-[#ccd0d4] p-0.5 rounded-[2px] relative group overflow-hidden"
                                  >
                                    <img 
                                      src={inputUrl} 
                                      className="w-full h-full object-cover rounded-[1px]" 
                                      alt="" 
                                    />
                                    {/* Quick removal hover button */}
                                    <button
                                      type="button"
                                      onClick={() => handleRemoveGalleryField(idx)}
                                      className="absolute -top-1 -right-1 bg-red-600 text-white rounded-full w-4 h-4 text-[9px] items-center justify-center flex opacity-0 group-hover:opacity-100 transition-opacity shadow-sm cursor-pointer"
                                      title="Remove image"
                                    >
                                      ✕
                                    </button>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className="border border-dashed border-[#ccd0d4] p-4 text-center text-[10px] text-slate-400 bg-slate-50 rounded-[2px]">
                              No gallery images selected yet.
                            </div>
                          )}

                          {/* Add link widget with question mark help */}
                          <div className="flex items-center gap-1.5 pt-1 text-left">
                            <button
                              type="button"
                              onClick={() => {
                                setMediaModalMode("gallery");
                                setIsMediaModalOpen(true);
                              }}
                              className="text-[#2271b1] hover:text-[#135e96] underline text-xs cursor-pointer font-medium"
                            >
                              Add product gallery images (打开媒体库添加画廊多图)
                            </button>
                            <span 
                              className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-slate-200 text-slate-500 font-bold text-[9px] cursor-help select-none"
                              title="Set zoomed highlights. Hovering over thumbnails displays the physical optical magnifying lens overlays."
                            >
                              ?
                            </span>
                          </div>

                          {/* Gallery URL Multi-picker Panel */}
                          <AnimatePresence>
                            {isGalleryPickerOpen && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-[#f0f0f1] border border-[#ccd0d4] p-3 rounded-[3px] space-y-2 mt-1 overflow-hidden"
                              >
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-slate-700 uppercase">Gallery Multi-Select Presets</span>
                                  <button
                                    type="button"
                                    onClick={() => setIsGalleryPickerOpen(false)}
                                    className="text-slate-400 hover:text-slate-600 text-xs font-bold"
                                  >
                                    ✕
                                  </button>
                                </div>

                                <p className="text-[9px] text-slate-500 font-medium leading-relaxed">
                                  Click any sticker preset to add it to this product's closeup lens zoom gallery.
                                </p>

                                {/* Click thumbnail to append to gallery */}
                                <div className="grid grid-cols-5 gap-1.5 max-h-[100px] overflow-y-auto pr-1 bg-white p-1 rounded border border-[#ccd0d4]">
                                  {PHOTO_PRESETS.map((p) => {
                                    const isAdded = galleryInputs.includes(p.url);
                                    return (
                                      <div 
                                        key={p.url}
                                        onClick={() => handleSelectPresetGalleryImage(p.url)}
                                        className={`aspect-square relative p-0.5 rounded-[2px] cursor-pointer transition-all border ${
                                          isAdded ? "border-emerald-500 bg-emerald-50 opacity-60" : "border-slate-300 hover:border-[#2271b1]"
                                        }`}
                                      >
                                        <img src={p.url} className="w-full h-full object-contain" alt="" />
                                        {isAdded && (
                                          <div className="absolute inset-0 flex items-center justify-center text-emerald-600 text-[10px] font-bold">✓</div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>

                                {/* Custom manual entry append */}
                                <div className="space-y-1 bg-white p-2 border border-[#ccd0d4] rounded-[2px] flex items-center gap-1">
                                  <input 
                                    id="manual-gallery-input"
                                    type="text" 
                                    placeholder="Paste raw detail image URL..."
                                    className="flex-1 bg-white border border-slate-300 px-1.5 py-1 text-[10px] font-mono rounded-[1px] focus:outline-none focus:border-[#2271b1]"
                                    onKeyDown={(e) => {
                                      if (e.key === "Enter") {
                                        e.preventDefault();
                                        const inputEl = document.getElementById("manual-gallery-input") as HTMLInputElement;
                                        if (inputEl && inputEl.value.trim()) {
                                          handleSelectPresetGalleryImage(inputEl.value.trim());
                                          inputEl.value = "";
                                        }
                                      }
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      const inputEl = document.getElementById("manual-gallery-input") as HTMLInputElement;
                                      if (inputEl && inputEl.value.trim()) {
                                        handleSelectPresetGalleryImage(inputEl.value.trim());
                                        inputEl.value = "";
                                      }
                                    }}
                                    className="bg-slate-300 hover:bg-slate-400 text-slate-700 px-2 py-1 text-[10.5px] font-bold rounded-[1px]"
                                  >
                                    Add
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      )}
                    </div>


                  </div>
                </form>
              </motion.div>
            )}

            {/* Tab 3: WP CATEGORIES DEFINE SCREEN */}
            {activeTab === "categories" && (
              <motion.div
                key="categories-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4"
              >
                <div>
                  <h1 className="text-2xl font-normal text-[#1d2327] font-serif">分类目录 (Categories)</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    在此管理前台分类菜单和相匹配的作品。分类动态计算已关联的作品数量。
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* LEFT COLUMN: Add New Category box (5 Columns) */}
                  <form onSubmit={handleAddCategory} className="lg:col-span-5 bg-white border border-[#ccd0d4] rounded-sm p-4 shadow-sm space-y-4">
                    <h2 className="text-sm font-bold text-[#1d2327] pb-2 border-b border-slate-100">
                      添加新分类目录 (Add New Category)
                    </h2>

                    <div className="space-y-2 text-xs">
                      <label className="font-bold text-[#1d2327]">分类名称 (Name in 5 Languages) <span className="text-red-500">*</span></label>
                      <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-sm border border-slate-200">
                        <div className="flex items-center gap-1.5">
                          <span className="w-16 shrink-0 text-slate-500 font-semibold font-mono text-[9px] uppercase">EN-英语</span>
                          <input
                            type="text"
                            required
                            placeholder="e.g. Stationery"
                            value={catNames.en}
                            onChange={(e) => setCatNames({...catNames, en: e.target.value})}
                            className="flex-1 bg-white border border-[#8c8f94] px-1.5 py-1 rounded-[2px] text-xs text-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-16 shrink-0 text-slate-500 font-semibold font-mono text-[9px] uppercase">ZH-中文</span>
                          <input
                            type="text"
                            required
                            placeholder="例如: 文具周边"
                            value={catNames.zh}
                            onChange={(e) => setCatNames({...catNames, zh: e.target.value})}
                            className="flex-1 bg-white border border-[#8c8f94] px-1.5 py-1 rounded-[2px] text-xs text-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-16 shrink-0 text-slate-500 font-semibold font-mono text-[9px] uppercase">FR-法语</span>
                          <input
                            type="text"
                            required
                            placeholder="p. ex. Papeterie"
                            value={catNames.fr}
                            onChange={(e) => setCatNames({...catNames, fr: e.target.value})}
                            className="flex-1 bg-white border border-[#8c8f94] px-1.5 py-1 rounded-[2px] text-xs text-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-16 shrink-0 text-slate-500 font-semibold font-mono text-[9px] uppercase">ES-西语</span>
                          <input
                            type="text"
                            required
                            placeholder="p. ej. Papelería"
                            value={catNames.es}
                            onChange={(e) => setCatNames({...catNames, es: e.target.value})}
                            className="flex-1 bg-white border border-[#8c8f94] px-1.5 py-1 rounded-[2px] text-xs text-slate-800"
                          />
                        </div>
                        <div className="flex items-center gap-1.5 text-right" dir="rtl">
                          <span className="w-16 shrink-0 text-slate-500 font-semibold font-mono text-[9px] uppercase text-left">AR-阿语</span>
                          <input
                            type="text"
                            required
                            placeholder="مثال: القرطاسية"
                            value={catNames.ar}
                            onChange={(e) => setCatNames({...catNames, ar: e.target.value})}
                            className="flex-1 bg-white border border-[#8c8f94] px-1.5 py-1 rounded-[2px] text-xs text-right text-slate-800"
                          />
                        </div>
                      </div>
                      <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                        这是在前台网站展示给客户的分类展示名称，支持5国语言本地化精准翻译。
                      </p>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <label className="font-bold text-[#1d2327]">匹配标识 (Slug) <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        required
                        placeholder="如: Stationery"
                        value={catMatchNameInput}
                        onChange={(e) => setCatMatchNameInput(e.target.value)}
                        className="w-full bg-white border border-[#8c8f94] p-2 rounded-[3px] font-mono font-bold text-slate-800 placeholder-slate-400 focus:border-[#2271b1]"
                      />
                      <p className="text-[10px] text-slate-400 font-normal leading-relaxed">
                        在作品的所属分类选项里，也必须录入完全一致的匹配标识（英文）以使筛选项关联工作。
                      </p>
                    </div>

                    <button
                      type="submit"
                      className="bg-[#2271b1] hover:bg-[#135e96] text-white font-medium py-2 px-4 rounded-[3px] text-xs border border-[#0a4b78] shadow-sm transition-all cursor-pointer flex items-center justify-center gap-1.5 w-full mt-2"
                    >
                      <FolderPlus size={13} className="text-emerald-400" />
                      <span>添加新分类目录 (Add Category)</span>
                    </button>
                  </form>

                  {/* RIGHT COLUMN: Active Category List with hover delete (7 Columns) */}
                  <div className="lg:col-span-7 bg-white border border-[#ccd0d4] rounded-sm shadow-sm overflow-hidden select-none">
                    <div className="bg-[#f6f7f7] border-b border-[#ccd0d4] px-4 py-2.5 flex items-center justify-between">
                      <span className="font-semibold text-xs text-[#1d2327]">所有激活的分类</span>
                      <span className="text-[10px] text-slate-500 font-semibold font-mono">COUNT: {categories.length}</span>
                    </div>

                    <div className="divide-y divide-[#dcdcde] text-xs">
                      {categories.map((cat) => {
                        const relCount = works.filter(w => cat.id === 'all' || w.category === cat.matchName).length;

                        return (
                          <div key={cat.id} className="p-3.5 flex items-center justify-between hover:bg-[#f6f7f7] transition-colors group">
                            <div className="flex items-center gap-3">
                              <div>
                                <div className="font-bold text-[#2271b1] text-sm flex items-center gap-2">
                                  <span>{cat.matchName}</span>
                                  <span className="text-[10px] font-mono text-slate-400 font-normal">({cat.id})</span>
                                </div>
                                <div className="text-[10px] text-slate-500 mt-0.5 flex flex-wrap gap-x-2 gap-y-0.5">
                                  <span>🇨🇳 {cat.names?.zh || '—'}</span>
                                  <span>🇬🇧 {cat.names?.en || '—'}</span>
                                  <span>🇫🇷 {cat.names?.fr || '—'}</span>
                                  <span>🇪🇸 {cat.names?.es || '—'}</span>
                                  <span>🇸🇦 {cat.names?.ar || '—'}</span>
                                </div>
                                <div className="text-[10px] text-slate-400 mt-1">翻译国际化Key: <span className="font-mono">{cat.tKey}</span></div>
                              </div>
                            </div>

                            <div className="flex items-center gap-4">
                              <span className="text-[10px] font-mono font-bold bg-[#f0f0f1] border border-[#ccd0d4] text-[#2c3338] px-2.5 py-0.5 rounded-[3px]">
                                {relCount} 个帖子
                              </span>

                              {cat.id !== "all" ? (
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCategory(cat.id, cat.matchName)}
                                  className="p-1 hover:bg-rose-50 text-slate-400 hover:text-rose-600 rounded-sm transition-colors opacity-20 group-hover:opacity-100"
                                  title="删除此分类目录"
                                >
                                  <Trash2 size={13} />
                                </button>
                              ) : (
                                <span className="text-[9px] font-black uppercase text-slate-350 select-none pr-1">全局保护</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

            {/* Tab 4: SYSTEM UTILS & RECOVER DATA SCREEN */}
            {activeTab === "system" && (
              <motion.div
                key="system-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className="space-y-4 max-w-3xl"
              >
                <div>
                  <h1 className="text-2xl font-normal text-[#1d2327] font-serif">工具与数据清理 (Database Tools)</h1>
                  <p className="text-xs text-slate-500 mt-1">
                    系统高级诊断工具，支持一键清空重度修改恢复至官方极简高保真作品集。
                  </p>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 select-none">
                    <div className="bg-white border border-[#ccd0d4] p-4 rounded-sm shadow-sm space-y-1">
                      <div className="text-[#c3c4c7] bg-[#1d2327] px-2 py-0.5 rounded-sm inline-block text-[9px] font-mono leading-none font-bold">WP STORAGE ENGINE</div>
                      <div className="text-slate-450 text-[10px] font-bold uppercase tracking-wider block pt-2">物理数据库文件体积</div>
                      <div className="text-2xl font-semibold text-[#1d2327] font-mono pb-1">
                        {((JSON.stringify(works) + JSON.stringify(categories)).length / 1024).toFixed(3)} KB
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        数据库使用极速 localStorage 驱动，零 API 请求延迟，无额外服务消耗。
                      </p>
                    </div>

                    <div className="bg-white border border-[#ccd0d4] p-4 rounded-sm shadow-sm space-y-1">
                      <div className="text-[#c3c4c7] bg-[#1d2327] px-2 py-0.5 rounded-sm inline-block text-[9px] font-mono leading-none font-bold">MEDIA ENGINE ACTIVE</div>
                      <div className="text-slate-450 text-[10px] font-bold uppercase tracking-wider block pt-2">多媒体高清摄影件数</div>
                      <div className="text-2xl font-semibold text-[#1d2327] font-mono pb-1">
                        {works.reduce((acc, curr) => acc + (curr.gallery?.length || 1), 0)} 张贴纸大图
                      </div>
                      <p className="text-[10px] text-slate-400 leading-normal">
                        支持任意格式的高清网络摄影作品，无需切图上传，支持大图放大。
                      </p>
                    </div>
                  </div>

                  {/* WP Reset Meta box */}
                  <div className="bg-white border border-l-4 border-l-red-500 border-[#ccd0d4] rounded-sm p-5 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-red-600">
                      <RotateCcw size={16} />
                      <h3 className="text-sm font-bold">初始化本地数据库 (Danger Zone / Factory Clean)</h3>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed">
                      如果您希望清除所有在本地自定义测试期间录入的脏数据或错误分类，点击下方按钮将清空所有存储并完全
                      载入最初设计的 10 个高清特写贴纸方案和 4 项标准矢量图标分类。
                    </p>

                    <div className="pt-2">
                      <button
                        type="button"
                        onClick={() => {
                          if (confirm("🚨 终极警告：此操作将永久清空您在本地添加、修改的所有贴纸作品及分类目录数据！确定立即执行重置操作吗？")) {
                            onResetToDefaults();
                            alert("已清除浏览器本地存储缓存。官方初始 10 大贴纸方案及 4 个高阶分类已成功恢复！");
                          }
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-[3px] text-xs transition-all border border-red-700 shadow-sm cursor-pointer hover:shadow-md flex items-center gap-1.5"
                      >
                        <RefreshCw size={13} />
                        <span>一键重构数据库并恢复默认</span>
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

      </div>

      {/* WordPress Media Library Modal popup */}
      <MediaLibraryModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleMediaModalSelect}
        title={mediaModalMode === "single" ? "Product image" : "Product gallery"}
        multiple={mediaModalMode === "gallery"}
        initialSelected={mediaModalMode === "single" 
          ? (formImage ? [formImage] : []) 
          : galleryInputs.filter(g => g && g.trim() !== "")}
      />

    </div>
  );
}

// Inline fallback SVG wrapper icon
function ArchiveIconWrapper() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-archive-x text-slate-400">
      <rect width="20" height="5" x="2" y="3" rx="1"/>
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8"/>
      <path d="m9.5 17 5-5"/>
      <path d="m9.5 12 5 5"/>
    </svg>
  );
}
