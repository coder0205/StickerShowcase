// src/components/MediaLibraryModal.tsx
import { useState, useMemo, useRef, useEffect, FormEvent, DragEvent, ChangeEvent } from "react";
import { 
  X, 
  Check, 
  Upload, 
  Search, 
  Image as ImageIcon, 
  Trash2, 
  CheckSquare
} from "lucide-react";

export interface AttachmentItem {
  id: string;
  url: string;
  filename: string;
  date: string;
  size: string;
  dimensions: string;
  type: string;
  altText?: string;
  title: string;
  caption?: string;
  description?: string;
  status?: "completed" | "uploading";
}

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  title: string;          // Modal title, e.g. "Product image" or "Product gallery"
  multiple?: boolean;     // True for gallery multi-select, false for main product single-select
  initialSelected?: string[];
}

// Pre-seeded high fidelity mock attachments that match the user's screenshot exactly!
const INITIAL_ATTACHMENTS: AttachmentItem[] = [
  {
    id: "act-sticker-12-1",
    url: "https://images.unsplash.com/photo-1572575151526-75f111812163?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款1.jpg",
    date: "May 15, 2026",
    size: "576 KB",
    dimensions: "1440 by 1440 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款1",
    altText: "Chinese style act embossed 3D sticker mockup 1",
    caption: "",
    description: "Detailed embossed 3D design collection sheet",
    status: "completed"
  },
  {
    id: "act-sticker-12-2",
    url: "https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款2.jpg",
    date: "May 15, 2026",
    size: "412 KB",
    dimensions: "1200 by 1200 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款2",
    altText: "ACT embossed sticker sheet 2",
    status: "completed"
  },
  {
    id: "act-sticker-12-3",
    url: "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款3.jpg",
    date: "May 15, 2026",
    size: "820 KB",
    dimensions: "1600 by 1600 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款3",
    status: "completed"
  },
  {
    id: "logo-jaki-single",
    url: "https://images.unsplash.com/photo-1605721911519-3dfeb3be25e7?auto=format&fit=crop&q=80&w=600",
    filename: "logo-stickerjaki-singleImg.png",
    date: "May 10, 2026",
    size: "94 KB",
    dimensions: "512 by 512 pixels",
    type: "image/png",
    title: "logo-stickerjaki-singleImg",
    status: "completed"
  },
  {
    id: "logo-jaki-vertical",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    filename: "logo-stickerjaki-vertical version.png",
    date: "May 10, 2026",
    size: "148 KB",
    dimensions: "800 by 1200 pixels",
    type: "image/png",
    title: "logo-stickerjaki-vertical version",
    status: "completed"
  },
  {
    id: "cropped-logo-jaki",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600",
    filename: "cropped-logo-stickerjaki-brand.png",
    date: "May 10, 2026",
    size: "72 KB",
    dimensions: "400 by 100 pixels",
    type: "image/png",
    title: "cropped-logo-stickerjaki-brand",
    status: "completed"
  },
  {
    id: "act-sticker-12-4",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款4.jpg",
    date: "May 15, 2026",
    size: "612 KB",
    dimensions: "1440 by 1440 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款4",
    status: "completed"
  },
  {
    id: "act-sticker-12-5",
    url: "https://images.unsplash.com/photo-1614850523296-e8c041de43a2?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款5.jpg",
    date: "May 15, 2026",
    size: "348 KB",
    dimensions: "1000 by 1000 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款5",
    status: "completed"
  },
  {
    id: "act-sticker-12-6",
    url: "https://images.unsplash.com/photo-1589149098258-3e9102ca63d3?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款6.jpg",
    date: "May 15, 2026",
    size: "520 KB",
    dimensions: "1280 by 1280 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款6",
    status: "completed"
  },
  {
    id: "act-sticker-12-7",
    url: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款7.jpg",
    date: "May 15, 2026",
    size: "298 KB",
    dimensions: "1024 by 1024 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款7",
    status: "completed"
  },
  {
    id: "act-sticker-12-8",
    url: "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款8.jpg",
    date: "May 15, 2026",
    size: "710 KB",
    dimensions: "1440 by 1440 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款8",
    status: "completed"
  },
  {
    id: "act-sticker-12-9",
    url: "https://images.unsplash.com/photo-1559056191-4917a2dc2dfc?auto=format&fit=crop&q=80&w=600",
    filename: "ACT浮雕立体贴12款9.jpg",
    date: "May 15, 2026",
    size: "625 KB",
    dimensions: "1440 by 1440 pixels",
    type: "image/jpeg",
    title: "ACT浮雕立体贴12款9",
    status: "completed"
  },
  {
    id: "abs-diamond-9",
    url: "https://images.unsplash.com/photo-1620336655055-088d06e76fd0?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴9.jpg",
    date: "May 12, 2026",
    size: "340 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴9",
    status: "completed"
  },
  {
    id: "abs-diamond-8",
    url: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴8.jpg",
    date: "May 12, 2026",
    size: "310 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴8",
    status: "completed"
  },
  {
    id: "abs-diamond-7",
    url: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴7.jpg",
    date: "May 12, 2026",
    size: "295 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴7",
    status: "completed"
  },
  {
    id: "abs-diamond-6",
    url: "https://images.unsplash.com/photo-1502472544832-76378951f28b?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴6.jpg",
    date: "May 12, 2026",
    size: "212 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴6",
    status: "completed"
  },
  {
    id: "abs-diamond-5",
    url: "https://images.unsplash.com/photo-1544476072-be6b70502421?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴5.jpg",
    date: "May 12, 2026",
    size: "420 KB",
    dimensions: "1000 by 1000 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴5",
    status: "completed"
  },
  {
    id: "abs-diamond-4",
    url: "https://images.unsplash.com/photo-1613314588794-14362a2227d4?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴4.jpg",
    date: "May 12, 2026",
    size: "260 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴4",
    status: "completed"
  },
  {
    id: "abs-diamond-3",
    url: "https://images.unsplash.com/photo-1579783921008-5917a2dc2dfc?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴3.jpg",
    date: "May 12, 2026",
    size: "290 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴3",
    status: "completed"
  },
  {
    id: "abs-diamond-2",
    url: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=600",
    filename: "ABS-167单颗造型钻石贴2.jpg",
    date: "May 12, 2026",
    size: "312 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "ABS-167单颗造型钻石贴2",
    status: "completed"
  },
  {
    id: "aa-gold-9",
    url: "https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=600",
    filename: "AA-A烫金浮雕贴纸9.jpg",
    date: "May 08, 2026",
    size: "480 KB",
    dimensions: "1200 by 1200 pixels",
    type: "image/jpeg",
    title: "AA-A烫金浮雕贴纸9",
    status: "completed"
  },
  {
    id: "aa-gold-8",
    url: "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&q=80&w=600",
    filename: "AA-A烫金浮雕贴纸8.jpg",
    date: "May 08, 2026",
    size: "405 KB",
    dimensions: "1200 by 1200 pixels",
    type: "image/jpeg",
    title: "AA-A烫金浮雕贴纸8",
    status: "completed"
  },
  {
    id: "aa-gold-7",
    url: "https://images.unsplash.com/photo-1614850523296-e8c041de43a2?auto=format&fit=crop&q=80&w=600",
    filename: "AA-A烫金浮雕贴纸7.jpg",
    date: "May 08, 2026",
    size: "318 KB",
    dimensions: "1200 by 1200 pixels",
    type: "image/jpeg",
    title: "AA-A烫金浮雕贴纸7",
    status: "completed"
  },
  {
    id: "aa-gold-6",
    url: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&q=80&w=600",
    filename: "AA-A烫金浮雕贴纸6.jpg",
    date: "May 08, 2026",
    size: "355 KB",
    dimensions: "1200 by 1200 pixels",
    type: "image/jpeg",
    title: "AA-A烫金浮雕贴纸6",
    status: "completed"
  },
  {
    id: "family-sticker-optimized",
    url: "https://images.unsplash.com/photo-1493612276216-ee3925520721?auto=format&fit=crop&q=80&w=600",
    filename: "family_sticker_web_optimized.jpg",
    date: "May 05, 2026",
    size: "210 KB",
    dimensions: "960 by 640 pixels",
    type: "image/jpeg",
    title: "family_sticker_web_optimized",
    status: "completed"
  },
  {
    id: "elementor-screenshot",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=600",
    filename: "Elementor-post-screenshot_36_2026-.png",
    date: "May 02, 2026",
    size: "460 KB",
    dimensions: "1920 by 1080 pixels",
    type: "image/png",
    title: "Elementor-post-screenshot_36_2026-",
    status: "completed"
  },
  {
    id: "woocommerce-placeholder",
    url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600",
    filename: "woocommerce-placeholder.png",
    date: "Jan 01, 2026",
    size: "20 KB",
    dimensions: "600 by 600 pixels",
    type: "image/png",
    title: "woocommerce-placeholder",
    status: "completed"
  },
  {
    id: "gift-packaging-box",
    url: "https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&q=80&w=600",
    filename: "礼盒.jpg",
    date: "April 29, 2026",
    size: "185 KB",
    dimensions: "800 by 800 pixels",
    type: "image/jpeg",
    title: "礼盒",
    status: "completed"
  }
];

export default function MediaLibraryModal({
  isOpen,
  onClose,
  onSelect,
  title,
  multiple = false,
  initialSelected = []
}: MediaLibraryModalProps) {
  const [activeTab, setActiveTab] = useState<"upload" | "library">("library");
  const [attachments, setAttachments] = useState<AttachmentItem[]>(() => {
    // Check local storage to persist admin uploads
    const stored = localStorage.getItem("sticker_admin_attachments");
    return stored ? JSON.parse(stored) : INITIAL_ATTACHMENTS;
  });

  // Selection states
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelected);
  
  // Search & filters
  const [selectedType, setSelectedType] = useState<string>("all");
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Editor detail inputs for selected item
  const [isCopied, setIsCopied] = useState(false);
  const [customAltText, setCustomAltText] = useState("");
  const [customTitle, setCustomTitle] = useState("");
  const [customCaption, setCustomCaption] = useState("");
  const [customDescription, setCustomDescription] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const pasteUrlRef = useRef<HTMLInputElement>(null);

  // Sync selectedUrls and clear query/reset tabs on opening
  const initialKeys = initialSelected.join(",");
  useEffect(() => {
    if (isOpen) {
      setSelectedUrls(initialSelected);
      setSearchQuery("");
      setSelectedType("all");
      setSelectedDateFilter("all");
      setActiveTab("library");
    }
  }, [isOpen, initialKeys]);

  // Persist attachments state
  const saveAttachments = (newAttachments: AttachmentItem[]) => {
    setAttachments(newAttachments);
    localStorage.setItem("sticker_admin_attachments", JSON.stringify(newAttachments));
  };

  // Find currently active attachment for detail view
  // (In single select, it's the selected item. In multi-select, it's the last selected item.)
  const activeAttachment = useMemo(() => {
    if (selectedUrls.length === 0) return null;
    const lastUrl = selectedUrls[selectedUrls.length - 1];
    return attachments.find(a => a.url === lastUrl) || null;
  }, [selectedUrls, attachments]);

  // Sync editing inputs when activeAttachment changes
  const handleSelectAttachment = (attach: AttachmentItem) => {
    if (multiple) {
      if (selectedUrls.includes(attach.url)) {
        setSelectedUrls(selectedUrls.filter(u => u !== attach.url));
      } else {
        setSelectedUrls([...selectedUrls, attach.url]);
      }
    } else {
      setSelectedUrls([attach.url]);
    }

    // Set editing fields
    setCustomAltText(attach.altText || "");
    setCustomTitle(attach.title || attach.filename.split(".")[0]);
    setCustomCaption(attach.caption || "");
    setCustomDescription(attach.description || "");
    setIsCopied(false);
  };

  // Handle saving attachment details
  const handleUpdateAttachmentDetails = (field: keyof AttachmentItem, value: any) => {
    if (!activeAttachment) return;
    const updated = attachments.map(item => {
      if (item.id === activeAttachment.id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    saveAttachments(updated);
  };

  // Delete attachment
  const handleDeleteAttachment = (id: string) => {
    if (confirm("确定要永久删除此媒体文件吗？此操作无法撤销。 (Are you sure you want to permanently delete this media file?)")) {
      const target = attachments.find(a => a.id === id);
      const updated = attachments.filter(a => a.id !== id);
      saveAttachments(updated);
      if (target) {
        setSelectedUrls(selectedUrls.filter(u => u !== target.url));
      }
    }
  };

  // Copy file URL to clipboard
  const handleCopyUrl = () => {
    if (!activeAttachment) return;
    navigator.clipboard.writeText(activeAttachment.url).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  };

  // Filter attachments
  const filteredAttachments = useMemo(() => {
    return attachments.filter(item => {
      // Type filter
      if (selectedType !== "all") {
        if (selectedType === "images" && !item.type.startsWith("image/")) return false;
        if (selectedType === "png" && !item.filename.endsWith(".png")) return false;
      }
      // Date filter
      if (selectedDateFilter !== "all") {
        const itemMonth = item.date.split(" ")[0].toLowerCase();
        if (selectedDateFilter === "may" && itemMonth !== "may") return false;
        if (selectedDateFilter === "april" && itemMonth !== "april") return false;
      }
      // Search query
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchTitle = item.title.toLowerCase().includes(query);
        const matchFile = item.filename.toLowerCase().includes(query);
        const matchAlt = (item.altText || "").toLowerCase().includes(query);
        if (!matchTitle && !matchFile && !matchAlt) return false;
      }
      return true;
    });
  }, [attachments, selectedType, selectedDateFilter, searchQuery]);

  // Simulated file upload triggers
  const executeUploadFile = (fileDetails: { name: string; sizeBytes: number; type: string; tempUrl: string }) => {
    const sizeStr = `${(fileDetails.sizeBytes / 1024).toFixed(0)} KB`;
    const newId = `custom-u-${Date.now()}`;
    const newAttach: AttachmentItem = {
      id: newId,
      url: fileDetails.tempUrl,
      filename: fileDetails.name,
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }),
      size: sizeStr,
      dimensions: "1024 by 1024 pixels",
      type: fileDetails.type,
      title: fileDetails.name.trim().split(".")[0],
      altText: fileDetails.name.trim().split(".")[0],
      caption: "",
      description: "Uploaded via WordPress Editor Media Uploader",
      status: "uploading"
    };

    // Prepend to array
    saveAttachments([newAttach, ...attachments]);
    setSelectedUrls([newAttach.url]);
    setActiveTab("library");

    // Simulate completion
    setTimeout(() => {
      const updated = [newAttach, ...attachments].map(item => {
        if (item.id === newId) {
          return { ...item, status: "completed" as const };
        }
        return item;
      });
      saveAttachments(updated);
    }, 1200);
  };

  const handleManualUrlSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (pasteUrlRef.current && pasteUrlRef.current.value.trim()) {
      const val = pasteUrlRef.current.value.trim();
      const ext = val.split(".").pop()?.split("?")[0] || "jpg";
      executeUploadFile({
        name: `external-image-attachment.${ext}`,
        sizeBytes: 153200, // mock size 150KB
        type: `image/${ext === "png" ? "png" : "jpeg"}`,
        tempUrl: val
      });
      pasteUrlRef.current.value = "";
    }
  };

  const handleFileUploadChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const objectUrl = URL.createObjectURL(file);
      executeUploadFile({
        name: file.name,
        sizeBytes: file.size,
        type: file.type || "image/jpeg",
        tempUrl: objectUrl
      });
    }
  };

  // Drag-and-drop mechanics (AI Studio usability guideline standard compliance)
  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const objectUrl = URL.createObjectURL(file);
      executeUploadFile({
        name: file.name,
        sizeBytes: file.size,
        type: file.type || "image/jpeg",
        tempUrl: objectUrl
      });
    }
  };

  // Insert Action click
  const handleInsertSelected = () => {
    if (selectedUrls.length > 0) {
      onSelect(selectedUrls);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[180] bg-black/60 flex items-center justify-center font-sans select-none select-text text-left">
      {/* Root Dialog box mimicking WordPress window boundary */}
      <div className="bg-white w-[96%] h-[92%] max-w-[1200px] rounded-sm shadow-2xl flex flex-col border border-slate-300 relative overflow-hidden">
        
        {/* TOP PANEL: WP Custom Title & Close Bar */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200">
          <h2 className="text-base font-bold text-[#1d2327]">
            {title ? `${title}` : "Product image"}
          </h2>
          <button 
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTROLS BAR: Navigation tabs for mock operations */}
        <div className="flex items-center border-b border-slate-200 bg-[#fbfbfb] px-4 space-x-1 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab("upload")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "upload"
                ? "border-[#2271b1] text-[#2c3338] font-bold"
                : "border-transparent text-[#2271b1] hover:text-[#135e96]"
            }`}
          >
            Upload files (上传文件)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("library")}
            className={`px-4 py-2.5 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === "library"
                ? "border-[#2271b1] text-[#2c3338] font-bold"
                : "border-transparent text-[#2271b1] hover:text-[#135e96]"
            }`}
          >
            Media Library (媒体库)
          </button>
        </div>

        {/* MAIN BODY AREA */}
        <div className="flex-1 flex overflow-hidden min-h-0 bg-white">
          
          {/* TAB 1: Real-file drag & upload simulation */}
          {activeTab === "upload" && (
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex-1 flex flex-col items-center justify-center p-8 bg-slate-50 border-2 border-dashed border-slate-300 m-4 rounded-sm"
            >
              <Upload className="text-slate-350 mb-4 animate-bounce" size={48} />
              <h3 className="text-base font-bold text-slate-700 mb-1">
                Drag files here to upload (拖拽图片到这里直接上传)
              </h3>
              <p className="text-slate-400 text-xs mb-4">
                支持 jpg, jpeg, png, gif 格式图片 (Supports standard files)
              </p>
              
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white border border-[#2271b1] hover:bg-slate-50 text-[#2271b1] text-xs font-semibold px-4 py-2 rounded-[3px] shadow-sm transition-all"
                >
                  Select Files (选择本地文件)
                </button>
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileUploadChange}
                  className="hidden"
                />
              </div>

              {/* Paste Network address fallback */}
              <form onSubmit={handleManualUrlSubmit} className="mt-8 max-w-sm w-full space-y-1.5 p-4 border border-[#ccd0d4] bg-white shadow-inner rounded-sm">
                <label className="text-[10px] font-bold text-slate-500 block uppercase">Or Import via Network URL</label>
                <div className="flex gap-1">
                  <input
                    type="url"
                    ref={pasteUrlRef}
                    placeholder="https://example.com/cute-sticker.jpg"
                    className="flex-1 bg-white border border-[#c3c4c7] px-2 py-1 text-xs rounded-sm focus:border-[#2271b1] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 text-xs px-2.5 rounded-sm"
                  >
                    Load
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Grid view with full WooCommerce metadata */}
          {activeTab === "library" && (
            <div className="flex-1 flex min-h-0">
              
              {/* LEFT: Grid Gallery & Filters */}
              <div className="flex-1 flex flex-col min-h-0 border-r border-slate-200">
                {/* Search / Filters Bar as in WordPress exact screenshot layout */}
                <div className="bg-[#fcfcfc] border-b border-slate-200 px-4 py-2 flex flex-wrap items-center justify-between gap-3 shrink-0">
                  <div className="flex items-center gap-2 text-xs">
                    {/* Filter by Type */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Filter by type:</span>
                      <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="bg-white border border-[#ccd0d4] text-xs p-1 select-none focus:outline-none focus:border-[#2271b1] rounded-sm text-slate-700"
                      >
                        <option value="all">Images</option>
                        <option value="images">Only JPGs</option>
                        <option value="png">Only PNGs</option>
                      </select>
                    </div>

                    {/* Filter by Date */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-500">Filter by date:</span>
                      <select
                        value={selectedDateFilter}
                        onChange={(e) => setSelectedDateFilter(e.target.value)}
                        className="bg-white border border-[#ccd0d4] text-xs p-1 select-none focus:outline-none focus:border-[#2271b1] rounded-sm text-slate-700"
                      >
                        <option value="all">All dates</option>
                        <option value="may">May 2026</option>
                        <option value="april">April 2026</option>
                      </select>
                    </div>
                  </div>

                  {/* WP Standard Search */}
                  <div className="relative">
                    <label className="sr-only">Search media</label>
                    <input
                      type="text"
                      placeholder="Search media..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white border border-[#ccd0d4] pr-7 pl-2 py-1 text-xs w-[180px] focus:outline-none focus:border-[#2271b1] placeholder-slate-400 rounded-sm"
                    />
                    <Search className="absolute right-2 top-2 text-slate-400" size={12} />
                  </div>
                </div>

                {/* Grid Canvas area */}
                <div className="flex-1 overflow-y-auto p-4 bg-slate-100/50">
                  {filteredAttachments.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
                      {filteredAttachments.map((attach) => {
                        const isSelected = selectedUrls.includes(attach.url);
                        const isUploading = attach.status === "uploading";

                        return (
                          <div
                            key={attach.id}
                            onClick={() => !isUploading && handleSelectAttachment(attach)}
                            className={`aspect-square bg-white border relative rounded-sm cursor-pointer select-none transition-all group shadow-sm flex flex-col justify-between overflow-hidden ${
                              isSelected 
                                ? "border-[#2271b1] ring-2 ring-[#2271b1] scale-98" 
                                : "border-slate-300 hover:border-slate-450"
                            }`}
                          >
                            {/* Visual Graphic frame */}
                            <div className="flex-1 flex items-center justify-center p-1.5 bg-slate-50 relative min-h-0">
                              <img
                                src={attach.url}
                                referrerPolicy="no-referrer"
                                className={`max-w-full max-h-full object-contain ${isSelected ? "opacity-90" : ""} transition-transform duration-300 group-hover:scale-105`}
                                alt={attach.title}
                              />
                              
                              {/* Uploading loading layer */}
                              {isUploading && (
                                <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-1">
                                  <div className="w-5 h-5 border-2 border-[#2271b1] border-t-transparent rounded-full animate-spin"></div>
                                  <span className="text-[9px] font-mono text-[#2271b1]">uploading...</span>
                                </div>
                              )}
                            </div>

                            {/* Label label as in mockup */}
                            <div className="bg-[#f3f4f5] border-t border-slate-200 py-1 px-1.5 shrink-0">
                              <p className="text-[10px] text-slate-600 truncate font-sans text-center">
                                {attach.filename}
                              </p>
                            </div>

                            {/* Selection checkmark icon as in mockup top right corner of image */}
                            {isSelected && (
                              <div className="absolute top-1.5 right-1.5 bg-[#2271b1] text-white border border-white rounded-[2px] w-4 h-4 flex items-center justify-center shadow-md z-10 animate-fade-in">
                                <Check size={11} className="stroke-[3.5]" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-24 text-slate-400 text-xs">
                      <ImageIcon className="text-slate-300 mb-2" size={36} />
                      <p>No media attachments found matching search or filter query.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* RIGHT: Selected Attachment Details Meta-Editor Column */}
              <div className="w-[280px] shrink-0 bg-[#f6f7f7] overflow-y-auto border-l border-slate-200 flex flex-col justify-between text-xs text-[#2c3338] font-sans">
                
                {/* Meta details form box */}
                <div className="p-4 space-y-4">
                  <h3 className="font-bold text-[#1d2327] uppercase tracking-wider text-[11px] pb-1 border-b border-slate-200">
                    Attachment Details (附件详情)
                  </h3>

                  {activeAttachment ? (
                    <div className="space-y-4">
                      {/* Flex preview */}
                      <div className="flex gap-2.5 items-start">
                        <div className="w-16 h-16 bg-white border border-slate-250 p-1 flex items-center justify-center rounded-sm shrink-0">
                          <img 
                            src={activeAttachment.url} 
                            className="max-w-full max-h-full object-contain" 
                            alt="" 
                          />
                        </div>
                        <div className="min-w-0 space-y-0.5 text-[#50575e] text-[10.5px]">
                          <p className="font-bold text-[#1d2327] truncate" title={activeAttachment.filename}>
                            {activeAttachment.filename}
                          </p>
                          <p className="text-slate-500 font-medium">{activeAttachment.date}</p>
                          <p className="text-slate-500 font-medium">{activeAttachment.size}</p>
                          <p className="text-slate-500 font-mono font-medium">{activeAttachment.dimensions}</p>
                          <div className="pt-1 flex gap-2">
                            <button 
                              type="button" 
                              onClick={handleCopyUrl}
                              className="text-[#2271b1] hover:text-[#135e96] font-semibold hover:underline cursor-pointer"
                            >
                              Edit Image
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteAttachment(activeAttachment.id)}
                              className="text-[#d63638] hover:text-red-700 font-semibold hover:underline cursor-pointer"
                            >
                              Delete permanently
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Fields Form inputs as shown in layout */}
                      <div className="space-y-3 pt-2 text-[#2c3338]">
                        
                        {/* 1. Alt Text */}
                        <div className="space-y-1">
                          <div className="flex items-center justify-between">
                            <label className="font-semibold text-[11px] text-[#1D2327]">Alt Text (替代文本)</label>
                          </div>
                          <textarea
                            rows={2}
                            value={customAltText}
                            onChange={(e) => {
                              setCustomAltText(e.target.value);
                              handleUpdateAttachmentDetails("altText", e.target.value);
                            }}
                            className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs focus:outline-none focus:border-[#2271b1]"
                          />
                          <p className="text-[10px] text-slate-400 italic leading-snug">
                            <span className="text-[#2271b1] underline cursor-pointer hover:underline">Learn how to describe the purpose of the image</span>. Leave empty if the image is purely decorative.
                          </p>
                        </div>

                        {/* 2. Title */}
                        <div className="space-y-1">
                          <label className="font-semibold text-[11px] text-[#1D2327] block">Title (标题)</label>
                          <input
                            type="text"
                            value={customTitle}
                            onChange={(e) => {
                              setCustomTitle(e.target.value);
                              handleUpdateAttachmentDetails("title", e.target.value);
                            }}
                            className="w-full bg-white border border-[#8c8f94] px-1.5 py-1 text-xs rounded-[2px] focus:outline-none focus:border-[#2271b1]"
                          />
                        </div>

                        {/* 3. Caption */}
                        <div className="space-y-1">
                          <label className="font-semibold text-[11px] text-[#1D2327] block">Caption (说明文字)</label>
                          <textarea
                            rows={2}
                            value={customCaption}
                            onChange={(e) => {
                              setCustomCaption(e.target.value);
                              handleUpdateAttachmentDetails("caption", e.target.value);
                            }}
                            className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs focus:outline-none focus:border-[#2271b1]"
                          />
                        </div>

                        {/* 4. Description */}
                        <div className="space-y-1">
                          <label className="font-semibold text-[11px] text-[#1D2327] block">Description (图像描述)</label>
                          <textarea
                            rows={2}
                            value={customDescription}
                            onChange={(e) => {
                              setCustomDescription(e.target.value);
                              handleUpdateAttachmentDetails("description", e.target.value);
                            }}
                            className="w-full bg-white border border-[#8c8f94] p-1.5 rounded-[2px] text-xs focus:outline-none focus:border-[#2271b1]"
                          />
                        </div>

                        {/* 5. File URL with Copy Tool */}
                        <div className="space-y-1">
                          <label className="font-semibold text-[11px] text-[#1D2327] block">File URL (文件链接地址)</label>
                          <input
                            type="text"
                            readOnly
                            value={activeAttachment.url}
                            className="w-full bg-[#f0f0f1] border border-[#ccd0d4] text-slate-500 font-mono px-1.5 py-1 text-[10.5px] rounded-[1px] select-all cursor-default focus:outline-none"
                          />
                          <div className="pt-1 select-none">
                            <button
                              type="button"
                              onClick={handleCopyUrl}
                              className={`bg-white hover:bg-slate-50 text-[#2271b1] border border-[#2271b1] cursor-pointer text-[10.5px] font-semibold px-2 px-3 py-1 rounded-[3px] shadow-sm transition-all focus:outline-none ${
                                isCopied ? "border-emerald-500 text-emerald-600" : ""
                              }`}
                            >
                              {isCopied ? "Copied URL!" : "Copy URL to clipboard"}
                            </button>
                          </div>
                        </div>

                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-16 text-slate-400 italic">
                      No image active. Select an item in the gallery to customize its properties.
                    </div>
                  )}

                </div>

                {/* Bottom quick meta specs info row */}
                <div className="bg-[#f0f0f1] border-t border-slate-200 px-4 py-2 text-[10.5px] text-slate-400 flex items-center justify-between font-mono">
                  <span>Count: {attachments.length}</span>
                  <span>SYSTEM_MEDIALIB</span>
                </div>

              </div>

            </div>
          )}

        </div>

        {/* BOTTOM PANEL: WordPress Action Controls */}
        <div className="bg-[#fcfcfc] border-t border-slate-200 px-4 py-3.5 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 font-semibold select-none">
            {selectedUrls.length > 0 ? (
              <span className="text-[#2271b1]">
                已选定 {selectedUrls.length} 张媒体图片 ({selectedUrls.length} file{selectedUrls.length > 1 ? "s" : ""} selected)
              </span>
            ) : (
              <span>点击缩略图选择需要的图片附件 (Select images above)</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white border border-[#ccd0d4] hover:bg-slate-50 text-[#2c3338] text-xs font-semibold rounded-[3px] shadow-sm select-none transition-all cursor-pointer"
            >
              Cancel (取消)
            </button>
            <button
              type="button"
              disabled={selectedUrls.length === 0}
              onClick={handleInsertSelected}
              className={`text-white text-xs font-semibold px-4 py-2 rounded-[3px] shadow-sm select-none transition-all cursor-pointer ${
                selectedUrls.length > 0
                  ? "bg-[#2271b1] hover:bg-[#135e96] active:bg-[#0a4b78] border border-[#0a4b78]"
                  : "bg-slate-300 border-slate-350 opacity-50 cursor-not-allowed text-slate-500"
              }`}
            >
              {title === "Product gallery" 
                ? "Add product gallery images (添加商品画廊图)" 
                : "Set product image (确定设为商品特色图)"}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
