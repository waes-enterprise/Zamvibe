import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const CLIPS_DIR = '/home/z/my-project/download/limo-clips';
const STATE_FILE = path.join(CLIPS_DIR, 'limo_state.json');

const CLIPS = [
  {
    num: 1,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. A tall African man, mid-40s, dark brown skin, short natural hair, wearing a faded olive green work shirt, dark brown carpenter trousers, and worn leather work boots. Outdoor backyard workshop in Zambia, red clay ground, scattered rough-cut wood planks, one large mango tree casting dappled shade, natural warm morning golden hour sunlight. The man holds a tape measure and pencil, measuring a long raw wood plank. A pencil sketch on paper is nailed to a wooden post showing a long limousine car shape. Close-up on hands marking wood grain. Raw documentary photography style, no text, no watermark.',
    vidPrompt: 'The man measures and marks wood planks at his outdoor workshop under a mango tree. He references a sketch of a limousine on a post. Sawdust floats in morning golden light. Close-up on his experienced hands. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 2,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man is hand-sawing a wood plank on a wooden sawhorse. Vigorous sawing motion, sawdust and wood shavings flying through the air. Close-up of saw teeth cutting through wood grain. Wood shavings accumulate on the red clay ground. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man vigorously hand-saws measured wood planks on a sawhorse. Sawdust and wood shavings fly everywhere through golden morning light. Close-up of saw teeth cutting through wood grain. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 3,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man is hammering together a very long wooden chassis frame on the ground. Heavy wooden beams form an extra-long flat floor pan shape of a stretch limousine. He uses a large hammer to drive nails. The extremely long rectangular floor shape is clearly visible. Sawdust in the air. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man hammers together an extra-long wooden chassis frame for a stretch limousine. Heavy beams form the long flat floor pan. He checks alignment and adjusts beams. Sawdust in morning air. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 4,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man attaches curved wheel arches and vertical crossbeams to the extra-long chassis. Arched wooden pieces over wheel positions, vertical support beams around perimeter. A long car skeleton frame visible from the side, noticeably longer than a normal car. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man attaches curved wheel arches and vertical crossbeams to the long chassis. The skeleton frame of a stretch limousine is visible from the side, noticeably longer than a normal car. He steps back to inspect. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 5,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man is nailing flat side body panels onto the skeleton frame. The distinctive extremely long shape of a wooden stretch limousine is emerging. Long rectangular panels along the extra-long sides, multiple window positions visible. The elongated limousine silhouette with angular roofline becoming recognizable. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man nails flat side body panels onto the skeleton frame. The extremely long shape of a wooden stretch limousine emerges. Multiple window positions visible along the elongated body. He hammers panels along A B C and extra D pillars. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 6,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man is carving and shaping the hood and front grille of the wooden limousine. He uses hand chisels and a plane to shape the front end. A classic luxury limousine front with a prominent rectangular grille and long hood. Wood shavings curl from the chisel. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man carves and shapes the hood and front grille of the wooden limousine. Hand chisels and plane shape the long flat hood and prominent rectangular front grille. Wood shavings curl from the chisel. He runs his hand along the curved hood surface. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 7,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man builds the long rear section of the limousine including an extended trunk and rear bumper. The stretched passenger cabin section with multiple windows is clearly visible. He checks a pencil sketch on the post showing the limousine rear profile. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man builds the extended trunk and rear bumper section of the wooden limousine. The stretched passenger cabin with multiple windows is visible. He checks a sketch on a post showing the limousine rear profile. He compares and makes adjustments. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 8,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man fits four large wooden wheels onto axle supports at each corner of the extra-long wooden limousine. Each wheel made from thick circular wooden discs joined with dowels. He lifts each wheel and slides onto axle supports. He spins wheels to test rotation. The long wooden limousine now sits on four wooden wheels. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man fits four large wooden wheels onto axle supports at each corner of the long wooden limousine. Each wheel made from thick circular wooden discs joined with dowels. He lifts each wheel carefully and tests rotation. The limousine now sits on four wooden wheels. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 9,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man sands the entire extra-long body of the wooden limousine smooth using a wood plane and sanding block. A dramatic cloud of fine wood dust rises into golden morning light. Morning light catches the smooth wood grain beautifully. The long limousine shape looks sleek and refined with smooth wooden surfaces. Dust settles on red clay. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man sands the entire extra-long body of the wooden limousine smooth. A dramatic cloud of fine wood dust rises into golden morning light. Light catches the smooth wood grain beautifully. The sleek limousine shape looks refined. Dust settles on red clay. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 10,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man carefully carves window openings in the wooden limousine body using hand drill and chisel. Precise rectangular window frames with multiple windows along the stretched passenger cabin. He also carves door handles from small wooden blocks and adds side mirror housings. The long row of windows frames the spacious interior. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man carves window openings in the wooden limousine body. Multiple precise rectangular windows along the stretched passenger cabin. He carves door handles and attaches side mirror housings. The long row of windows frames the spacious interior. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 11,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Interior view inside the wooden stretch limousine. The tall African man in olive green work shirt installs a hand-carved wooden steering wheel with three spokes, a long flat wooden dashboard with recessed gauge areas, and extremely long contoured wooden bench seats with multiple seat dividers. The interior is spacious and luxurious with rich wood craftsmanship. Camera shows the long cabin stretching back with multiple rows of seating. Morning light through window frames. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'Interior view inside the wooden stretch limousine. The man installs a hand-carved wooden steering wheel, a long flat dashboard with gauge areas, and extremely long wooden bench seats with multiple seat dividers. The spacious luxury interior with rich wood craftsmanship visible. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 12,
    imgPrompt: 'Photorealistic documentary photograph, vertical 9:16. Same tall African man, mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. The man adds final exterior details to the wooden stretch limousine. He carves and attaches a hood ornament from a small wood block, installs round wooden headlight housings, and carefully creates vertical wooden grille slats in the prominent front grille opening. Close-up on his hands fitting the grille slats. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'The man adds final exterior details to the wooden stretch limousine. He carves and attaches a wooden hood ornament, installs round headlight housings, and carefully creates vertical wooden grille slats in the front grille. Close-up on his hands fitting the slats. Documentary style, natural ambience only, no music no dialogue no text.'
  },
  {
    num: 13,
    imgPrompt: 'Wide cinematic documentary photograph, vertical 9:16. A full-sized wooden stretch limousine built entirely from wood is complete and stunningly beautiful in an outdoor backyard workshop. The extremely long limousine with multiple windows along its stretched passenger cabin, wooden wheels, carved front grille with vertical slats, round headlight housings, and a wooden hood ornament. A tall African man in olive green work shirt stands proudly beside his creation. Red clay ground, large mango tree casting shade, breathtaking warm morning golden hour light illuminating the polished wood grain. A remarkable engineering and artistic achievement. Raw documentary photography, no text, no watermark.',
    vidPrompt: 'Wide cinematic shot. The full-sized wooden stretch limousine is complete. Extremely long body with multiple windows. The man stands proudly beside his creation in golden morning light. He runs his hand along the smooth wooden side panel. Camera slowly pulls back revealing the entire long limousine under the mango tree. Every detail visible. Documentary raw footage, natural ambience only, no music no dialogue no text.'
  }
];

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`${ts} ${msg}`);
}

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
  } catch(e) {}
  return { completed: [], failed: [], current: null };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function generateImage(zai, prompt, outputPath) {
  const result = await zai.images.generations.create({
    prompt,
    size: '768x1344',
    n: 1
  });
  
  if (result.data?.[0]?.url) {
    // Download from URL
    execSync(`curl -sL -o "${outputPath}" "${result.data[0].url}"`, { timeout: 60000 });
  } else if (result.data?.[0]?.b64_json) {
    fs.writeFileSync(outputPath, Buffer.from(result.data[0].b64_json, 'base64'));
  } else {
    throw new Error('No image data returned');
  }
  return outputPath;
}

async function generateVideoFromImage(zai, imagePath, prompt) {
  const imageBuffer = fs.readFileSync(imagePath);
  const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
  
  const task = await zai.video.generations.create({
    image_url: base64Image,
    prompt,
    quality: 'speed',
    duration: 5,
    fps: 30,
    size: '768x1344'
  });
  
  return task;
}

async function pollForResult(zai, taskId) {
  let pollCount = 0;
  while (pollCount < 120) {
    pollCount++;
    await new Promise(r => setTimeout(r, 10000));
    try {
      const result = await zai.async.result.query(taskId);
      if (pollCount % 3 === 0) log(`Poll ${pollCount}: ${result.task_status}`);
      if (result.task_status === 'SUCCESS') {
        const url = result.video_result?.[0]?.url || result.video_url || result.url || result.video;
        return { success: true, url };
      } else if (result.task_status === 'FAIL') {
        return { success: false, error: 'Task failed' };
      }
    } catch(e) {}
  }
  return { success: false, error: 'Polling timeout' };
}

async function main() {
  log('=== Starting Limo Image→Video Pipeline ===');
  
  const zai = await ZAI.create();
  const state = loadState();
  
  for (const clip of CLIPS) {
    if (state.completed.includes(clip.num)) {
      log(`Clip ${clip.num}: already completed, skipping`);
      continue;
    }
    
    log(`=== Clip ${clip.num}/13 ===`);
    state.current = clip.num;
    saveState(state);
    
    try {
      // Step 1: Generate HQ image
      log(`Clip ${clip.num}: Generating reference image...`);
      const imgPath = path.join(CLIPS_DIR, `img${clip.num}.png`);
      await generateImage(zai, clip.imgPrompt, imgPath);
      log(`Clip ${clip.num}: Image saved to ${imgPath}`);
      
      // Small delay between API calls
      await new Promise(r => setTimeout(r, 5000));
      
      // Step 2: Generate video from image
      log(`Clip ${clip.num}: Generating video from image...`);
      const task = await generateVideoFromImage(zai, imgPath, clip.vidPrompt);
      log(`Clip ${clip.num}: Video task created - ${task.id}`);
      
      // Step 3: Poll for result
      const result = await pollForResult(zai, task.id);
      
      if (result.success) {
        log(`Clip ${clip.num}: Video ready - ${result.url}`);
        
        // Download video
        const vidPath = path.join(CLIPS_DIR, `clip${clip.num}.mp4`);
        execSync(`curl -sL -o "${vidPath}" "${result.url}"`, { timeout: 120000 });
        log(`Clip ${clip.num}: Video downloaded to ${vidPath}`);
        
        // Save metadata
        fs.writeFileSync(
          path.join(CLIPS_DIR, `clip${clip.num}_meta.json`),
          JSON.stringify({ num: clip.num, taskId: task.id, videoUrl: result.url, completedAt: new Date().toISOString() }, null, 2)
        );
        
        state.completed.push(clip.num);
        state.current = null;
        saveState(state);
        
        log(`Clip ${clip.num}: COMPLETE`);
        
        // Wait between clips
        if (clip.num < 13) {
          log('Waiting 30s before next clip...');
          await new Promise(r => setTimeout(r, 30000));
        }
      } else {
        log(`Clip ${clip.num}: Video generation failed - ${result.error}`);
        state.failed.push(clip.num);
        state.current = null;
        saveState(state);
        await new Promise(r => setTimeout(r, 60000));
      }
    } catch(e) {
      log(`Clip ${clip.num}: ERROR - ${e.message}`);
      state.failed.push(clip.num);
      state.current = null;
      saveState(state);
      await new Promise(r => setTimeout(r, 60000));
    }
  }
  
  log('=== Pipeline Complete ===');
  log(`Completed: ${state.completed.join(', ')}`);
  log(`Failed: ${state.failed.join(', ')}`);
}

main().catch(e => log(`FATAL: ${e.message}`));
