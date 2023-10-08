import  { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import styled from "styled-components";

const Player = () => {
    const {videoId} = useParams();
  const [video, setVideo] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/video/"+videoId, {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          });
          console.log(response);
        setVideo(response.data);
        console.log(video.playableUrl);
      } catch (error) {
        console.error('Error fetching video:', error);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (!video) {
    return <div>Video not found</div>;
  }

  const VideoWrapper = styled.div``;

  const VideoFrame = styled.video`
  max-height: 720px;
  width: 100%;
  object-fit: cover;
`;

  return (
    <div>
      <h2>{video.title}</h2>
      <VideoWrapper>
          <VideoFrame src={video.playableUrl} controls />
        </VideoWrapper>
    </div>
  );
};

export default Player;