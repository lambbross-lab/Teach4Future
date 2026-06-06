
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">{title}</h1>
        <div className="prose prose-slate max-w-none prose-headings:text-slate-900 prose-headings:font-bold prose-p:text-slate-600 prose-p:leading-relaxed prose-li:text-slate-600">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const PrivacyPolicy = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.privacy.title')}>
      <p>{t('legal.privacy.updated')}</p>
      <h2>{t('legal.privacy.s1Title')}</h2>
      <p>{t('legal.privacy.s1Content')}</p>
      <h2>{t('legal.privacy.s2Title')}</h2>
      <p>{t('legal.privacy.s2Content')}</p>
      <h2>{t('legal.privacy.s3Title')}</h2>
      <p>{t('legal.privacy.s3Content')}</p>
      <h2>{t('legal.privacy.s4Title')}</h2>
      <p>{t('legal.privacy.s4Content')}</p>
    </LegalLayout>
  );
};

export const CookiePolicy = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.cookies.title')}>
      <p>{t('legal.cookies.updated')}</p>
      <h2>{t('legal.cookies.s1Title')}</h2>
      <p>{t('legal.cookies.s1Content')}</p>
      <h2>{t('legal.cookies.s2Title')}</h2>
      <p>{t('legal.cookies.s2Content')}</p>
      <h2>{t('legal.cookies.s3Title')}</h2>
      <p>{t('legal.cookies.s3Content')}</p>
    </LegalLayout>
  );
};

export const TermsConditions = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.terms.title')}>
      <p>{t('legal.terms.updated')}</p>
      <h2>{t('legal.terms.s1Title')}</h2>
      <p>{t('legal.terms.s1Content')}</p>
      <h2>{t('legal.terms.s2Title')}</h2>
      <p>{t('legal.terms.s2Content')}</p>
      <h2>{t('legal.terms.s3Title')}</h2>
      <p>{t('legal.terms.s3Content')}</p>
    </LegalLayout>
  );
};

export const RefundPolicy = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.refunds.title')}>
      <p>{t('legal.refunds.updated')}</p>
      <h2>{t('legal.refunds.s1Title')}</h2>
      <p>{t('legal.refunds.s1Content')}</p>
      <h2>{t('legal.refunds.s2Title')}</h2>
      <p>{t('legal.refunds.s2Content')}</p>
      <h2>{t('legal.refunds.s3Title')}</h2>
      <p>{t('legal.refunds.s3Content')}</p>
    </LegalLayout>
  );
};
