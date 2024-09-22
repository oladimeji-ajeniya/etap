import { VIDEO_PROGRESS_REPOSITORY } from "src/core/constants";
import { VideoProgress } from "./video-progress.model";

export const videoProgressProviders = [
  {
    provide: VIDEO_PROGRESS_REPOSITORY,
    useValue: VideoProgress,
  }
];