"use client";
import isAuthGuard from '@/components/isAuthGuard';
import { fetchSubjects } from '@/services/subjectService';
import { createTopic } from '@/services/topicService';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const CreateTopicPage = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [subjectId, setSubjectId] = useState('');
  const [subjects, setSubjects] = useState<{ id: number; title: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Add loading state
  const router = useRouter(); // Router for navigation

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        const data = await fetchSubjects();
        setSubjects(data);
      } catch (err: any) {
        setError(err.message || 'Unable to fetch subjects');
      }
    };

    loadSubjects();
  }, []);

  const handleCreateTopic = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true); // Set loading state to true

    if (!videoFile) {
      setError('Please select a video file');
      setLoading(false); // Reset loading if there is an error
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('videos', videoFile);
    formData.append('subjectId', subjectId);

    try {
      await createTopic(formData);
      setSuccess('Topic created successfully!');
      
      // Reset form fields
      setTitle('');
      setDescription('');
      setVideoFile(null);
      setSubjectId('');

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false); // Set loading to false after the request
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-2xl font-semibold mb-6 text-center">Create Topic</h1>
        <form onSubmit={handleCreateTopic}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title:</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic title"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-medium mb-2">Description:</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter topic description"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="video" className="block text-gray-700 font-medium mb-2">Video File:</label>
            <input
              id="video"
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="subjectId" className="block text-gray-700 font-medium mb-2">Subject:</label>
            <select
              id="subjectId"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              required
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select a subject</option>
              {subjects.map((subject) => (
                <option key={subject.id} value={subject.id}>
                  {subject.title}
                </option>
              ))}
            </select>
          </div>
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-500 text-sm mb-4">{success}</p>}
          
          {/* Display loader and disable button when loading */}
          <button
            type="submit"
            className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Create Topic'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default isAuthGuard(CreateTopicPage);
