import { Link, type LinkProps } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { localizePath } from '../lib/localizedPaths';

const LocalizedLink = ({ to, ...props }: LinkProps) => {
  const { language } = useLanguage();
  const destination = typeof to === 'string' ? localizePath(to, language) : to;
  return <Link to={destination} {...props} />;
};

export default LocalizedLink;
