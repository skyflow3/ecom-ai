import { blockTreeSchema } from '../src/design-system/blocks';
import * as fs from 'fs';

const tree = JSON.parse(fs.readFileSync('test-output/advertorial-2026-05-08T21-54-13-888Z-tree.json', 'utf-8'));
const result = blockTreeSchema.safeParse(tree);

console.log('Success:', result.success);
if (!result.success) {
  console.log('Issues:', result.error.issues.length);
  result.error.issues.forEach(i => {
    console.log(`  ${i.path.join('.')}: ${i.message}`);
  });
} else {
  console.log('All blocks valid!');
}
