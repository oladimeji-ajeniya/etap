"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { fetchTopics } from '@/services/topicService'; // Make sure this path is correct
import { Topic } from '@/services/topicService'; // Adjust import as necessary

const SubjectTopicsPage = () => {
  const router = useRouter();
  const { id } = router.query; // Get subject ID from the URL
  const [topics, setTopics] = useState<Topic[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!id) return; // Wait for ID to be available

    const getTopics = async () => {
      try {
        const data = await fetchTopics(Number(id)); // Fetch topics for the subject
        setTopics(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch topics');
      } finally {
        setLoading(false);
      }
    };

    getTopics();
  }, [id]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-4xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Topics for Subject ID: {id}</h1>

        {loading && <p>Loading topics...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {!loading && !error && (
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="px-4 py-2">ID</th>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Description</th>
                <th className="px-4 py-2">Video URL</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic.id} className="border-t">
                  <td className="px-4 py-2">{topic.id}</td>
                  <td className="px-4 py-2">{topic.title}</td>
                  <td className="px-4 py-2">{topic.description}</td>
                  <td className="px-4 py-2">{topic.video_url}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default SubjectTopicsPage;
