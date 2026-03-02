import React from "react";
import { ArrowRight, Calendar, ArrowUpRight, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";

const TravelInspiration = () => {
  const { t, i18n } = useTranslation();

  // Dữ liệu bài viết kết hợp dịch thuật
  const ARTICLES = [
    {
      id: 1,
      category: t('home.travel_inspiration.categories.hot_spot'),
      title: t('home.travel_inspiration.articles.article_1'),
      date: i18n.language === 'vi' ? "06 Tháng 08, 2025" : "Aug 06, 2025",
      image: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=2070&auto=format&fit=crop",
      link: "https://agotourist.com/cafe-dep-o-da-lat/"
    },
    {
      id: 2,
      category: t('home.travel_inspiration.categories.food'),
      title: t('home.travel_inspiration.articles.article_2'),
      date: i18n.language === 'vi' ? "20 Tháng 11, 2025" : "Nov 20, 2025",
      image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop",
      link: "https://www.ivivu.com/blog/2022/07/lam-chuyen-food-tour-hai-phong-ngon-bo-re/"
    },
    {
      id: 3,
      category: t('home.travel_inspiration.categories.experience'),
      title: t('home.travel_inspiration.articles.article_3'),
      date: i18n.language === 'vi' ? "23 Tháng 05, 2025" : "May 23, 2025",
      image: "https://images.unsplash.com/photo-1540206351-d6465b3ac5c1?q=80&w=2094&auto=format&fit=crop",
      link: "https://vinpearl.com/vi/chia-se-tu-a-z-kinh-nghiem-du-lich-phu-quoc-cho-gia-dinh"
    }
  ];

  // Hàm xử lý mở link
  const handleArticleClick = (link) => {
    window.open(link, "_blank", "noopener,noreferrer");
  };

  return (
    <section className="container mx-auto px-4 py-16">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-10 px-2 gap-4">
        <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-2">
                <span className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg shadow-sm">
                    <BookOpen size={20} />
                </span>
                <span className="text-emerald-600 font-bold uppercase tracking-wider text-xs">
                    {t('home.travel_inspiration.blog_title')}
                </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900 tracking-tight leading-tight">
                {t('home.travel_inspiration.title').split(' ').map((word, i) => 
                    i === 0 ? word + ' ' : <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-600 ml-1">{word} </span>
                )}
            </h2>
            <p className="text-gray-500 mt-3 font-medium text-base">
                {t('home.travel_inspiration.subtitle')}
            </p>
        </div>
        
        <button 
            onClick={() => window.open("https://vnexpress.net/du-lich", "_blank")}
            className="hidden md:flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-emerald-600 transition-all bg-white px-5 py-2.5 rounded-full border border-gray-200 hover:border-emerald-200 shadow-sm hover:shadow-md group"
        >
            {t('home.travel_inspiration.see_all')}
            <div className="bg-gray-100 group-hover:bg-emerald-100 p-1 rounded-full transition-colors">
                <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
        </button>
      </div>

      {/* ARTICLES GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {ARTICLES.map((item) => (
          <div 
            key={item.id} 
            onClick={() => handleArticleClick(item.link)}
            className="group cursor-pointer flex flex-col h-full"
          >
            {/* Image Container */}
            <div className="relative overflow-hidden rounded-[1.5rem] mb-5 aspect-[4/3] shadow-md group-hover:shadow-xl transition-all duration-300">
              <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Category Badge */}
              <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm border border-white/50">
                {item.category}
              </div>

              <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 border border-white/30">
                <ArrowUpRight size={20} />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-semibold text-gray-400 mb-3">
                    <Calendar size={14} className="text-emerald-500" /> 
                    <span>{item.date}</span>
                    <span className="w-1 h-1 rounded-full bg-gray-300 mx-1"></span>
                    <span>{t('home.travel_inspiration.read_time')}</span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-2 leading-snug mb-2">
                  {item.title}
                </h3>
                
                <div className="mt-auto pt-2">
                    <span className="inline-flex items-center text-sm font-bold text-gray-500 group-hover:text-emerald-600 transition-colors border-b-2 border-transparent group-hover:border-emerald-100 pb-0.5">
                        {t('home.travel_inspiration.read_more')}
                    </span>
                </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TravelInspiration;