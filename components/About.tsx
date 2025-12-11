import React from 'react';
import { Mail, Share2, Star, Shield, ExternalLink, Code, Globe, Github, CheckCircle2 } from 'lucide-react';

const About: React.FC = () => {
  const handleEmail = () => {
    window.location.href = "mailto:younesbousseta30@gmail.com";
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Sentinel Shield Security',
        text: 'تحقق من تطبيق الحماية الأمني المطور بواسطة Youness Boussetta',
        url: window.location.href,
      });
    } else {
      alert('تم نسخ رابط التطبيق للحافظة');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Hero Card - Material Design 3 Style */}
      <div className="relative overflow-hidden bg-[#1a1a1a] rounded-[2rem] border border-gray-800 shadow-2xl">
        {/* Moroccan Flag Gradient Background Effect */}
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-[#C1272D]/20 via-transparent to-[#006233]/20"></div>
        
        <div className="relative p-8 flex flex-col items-center text-center">
          <div className="w-32 h-32 rounded-full border-4 border-[#D4AF37] p-1 mb-4 shadow-[0_0_20px_rgba(212,175,55,0.3)] bg-black">
             {/* Avatar Placeholder */}
            <div className="w-full h-full rounded-full bg-gradient-to-br from-gray-800 to-black flex items-center justify-center overflow-hidden">
                <Code size={48} className="text-gray-400" />
            </div>
          </div>
          
          <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-2">
            Youness Boussetta
            <span className="text-2xl" title="Morocco">🇲🇦</span>
          </h1>
          <p className="text-[#006233] font-medium bg-[#006233]/10 px-4 py-1 rounded-full border border-[#006233]/30">
            مطور أندرويد & خبير أمن معلومات
          </p>
        </div>
      </div>

      {/* Description Card */}
      <div className="bg-[#1E1E1E] rounded-[1.5rem] p-6 border border-gray-800">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <Shield className="text-[#C1272D]" />
          عن التطبيق
        </h3>
        <p className="text-gray-300 leading-relaxed text-lg">
          تطبيق أمني تعليمي متقدم يهدف إلى فحص وحماية أجهزة الأندرويد من التهديدات السيبرانية الحديثة. تم تطوير هذا المشروع لمحاكاة أدوات الفحص الأمني المتقدمة، وتحليل سلوك التطبيقات، وكشف الثغرات الأمنية باستخدام تقنيات الذكاء الاصطناعي.
        </p>
        
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl">
                <CheckCircle2 className="text-[#006233]" size={20} />
                <span className="text-sm text-gray-300">تحليل التهديدات بالذكاء الاصطناعي</span>
            </div>
            <div className="flex items-center gap-3 bg-black/30 p-3 rounded-xl">
                <CheckCircle2 className="text-[#006233]" size={20} />
                <span className="text-sm text-gray-300">مراقبة الشبكة والعمليات</span>
            </div>
        </div>
      </div>

      {/* Contact & Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button 
          onClick={handleEmail}
          className="bg-[#C1272D]/10 hover:bg-[#C1272D]/20 border border-[#C1272D]/50 text-[#ff4d4d] p-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group"
        >
          <Mail className="group-hover:animate-bounce" />
          <span className="font-bold">تواصل مع المطور</span>
        </button>

        <button 
            onClick={handleShare}
            className="bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/50 text-[#D4AF37] p-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95"
        >
          <Share2 />
          <span className="font-bold">مشاركة التطبيق</span>
        </button>
      </div>

      <div className="bg-[#1E1E1E] rounded-[1.5rem] p-1 border border-gray-800 flex">
         <button className="flex-1 p-4 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-white flex flex-col items-center gap-2 transition-colors">
            <Star size={24} />
            <span className="text-xs">قيم التطبيق</span>
         </button>
         <button className="flex-1 p-4 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-white flex flex-col items-center gap-2 transition-colors">
            <Globe size={24} />
            <span className="text-xs">الموقع الرسمي</span>
         </button>
         <button className="flex-1 p-4 hover:bg-white/5 rounded-2xl text-gray-400 hover:text-white flex flex-col items-center gap-2 transition-colors">
            <Github size={24} />
            <span className="text-xs">GitHub</span>
         </button>
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 border-t border-gray-800">
        <div className="flex items-center justify-center gap-2 text-gray-500 mb-2">
            <span>الإصدار 2.5.0 (Beta)</span>
        </div>
        <a href="#" className="text-xs text-[#006233] hover:underline hover:text-[#00ff41]">سياسة الخصوصية وشروط الاستخدام</a>
        <p className="text-[10px] text-gray-600 mt-4 font-mono">
            جميع الحقوق محفوظة © {new Date().getFullYear()} Youness Boussetta
        </p>
      </div>

    </div>
  );
};

export default About;