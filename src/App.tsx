// src/App.tsx
import { motion, AnimatePresence } from "motion/react";
import { 
  Palette,
  Layout,
  Layers,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Star,
  ArrowLeft,
  MessageCircle,
  Tag,
  Search,
  Languages,
  ChevronDown,
  Settings
} from "lucide-react";
import { useState, useRef, MouseEvent } from "react";
import { 
  WorkItem, 
  CategoryItem, 
  ICON_MAP, 
  INITIAL_WORKS, 
  INITIAL_CATEGORIES 
} from "./types";
import AdminPanel from "./components/AdminPanel";

// Languages
const LANGUAGES = [
  { code: 'en', name: 'English', dir: 'ltr' },
  { code: 'zh', name: '简体中文', dir: 'ltr' },
  { code: 'fr', name: 'Français', dir: 'ltr' },
  { code: 'es', name: 'Español', dir: 'ltr' },
  { code: 'ar', name: 'العربية', dir: 'rtl' },
];

const TRANSLATIONS: Record<string, any> = {
  zh: {
    heroTitle: "贴纸作品",
    heroHighlight: "展示",
    categoriesTitle: "作品分类",
    exploreSub: "按类型浏览",
    backBtn: "返回作品列表",
    workIdPrefix: "作品：",
    detailsTitle: "作品详情",
    guessTitle: "猜你喜欢",
    allWorks: "全部分类",
    catBranding: "品牌设计",
    catUiUx: "UI/UX 设计",
    catIllustration: "插画艺术"
  },
  en: {
    heroTitle: "Sticker",
    heroHighlight: "Showcase",
    categoriesTitle: "Categories",
    exploreSub: "Explore by Genre",
    backBtn: "Back to Works",
    workIdPrefix: "Work ID:",
    detailsTitle: "Product Details",
    guessTitle: "You Might Like",
    allWorks: "All Works",
    catBranding: "Branding",
    catUiUx: "UI/UX Design",
    catIllustration: "Illustration"
  },
  fr: {
    heroTitle: "Autocollants",
    heroHighlight: "Exposition",
    categoriesTitle: "Catégories",
    exploreSub: "Explorer par genre",
    backBtn: "Retour aux œuvres",
    workIdPrefix: "ID de l'œuvre:",
    detailsTitle: "Détails du produit",
    guessTitle: "Vous pourriez aimer",
    allWorks: "Toutes les œuvres",
    catBranding: "Branding",
    catUiUx: "Design UI/UX",
    catIllustration: "Illustration"
  },
  es: {
    heroTitle: "Pegatinas",
    heroHighlight: "Exposición",
    categoriesTitle: "Categorías",
    exploreSub: "Explorar por género",
    backBtn: "Volver a las obras",
    workIdPrefix: "ID de la obra:",
    detailsTitle: "Detalles del producto",
    guessTitle: "Te podría gustar",
    allWorks: "Todas las obras",
    catBranding: "Branding",
    catUiUx: "Diseño UI/UX",
    catIllustration: "Ilustración"
  },
  ar: {
    heroTitle: "ملصقات",
    heroHighlight: "معرض",
    categoriesTitle: "الفئات",
    exploreSub: "استكشف حسب النوع",
    backBtn: "العودة إلى الأعمال",
    workIdPrefix: "رقم العمل:",
    detailsTitle: "تفاصيل المنتج",
    guessTitle: "قد يعجبك",
    allWorks: "كل الأعمال",
    catBranding: "العلامات التجارية",
    catUiUx: "تصميم واجهة المستخدم",
    catIllustration: "الرسوم التوضيحية"
  }
};

// Helper functions for localized content resolution
const getWorkName = (work: WorkItem, lang: string) => {
  if (work.names && work.names[lang as keyof typeof work.names]) {
    return work.names[lang as keyof typeof work.names]!;
  }
  return work.name;
};

const getWorkDesc = (work: WorkItem, lang: string) => {
  if (work.descriptions && work.descriptions[lang as keyof typeof work.descriptions]) {
    return work.descriptions[lang as keyof typeof work.descriptions]!;
  }
  return work.description;
};

const getWorkDetailedDesc = (work: WorkItem, lang: string) => {
  if (work.detailedDescs && work.detailedDescs[lang as keyof typeof work.detailedDescs]) {
    return work.detailedDescs[lang as keyof typeof work.detailedDescs]!;
  }
  return work.detailedDesc;
};

const getCategoryName = (cat: CategoryItem, lang: string) => {
  if (cat.names && cat.names[lang as keyof typeof cat.names]) {
    return cat.names[lang as keyof typeof cat.names]!;
  }
  const tStr = TRANSLATIONS[lang];
  if (tStr && tStr[cat.tKey]) {
    return tStr[cat.tKey];
  }
  return cat.matchName;
};

export default function App() {
  const [selectedLanguage, setSelectedLanguage] = useState("zh");
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedWorkId, setSelectedWorkId] = useState<number | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState(0);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [[imgX, imgY], setImgXY] = useState([0, 0]);
  const [[cursorX, cursorY], setCursorXY] = useState([0, 0]);

  // Admin Panel states
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [works, setWorks] = useState<WorkItem[]>(() => {
    const saved = localStorage.getItem("sticker_works_v25");
    return saved ? JSON.parse(saved) : INITIAL_WORKS;
  });

  const [categories, setCategories] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem("sticker_categories_v25");
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const containerRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[selectedLanguage];
  const isRTL = LANGUAGES.find(l => l.code === selectedLanguage)?.dir === 'rtl';

  const handleSaveWorks = (newWorks: WorkItem[]) => {
    setWorks(newWorks);
    localStorage.setItem("sticker_works_v25", JSON.stringify(newWorks));
  };

  const handleSaveCategories = (newCats: CategoryItem[]) => {
    setCategories(newCats);
    localStorage.setItem("sticker_categories_v25", JSON.stringify(newCats));
  };

  const handleResetToDefaults = () => {
    // Completely clear customized values and restart pristine datasets
    setWorks(INITIAL_WORKS);
    setCategories(INITIAL_CATEGORIES);
    localStorage.removeItem("sticker_works_v25");
    localStorage.removeItem("sticker_categories_v25");
    setSelectedCategory("all");
    setSelectedWorkId(null);
  };

  // Dynamic counts calculations
  const categoriesWithCounts = categories.map(cat => ({
    ...cat,
    count: works.filter(w => cat.id === 'all' || w.category === cat.matchName).length
  }));

  const filteredWorks = works.filter(work => {
    if (selectedCategory === "all") return true;
    const cat = categories.find(c => c.id === selectedCategory);
    return work.category === cat?.matchName;
  });

  const selectedWork = works.find(w => w.id === selectedWorkId);
  const recommendations = works.filter(w => w.category === selectedWork?.category && w.id !== selectedWorkId).slice(0, 4);

  const handleOpenDetail = (workId: number) => {
    setSelectedWorkId(workId);
    setActiveImgIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCloseDetail = () => {
    setSelectedWorkId(null);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const { top, left, width, height } = containerRef.current.getBoundingClientRect();
    const x = e.pageX - left - window.scrollX;
    const y = e.pageY - top - window.scrollY;
    setImgXY([x / width, y / height]);
    setCursorXY([x, y]);
  };

  return (
    <div 
      className="min-h-screen bg-background selection:bg-primary selection:text-white pb-20 relative font-jakarta"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Utilities Container (Language Switcher & Admin Button) */}
      <div className={`fixed top-6 z-[110] flex items-center gap-3 ${isRTL ? 'left-6 md:left-12' : 'right-6 md:right-12'}`}>
        {/* Minimalist modern Admin workspace button */}
        <button
          onClick={() => setIsAdminOpen(true)}
          className="flex items-center gap-2 bg-slate-900 border border-slate-800 text-white hover:bg-black px-4 py-2 rounded-2xl shadow-soft hover:shadow-lg transition-all font-bold text-xs"
          title="管理后台/Admin Panel"
        >
          <Settings size={15} className="text-primary animate-spin-slow" />
          <span className="hidden sm:inline">工作台管理</span>
        </button>

        {/* Language Switcher */}
        <div className="relative">
          <button 
            onClick={() => setIsLangOpen(!isLangOpen)}
            className="flex items-center gap-2 bg-white/80 backdrop-blur-md border border-slate-100 px-4 py-2 rounded-2xl shadow-soft hover:shadow-md transition-all font-jakarta text-sm font-bold text-slate-700"
          >
            <Languages size={18} className="text-primary" />
            <span className="hidden sm:inline">
              {LANGUAGES.find(l => l.code === selectedLanguage)?.name}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
            {isLangOpen && (
              <>
                <div 
                  className="fixed inset-0 z-[-1]" 
                  onClick={() => setIsLangOpen(false)}
                />
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className={`absolute mt-3 w-48 bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden py-2 ${isRTL ? 'left-0' : 'right-0'}`}
                >
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setSelectedLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`w-full flex items-center px-4 py-2.5 text-sm font-bold transition-colors ${
                        selectedLanguage === lang.code 
                        ? 'bg-surface-low text-primary' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-primary'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!selectedWorkId ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Hero Section */}
            <section className="pt-12 pb-12 px-4 md:px-12 lg:px-24">
              <div className="max-w-[1400px] mx-auto bg-surface-low rounded-[2.5rem] overflow-hidden relative px-8 md:px-16 py-16 md:py-20 shadow-sm">
                <div className="absolute top-10 right-16 w-24 h-24 rounded-3xl rotate-12 opacity-50 bg-[#ffb1c1]" />
                <div className="absolute bottom-10 right-40 w-16 h-16 rounded-full opacity-40 bg-[#ffd9df]" />
                <div className="absolute top-20 right-56 w-12 h-12 rotate-45 opacity-30 bg-primary" />
                
                <div className="relative z-10 max-w-2xl">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h1 className="font-fredoka font-black text-5xl md:text-7xl text-on-background leading-[1.0] uppercase italic tracking-tight">
                      {t.heroTitle} <br /> <span className="text-primary italic">{t.heroHighlight}</span>
                    </h1>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Main Content */}
            <main className="max-w-[1400px] mx-auto px-4 md:px-12 lg:px-24">
              <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar */}
                <aside className="w-full lg:w-72 shrink-0">
                  <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-soft sticky top-8">
                    <h3 className="font-fredoka font-black text-2xl text-on-background">{t.categoriesTitle}</h3>
                    <p className="text-[11px] uppercase tracking-widest text-slate-400 font-black mt-1">{t.exploreSub}</p>
                    
                    <div className="mt-6 space-y-1.5 font-jakarta">
                      {categoriesWithCounts.map((cat) => {
                        return (
                          <button
                            key={cat.id}
                            onClick={() => setSelectedCategory(cat.id)}
                            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl font-bold text-sm transition-all group ${
                              selectedCategory === cat.id 
                              ? 'bg-surface-low text-primary' 
                              : 'text-slate-600 hover:bg-surface-low hover:text-primary'
                            }`}
                          >
                            <span className={`flex items-center gap-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
                              {getCategoryName(cat, selectedLanguage)}
                            </span>
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                              selectedCategory === cat.id ? 'bg-white text-primary shadow-sm' : 'bg-slate-50 text-slate-400'
                            }`}>
                              {cat.count}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </aside>

                {/* Grid Section */}
                <section className="flex-1 space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredWorks.map((work) => (
                      <motion.div
                        layout
                        key={work.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        whileHover={{ y: -5 }}
                        onClick={() => handleOpenDetail(work.id)}
                        className="group bg-white p-4 rounded-[2rem] border border-slate-100 shadow-soft flex flex-col hover:shadow-2xl transition-all duration-500 cursor-pointer"
                      >
                        <div className="relative aspect-square rounded-2xl overflow-hidden mb-5 bg-[#fafafa] border border-slate-100/50">
                          <img 
                            src={work.image} 
                            alt={getWorkName(work, selectedLanguage)} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                          />
                        </div>
                        <div className="px-2 flex flex-col flex-1 pb-2">
                          <h4 className="font-fredoka font-black text-lg text-on-background group-hover:text-primary transition-colors">
                            {getWorkName(work, selectedLanguage)}
                          </h4>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>
              </div>
            </main>
          </motion.div>
        ) : selectedWork && (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-[1240px] mx-auto px-6 pt-12"
          >
            {/* Back Button and Work ID */}
            <nav className="relative flex items-center justify-center mb-12">
              <button 
                onClick={handleCloseDetail}
                className={`absolute flex items-center gap-2 text-primary font-black text-sm uppercase tracking-widest bg-primary-fixed px-6 py-3 rounded-full hover:bg-primary hover:text-white transition-all shadow-sm ${isRTL ? 'right-0 flex-row-reverse' : 'left-0'}`}
              >
                {isRTL ? <ChevronRight size={18} /> : <ArrowLeft size={18} />}
                {t.backBtn}
              </button>
              <div className="font-fredoka font-black text-slate-400 text-2xl uppercase tracking-widest">
                {t.workIdPrefix}{selectedWork.id.toString().padStart(3, '0')}
              </div>
            </nav>

            <div className="flex flex-col items-center gap-24">
              {/* Media Area */}
              <div className="w-full max-w-3xl space-y-12 relative">
                <div 
                  ref={containerRef}
                  onMouseEnter={() => setShowMagnifier(true)}
                  onMouseLeave={() => setShowMagnifier(false)}
                  onMouseMove={handleMouseMove}
                  className="relative aspect-square rounded-[3rem] overflow-hidden border border-slate-100 shadow-xl group cursor-crosshair bg-[#fafafa]"
                >
                   <AnimatePresence mode="wait">
                    <motion.img 
                      key={activeImgIndex}
                      src={selectedWork.gallery ? selectedWork.gallery[activeImgIndex] : selectedWork.image} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="w-full h-full object-cover p-12 select-none"
                      alt={getWorkName(selectedWork, selectedLanguage)}
                    />
                   </AnimatePresence>

                   {/* Lens Selector */}
                   <AnimatePresence>
                    {showMagnifier && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="pointer-events-none absolute w-[180px] h-[180px] rounded-3xl border border-white/50 bg-black/10 backdrop-blur-[2px] shadow-xl z-10"
                        style={{
                          left: `${cursorX - 90}px`,
                          top: `${cursorY - 90}px`,
                        }}
                      />
                    )}
                   </AnimatePresence>
                   
                   {/* Nav buttons */}
                   {selectedWork.gallery && selectedWork.gallery.length > 1 && (
                     <>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImgIndex(prev => (prev > 0 ? prev - 1 : selectedWork.gallery ? selectedWork.gallery.length - 1 : 0)) }}
                        className="absolute left-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button 
                        onClick={(e) => { e.stopPropagation(); setActiveImgIndex(prev => (prev < (selectedWork.gallery ? selectedWork.gallery.length - 1 : 0) ? prev + 1 : 0)) }}
                        className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/80 backdrop-blur-sm border border-slate-100 flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white z-20"
                      >
                        <ChevronRight size={24} />
                      </button>
                     </>
                   )}
                </div>

                {/* Magnified Preview - Floating near cursor, flips sides intelligently */}
                <AnimatePresence>
                  {showMagnifier && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="pointer-events-none fixed z-[100] w-[400px] h-[400px] bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] border-4 border-white overflow-hidden transition-transform duration-75"
                      style={{
                        // Position relative to viewport since we use 'fixed'
                        left: imgX < 0.5 
                          ? `${containerRef.current?.getBoundingClientRect().left! + cursorX + 120}px` 
                          : `${containerRef.current?.getBoundingClientRect().left! + cursorX - 520}px`,
                        top: `${containerRef.current?.getBoundingClientRect().top! + cursorY - 200}px`,
                        transform: isRTL ? 'scaleX(-1)' : 'none'
                      }}
                    >
                      <div 
                        className="w-full h-full"
                        style={{
                          backgroundImage: `url(${selectedWork.gallery ? selectedWork.gallery[activeImgIndex] : selectedWork.image})`,
                          backgroundSize: '400%',
                          backgroundPosition: `${imgX * 100}% ${imgY * 100}%`,
                          backgroundRepeat: 'no-repeat'
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Thumbnails */}
                {selectedWork.gallery && selectedWork.gallery.length > 1 && (
                  <div className="flex gap-4 justify-center overflow-x-auto pb-4 no-scrollbar">
                    {selectedWork.gallery.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setActiveImgIndex(idx)}
                        className={`shrink-0 w-24 h-24 rounded-2xl overflow-hidden border-4 transition-all ${
                          activeImgIndex === idx ? 'border-primary scale-105 shadow-md' : 'border-white hover:border-slate-100'
                        }`}
                      >
                        <img src={img} className="w-full h-full object-cover" alt="" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Info Area */}
              <div className="w-full max-w-3xl space-y-16">
                <div className="space-y-6 text-center">
                  <h1 className="font-fredoka font-black text-5xl md:text-6xl text-on-background leading-tight">{getWorkName(selectedWork, selectedLanguage)}</h1>
                  <p className="text-xl text-slate-600 leading-relaxed font-jakarta font-medium max-w-2xl mx-auto">
                    {getWorkDesc(selectedWork, selectedLanguage)}
                  </p>
                </div>

                <div className="space-y-8 pt-16 border-t border-slate-100">
                  <h3 className="font-fredoka font-black text-3xl text-on-background">{t.detailsTitle}</h3>
                  <div className="font-jakarta text-lg text-slate-500 leading-relaxed prose prose-slate max-w-none">
                    {getWorkDetailedDesc(selectedWork, selectedLanguage)}
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {recommendations.length > 0 && (
              <section className="mt-32 pt-16 border-t border-slate-100">
                <h2 className="font-fredoka font-black text-3xl mb-12 text-on-background text-center">{t.guessTitle}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                  {recommendations.map((rec) => (
                    <div 
                      key={rec.id} 
                      onClick={() => handleOpenDetail(rec.id)}
                      className="group bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-soft hover:shadow-2xl transition-all cursor-pointer"
                    >
                      <div className="aspect-square rounded-[2rem] overflow-hidden mb-6 bg-[#fafafa] border border-slate-100/50">
                        <img src={rec.image} className="w-full h-full object-cover transition-transform group-hover:scale-110" alt="" />
                      </div>
                      <h3 className="font-fredoka font-black text-lg px-2 group-hover:text-primary transition-colors text-on-background">{getWorkName(rec, selectedLanguage)}</h3>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Administration Workspace Control Panel */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel
            works={works}
            categories={categories}
            onSaveWorks={handleSaveWorks}
            onSaveCategories={handleSaveCategories}
            onResetToDefaults={handleResetToDefaults}
            onClose={() => setIsAdminOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
