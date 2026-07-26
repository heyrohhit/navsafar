// scripts/remove-unused.mjs
// Run: node scripts/remove-unused.mjs
import { unlinkSync, rmSync, existsSync } from "fs";
import { join } from "path";

const FILES = [
  "src/app/admin/page.old.jsx",
  "src/app/components/seo/GlobalSEO.jsx",
  "src/app/components/seo/RouteSchema.jsx",
  "src/lib/seo.js",
  "src/proxy.js",
  "src/app/components/hero/OptimizedHeroImage.jsx",
  "src/app/components/features/detailsFeature.jsx",
];

const DIRS = [
  "src/data/.backup",
];

let removed = 0;
let failed = 0;

for (const file of FILES) {
  const p = join(process.cwd(), file);
  if (existsSync(p)) {
    try { unlinkSync(p); console.log(`✅ Removed: ${file}`); removed++; }
    catch (e) { console.error(`❌ Failed: ${file} — ${e.message}`); failed++; }
  } else {
    console.log(`⏭️  Not found (skip): ${file}`);
  }
}

for (const dir of DIRS) {
  const p = join(process.cwd(), dir);
  if (existsSync(p)) {
    try { rmSync(p, { recursive: true, force: true }); console.log(`✅ Removed dir: ${dir}`); removed++; }
    catch (e) { console.error(`❌ Failed dir: ${dir} — ${e.message}`); failed++; }
  } else {
    console.log(`⏭️  Not found (skip): ${dir}`);
  }
}

console.log(`\nDone. Removed: ${removed}, Failed: ${failed}`);
