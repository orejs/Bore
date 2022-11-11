import dynamic from 'next/dynamic';

export const AdminLayout = dynamic(() => import('./AdminLayout'), {
  ssr: false,
});
