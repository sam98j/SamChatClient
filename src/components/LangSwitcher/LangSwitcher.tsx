import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

const LanguageSwitcher: React.FC<{ path: string }> = ({ path }) => {
  const { locale } = useRouter();
  const localPath = locale === 'en' ? 'ar' : 'en';
  return (
    <div>
      <Link
        href={`/${path}`}
        locale={localPath}
        style={{ textAlign: 'center', marginTop: '10px' }}
      >
        {locale === 'en' ? 'عربي' : 'English'}
      </Link>
    </div>
  );
};

export default LanguageSwitcher;
