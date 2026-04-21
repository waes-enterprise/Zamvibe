import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const clipNum = parseInt(process.argv[2]);
const imgPath = process.argv[3];
const prompt = process.argv[4];

const zai = await ZAI.create();
const imgBuffer = fs.readFileSync(imgPath);
const base64Img = `data:image/png;base64,${imgBuffer.toString('base64')}`;

const task = await zai.video.generations.create({
  image_url: base64Img,
  prompt: prompt,
  quality: 'speed',
  duration: 5,
  fps: 30,
  size: '768x1344'
});
console.log('TASK_ID:' + task.id);

// Poll for result
let pollCount = 0;
while (pollCount < 120) {
  pollCount++;
  await new Promise(r => setTimeout(r, 10000));
  try {
    const result = await zai.async.result.query(task.id);
    if (pollCount % 3 === 0) console.log('Poll ' + pollCount + ': ' + result.task_status);
    if (result.task_status === 'SUCCESS') {
      const url = result.video_result?.[0]?.url || result.video_url || result.url || result.video;
      console.log('VIDEO_URL:' + url);
      break;
    } else if (result.task_status === 'FAIL') { console.log('FAILED'); break; }
  } catch(e) {}
}
