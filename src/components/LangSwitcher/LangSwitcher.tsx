import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

export default function LanguageSwitcher() {
    const { locale } = useRouter();
    const localPath = locale === 'en' ? 'ar' : 'en';
    return (
        <div>
            <Link
                href={`/${localPath}/login`}
                locale='ar'
                style={{ textAlign: 'center', marginTop: '10px' }}
            >
                {locale === 'en' ? 'عربي' : 'English'}
            </Link>
        </div>
    );
}
