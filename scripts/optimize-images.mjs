// scripts/optimize-images.mjs
// Run: node scripts/optimize-images.mjs
// Converts JPG/PNG to WebP and creates responsive sizes

import { readFile, writeFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { extname, basename, join } from "path";

// List of hero images to optimize
const images = [
  "public/assets/bg.jpg",
  "public/assets/kd.jpg",
  "public/assets/mt.jpg",
  "public/assets/gl.jpg",
  "public/assets/Mt2.jpg",
  // Add more as needed
];

async function optimizeImage(imagePath) {
  try {
    // Check if sharp is available, else skip
    try {
      require("sharp");
    } catch (e) {
      console.log(`⚠️  Sharp not installed. Skipping ${imagePath}`);
      console.log(`   Install with: npm install sharp`);
      return;
    }

    const sharp = require("sharp");
    const imageName = basename(imagePath, extname(imagePath));
    const outputDir = "public/assets/optimized";

    // Ensure output directory exists
    if (!existsSync(outputDir)) {
      await mkdir(outputDir, { recursive: true });
    }

    console.log(`Optimizing ${imagePath}...`);

    // Create multiple sizes
    const sizes = [
      { width: 320, suffix: "320w" },
      { width: 640, suffix: "640w" },
      { width: 768, suffix: "768w" },
      { width: 1024, suffix: "1024w" },
      { width: 1280, suffix: "1280w" },
      { width: 1920, suffix: "1920w" },
    ];

    const promises = sizes.map(async ({ width, suffix }) => {
      const outputPath = join(
        outputDir,
        `${imageName}-${suffix}.webp`
      );

      await sharp(imagePath)
        .resize(width, null, { withoutEnlargement: true })
        .webp({ quality: 80, effort: 6 })
        .toFile(outputPath);
    });

    await Promise.all(promises);
    console.log(`✅ Created ${sizes.length} WebP variants of ${imageName}`);
  } catch (error) {
    console.error(`❌ Error optimizing ${imagePath}:`, error.message);
  }
}

async function main() {
  console.log("🚀 Starting image optimization...\n");

  for (const image of images) {
    await optimizeImage(image);
  }

  console.log("\n✅ Image optimization complete!");
  console.log("📁 WebP files saved in public/assets/optimized/");
  console.log("💡 Usage: /assets/optimized/image-320w.webp");
}

main().catch(console.error);
