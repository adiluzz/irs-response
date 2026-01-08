'use client';

import dynamic from 'next/dynamic';

const HomePage = dynamic(() => import('@/components/pages/HomePage').then(mod => ({ default: mod.HomePage })), {
  ssr: false,
});

export default function Page() {
  return <HomePage />;
}
