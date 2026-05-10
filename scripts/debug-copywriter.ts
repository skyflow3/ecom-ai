import { buildCopywriterPrompt } from '../src/agents/prompts/copywriter';

async function main() {
  const { systemPrompt, userPrompt } = await buildCopywriterPrompt({
    pageType: 'advertorial',
    product: { name: 'Nutrovia', description: 'Gut health supplement' },
  });

  const hasMultiPhase = systemPrompt.includes('hookBody');
  const hasSingleBody = systemPrompt.includes('"body":');
  console.log('Multi-phase format:', hasMultiPhase);
  console.log('Single body format:', hasSingleBody);

  const formatStart = systemPrompt.indexOf('OUTPUT FORMAT');
  if (formatStart !== -1) {
    console.log('\n--- OUTPUT FORMAT SECTION ---');
    console.log(systemPrompt.substring(formatStart, formatStart + 1200));
  }
}
main();
