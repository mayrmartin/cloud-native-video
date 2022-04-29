import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
require("videojs-sprite-thumbnails");

export interface IVideoPlayerProps {
  videoUrl: string;
  pickerThumbnailUrl: string;
}

export const VideoPlayer = (props: IVideoPlayerProps) => {
  const playerRef = useRef(null);
  useEffect(() => {
    if (playerRef.current) (playerRef as any).dispose();

    var player = ((playerRef.current as any) = videojs(
      "videojs-sprite-thumbnails-player"
    ));

    // setup 160x90 thumbnails in sprite.jpg, 1 per second
    console.log(props.pickerThumbnailUrl);
    (player as any).spriteThumbnails({
      interval: 10,
      url: props.pickerThumbnailUrl,
      width: 160,
      height: 90,
    });

    return () => {
      if (playerRef.current) {
        (playerRef.current as any).dispose();
        playerRef.current = null;
      }
    };
  }, [props, playerRef]);

  return (
    <>
      <video
        id="videojs-sprite-thumbnails-player"
        className="video-js vjs-default-skin"
        data-setup='{"aspectRatio":"12:5"}'
        controls={true}
      >
        <source src={props.videoUrl} type="video/mp4" />
      </video>
    </>
  );
};

export default VideoPlayer;
