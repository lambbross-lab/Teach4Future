
import React, { useState } from 'react';
import { FAQS } from '../mockData';
import { Search, ChevronDown, ChevronUp, HelpCircle, MessageSquare } from 'lucide-react';
import { cn, getText } from '../lib/utils';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const FAQ = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [openId, setOpenId] = useState<string | null>(FAQS[0].id);
  const { language, t } = useLanguage();

  const filteredFaqs = FAQS.filter(faq => {
    const question = getText(faq.question, language).toLowerCase();
    const answer = getText(faq.answer, language).toLowerCase();
    const category = getText(faq.category, language).toLowerCase();
    const query = searchQuery.toLowerCase();
    
    return question.includes(query) || answer.includes(query) || category.includes(query);
  });

  const categories = Array.from(new Set(FAQS.map(f => getText(f.category, language))));

  return (
    <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">Frequently Asked Questions</h1>
          <p className="text-lg text-slate-600">
            Find answers to common questions about our courses, Erasmus+ funding, and logistics.
          </p>
        </div>

        {/* Search */}
        <div className="relative mb-12">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input 
            type="text" 
            placeholder={t('common.searchPlaceholder')}
            className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* FAQ List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => (
              <div 
                key={faq.id} 
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden transition-all"
              >
                <button 
                  onClick={() => setOpenId(openId === faq.id ? null : faq.id)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <span className="bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md">
                      {getText(faq.category, language)}
                    </span>
                    <h3 className="font-bold text-slate-900">{getText(faq.question, language)}</h3>
                  </div>
                  {openId === faq.id ? <ChevronUp className="h-5 w-5 text-slate-400" /> : <ChevronDown className="h-5 w-5 text-slate-400" />}
                </button>
                {openId === faq.id && (
                  <div className="px-6 pb-6 pt-2 border-t border-slate-50 animate-in slide-in-from-top-2 duration-300">
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {getText(faq.answer, language)}
                    </p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-500">{t('common.noResults')}</p>
            </div>
          )}
        </div>

        {/* Still have questions? */}
        <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white text-center relative overflow-hidden">
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          <HelpCircle className="h-12 w-12 text-blue-200 mx-auto mb-6" />
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-blue-100 mb-8 max-w-md mx-auto">
            Our team is here to help you with any specific queries you might have about your Erasmus+ mobility.
          </p>
          <Link to="/contact">
            <Button variant="secondary" className="bg-white text-blue-600 hover:bg-slate-100">
              {t('nav.contact')}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
