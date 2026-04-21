import ZAI from 'z-ai-web-dev-sdk';

async function main() {
  const zai = await ZAI.create();
  console.log('Attempting video generation...');
  const task = await zai.video.generations.create({
    prompt: "A tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. He carries tape measure and pencil, surveys raw wood planks, picks up a long plank, measures it, marks cut lines. References a sketch on paper nailed to post. Close-up on hands marking wood grain. Documentary style, natural ambience only.",
    quality: 'speed',
    duration: 5,
    fps: 30,
    size: '768x1344'
  });
  console.log('Task ID:', task.id);
  console.log('Status:', task.task_status);
}

main().catch(e => console.error('Error:', e.message));
