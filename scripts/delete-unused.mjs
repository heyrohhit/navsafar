import { unlinkSync, rmSync, existsSync } from "fs";

const FILES = [
  "src/app/admin/page.old.jsx",
  "src/app/components/seo/GlobalSEO.jsx",
  "src/app/components/seo/RouteSchema.jsx",
  "src/lib/seo.js",
  "src/proxy.js",
  "src/app/components/hero/OptimizedHeroImage.jsx",
  "src/app/components/features/detailsFeature.jsx",
];

const DIRS = ["src/data/.backup"];

let removed = 0;

for (const file of FILES) {
  if (existsSync(file)) {
    try {
      unlinkSync(file);
      console.log(`Deleted: ${file}`);
      removed++;
    } catch (e) {
      console.log(`Failed: ${file} - ${e.message}`);
    }
  } else {
    console.log(`Not found: ${file}`);
  }
}

for (const dir of DIRS) {
  if (existsSync(dir)) {
    try {
      rmSync(dir, { recursive: true, force: true });
      console.log(`Deleted dir: ${dir}`);
      removed++;
    } catch (e) {
      console.log(`Failed dir: ${dir} - ${e.message}`);
    }
  } else {
    console.log(`Not found dir: ${dir}`);
  }
}

console.log(`\nTotal removed: ${removed}`);
