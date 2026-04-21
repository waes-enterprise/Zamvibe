#!/bin/bash
cd /home/z/my-project/download/w123-clips

# Check if clip 1 already done
if [ -f "clip1.json" ]; then
  echo "$(date): Clip 1 already done"
  exit 0
fi

# Try to create a video task
echo "$(date): Attempting Clip 1..."
node -e "
import ZAI from 'z-ai-web-dev-sdk';
const zai = await ZAI.create();
const task = await zai.video.generations.create({
  prompt: 'A tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 1: The man arrives carrying a tape measure and pencil. Raw rough-cut wood planks are stacked on the ground. He surveys the pile, picks up a long plank, measures it carefully, marks cut lines with his pencil on several planks. He references a small sketch on paper nailed to a wooden post nearby. Close-up on his hands marking the wood grain. Raw documentary footage, natural ambience only, no music no dialogue no text.',
  quality: 'speed',
  duration: 5,
  fps: 30,
  size: '768x1344'
});
console.log('TASK_ID:' + task.id);
console.log('STATUS:' + task.task_status);
" 2>&1
