import React from 'react';

export default function ControlButtons({ onNext, onToggleHistory, showHistory, disabled }) {
  return (
    <div className="flex justify-between items-center mt-4">
      <button
        onClick={onToggleHistory}
        className="px-4 py-2 bg-gray-500 text-white rounded"
      >
        {showHistory ? '히스토리 닫기' : '이전 질문 보기'}
      </button>

      <button
        onClick={onNext}
        className="px-4 py-2 bg-blue-600 text-white rounded"
        disabled={disabled}
      >
        다음 질문 받기
      </button>
    </div>
  );
}
