
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

const Login = () => {
  const { t } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) {
      setError(t('login.notConfigured'));
      return;
    }
    setIsLoading(true);
    setError('');
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      setError(t('login.error'));
      setIsLoading(false);
      return;
    }
    navigate('/admin');
  };

  const handleForgotPassword = async () => {
    setError('');
    setMessage('');
    if (!supabase) {
      setError(t('login.notConfigured'));
      return;
    }
    if (!email.trim()) {
      setError(t('login.enterEmail'));
      return;
    }

    setIsLoading(true);
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setIsLoading(false);

    if (resetError) {
      setError(t('login.resetError'));
      return;
    }
    setMessage(t('login.resetSent'));
  };

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">
              Teach4Future <span className="text-blue-600">Academy</span>
            </span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('nav.login')}</h1>
          <p className="text-slate-500">{t('login.subtitle')}</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('contact.form.email')}</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required 
                  type="email" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="admin@teach4future.eu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('login.password')}</label>
                <button type="button" onClick={handleForgotPassword} disabled={isLoading} className="text-xs font-bold text-blue-600 hover:text-blue-700 disabled:opacity-50">{t('login.forgot')}</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input 
                  required 
                  type="password" 
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" isLoading={isLoading} disabled={!isSupabaseConfigured}>
              {t('login.signIn')}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            {error && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
            {message && <p role="status" className="rounded-xl bg-green-50 px-4 py-3 text-sm text-green-800">{message}</p>}
          </form>

          <div className="mt-8 pt-6 border-t border-slate-50 text-center">
            <p className="text-xs text-slate-400 flex items-center justify-center">
              <ShieldCheck className="h-3 w-3 mr-1 text-blue-500" />
              {t('login.secure')}
            </p>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
            ← {t('login.back')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
