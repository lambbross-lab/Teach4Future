import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Lock, ShieldCheck } from 'lucide-react';
import Button from '../components/ui/Button';
import { useLanguage } from '../contexts/LanguageContext';
import { supabase } from '../lib/supabase';

const ResetPassword = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');

    if (!supabase) {
      setError(t('login.notConfigured'));
      return;
    }
    if (password.length < 8) {
      setError(t('login.passwordTooShort'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('login.passwordMismatch'));
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (updateError) {
      setError(t('login.invalidResetLink'));
      return;
    }

    setSuccess(true);
    await supabase.auth.signOut();
  };

  if (success) {
    return (
      <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100 text-center">
          <ShieldCheck className="h-12 w-12 text-green-600 mx-auto mb-5" />
          <h1 className="text-3xl font-bold text-slate-900 mb-3">{t('login.passwordUpdated')}</h1>
          <p className="text-slate-500 mb-8">{t('login.passwordUpdatedDesc')}</p>
          <Button className="w-full" size="lg" onClick={() => navigate('/login')}>{t('login.goToLogin')}</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-10">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="bg-blue-600 p-2 rounded-lg"><GraduationCap className="h-6 w-6 text-white" /></div>
            <span className="text-2xl font-bold tracking-tight text-slate-900">Teach4Future <span className="text-blue-600">Academy</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">{t('login.createPassword')}</h1>
          <p className="text-slate-500">{t('login.createPasswordDesc')}</p>
        </div>

        <div className="bg-white p-8 md:p-10 rounded-[2rem] shadow-xl border border-slate-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('login.newPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required minLength={8} type="password" autoComplete="new-password" value={password} onChange={(event) => setPassword(event.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">{t('login.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                <input required minLength={8} type="password" autoComplete="new-password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <Button type="submit" size="lg" className="w-full" isLoading={isLoading}>{t('login.savePassword')}</Button>
            {error && <p role="alert" className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
