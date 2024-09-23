import { useRouter } from 'next/navigation';
import { useEffect, ComponentType } from 'react';

const isAuthGuard = <P extends object>(WrappedComponent: ComponentType<P>) => {
  const AuthGuard = (props: P) => {
    const router = useRouter();
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

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
