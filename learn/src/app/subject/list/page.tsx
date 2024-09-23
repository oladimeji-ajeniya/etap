"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchSubjects, Subject } from '@/services/subjectService';
import isAuthGuard from '@/components/isAuthGuard';

const ListSubjectsPage = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    const getSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message || 'Unable to get subjects');
        } else {
          setError('Unable to get subjects');
        }
      } finally {
        setLoading(false);
      }
    };
  
    getSubjects();
  }, []);  

  const handleViewTopics = (subjectId: number | undefined) => {
    router.push(`/subject/${subjectId}/topics`); 
  };

  return (
    <div className="flex justify-center items-center bg-gray-100">
      <div className="w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Subjects List</h1>

        {loading && <p>Loading subjects...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        
        {!loading && !error && (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className="border-t">
                  <td className="px-4 py-2">{subject.title}</td>
                  <td className="px-4 py-2">{subject.description}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleViewTopics(subject.id)}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                      View Topics
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default isAuthGuard(ListSubjectsPage);
