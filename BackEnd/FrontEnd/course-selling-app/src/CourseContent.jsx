import  { useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { isCourseLoading } from './store/selectors/course';
import { EmailState, userEmailState } from './store/selectors/userEmailState';
import './CourseContent.css'; // Import your custom CSS file for styling

const CourseContent = () => {
  const [video, setVideo] = useState(null);
  const [courseTitle, setCourseTitle] = useState(''); // Added courseTitle state
  const [courseDescription, setCourseDescription] = useState(''); // Added courseDescription state
  const [courseImage, setCourseImage] = useState(''); // Added courseImage state
  let { courseId } = useParams();
  const CourseLoading = useRecoilValue(isCourseLoading);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const adminEmail = useRecoilValue(EmailState);
  const userEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();

  // Create a ref for the file input
  const fileInputRef = useRef(null);

  // Redirect to the home page if neither admin nor user is authenticated
  if (!adminEmail && !userEmail) {
    navigate("/");
  }

  // Display a loading screen while the course data is being fetched
  if (CourseLoading) {
    return (
      <div className="loading-container">
        <div className="loading-text">Loading...</div>
      </div>
    );
  }

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
    formData

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
        />
        <textarea
          placeholder="Course Description"
          value={courseDescription}
          onChange={(e) => setCourseDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Course Image URL"
          value={courseImage}
          onChange={(e) => setCourseImage(e.target.value)}
        />
      </div>
      
      <div className="upload-section">
        <div className="course-header">
          <img src={courseImage} alt={courseTitle} className="course-image" />
          <div className="course-details">
            <h1 className="course-title">{courseTitle}</h1>
            <p className="course-description">{courseDescription}</p>
          </div>
        </div>
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
