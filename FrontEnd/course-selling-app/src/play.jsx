import  { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import styled from "styled-components";

const PlayerContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  z-index:0;
  

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const Player = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [videos, setVideos] = useState([]); // Assuming you have an array of videos for the course.

  useEffect(() => {
    // Fetch the video data for the specified videoId
    axios.get("http://localhost:3000/user/videofind/" + videoId, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((response) => {
        setVideo(response.data);
        const courseId = response.data.courseId;
        console.log(courseId);
        axios.get("http://localhost:3000/user/course/content/" + courseId, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        })
          .then((response) => {
            setVideos(response.data);
          })
          .catch((error) => {
            console.error('Error fetching course videos', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching video data', error);
      });

    // Fetch the list of videos for the course (you should set this array as per your data structure)
  
  }, [videoId]);

  if (!video) {
    return <div>Video not found</div>;
  }

  return (
    <PlayerContainer>
      <span>
        <h2>{video.title}</h2>
        <VideoFrame src={video.videoUrl} controls />
        <h4>{video.description}</h4>
        <h2>Course Videos</h2>
      </span>s
      <VideoList videos={videos} />
    </PlayerContainer>
    
  );
};

const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

const VideoListContainer = styled.div`
  overflow-y: auto; /* Make the video list scrollable */
  max-height: 720px; /* Set a maximum height for the scrollable area */
  @media (max-width: 768px) {
    margin-top: 10px;
    width:100%
  }
`;


const VideoList = ({ videos }) => {
  const navigate = useNavigate();

  return (
    <VideoListContainer>
      <ul>
        {videos.map((video) => (
          <div
          key={video._id}
          className="course-card"
          onClick={() => {
            window.scrollTo(0, 0);
            navigate("/player/" + video._id);
          }}
        >
          <img src={video.image} alt={video.title} className="course-thumbnail" />

  
            <div className="course-title">{video.title}</div>
          </div>
        ))}
      </ul>
    </VideoListContainer>
  );
};

export default Player;
