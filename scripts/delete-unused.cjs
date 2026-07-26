const fs = require("fs");
const path = require("path");

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

FILES.forEach(function (file) {
  if (fs.existsSync(file)) {
    try {
      fs.unlinkSync(file);
      console.log("Deleted: " + file);
      removed++;
    } catch (e) {
      console.log("Failed: " + file + " - " + e.message);
    }
  } else {
    console.log("Not found: " + file);
  }
});

DIRS.forEach(function (dir) {
  if (fs.existsSync(dir)) {
    try {
      fs.rmSync(dir, { recursive: true, force: true });
      console.log("Deleted dir: " + dir);
      removed++;
    } catch (e) {
      console.log("Failed dir: " + dir + " - " + e.message);
    }
  } else {
    console.log("Not found dir: " + dir);
  }
});

console.log("\nTotal removed: " + removed);
