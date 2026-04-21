import ZAI from 'z-ai-web-dev-sdk';
import fs from 'fs';
import path from 'path';

const CLIPS_DIR = '/home/z/my-project/download/w123-clips';
const STATE_FILE = path.join(CLIPS_DIR, 'state.json');

const CLIPS = [
  {
    num: 1,
    prompt: "A tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 1: The man arrives carrying a tape measure and pencil. Raw rough-cut wood planks are stacked on the ground. He surveys the pile, picks up a long plank, measures it carefully, marks cut lines with his pencil on several planks. He references a small sketch on paper nailed to a wooden post nearby. Close-up on his hands marking the wood grain. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 2,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 2: The man is hand-sawing the measured wood planks on a wooden sawhorse. Vigorous sawing motion, sawdust and wood shavings flying everywhere. The camera shows the planks being cut to exact measurements. Close-up of saw teeth cutting through wood grain. Wood shavings accumulate on the red clay ground. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 3,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 3: The man is hammering together a wooden chassis frame on the ground. Heavy wooden beams form the flat floor pan shape of a car. He uses a large hammer to drive nails into thick beams. The rectangular car floor shape is clearly visible forming on the red clay. He checks alignment by eye and adjusts beams. Sawdust in the air. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 4,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 4: The man attaches curved wheel arches and vertical crossbeams to the chassis. He nails arched wooden pieces over where the wheels will go, and adds vertical support beams around the perimeter. The skeleton frame of a car is clearly visible from the side. He steps back to inspect the structure. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 5,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 5: The man is nailing flat side body panels onto the skeleton frame. The distinctive boxy shape of a 1980s Mercedes-Benz W123 is clearly emerging. He positions long rectangular wooden panels along the sides, nailing them in place. The characteristically upright W123 silhouette with its angular roofline becomes recognizable. He hammers panels into place along the A B and C pillars. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 6,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 6: The man is carving and shaping the hood and front grille to accurate W123 proportions. He uses hand chisels and a plane to shape the long flat hood and the slightly recessed rectangular front grille area. The iconic Mercedes-Benz W123 front end proportions are clearly recognizable. Wood shavings curl away from the chisel. He runs his hand along the curved hood surface to check smoothness. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 7,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 7: The man builds the trunk lid and rear bumper section. He attaches a flat wooden panel for the trunk and shapes the rear bumper from a thick plank. He steps back and checks a pencil sketch on the wooden post showing the W123 rear profile. The sketch shows the characteristic W123 tail with vertical taillights and horizontal trunk line. He compares the wooden car to the sketch and makes adjustments. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 8,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 8: The man fits four large wooden wheels onto axle supports at each corner of the car. Each wheel is made from thick circular wooden discs joined together with dowels. He lifts each wheel carefully and slides them onto the axle supports. He spins each wheel to test they rotate freely. The wooden car now sits on four wooden wheels and is recognizably a life-sized Mercedes-Benz W123. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 9,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 9: The man sands the entire body of the wooden car smooth using a large wood plane and sanding block. A large cloud of fine wood dust rises into the morning air. The morning golden hour light catches the smooth wood grain beautifully as he works. He runs his palm along the sanded surfaces checking for roughness. The W123 shape looks sleek and refined now with smooth wooden surfaces. Dust settles on the red clay ground. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 10,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 10: The man carefully carves out window openings in the wooden body using a hand drill and chisel. He creates precise rectangular window frames with slightly rounded corners matching the W123 design. He also carves door handles from small wooden blocks and attaches them, and adds side mirror housings on each front door. The windows now frame the interior space. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 11,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 11: Interior view inside the wooden W123. The man installs a hand-carved wooden steering wheel with three spokes, a flat wooden dashboard with recessed gauge areas, and contoured wooden bench seats with carved seat divider. He positions each interior piece carefully. The camera shows the craftsmanship of the wooden steering wheel and dashboard details. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 12,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 12: The man adds final exterior details to the wooden W123. He carves and attaches the iconic Mercedes hood ornament (three-pointed star) from a small block of wood. He installs round wooden headlight housings in the front, and carefully creates vertical wooden grille slats in the front grille opening. He steps back to admire the grille assembly. Raw documentary footage, natural ambience only, no music no dialogue no text."
  },
  {
    num: 13,
    prompt: "Same tall African man mid-40s, dark brown skin, short natural hair, faded olive green work shirt, dark brown carpenter trousers, worn leather work boots. Same outdoor backyard workshop, red clay ground, wood planks, large mango tree shade, morning golden hour light. CLIP 13: Wide cinematic shot. The full-sized wooden 1980s Mercedes-Benz W123 is complete and beautiful. The man stands proudly beside his creation in the golden morning light. He slowly runs his hand along the smooth wooden side panel admiring his work. The camera slowly pulls back revealing the entire car under the mango tree. Every W123 detail is visible: the boxy silhouette, vertical grille slats, round headlights, three-pointed star hood ornament, wooden wheels. A remarkable life-sized wooden car. Raw documentary footage, natural ambience only, no music no dialogue no text."
  }
];

function loadState() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    }
  } catch(e) {}
  return { completed: [], failed: [], current: null };
}

function saveState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

function log(msg) {
  const ts = new Date().toISOString();
  console.log(`${ts} ${msg}`);
  fs.appendFileSync(path.join(CLIPS_DIR, 'batch.log'), `${ts} ${msg}\n`);
}

async function createWithRetry(zai, params, maxRetries = 15) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      log(`Task creation attempt ${i+1}/${maxRetries}`);
      const task = await zai.video.generations.create(params);
      return task;
    } catch(e) {
      log(`Task creation error: ${e.message}`);
      if (i < maxRetries - 1) {
        const wait = 120000; // 2 min between retries
        log(`Waiting ${wait/1000}s before retry...`);
        await new Promise(r => setTimeout(r, wait));
      }
    }
  }
  throw new Error('All task creation retries failed');
}

async function pollForResult(zai, taskId) {
  let pollCount = 0;
  const maxPolls = 180; // 45 minutes max
  
  while (pollCount < maxPolls) {
    pollCount++;
    await new Promise(r => setTimeout(r, 10000)); // 10s between polls
    
    try {
      const result = await zai.async.result.query(taskId);
      if (pollCount % 6 === 0) log(`Poll ${pollCount}: ${result.task_status}`);
      
      if (result.task_status === 'SUCCESS') {
        const url = result.video_result?.[0]?.url || result.video_url || result.url || result.video;
        return { success: true, url, result };
      } else if (result.task_status === 'FAIL') {
        return { success: false, error: 'Task failed', result };
      }
    } catch(e) {
      if (pollCount % 6 === 0) log(`Poll error: ${e.message}`);
    }
  }
  return { success: false, error: 'Polling timeout' };
}

async function main() {
  log('=== Starting batch video generation for 13 W123 clips ===');
  
  const zai = await ZAI.create();
  const state = loadState();
  
  for (const clip of CLIPS) {
    if (state.completed.includes(clip.num)) {
      log(`Clip ${clip.num}: already completed, skipping`);
      continue;
    }
    
    log(`=== Starting Clip ${clip.num}/13 ===`);
    state.current = clip.num;
    saveState(state);
    
    try {
      // Create task with retries
      const task = await createWithRetry(zai, {
        prompt: clip.prompt,
        quality: 'speed',
        duration: 5,
        fps: 30,
        size: '768x1344'
      });
      
      log(`Clip ${clip.num}: Task created - ID: ${task.id}`);
      
      // Poll for result
      const result = await pollForResult(zai, task.id);
      
      if (result.success) {
        log(`Clip ${clip.num}: SUCCESS! URL: ${result.url}`);
        
        // Save clip info
        const clipInfo = {
          num: clip.num,
          url: result.url,
          taskId: task.id,
          completedAt: new Date().toISOString()
        };
        fs.writeFileSync(
          path.join(CLIPS_DIR, `clip${clip.num}.json`),
          JSON.stringify(clipInfo, null, 2)
        );
        
        state.completed.push(clip.num);
        state.current = null;
        saveState(state);
        
        log(`Clip ${clip.num}: saved to clip${clip.num}.json`);
        
        // Wait between clips to avoid rate limiting
        if (clip.num < 13) {
          log('Waiting 60s before next clip...');
          await new Promise(r => setTimeout(r, 60000));
        }
      } else {
        log(`Clip ${clip.num}: FAILED - ${result.error}`);
        state.failed.push(clip.num);
        state.current = null;
        saveState(state);
        
        // Wait longer after failure
        log('Waiting 180s after failure...');
        await new Promise(r => setTimeout(r, 180000));
      }
    } catch(e) {
      log(`Clip ${clip.num}: FATAL ERROR - ${e.message}`);
      state.failed.push(clip.num);
      state.current = null;
      saveState(state);
      
      log('Waiting 180s after fatal error...');
      await new Promise(r => setTimeout(r, 180000));
    }
  }
  
  log('=== Batch generation complete ===');
  log(`Completed: ${state.completed.join(', ')}`);
  log(`Failed: ${state.failed.join(', ')}`);
}

main().catch(e => log(`Fatal: ${e.message}`));
