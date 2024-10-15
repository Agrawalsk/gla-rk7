import  { useState } from 'react';
import './styles.css'; // Import the CSS file for styling

const SearchApp = () => {
  const [hashtag, setHashtag] = useState('');
  const [posts, setPosts] = useState([]);

  // Handle search logic
  const handleSearch = async (event) => {
    event.preventDefault(); // Prevent page reload

    try {
      const response = await fetch('http://localhost:5000/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ hashtag }), // Send as JSON
      });

      // Check if the response is okay
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log("Posts:", data.posts); // Log the retrieved posts
      setPosts(data.posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  return (
    <div className="App">
      <main className="search-container">
        <h1>Search Posts</h1>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search by hashtag..."
            value={hashtag}
            onChange={(e) => setHashtag(e.target.value)}
          />
          <input type="submit" value="Search" />
        </form>
        <div className="results">
          {posts.length > 0 ? (
            posts.map((post,index) => (
              <div key={index} style={{ margin: '10px',width:'fit-content', border:'1px solid black', padding:'20px' }}>
            <img
              src={`http://127.0.0.1:5000/image/${post.file_id}`}  // Ensure this URL serves the image from your backend
              alt={post.filename}
              style={{ maxWidth: '300px', marginBottom: '5px', padding:'5px', border:'1px solid black'}}
            />
            <p>{post.caption}</p>
            <p>{post.hashtags}</p>
          </div>
            ))
          ) : (
            <p>No posts found</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default SearchApp;
