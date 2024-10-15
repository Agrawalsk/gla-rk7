import React, { useState } from 'react';

export default function NewPostForm({ addNewPost }) {
  const [content, setContent] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      addNewPost(content);
      setContent('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 mb-8">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="What's on your mind?"
        className="w-full p-2 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
      />
      <div className="mt-2 flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
        >
          Post
        </button>
      </div>
    </form>
  );
}