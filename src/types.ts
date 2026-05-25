// src/types.ts
import { 
  Palette, 
  Layout, 
  Layers, 
  Sparkles, 
  Tag, 
  Star, 
  Coffee, 
  Heart, 
  Smile,
  LucideIcon
} from "lucide-react";

export interface CategoryItem {
  id: string;
  tKey: string;      // translation key, or fallback to name
  matchName: string; // matches work.category
  iconName: string;  // name of lucide-react icon as string
  count?: number;    // dynamic calculated based on works
  names?: {
    en?: string;
    zh?: string;
    fr?: string;
    es?: string;
    ar?: string;
  };
}

export interface WorkItem {
  id: number;
  name: string;
  names?: {
    en?: string;
    zh?: string;
    fr?: string;
    es?: string;
    ar?: string;
  };
  category: string;
  price?: number;
  rating?: number;
  reviews?: number;
  image: string;
  gallery?: string[];
  bgColor: string;     // e.g. "bg-[#FFEAD2]"
  tag: string;         // e.g. "Best Seller" or "New"
  description: string;
  descriptions?: {
    en?: string;
    zh?: string;
    fr?: string;
    es?: string;
    ar?: string;
  };
  detailedDesc: string;
  detailedDescs?: {
    en?: string;
    zh?: string;
    fr?: string;
    es?: string;
    ar?: string;
  };
}

export const ICON_MAP: Record<string, LucideIcon> = {
  Palette,
  Layout,
  Layers,
  Sparkles,
  Tag,
  Star,
  Coffee,
  Heart,
  Smile
};

// Available background styles to pick from in Admin
export const BG_COLORS_PRESET = [
  { class: "bg-[#FFEAD2]", name: "暖橘 (Warm Apricot)" },
  { class: "bg-[#E2F2FF]", name: "冰蓝 (Ice Blue)" },
  { class: "bg-[#F3E5F5]", name: "梦幻紫 (Dream Lavender)" },
  { class: "bg-[#E8F5E9]", name: "薄荷绿 (Mint Green)" },
  { class: "bg-[#FFF9C4]", name: "暖阳黄 (Sunny Yellow)" },
  { class: "bg-[#FAFAFA]", name: "简约白 (Soft White)" },
  { class: "bg-[#FFF3E0]", name: "蜜桃粉 (Peach Pink)" },
  { class: "bg-[#E0F7FA]", name: "海洋蓝 (Cyan Ocean)" },
  { class: "bg-[#EAEAEA]", name: "经典灰 (Modern Slate)" },
];

export const INITIAL_CATEGORIES: CategoryItem[] = [
  { 
    id: 'all', 
    tKey: 'allWorks', 
    matchName: 'All', 
    iconName: 'Layout',
    names: { en: 'All Works', zh: '全部分类', fr: 'Toutes les œuvres', es: 'Todas las obras', ar: 'كل الأعمال' }
  },
  { 
    id: 'branding', 
    tKey: 'catBranding', 
    matchName: 'Branding', 
    iconName: 'Palette',
    names: { en: 'Branding', zh: '品牌设计', fr: 'Branding', es: 'Branding', ar: 'العلامات التجارية' }
  },
  { 
    id: 'uiux', 
    tKey: 'catUiUx', 
    matchName: 'UI/UX Design', 
    iconName: 'Layers',
    names: { en: 'UI/UX Design', zh: 'UI/UX 设计', fr: 'Design UI/UX', es: 'Diseño UI/UX', ar: 'تصميم واجهة المستخدم' }
  },
  { 
    id: 'illustration', 
    tKey: 'catIllustration', 
    matchName: 'Illustration', 
    iconName: 'Sparkles',
    names: { en: 'Illustration', zh: '插画艺术', fr: 'Illustration', es: 'Ilustración', ar: 'الرسوم التوضيحية' }
  },
];

export const INITIAL_WORKS: WorkItem[] = [
  {
    id: 1,
    name: "Hot Stamping Brand Identity",
    category: "Branding",
    price: 9.99,
    rating: 4.8,
    reviews: 12,
    image: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#FFEAD2]",
    tag: "Best Seller",
    description: "A premium branding collection featuring hot stamping textures and elegant typography. Designed for luxury retail experiences.",
    detailedDesc: "这个项目探索了传统工艺与现代数字美学的交集。在深色磨砂表面上使用铜和金箔纹理，我们创造了一个能与高端受众产生共鸣的触觉品牌形象。该方案包含完整的文具设计、数字资产以及印刷生产指南。"
  },
  {
    id: 2,
    name: "Geometric Interface Kit",
    category: "UI/UX Design",
    price: 5.99,
    rating: 5.0,
    reviews: 8,
    image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#E2F2FF]",
    tag: "",
    description: "Advanced component library with a focus on geometric precision and accessible interactions.",
    detailedDesc: "专为速度和可扩展性而构建，该套件提供了 200 多个专为现代 SaaS 应用程序量指。所有元素都是响应式的，并针对 Web 和移动平台进行了优化。"
  },
  {
    id: 3,
    name: "Soft Pastel Illustrations",
    category: "Illustration",
    price: 3.99,
    rating: 4.5,
    reviews: 15,
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#F3E5F5]",
    tag: "New",
    description: "Dreamy, character-focused illustrations using a soft pastel color palette.",
    detailedDesc: "该系列捕捉了日常生活中转瞬即逝的魔法时刻。细腻的笔触和柔和的色调旨在唤起宁静和奇妙的感觉。非常适合儿童图书或专题报道。"
  },
  {
    id: 4,
    name: "Minimalist Poster Pack",
    category: "Illustration",
    price: 12.50,
    rating: 4.9,
    reviews: 24,
    image: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1502472544832-76378951f28b?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#E8F5E9]",
    tag: "Popular",
    description: "A set of high-resolution posters focusing on negative space and simple forms.",
    detailedDesc: "少即是多。这个系列包含 20 种独特的设计，剥离非本质的东西，展示简单形状的核心美感。现代办公空间或工作室装饰的理想选择。"
  },
  {
    id: 5,
    name: "Coffee Shop Branding",
    category: "Branding",
    price: 15.00,
    rating: 4.7,
    reviews: 10,
    image: "https://images.unsplash.com/photo-1559056191-4917a2dc2dfc?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1559056191-4917a2dc2dfc?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#D7CCC8]",
    tag: "",
    description: "Complete identity work for a boutique coffee roaster, from logo to cup packaging.",
    detailedDesc: "我们的咖啡馆品牌设计专注于阳光烘干咖啡豆的温暖感。我们使用了土地色调和手写字体，营造出一种迷人的手工艺感，在拥挤的市场中脱颖而出。"
  },
  {
    id: 6,
    name: "3D Icon Set",
    category: "Illustration",
    price: 8.99,
    rating: 4.9,
    reviews: 32,
    image: "https://images.unsplash.com/photo-1614850523296-e8c041de43a2?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1614850523296-e8c041de43a2?auto=format&fit=crop&q=80&w=1200",
      "https://images.unsplash.com/photo-1620336655055-088d06e76fd0?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#FFF9C4]",
    tag: "Featured",
    description: "Glossy, high-detail 3D icons for modern app interfaces.",
    detailedDesc: "这些图标采用逼真的光影和物理材料渲染。它们为任何后台界面或着陆页设计增添了俏皮而精致的触感。"
  },
  {
    id: 7,
    name: "Organic Pattern Library",
    category: "Branding",
    price: 7.50,
    rating: 4.6,
    reviews: 5,
    image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#F1F8E9]",
    tag: "",
    description: "A collection of hand-drawn patterns inspired by natural textures.",
    detailedDesc: "这组图案旨在为品牌设计带来自然、有机的感觉。适用于包装、背景纹理及纺织品印花。"
  },
  {
    id: 8,
    name: "Tech Startup Website",
    category: "UI/UX Design",
    price: 25.00,
    rating: 4.8,
    reviews: 18,
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#E3F2FD]",
    tag: "",
    description: "Landing page and dashboard design for a cloud computing platform.",
    detailedDesc: "强调技术感与易用性的平衡。采用了深色模式与霓虹色调的点缀，展现前卫的科技品牌形象。"
  },
  {
    id: 9,
    name: "Editorial Magazine Layout",
    category: "Branding",
    price: 18.00,
    rating: 4.9,
    reviews: 9,
    image: "https://images.unsplash.com/photo-1544476072-be6b70502421?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1544476072-be6b70502421?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#FAFAFA]",
    tag: "Design Choice",
    description: "Multi-page layout system for a fashion and art publication.",
    detailedDesc: "大面积的留白与精致的衬线体运用，使整本杂志充满高级感与艺术气息。"
  },
  {
    id: 10,
    name: "Character Sketchbook",
    category: "Illustration",
    price: 4.50,
    rating: 4.7,
    reviews: 11,
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
    gallery: [
      "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=1200"
    ],
    bgColor: "bg-[#FFF3E0]",
    tag: "",
    description: "A variety of expressive character studies in various styles.",
    detailedDesc: "记录了上百个角色的创作原型方案，是动画与游戏角色设计的灵感库。"
  }
];

// Seed images to quickly choose from Unsplash
export const PHOTO_PRESETS = [
  { url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=1200", name: "Premium Packaging & Gold foil" },
  { url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80&w=1200", name: "Dreamy Pastel Illustration" },
  { url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=1200", name: "Clean Minimalist Geometric" },
  { url: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=1200", name: "Modern Graphic & Shadow Deco" },
  { url: "https://images.unsplash.com/photo-1559056191-4917a2dc2dfc?auto=format&fit=crop&q=80&w=1200", name: "Artisanal Coffee & Cups mockup" },
  { url: "https://images.unsplash.com/photo-1614850523296-e8c041de43a2?auto=format&fit=crop&q=80&w=1200", name: "Sleek Glossy Holographic 3D" },
  { url: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=1200", name: "Fun Sticker mockup on laptop" },
  { url: "https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&q=80&w=1200", name: "Cute Stationery Design" },
  { url: "https://images.unsplash.com/photo-1572575151526-75f111812163?auto=format&fit=crop&q=80&w=1200", name: "Pastel Hologram Background" }
];
