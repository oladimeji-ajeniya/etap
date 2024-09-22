import { useAuth } from '@/hooks/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Header = () => {
  const { isAuthenticated, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="bg-blue-600 text-white p-4">
      <nav className="container mx-auto flex justify-between">
        <h1 className="text-lg font-bold">Etap</h1>
        <ul className="flex space-x-4">
          {!isAuthenticated ? (
            <>
              <li>
                <Link href="/signup" className="hover:underline">Sign Up</Link>
              </li>
              <li>
                <Link href="/login" className="hover:underline">Log In</Link>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link href="/" className="hover:underline">Home</Link>
              </li>
              <li>
                <Link href="/subject/list" className="hover:underline">Subjects</Link>
              </li>
              <li>
                <button onClick={handleLogout} className="hover:underline text-red-400">
                  Sign Out
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
