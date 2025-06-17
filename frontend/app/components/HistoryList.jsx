import React from 'react';
import ReactMarkdown from 'react-markdown';

export default function HistoryList({
  history,
  activeFolder,
  showOnlyBookmarked,
  expandedIndexes,
  toggleIndex,
  toggleBookmark,
}) {
  const filteredHistory = history.filter(
    (item) =>
      item.folder === activeFolder &&
      (!showOnlyBookmarked || item.bookmarked)
  );

  return (
    <div className="mt-8 space-y-4">
      {filteredHistory.map((item, index) => {
        const isExpanded = expandedIndexes.includes(index);
        return (
          <div key={index} className="border rounded shadow bg-white">
            <div className="flex justify-between items-center border-b">
              <button
                onClick={() => toggleIndex(index)}
                className="w-full text-left p-4 font-medium text-gray-800 hover:bg-gray-50 truncate"
                title={item.question}
              >
                🧠 {item.question}
              </button>
              <button
                onClick={() => toggleBookmark(index)}
                className="px-3 text-yellow-500 hover:text-yellow-600"
                title="책갈피 토글"
              >
                {item.bookmarked ? '★' : '☆'}
              </button>
            </div>

            {isExpanded && (
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="font-semibold text-gray-700">🙋 나의 답변</h3>
                  <p className="whitespace-pre-wrap">{item.answer}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700">📝 피드백</h3>
                  <ReactMarkdown>{item.feedback}</ReactMarkdown>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}