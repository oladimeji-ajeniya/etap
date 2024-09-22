import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const isAuthGuard = (WrappedComponent: any) => {
  const AuthGuard = (props: any) => {
    const router = useRouter();
    const token = localStorage.getItem('token');

    useEffect(() => {
      if (!token) {
        router.push('/login'); 
      }
    }, [token, router]);

    if (!token) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };
  return AuthGuard;
};

export default isAuthGuard;
