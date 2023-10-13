import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRecoilValue } from 'recoil';
import { EmailState, userEmailState } from './store/selectors/userEmailState';
import { useNavigate, useParams } from 'react-router-dom';
import './VideoPlayer.css'; // Import your custom CSS file for styling

const VideoPlayer = () => {
  const [videos, setVideos] = useState([]);
  let { courseId } = useParams();
  const adminEmail = useRecoilValue(EmailState);
  const userEmail = useRecoilValue(userEmailState);
  const navigate = useNavigate();

  // Redirect to the home page if neither admin nor user is authenticated
  if (!adminEmail && !userEmail) {
    navigate("/");
  }

  useEffect(() => {
    // Fetch video data from the backend API when the component mounts
    axios.get(`http://localhost:3000/user/course/content/${courseId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => {
        // Update the state with the fetched video data
        setVideos(response.data);
      })
      .catch((error) => {
        console.error('Error fetching video data', error);
      });
  }, []);

  return (
    <div className="course-cards-container">
      {videos.map((video) => (
        <div
          key={video._id}
          className="course-card"
          onClick={() => {
            navigate("/player/" + video._id);
          }}
        >
          <img src={video.image} alt={video.title} className="course-thumbnail" />
          <div className="course-details">
            <img src={video.thumb} alt="Author" className="author-avatar" />
            <div className="course-title">{video.title}</div>
            <div className="course-description">{video.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoPlayer;
