import React from 'react';


export default function MutualFollows({ mutualFollows }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-semibold mb-4">Mutual Follows</h2>
      <ul className="space-y-4">
        {mutualFollows.map((follow) => (
          <li key={follow.id} className="border-b pb-2 last:border-b-0">
            <span className="font-medium">{follow.username}</span>
            <p className="text-sm text-gray-600 truncate">{follow.lastPost}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}