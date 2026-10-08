import { useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getRouteLanguage, localizePath } from '../lib/localizedPaths';

const LocalePathSync = () => {
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const { language, setLanguage } = useLanguage();
  const routeLanguage = getRouteLanguage(pathname);

  useLayoutEffect(() => {
    if (routeLanguage && routeLanguage !== language) {
      setLanguage(routeLanguage);
      return;
    }
    if (!routeLanguage) {
      const currentPath = `${pathname}${search}${hash}`;
      const localizedPath = localizePath(currentPath, language);
      if (localizedPath !== currentPath) navigate(localizedPath, { replace: true });
    }
  }, [hash, language, navigate, pathname, routeLanguage, search, setLanguage]);

  return null;
};

export default LocalePathSync;
