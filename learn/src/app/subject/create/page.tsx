"use client";
import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { createSubject, Subject } from '@/services/subjectService';
import isAuthGuard from '@/components/isAuthGuard';

const CreateSubjectPage = () => {
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validationSchema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    description: Yup.string().required('Description is required'),
  });

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Subject</h1>

        <Formik
          initialValues={{ title: '', description: '' }}
          validationSchema={validationSchema}
          onSubmit={async (values, { resetForm, setSubmitting }) => {
            setError(null); 
            setSuccess(null);

            try {
              const subject: Subject = {
                title: values.title,
                description: values.description,
                userId: JSON.parse(localStorage.getItem("userId") || "false"),
              };
              await createSubject(subject);
              setSuccess('Subject created successfully!');
              resetForm();
            } catch (err: any) {
              setError(err.message || 'Something went wrong');
            } finally {
              setSubmitting(false); // Ensure form submission state is reset
            }
          }}
        >
          {({ isSubmitting }) => (
            <Form>
              <div className="mb-4">
                <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                  Title:
                </label>
                <Field
                  id="title"
                  name="title"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject title"
                />
                <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
              </div>

              <div className="mb-4">
                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                  Description:
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subject description"
                />
                <ErrorMessage name="description" component="div" className="text-red-500 text-sm" />
              </div>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              {success && <p className="text-green-500 text-sm mb-4">{success}</p>}

              <button
                type="submit"
                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Saving...' : 'Create Subject'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default isAuthGuard(CreateSubjectPage);
