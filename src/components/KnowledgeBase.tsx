import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Filter,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Stethoscope,
  Info,
} from 'lucide-react';
import { KnowledgeArticle } from '../types';
import { KNOWLEDGE_ARTICLES } from '../data/mockData';

interface KnowledgeBaseProps {
  onAskInChat: (question: string) => void;
}

export const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ onAskInChat }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(KNOWLEDGE_ARTICLES[0].id);

  const categories = ['All', 'Diabetes & Glucose', 'Cardiovascular', 'Kidney Function', 'Hepatic Function', 'Vitamins & Minerals', 'Hematology'];

  const filteredArticles = KNOWLEDGE_ARTICLES.filter((art) => {
    const matchesCategory = selectedCategory === 'All' || art.category === selectedCategory;
    const matchesSearch =
      art.testName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.definition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.shortName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400 uppercase tracking-wide">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>Module 6 — Medical Knowledge Base</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">Laboratory Test & Biomarker Reference Library</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Explore standard reference ranges, physiological roles, high/low causes, and evaluation steps for common clinical biomarkers.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search test e.g. HbA1c, Creatinine, Lipid..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Articles Catalog */}
      <div className="space-y-4">
        {filteredArticles.map((article) => {
          const isExpanded = expandedId === article.id;
          return (
            <div
              key={article.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden transition-all"
            >
              <div
                onClick={() => setExpandedId(isExpanded ? null : article.id)}
                className="p-5 flex items-center justify-between cursor-pointer hover:bg-slate-850 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{article.testName}</h3>
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-semibold">
                      {article.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{article.definition}</p>
                </div>

                <div className="flex items-center space-x-4 shrink-0">
                  <div className="text-right hidden sm:block">
                    <div className="text-xs text-slate-400">Reference Range</div>
                    <div className="text-xs font-bold text-emerald-300">{article.normalRange}</div>
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-5 h-5 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-slate-400" />
                  )}
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-5 bg-slate-950/80 border-t border-slate-800 text-xs text-slate-300 space-y-4 animate-in fade-in duration-150">
                  <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                    <span className="font-bold text-emerald-400 block">Definition & Purpose:</span>
                    <p className="text-slate-200 leading-relaxed">{article.definition}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-rose-950/20 border border-rose-500/30 p-3.5 rounded-xl space-y-1.5">
                      <span className="font-bold text-rose-300 block">Common Causes for High Results:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {article.highCauses.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-sky-950/20 border border-sky-500/30 p-3.5 rounded-xl space-y-1.5">
                      <span className="font-bold text-sky-300 block">Common Causes for Low Results:</span>
                      <ul className="list-disc list-inside space-y-0.5 text-slate-300">
                        {article.lowCauses.map((c, i) => (
                          <li key={i}>{c}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-amber-300 block">Associated Symptoms:</span>
                      <p className="text-slate-300">{article.symptoms.join(', ')}</p>
                    </div>

                    <div className="bg-slate-900 p-3.5 rounded-xl border border-slate-800 space-y-1">
                      <span className="font-bold text-teal-300 block">Typical Clinical Evaluation:</span>
                      <p className="text-slate-300">{article.typicalEvaluation}</p>
                    </div>
                  </div>

                  <div className="bg-emerald-950/20 border border-emerald-500/20 p-3.5 rounded-xl space-y-1">
                    <span className="font-bold text-emerald-300 block">Lifestyle & Dietary Considerations:</span>
                    <ul className="list-disc list-inside space-y-0.5 text-emerald-200">
                      {article.lifestyleConsiderations.map((lc, i) => (
                        <li key={i}>{lc}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                    <button
                      onClick={() => onAskInChat(`Can you explain more about ${article.testName} and what lifestyle changes can improve it?`)}
                      className="text-emerald-400 hover:underline flex items-center space-x-1 font-semibold"
                    >
                      <Stethoscope className="w-4 h-4" />
                      <span>Ask AI Assistant About {article.shortName}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
