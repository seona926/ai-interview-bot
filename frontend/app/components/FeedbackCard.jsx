import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function FeedbackCard({ feedback }) {
  if (!feedback) return null;

  return (
    <div className="bg-blue-50 border p-4 rounded shadow">
      <h2 className="text-lg font-semibold mb-2">📝 피드백</h2>
      <ReactMarkdown>{feedback}</ReactMarkdown>
    </div>
  );
}