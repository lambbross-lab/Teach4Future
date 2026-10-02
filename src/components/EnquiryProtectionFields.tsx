import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';

interface EnquiryProtectionFieldsProps {
  consent: boolean;
  onConsentChange: (value: boolean) => void;
  website: string;
  onWebsiteChange: (value: string) => void;
}

const EnquiryProtectionFields = ({
  consent,
  onConsentChange,
  website,
  onWebsiteChange,
}: EnquiryProtectionFieldsProps) => {
  const { t } = useLanguage();

  return (
    <>
      <div className="absolute left-[-10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor="website">{t('common.honeypotLabel')}</label>
        <input
          id="website"
          name="website"
          type="text"
          tabIndex={-1}
          autoComplete="off"
          value={website}
          onChange={(event) => onWebsiteChange(event.target.value)}
        />
      </div>

      <label className="flex items-start gap-3 text-sm leading-relaxed text-slate-600">
        <input
          required
          type="checkbox"
          checked={consent}
          onChange={(event) => onConsentChange(event.target.checked)}
          className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <span>
          {t('common.privacyConsentPrefix')}{' '}
          <Link to="/privacy" className="font-semibold text-blue-600 hover:underline">
            {t('common.privacyPolicy')}
          </Link>
          {t('common.privacyConsentSuffix')}
        </span>
      </label>
    </>
  );
};

export default EnquiryProtectionFields;
