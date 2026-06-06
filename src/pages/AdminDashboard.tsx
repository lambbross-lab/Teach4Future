
import React, { useState } from 'react';
import { 
  Users, BookOpen, Calendar, MapPin, 
  TrendingUp, Plus, Search, Filter, 
  MoreVertical, Edit, Trash2, CheckCircle2, 
  XCircle, Clock, GraduationCap, LogOut,
  LayoutDashboard, MessageSquare, Settings
} from 'lucide-react';
import { COURSES, SESSIONS, CITIES } from '../mockData';
import { formatDate, cn } from '../lib/utils';
import Button from '../components/ui/Button';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

const AdminDashboard = () => {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('enrolments');
  const navigate = useNavigate();

  const stats = [
    { label: t('admin.stats.totalEnrolments'), value: '124', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: t('admin.stats.activeCourses'), value: '12', icon: BookOpen, color: 'text-green-600', bg: 'bg-green-50' },
    { label: t('admin.stats.upcomingSessions'), value: '8', icon: Calendar, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: t('admin.stats.revenue'), value: '€60,760', icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 hidden lg:flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 border-b border-slate-100">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-blue-600 p-1.5 rounded-lg">
              <GraduationCap className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">
              Teach4Future
            </span>
          </Link>
        </div>
        
        <nav className="flex-grow p-4 space-y-1">
          {[
            { id: 'dashboard', label: t('admin.nav.dashboard'), icon: LayoutDashboard },
            { id: 'enrolments', label: t('admin.nav.enrolments'), icon: Users },
            { id: 'courses', label: t('admin.nav.courses'), icon: BookOpen },
            { id: 'sessions', label: t('admin.nav.sessions'), icon: Calendar },
            { id: 'requests', label: t('admin.nav.requests'), icon: MessageSquare },
            { id: 'settings', label: t('admin.nav.settings'), icon: Settings },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={cn(
                "w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                activeTab === item.id ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-50"
              )}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span>{t('admin.nav.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-grow lg:pl-64 pt-24 lg:pt-0">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 sticky top-0 z-40">
          <h2 className="text-xl font-bold text-slate-900 capitalize">
            {activeTab === 'enrolments' ? t('admin.nav.enrolments') : 
             activeTab === 'dashboard' ? t('admin.nav.dashboard') :
             activeTab === 'courses' ? t('admin.nav.courses') :
             activeTab === 'sessions' ? t('admin.nav.sessions') :
             activeTab === 'requests' ? t('admin.nav.requests') :
             activeTab === 'settings' ? t('admin.nav.settings') : activeTab}
          </h2>
          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input 
                type="text" 
                placeholder={t('common.search')} 
                className="pl-10 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none w-64"
              />
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
              AD
            </div>
          </div>
        </header>

        <div className="p-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-start mb-4">
                  <div className={cn("p-3 rounded-xl", stat.bg)}>
                    <stat.icon className={cn("h-6 w-6", stat.color)} />
                  </div>
                  <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-md">+12%</span>
                </div>
                <h3 className="text-sm font-medium text-slate-500 mb-1">{stat.label}</h3>
                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Content Area */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center space-x-4">
                <h3 className="font-bold text-slate-900">{t('admin.recentEnrolments')}</h3>
                <span className="bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md">
                  {t('admin.last24h')}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  {t('admin.filter')}
                </Button>
                <Button size="sm" className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  {t('admin.addNew')}
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.student')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.course')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.date')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">{t('admin.table.status')}</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">{t('admin.table.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[
                    { name: 'Maria Rossi', email: 'maria@school.it', course: 'AI for Education', date: '2026-07-06', status: t('admin.status.confirmed') },
                    { name: 'Jan Kowalski', email: 'jan@liceum.pl', course: 'Inclusion & SEN', date: '2026-07-13', status: t('admin.status.pending') },
                    { name: 'Elena Garcia', email: 'elena@ies.es', course: 'Wellbeing', date: '2026-09-14', status: t('admin.status.confirmed') },
                    { name: 'Thomas Müller', email: 'thomas@gym.de', course: 'Digital Competence', date: '2026-10-19', status: t('admin.status.cancelled') },
                    { name: 'Sophie Laurent', email: 'sophie@ecole.fr', course: 'CLIL / English', date: '2026-11-09', status: t('admin.status.confirmed') },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-600">
                            {row.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{row.name}</p>
                            <p className="text-xs text-slate-400">{row.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{row.course}</td>
                      <td className="px-6 py-4 text-sm text-slate-600">{formatDate(row.date)}</td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          "inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider",
                          row.status === t('admin.status.confirmed') ? "bg-green-100 text-green-700" : 
                          row.status === t('admin.status.pending') ? "bg-orange-100 text-orange-700" : 
                          "bg-red-100 text-red-700"
                        )}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-slate-600">
                          <MoreVertical className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="p-6 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-500">{t('admin.showing')} 5 {t('admin.of')} 124 {t('admin.nav.enrolments').toLowerCase()}</p>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline">{t('admin.previous')}</Button>
                <Button size="sm" variant="outline">{t('admin.next')}</Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
