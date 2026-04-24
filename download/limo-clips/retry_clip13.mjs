import ZAI from 'z-ai-web-dev-sdk';
import { writeFileSync } from 'fs';

const zai = await ZAI.create();

const task = await zai.video.generations.create({
  prompt: 'A tall African man in white tank top stands proudly next to a full-sized wooden stretch limousine he built by hand. Wide shot showing the entire handmade wooden car with carved details. Golden sunset light. Documentary style, natural ambience only.',
  quality: 'speed',
  duration: 5,
  fps: 30,
  size: '768x1344'
});

const taskId = task.id || task.taskId || task.task_id;
console.log('Task created:', taskId);
writeFileSync('clip13_task.json', JSON.stringify({ taskId, status: 'submitted', time: new Date().toISOString() }));

// Poll for result
for (let i = 0; i < 60; i++) {
  await new Promise(r => setTimeout(r, 15000));
  try {
    const result = await zai.async.result.query(taskId);
    console.log(`Poll ${i+1}:`, JSON.stringify(result).slice(0, 200));
    
    if (result.status === 'succeeded' || result.status === 'completed') {
      const videoUrl = result.output?.video_url || result.output?.url || result.data?.url || result.url;
      if (videoUrl) {
        console.log('VIDEO URL:', videoUrl);
        writeFileSync('clip13_result.json', JSON.stringify({ taskId, status: 'done', url: videoUrl, time: new Date().toISOString() }));
        
        // Download
        const { execSync } = await import('child_process');
        execSync(`curl -L -o clip13.mp4 "${videoUrl}"`, { stdio: 'inherit' });
        console.log('Downloaded clip13.mp4');
      }
      break;
    }
    if (result.status === 'failed') {
      console.error('Task failed:', JSON.stringify(result));
      writeFileSync('clip13_result.json', JSON.stringify({ taskId, status: 'failed', result, time: new Date().toISOString() }));
      break;
    }
  } catch (e) {
    console.log(`Poll ${i+1} error: ${e.message}`);
  }
}
