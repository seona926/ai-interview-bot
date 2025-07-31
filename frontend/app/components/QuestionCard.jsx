import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function QuestionCard({ question, answer, step, isBookmarked, onToggleBookmark }) {
  return (
    <div className="bg-gray-100 p-4 rounded shadow relative">
      <div className="flex justify-between items-start">
        <h2 className="text-lg font-semibold mb-2">🧠 면접 질문</h2>
        {step === 'feedback' && (
          <button
            onClick={onToggleBookmark}
            className="text-yellow-500 hover:text-yellow-600 text-xl"
            title="책갈피"
          >
            {isBookmarked ? '★' : '☆'}
          </button>
        )}
      </div>
      <ReactMarkdown>{question}</ReactMarkdown>

      {step === 'feedback' && answer && (
        <div className="mt-4 bg-white border-t pt-4">
          <h3 className="text-md font-medium text-gray-700">🙋 나의 답변</h3>
          <p className="mt-2 whitespace-pre-wrap text-gray-800">{answer}</p>
        </div>
      )}
    </div>
  );
}