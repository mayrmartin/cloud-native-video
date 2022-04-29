import { Box, Card, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IVideoItem } from "./../../shared/types/index";
import "./App.css";
import { VideoPreviewElement } from "./components/VideoPreviewElement";

function App() {
  const [videos, setVideos] = useState<IVideoItem[]>();

  const fetchVideo = async () => {
    const request = await fetch(
      `${process.env.REACT_APP_API_BASE_URL}/api/videos`
    );

    if (request.status !== 200) {
      alert("Error fetching videos");
    }

    setVideos(await request.json());
  };

  useEffect(() => {
    fetchVideo();
  }, []);

  return (
    <>
      {videos ? (
        <Box padding={"7%"}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
          >
            {videos.map((el, index) => (
              <Grid item xs={2} sm={4} md={4} key={index}>
                <Link to={`/stage/play/${el.id}`}>
                  <Card variant="outlined">
                    <VideoPreviewElement
                      previewVideoUrl={el.previewVideoUrl}
                      previewUrlThumbnailUrl={el.previewUrlThumbnailUrl}
                    />
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        </Box>
      ) : (
        <>Loading...</>
      )}
    </>
  );
}

export default App;
