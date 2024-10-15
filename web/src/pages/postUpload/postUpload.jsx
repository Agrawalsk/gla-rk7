import { useState,useEffect} from 'react';
import axios from 'axios';
import "./post.css";

function PostUpload() {
  const [images, setImages] = useState([]);        // To store fetched images
  const [file, setFile] = useState(null);          // To store the selected file
  const [preview, setPreview] = useState('');      // For previewing the selected image
  const [uploadMessage, setUploadMessage] = useState('');  // To show upload status
  const [caption, setCaption] = useState('');       // To store the image caption
  const [hashtags,setHashtags] = useState('');
  
  // Handle file input change and create a preview
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);  // Set the preview to the file's Data URL
      };
      reader.readAsDataURL(selectedFile);  // Convert file to Data URL
    } else {
      setPreview('');  // Clear the preview if no file is selected
    }
  };

  // Fetch images when the component mounts
  useEffect(() => {
    fetchImages();
  }, []);

  // Function to fetch all images from the server
  const fetchImages = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:5000/images');  // Replace with your backend endpoint
      const posts = response.data.posts;  // Assuming the response contains 'posts'
      setImages(posts);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  // Function to handle file upload form submission
  const handleFileUpload = async (event) => {
    event.preventDefault();  // Prevent default form submission

    if (!file) {
      setUploadMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('caption', caption);  // Add the caption to formData
    formData.append('hashtags',hashtags);

    try {
      const response = await axios.post('http://127.0.0.1:5000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 201) {
        setUploadMessage('Image uploaded successfully.');
        setFile(null);  // Clear file selection
        setPreview('');  // Clear preview
        setCaption('');  // Clear caption
        setHashtags('')
        event.target.reset();  // Reset form inputs
        fetchImages();  // Refresh the image list
      }
    } catch (error) {
      setUploadMessage(`Error uploading image: ${error.response?.data?.error || error.message}`);
    }
  };
  const onCancel=() =>{
    setPreview('')
    setCaption('')
    setHashtags('')
  }
  // Function to handle image deletion
  const handleDelete = async (file_id) => {
    try {
      const response = await axios.delete(`http://127.0.0.1:5000/post/${file_id}`);
      if (response.status === 200) {
        setUploadMessage('Image deleted successfully.');
        fetchImages();  // Refresh the image list after deletion
      }
    } catch (error) {
      setUploadMessage(`Error deleting image: ${error.response?.data?.error || error.message}`);
    }
  };

  return (
    <div className='form'>
    <div className='col1'>      
      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} encType="multipart/form-data">
        <input type="file" name="file" accept="image/*" onChange={handleFileChange} />
        <input type="submit" value="Upload" />
        <button onClick={fetchImages}>All images</button>
      </form>
     

      {/* Image Preview */}
      {preview && (
        <>
     
        <div className="preview-container">
          <img src={preview} alt="Image preview" style={{ maxWidth: '300px', marginBottom: '5px', padding:'5px', border:'1px solid black'}} />
        </div>
        <form>
        <input 
              type="text" 
              name="caption" 
              placeholder="Enter caption" 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)} 
            />
        <input 
              type='text'
              name='HashTags'
              placeholder='Hashtags'
              value={hashtags}
              onChange={(e)=> setHashtags(e.target.value)}
              />
        <button onClick={onCancel}>Cancel</button>
              </form>
        </>
        

      )}

      {/* Upload Message */}
      {uploadMessage && <p>{uploadMessage}</p>}
</div>

      {/* Displaying Images */}
      <div className="imageContainer">
      
        {images.map((post, index) => (
          <div key={index} style={{ margin: '10px', border:'1px solid black', padding:'20px' }}>
            <img
              src={`http://127.0.0.1:5000/image/${post.file_id}`}  // Ensure this URL serves the image from your backend
              alt={post.filename}
              style={{ maxWidth: '300px', marginBottom: '5px', padding:'5px', border:'1px solid black'}}
            />
            <p>{post.caption}</p>
            <p>{post.hashtags}</p>
            <button onClick={() => handleDelete(post.file_id)}>Delete</button>  {/* Delete button */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PostUpload;
