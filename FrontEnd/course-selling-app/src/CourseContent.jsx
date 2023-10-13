import  { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { EmailState, userEmailState } from './store/selectors/userEmailState';
import './CourseContent.css'; // Import your custom CSS file for styling

const CourseContent = () => {
  const [video, setVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState(''); // Added courseTitle state
  const [courseDescription, setCourseDescription] = useState(''); // Added courseDescription state
  const [courseImage, setCourseImage] = useState(''); // Added courseImage state
  const [courseThumb, setCourseThumb]=useState('');
  let { courseId } = useParams();
 
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const adminEmail = useRecoilValue(EmailState);
  const userEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();

  // Create a ref for the file input
  const fileInputRef = useRef(null);
  const imageRef = useRef(null);
  const desRef = useRef(null);
  const titleRef = useRef(null);
  const thumbnailRef = useRef(null);


  // Redirect to the home page if neither admin nor user is authenticated
  if (!adminEmail && !userEmail) {
    navigate("/");
  }

  // Display a loading screen while the course data is being fetched
 

  const handleFileChange = (event) => {
    setVideo(event.target.files[0]);
  };

  const handleUpload = async () => {
    var formData = new FormData();

    if (!video) {
      setMessage('Please select a video to upload.');
      setShowMessage(true);
      return;
    }
    formData.append('video', video);
    formData.append('title',courseTitle);
    formData.append('description',courseDescription);
    formData.append('image',courseImage)
    formData.append('thumb',courseThumb)

    try {
      await axios.post("http://localhost:3000/admin/upload/" + courseId, formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Required for file upload
          "Authorization": "Bearer " + localStorage.getItem("token")
        },
      });

      setMessage('Video uploaded successfully');
      setShowMessage(true);

      // Reset the file input and message after a delay
      setTimeout(() => {
        setVideo(null);
        setMessage('');
        setShowMessage(false);
        formData.delete('video'); // Clear the FormData
        fileInputRef.current.value = ''; // Clear the file input
        courseDescription.value='';
        courseTitle.value='';
        titleRef.current.value='';
        desRef.current.value='';

        imageRef.current.value='';

        thumbnailRef.current.value='';

        titleRef.current.value='';

      }, 2000); // 2 seconds
    } catch (error) {
      // Handle errors (e.g., display an error message to the admin)
      setMessage(`Error uploading video: ${error.message}`);
      setShowMessage(true);
    }
  };

  return (
    <div className="course-content-container">
      {/* Course Details Input Fields */}
      <div className="course-details-form">
        <input
          type="text"
          placeholder="Course Title"
          value={courseTitle}
          onChange={(e) => setCourseTitle(e.target.value)}
          ref={titleRef}
          
        />
        <textarea
          placeholder="Course Description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
          ref={desRef}
          
        />
        <input
          type="text"
          placeholder="Course Image URL"
          value={courseImage}
          onChange={(e) => setCourseImage(e.target.value)}
          ref={imageRef}
        />

<input
          type="text"
          placeholder="Course thumbnail URL"
          value={courseThumb}
          onChange={(e) => setCourseThumb(e.target.value)}
          ref={thumbnailRef}
        />
      </div>
      
      <div className="upload-section">
        <input
          type="file"
          accept="video/*"
          onChange={handleFileChange}
          ref={fileInputRef} // Assign the ref to the file input
        />
        <button className="upload-button" onClick={handleUpload}>Upload Video</button>
        {showMessage && <div className="message">{message}</div>}
      </div>
    </div>
  );
};

export default CourseContent;
