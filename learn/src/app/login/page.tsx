"use client";
import { useAuth } from '@/hooks/AuthContext';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { login } from '@/services/auth'; 
import { useRouter } from 'next/navigation'; 

const LoginPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); 
  const { login: contextLogin } = useAuth();

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setError(null);

    try {
      const data = await login(values.email, values.password); 
      if (data && data.token) {
        localStorage.setItem('userId', data.user.id);
        contextLogin(data.token);
        router.push('/');
      } else {
        throw new Error('Invalid login response');
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-black font-semibold mb-6 text-center">Log In</h1>

        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email:</label>
                <Field id="email" name="email" type="email" className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your email" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-bold mb-2">Password:</label>
                <Field id="password" name="password" type="password" className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter your password" />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button type="submit" className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Log In'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default LoginPage;
