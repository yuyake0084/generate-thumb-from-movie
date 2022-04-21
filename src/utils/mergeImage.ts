import fs from 'fs'
import path from 'path'
import joinImages from 'join-images'

/**
 * 指定した数の分だけ配列を分割する処理
 * @param array 
 * @param number 
 */
 export const sliceByNumber = <T>(array: T[], number: number) => {
  const length = Math.ceil(array.length / number);

  return [...Array(length)].map((_, i) =>
    array.slice(i * number, (i + 1) * number)
  );
};

const thumbsDir = path.resolve(__dirname, '../../_thumbs');
const mergedDir = path.resolve(__dirname, '../../_merged');

(async () => {
  try {
    fs.readdirSync(mergedDir).forEach(f => fs.rmSync(`${mergedDir}/${f}`))

    const images = fs.readdirSync(thumbsDir).map((image) => `${thumbsDir}/${image}`)
    const splicedImages = sliceByNumber(images.sort(), 10)

    await Promise.all(splicedImages.map(async(thumbs, idx) => {
      const result = await joinImages(thumbs, {
        direction: 'horizontal',
      })

      result.toFile(`${mergedDir}/${idx + 1}.png`)
    }))

    console.log('done.')
  } catch (e) {
    if (e instanceof Error) {
      console.error(e)
    }
  }
})()