export interface IVideoItem {
  id: string;
  previewVideoUrl: string;
  previewUrlThumbnailUrl: string;
  videoUrl: string;
  pickerThumbnailUrl: string;
}

export interface IUploadVideoItem {
  id: string;
  previewVideoKey?: string;
  previewUrlThumbnailKey?: string;
  videoKey?: string;
  pickerThumbnailKey?: string;
}
