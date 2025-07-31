'use client';
import { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import ChatBox from './components/ChatBox.jsx';

export default function Home() {
  const [resumeText, setResumeText] = useState('');

  return (
    <main className="p-4 max-w-3xl mx-auto">
      {!resumeText ? (
        <ResumeUploader onResumeReady={setResumeText} />
      ) : (
        <ChatBox resumeText={resumeText} />
      )}
    </main>
  );
}
