import React from 'react';


export default function UserFeed({ posts }) {
  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="font-semibold">{post.user}</span>
            <span className="text-sm text-gray-500">{new Date(post.timestamp).toLocaleString()}</span>
          </div>
          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}