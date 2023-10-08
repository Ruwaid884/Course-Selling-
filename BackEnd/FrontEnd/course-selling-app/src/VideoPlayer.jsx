import  { useEffect, useState } from 'react';
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
    axios.get("http://localhost:3000/user/course/content/" + courseId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
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
    <div className="video-player-container">
      <h1>Video Player</h1>
      <div className="video-list">
        {videos.map((video) => (
          <div className="video-card" key={video._id}>
            <img src={video.thumbnailUrl} alt={video.title} className="video-thumbnail" />
            <div className="video-details">
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              <button onClick={() => {
                navigate("/player/" + video._id);
              }}>
                Play Video
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
