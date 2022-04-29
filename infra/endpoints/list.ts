import { Request, Response } from "@pulumi/cloud";
import { Table } from "@pulumi/cloud-aws";
import * as AWS from "aws-sdk";
import { IUploadVideoItem, IVideoItem } from "../../shared/types";
import { awsSecrets } from "../config";
AWS.config.update(awsSecrets);
const getSignedUrl = (bucketName: string, objectKey: string) => {
  const s3 = new AWS.S3();

  const params = {
    Bucket: bucketName,
    Key: objectKey,
    Expires: 60 * 60 * 10,
  };

  return s3.getSignedUrl("getObject", params);
};

export const listVideos = async (
  req: Request,
  res: Response,
  table: Table,
  bucketName: string
) => {
  const items: IUploadVideoItem[] = await table.scan();
  const videos: IVideoItem[] = [];
  for (const el of items) {
    if (
      el.previewVideoKey !== undefined &&
      el.previewUrlThumbnailKey !== undefined &&
      el.videoKey !== undefined &&
      el.pickerThumbnailKey !== undefined
    ) {
      videos.push({
        id: el.id,
        previewVideoUrl: getSignedUrl(bucketName, el.previewVideoKey),
        previewUrlThumbnailUrl: getSignedUrl(
          bucketName,
          el.previewUrlThumbnailKey
        ),
        videoUrl: getSignedUrl(bucketName, el.videoKey),
        pickerThumbnailUrl: getSignedUrl(bucketName, el.pickerThumbnailKey),
      });
    }
  }
  res.status(200).json(videos || []);
};

export const getVideoById = async (
  req: Request,
  res: Response,
  table: Table,
  bucketName: string
) => {
  let id = req.params["id"];
  const item = await table.get({ id });
  let result = {};

  if (
    item.previewVideoKey !== undefined &&
    item.previewUrlThumbnailKey !== undefined &&
    item.videoKey !== undefined &&
    item.pickerThumbnailKey !== undefined
  ) {
    result = {
      id: item.id,
      previewVideoUrl: getSignedUrl(bucketName, item.previewVideoKey),
      previewUrlThumbnailUrl: getSignedUrl(
        bucketName,
        item.previewUrlThumbnailKey
      ),
      videoUrl: getSignedUrl(bucketName, item.videoKey),
      pickerThumbnailUrl: getSignedUrl(bucketName, item.pickerThumbnailKey),
    };
  }
  res.status(200).json(result);
};
