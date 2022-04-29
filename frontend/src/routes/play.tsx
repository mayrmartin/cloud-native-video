import { Box } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IVideoItem } from "../../../shared/types";
import VideoPlayer from "../components/VideoPlayer";

export const PlayPage = () => {
  const params = useParams();
  const [video, setVideo] = useState<IVideoItem>();

  const fetchVideo = async () => {
    const request = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/videos/${params.videoId}`
    );

    if (request.status !== 200) {
      alert("Error fetching video");
    }
    setVideo(await request.json());
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <>
      {video ? (
        <>
          <Box padding={"7%"}>
            <VideoPlayer
              videoUrl={video.videoUrl}
              pickerThumbnailUrl={video.pickerThumbnailUrl}
            />
          </Box>
        </>
      ) : (
        <>Loading...</>
      )}
    </>
  );
};
