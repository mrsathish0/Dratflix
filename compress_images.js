const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const assetDir = path.join(__dirname, 'assets');
const imagesToOptimize = [
  { file: 'me.jpeg', width: 800, quality: 80 },
  { file: 'Lawyer.png', width: 1200, quality: 80 },
  { file: 'Construction.png', width: 1200, quality: 80 },
  { file: 'DarkLogo.png', width: 400, quality: 90 }
  { file: 'FrameWork.png', width: 400, quality: 90 }
];

async function optimizeImages() {
  let html = fs.readFileSync('index.html', 'utf8');

  for (const img of imagesToOptimize) {
    const inputPath = path.join(assetDir, img.file);
    const parsed = path.parse(img.file);
    const outputFileName = `${parsed.name}.webp`;
    const outputPath = path.join(assetDir, outputFileName);

    if (fs.existsSync(inputPath)) {
      try {
        const statsBefore = fs.statiSync(inputPath);
        
        await sharp(inputPath)
          .resize({ width: img.width, withoutEnlargement: true })
          .webp({ quality: img.quality })
          .toFile(outputPath);
          
        const statsAfter = fs.statSync(outputPath);
        console.log(`Optimized ${img.file}: ${(statsBefore.size/1024).toFixed(1)} KB -> ${(statsAfter.size/1024).toFixed(1)} KB`);

        // Update HTML to use the new WebP file
        // Note: we need to replace occurrences of the file name in HTML and the JSON payloads
        const regex = new RegExp(img.file.replace(/\./g, '\\.'), 'g');
        html = html.replace(regex, outputFileName);
        
      } catch (err) {
        console.error(`Error optimizing ${img.file}:`, err);
      }
    } else {
      console.log(`File not found: ${inputPath}`);
    }
  }

  fs.writeFileSync('index.html', html, 'utf8');
  console.log('HTML updated with .webp references.');
}

optimizeImages();
