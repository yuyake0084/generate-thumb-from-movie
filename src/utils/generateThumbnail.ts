import * as path from "path";

// @ts-ignore
import { path as ffprobePath } from "@ffprobe-installer/ffprobe";
import { path as ffmpegPath } from "@ffmpeg-installer/ffmpeg";
import ffmpeg from "fluent-ffmpeg";

ffmpeg.setFfprobePath(ffprobePath);
ffmpeg.setFfmpegPath(ffmpegPath);

const count = 1000;

/**
 * 動画のメタ情報を解析する処理
 * @param url
 */
const generateThumbnail = async (url: string) => {
  const seconds = 1;
  const timemarks = new Array(count).fill(0).map((v, i) => seconds * (i + 1));

  return Promise.all(timemarks.map((mark, idx) => {
    return new Promise((resolve) => {
      const filename = `${idx + 1}`.padStart(4, '0')
      
      ffmpeg(url)
        .screenshots({
          count: 1,
          folder: path.resolve(__dirname, "../../_thumbs"),
          timemarks: [mark],
          filename: `${filename}.jpg`,
          size: "240x135",
        })
        .on("end", () => {
          resolve(mark);
        });
    });
  }));
};

(async () => {
  const url = process.argv[2]

  if (!url) throw new Error('URLが指定されていません')

  const result = await generateThumbnail(url)

  console.log(result)
})()