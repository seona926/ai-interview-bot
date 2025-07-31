'use client';
import { useState } from 'react';

export default function ResumeUploader({ onResumeReady }) {
  const [text, setText] = useState('');

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:4000/upload-resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ resumeText: text }),
    });

    const data = await res.json();
    console.log('서버 응답:', data);

    // 부모 컴포넌트에 전달
    onResumeReady(text);
  };

  return (
    <div className="p-4 border rounded mb-4">
      <h2 className="text-lg font-bold mb-2">자소서 입력</h2>
      <textarea
        className="w-full p-2 border"
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="자소서를 여기에 입력하세요..."
      />
      <button
        className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={handleSubmit}
      >
        자소서 제출
      </button>
    </div>
  );
}
