import { BucketHandlerArgs } from "@pulumi/cloud";
import { Table, Task } from "@pulumi/cloud-aws";
import { Output } from "@pulumi/pulumi";
import { IUploadVideoItem } from "../../shared/types";

export const createVideoThumbnail = (
  bucketName: Output<string>,
  bucketArgs: any,
  runner: Task
) => {
  console.log(
    `*** New video: file ${bucketArgs.key} was uploaded at ${bucketArgs.eventTime}.`
  );
  const file = bucketArgs.key;

  const thumbnailFile = (
    file.substring(0, file.indexOf("_")) + ".thumb.jpg"
  ).replace("upload/", "");

  runner
    .run({
      environment: {
        S3_BUCKET: bucketName.get(),
        INPUT_VIDEO: file,
        TIME_OFFSET: "00:00:01.000",
        OUTPUT_FILE: thumbnailFile,
        S3_DEST_DIR: "out",
      },
    })
    .then(() => {
      console.log(`Running thumbnailer task.`);
    });
};

export const createVideoPreview = (
  bucketName: Output<string>,
  bucketArgs: any,
  runner: Task,
  length: Number = 5
) => {
  const file = bucketArgs.key;

  const prevFile = (file.substring(0, file.indexOf("_")) + ".prev.mp4").replace(
    "upload/",
    ""
  );

  runner
    .run({
      environment: {
        S3_BUCKET: bucketName.get(),
        INPUT_VIDEO: file,
        TIME_OFFSET: "00:00:01.000",
        LENGTH: length.toString(),
        OUTPUT_FILE: prevFile,
        S3_DEST_DIR: "out",
      },
    })
    .then(() => {
      console.log(`Running prev img task.`);
    });
};

export const createVideoPickerThumbnail = (
  bucketName: Output<string>,
  bucketArgs: any,
  runner: Task,
  interval: Number = 5
) => {
  const file = bucketArgs.key;

  const prevFile = (file.substring(0, file.indexOf("_")) + ".mp4.png").replace(
    "upload/",
    ""
  );

  runner
    .run({
      environment: {
        S3_BUCKET: bucketName.get(),
        INPUT_VIDEO: file,
        TIME_OFFSET: "00:00:01.000",
        OUTPUT_FILE: prevFile,
        INTERVAL: interval.toString(),
        S3_DEST_DIR: "out",
      },
    })
    .then(() => {
      console.log(`Running prev picker thumbnail task.`);
    });
};

export const prepareVideo = (
  bucketName: Output<string>,
  bucketArgs: BucketHandlerArgs,
  videoThumbnailRunner: Task,
  videoPrevRunner: Task,
  videoPrevLength: Number = 5,
  videoThumbnailPicker: Task,
  videoThumbnailInterval: Number = 5,
  table: Table
) => {
  const { key } = bucketArgs;
  const id = key.substring(0, key.indexOf("_")).split("/")[1];
  insertVideo(table, { id, videoKey: bucketArgs.key });
  createVideoThumbnail(bucketName, bucketArgs, videoThumbnailRunner);
  createVideoPreview(bucketName, bucketArgs, videoPrevRunner, videoPrevLength);

  createVideoPickerThumbnail(
    bucketName,
    bucketArgs,
    videoThumbnailPicker,
    videoThumbnailInterval
  );
};

export const insertVideo = (table: Table, item: IUploadVideoItem) => {
  table.insert({ id: item.id, videoKey: item.videoKey });
};

export const updateVideo = (table: Table, item: IUploadVideoItem) => {
  const { id, ...rest } = item;
  table.update({ id }, rest);
};
