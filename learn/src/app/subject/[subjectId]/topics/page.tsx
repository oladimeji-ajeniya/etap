"use client";

import isAuthGuard from '@/components/isAuthGuard';
import Pagination from '@/components/Pagination';
import { fetchTopicsBySubject, sendVideoProgress, Topic } from '@/services/topicService';
import { useParams } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

const SubjectTopicsPage = () => {
  const { subjectId } = useParams(); 
  const [topics, setTopics] = useState<Topic[]>([]); 
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1); 
  const limit = 10; 
  const videoRefs = useRef<Record<number, HTMLVideoElement | null>>({}); // Store video references
  const userId = parseInt(localStorage.getItem('userId') || '0', 10); // Get userId from localStorage

  useEffect(() => {
    if (!subjectId) return;

    const fetchTopics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token') || '';
        const data = await fetchTopicsBySubject(subjectId, page, limit, token);

        console.log('data', data);

        
        setTopics(data.topics);
        setTotalPages(data.total);
      } catch (err: any) {
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [subjectId, page]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleVideoTimeUpdate = async (topicId: number) => {
    const videoElement = videoRefs.current[topicId];
    if (videoElement) {
      const currentTime = Math.floor(videoElement.currentTime); 
      const duration = Math.floor(videoElement.duration);

      if (currentTime >= 120 && currentTime < duration) {
        const watchTimePercentage = Math.floor((currentTime / duration) * 100); 

        try {
          await sendVideoProgress(userId, topicId, watchTimePercentage, localStorage.getItem('token') || '');
          console.log(`Progress sent for user ID: ${userId}, topic ID: ${topicId}, Percentage: ${watchTimePercentage}`);
        } catch (error) {
          console.error('Failed to send progress:', error);
        }
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      {topics.length === 0 ? (
        <p>No topics found for this subject.</p>
      ) : (
        <ul className="space-y-4">
          {topics.map((topic) => (
            <li key={topic.id} className="bg-white p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold">{topic.title}</h2>
              <p className="mt-2">{topic.description}</p>
              {topic.video_url ? (
                <video
                  src={topic.video_url}
                  className="mt-4"
                  width="500"
                  controls
                  ref={(el) => (videoRefs.current[topic.id] = el)} 
                  onTimeUpdate={() => handleVideoTimeUpdate(topic.id)}
                >
                  Your browser does not support the video tag.
                </video>
              ) : (
                <p>No video available for this topic.</p>
              )}
            </li>
          ))}
        </ul>
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default isAuthGuard(SubjectTopicsPage);
