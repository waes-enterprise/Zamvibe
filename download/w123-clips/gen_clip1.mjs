import ZAI from 'z-ai-web-dev-sdk';

async function createWithRetry(zai, params, maxRetries = 5) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      console.log(`Attempt ${i+1}/${maxRetries}...`);
      const task = await zai.video.generations.create(params);
      return task;
    } catch(e) {
      console.log(`Error: ${e.message}`);
      if (i < maxRetries - 1) {
        const wait = 60000 * (i + 1); // 1min, 2min, 3min, 4min, 5min
        console.log(`Waiting ${wait/1000}s before retry...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  throw new Error('All retries failed');
}

async function main() {
  const zai = await ZAI.create();
  
  console.log('Creating video task for Clip 1...');
  const task = await createWithRetry(zai, {
    prompt: "A tall African man in his mid-40s with dark brown skin and short natural hair, wearing a faded olive green work shirt, dark brown carpenter trousers, and worn leather work boots. He is in an outdoor backyard workshop with red clay ground, scattered wood planks, and a large mango tree providing shade. Natural morning golden hour light. The man carries a tape measure and pencil, surveys stacked raw wood planks, picks up a long plank, measures it carefully, and marks cut lines with his pencil. He references a small sketch on paper nailed to a wooden post. Close-up on his hands marking the wood grain. Raw documentary footage style, no music, no dialogue, natural ambience only.",
    quality: 'speed',
    duration: 5,
    fps: 30,
    size: '768x1344'
  });
  
  console.log('Task created:', JSON.stringify(task, null, 2));
  
  let pollCount = 0;
  const maxPolls = 120;
  
  while (pollCount < maxPolls) {
    pollCount++;
    console.log(`Poll ${pollCount}: waiting 15s...`);
    await new Promise(r => setTimeout(r, 15000));
    
    try {
      const result = await zai.async.result.query(task.id);
      console.log(`Poll ${pollCount}: status = ${result.task_status}`);
      
      if (result.task_status === 'SUCCESS') {
        const videoUrl = result.video_result?.[0]?.url || result.video_url || result.url || result.video;
        console.log('SUCCESS! Video URL:', videoUrl);
        break;
      } else if (result.task_status === 'FAIL') {
        console.log('FAILED:', JSON.stringify(result, null, 2));
        break;
      }
    } catch(e) {
      console.log(`Poll ${pollCount} error: ${e.message}`);
    }
  }
}

main().catch(e => console.error('Fatal:', e));
