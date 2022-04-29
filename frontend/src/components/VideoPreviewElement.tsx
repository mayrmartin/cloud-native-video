import { CircularProgress } from "@mui/material";
import { useEffect, useRef } from "react";
import HoverVideoPlayer from "react-hover-video-player";
export interface IPreviewItemProps {
  previewVideoUrl: string;
  previewUrlThumbnailUrl: string;
}

export const VideoPreviewElement = (props: IPreviewItemProps) => {
  const hoverVideoRef = useRef();
  useEffect(() => {
    const videoElement = hoverVideoRef.current as any;
    videoElement.playbackRate = 3;
  }, [hoverVideoRef]);
  return (
    <HoverVideoPlayer
      videoRef={hoverVideoRef as any}
      videoSrc={props.previewVideoUrl}
      pausedOverlay={
        <img
          src={props.previewUrlThumbnailUrl}
          alt=""
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />
      }
      loadingOverlay={
        <>
          <CircularProgress />
        </>
      }
    />
  );
};
