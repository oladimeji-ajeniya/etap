"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { signupUser } from '@/services/auth';

const SignupPage = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Form validation schema using Yup
  const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters long')
      .required('Password is required'),
  });

  const handleSubmit = async (values: { name: string; email: string; password: string }, { setSubmitting }: any) => {
    setError(null);

    try {
      await signupUser(values.name, values.email, values.password);
      alert('Signup successful!');
      setSubmitting(false);
      router.push('/login'); 
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      setSubmitting(false); 
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl text-black font-semibold mb-6 text-center">Sign Up</h1>

        <Formik
          initialValues={{ name: '', email: '', password: '' }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Name:
                </label>
                <Field
                  id="name"
                  name="name"
                  type="text"
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your name"
                />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Email:
                </label>
                <Field
                  id="email"
                  name="email"
                  type="email"
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                  Password:
                </label>
                <Field
                  id="password"
                  name="password"
                  type="password"
                  className="w-full p-3 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your password"
                />
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isSubmitting} 
              >
                {isSubmitting ? 'Signing up...' : 'Sign Up'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default SignupPage;
