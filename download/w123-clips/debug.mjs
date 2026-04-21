import ZAI from 'z-ai-web-dev-sdk';
async function main() {
  const zai = await ZAI.create();
  console.log('Config:', JSON.stringify(zai.config, null, 2));
}
main().catch(e => console.error(e.message));
