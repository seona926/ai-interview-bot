import React from 'react';

export default function FolderSelector({ folders, activeFolder, onChange, onAddFolder }) {
  return (
    <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center gap-2">
      <label className="text-sm text-gray-700">📁 폴더 지정:</label>
      <select
        className="border rounded p-1"
        value={activeFolder}
        onChange={(e) => onChange(e.target.value)}
      >
        {folders.map(folder => (
          <option key={folder} value={folder}>{folder}</option>
        ))}
      </select>
      <button
        onClick={onAddFolder}
        className="px-2 py-1 border rounded bg-white text-sm"
      >
        + 새 폴더
      </button>
    </div>
  );
}
