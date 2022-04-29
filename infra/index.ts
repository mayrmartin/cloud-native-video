import { BucketHandlerArgs } from "@pulumi/cloud";
import * as cloud from "@pulumi/cloud-aws";
import { prepareVideo, updateVideo } from "./convert";
import { getVideoById, listVideos } from "./endpoints/list";

const videoTable = new cloud.Table("videos", "id");
const videoBucket = new cloud.Bucket("videoBucket");
const videoBucketName = videoBucket.bucket.id;

// Create static serving
const staticServing = new cloud.API("cloud-native-video");
staticServing.static("/", "../frontend/build");

// Create an API endpoint
const api = new cloud.API("cloud-native-video-api");
api.get("/api/videos", (req, res) =>
  listVideos(req, res, videoTable, videoBucketName.get())
);
api.get("/api/videos/{id+}", (req, res) =>
  getVideoById(req, res, videoTable, videoBucketName.get())
);

/// A task which runs a containerized FFMPEG job to extract a thumbnail image.
const thumbnailTask = new cloud.Task("thumbnailTask", {
  build: "./convert/tasks/thumb",
  memoryReservation: 512,
});

const previewTask = new cloud.Task("previewTask", {
  build: "./convert/tasks/preview",
  memoryReservation: 512,
});

const pickerPreviewTask = new cloud.Task("pickerPreviewTask", {
  build: "./convert/tasks/pickerPreview",
  memoryReservation: 512,
});

// When a new video(.mp4) is uploaded
videoBucket.onPut(
  "onNewVideo",
  async (bucketArgs: BucketHandlerArgs) =>
    prepareVideo(
      videoBucketName,
      bucketArgs,
      thumbnailTask,
      previewTask,
      20,
      pickerPreviewTask,
      10,
      videoTable
    ),
  { keySuffix: ".mp4", keyPrefix: "upload/" }
);

// When a new thumbnail is created
videoBucket.onPut(
  "onNewThumbnail",
  (bucketArgs: BucketHandlerArgs) => {
    console.log(
      `*** New thumbnail: file ${bucketArgs.key} was saved at ${bucketArgs.eventTime}.`
    );
    const id = bucketArgs.key.split("/")[1].split(".")[0];
    updateVideo(videoTable, {
      id,
      previewUrlThumbnailKey: bucketArgs.key,
    });
    return Promise.resolve();
  },
  { keySuffix: ".thumb.jpg", keyPrefix: "out/" }
);

//When a new thumbnailpicker img is created
videoBucket.onPut(
  "onNewThumbnailPicker",
  (bucketArgs: BucketHandlerArgs) => {
    console.log(
      `*** New preview: file ${bucketArgs.key} was saved at ${bucketArgs.eventTime}.`
    );
    const id = bucketArgs.key.split("/")[1].split(".")[0];

    updateVideo(videoTable, { id, pickerThumbnailKey: bucketArgs.key });
    return Promise.resolve();
  },
  { keySuffix: ".mp4.png", keyPrefix: "out/" }
);

//When a new preview video is created
videoBucket.onPut(
  "onNewPreview",
  (bucketArgs: BucketHandlerArgs) => {
    console.log(
      `*** New preview: file ${bucketArgs.key} was saved at ${bucketArgs.eventTime}.`
    );
    const id = bucketArgs.key.split("/")[1].split(".")[0];

    updateVideo(videoTable, { id, previewVideoKey: bucketArgs.key });
    return Promise.resolve();
  },
  { keySuffix: ".prev.mp4", keyPrefix: "out/" }
);

// Export the bucket name.
exports.bucketName = videoBucketName;
exports.staticServing = staticServing.publish().url;
exports.api = api.publish().url;
