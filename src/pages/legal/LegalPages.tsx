
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';

const LegalLayout = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="pt-32 pb-20 bg-slate-50 min-h-screen">
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 md:p-16 rounded-[2.5rem] shadow-xl border border-slate-100">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-10 tracking-tight">{title}</h1>
        <div className="max-w-none text-slate-600 leading-relaxed [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h2]:mt-10 [&_h2]:mb-3 [&_p]:mb-3 [&_a]:text-blue-600 [&_a]:underline">
          {children}
        </div>
      </div>
    </div>
  </div>
);

const IdentityBlock = () => {
  const { t } = useLanguage();
  return (
    <>
      <h2>{t('legal.identity.title')}</h2>
      <p><strong>{t('legal.identity.nameLabel')}:</strong> {t('legal.identity.name')}</p>
      <p><strong>{t('legal.identity.registryLabel')}:</strong> {t('legal.identity.registry')}</p>
      <p><strong>{t('legal.identity.nifLabel')}:</strong> {t('legal.identity.nif')}</p>
      <p><strong>{t('legal.identity.addressLabel')}:</strong> {t('legal.identity.address')}</p>
      <p><strong>{t('legal.identity.oidLabel')}:</strong> {t('legal.identity.oid')}</p>
      <p><strong>{t('legal.identity.contactLabel')}:</strong> <a href="mailto:teach4futureacademy@gmail.com">teach4futureacademy@gmail.com</a> · {t('footer.location')}</p>
    </>
  );
};
const Sections = ({ prefix, count }: { prefix: string, count: number }) => {
  const { t } = useLanguage();
  return <>{Array.from({ length: count }, (_, index) => index + 1).map((number) => (
    <React.Fragment key={number}>
      <h2>{t(`${prefix}.s${number}Title`)}</h2>
      <p>{t(`${prefix}.s${number}Content`)}</p>
    </React.Fragment>
  ))}</>;
};

export const LegalNotice = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.notice.title')}>
      <p>{t('legal.notice.updated')}</p>
      <IdentityBlock />
      <Sections prefix="legal.notice" count={7} />
    </LegalLayout>
  );
};
export const PrivacyPolicy = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.privacy.title')}>
      <p>{t('legal.privacy.updated')}</p>
      <IdentityBlock />
      <Sections prefix="legal.privacy" count={7} />
    </LegalLayout>
  );
};

export const CookiePolicy = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.cookies.title')}>
      <p>{t('legal.cookies.updated')}</p>
      <Sections prefix="legal.cookies" count={3} />
    </LegalLayout>
  );
};

export const TermsConditions = () => {
  const { t } = useLanguage();
  return (
    <LegalLayout title={t('legal.terms.title')}>
      <p>{t('legal.terms.updated')}</p>
      <Sections prefix="legal.terms" count={8} />
    </LegalLayout>
  );
};

