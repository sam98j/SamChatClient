import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const LanguageSwitcher: React.FC<{ path: string }> = ({ path }) => {
  const { locale } = useRouter();
  // get usr pref lang from local storage
  const localPath = locale === 'en' ? 'ar' : 'en';
  const clickHandler = () => {
    document.cookie = `NEXT_LOCALE=${localPath}; max-age=31536000; path=/`;
    localStorage.setItem('pref-lang', localPath);
  };
  return (
    <div>
      <Link
        href={`/${path}`}
        locale={localPath}
        onClick={clickHandler}
        style={{ textAlign: 'center', marginTop: '10px' }}
      >
        {locale === 'en' ? 'عربي' : 'English'}
      </Link>
    </div>
  );
};

export default LanguageSwitcher;
