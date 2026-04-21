import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';

const zai = await ZAI.create();
const imgBuffer = fs.readFileSync('/home/z/my-project/download/limo-clips/clip1_img.png');
const base64Img = `data:image/png;base64,${imgBuffer.toString('base64')}`;

const task = await zai.video.generations.create({
  image_url: base64Img,
  prompt: 'The man picks up a long plank from the stack, extends the tape measure along its length, reads the measurement, then marks a cut line with his pencil on the wood grain. He repeats this on several planks. Documentary raw footage, natural ambience only, no music no dialogue no text.',
  quality: 'speed',
  duration: 5,
  fps: 30,
  size: '768x1344'
});
console.log('TASK_ID:' + task.id);
