import fs from 'fs';
import zlib from 'zlib';

function createCRC32Table() {
  const table = new Uint32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
    }
    table[i] = c >>> 0;
  }
  return table;
}

const crcTable = createCRC32Table();

function crc32(buf: Buffer): number {
  let c = 0xFFFFFFFF;
  for (let i = 0; i < buf.length; i++) {
    c = crcTable[(c ^ buf[i]) & 0xFF] ^ (c >>> 8);
  }
  return (c ^ 0xFFFFFFFF) >>> 0;
}

function makeChunk(type: string, data: Buffer): Buffer {
  const typeBuf = Buffer.from(type, 'ascii');
  const lenBuf = Buffer.alloc(4);
  lenBuf.writeUInt32BE(data.length, 0);

  const crcBuf = Buffer.alloc(4);
  const crcInput = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(crcInput), 0);

  return Buffer.concat([lenBuf, typeBuf, data, crcBuf]);
}

export function generatePNG(width: number, height: number, isMaskable: boolean = false): Buffer {
  // Signature
  const signature = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // bit depth
  ihdrData[9] = 6; // RGBA
  ihdrData[10] = 0; // compression
  ihdrData[11] = 0; // filter
  ihdrData[12] = 0; // interlace
  const ihdrChunk = makeChunk('IHDR', ihdrData);

  // Raw pixel data with filter byte 0 at start of each scanline
  const rowBytes = 1 + width * 4;
  const rawData = Buffer.alloc(rowBytes * height);

  const cx = width / 2;
  const cy = height / 2;
  const radius = Math.min(width, height) * 0.45;
  const innerRadius = Math.min(width, height) * (isMaskable ? 0.32 : 0.38);

  for (let y = 0; y < height; y++) {
    const rowOffset = y * rowBytes;
    rawData[rowOffset] = 0; // None filter

    for (let x = 0; x < width; x++) {
      const pixelOffset = rowOffset + 1 + x * 4;
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Background gradient (Deep Indigo to Rich Violet)
      const grad = y / height;
      let r = Math.round(67 + grad * 30);  // 67 -> 97 (#4338ca -> #6366f1)
      let g = Math.round(56 + grad * 20);  // 56 -> 76
      let b = Math.round(202 - grad * 10); // 202 -> 192
      let a = 255;

      // Draw stylized House & Pin emblem in white / emerald in center
      // Triangle roof:
      const roofPeakY = cy - innerRadius * 0.7;
      const roofBottomY = cy - innerRadius * 0.1;
      const roofHalfWidth = innerRadius * 0.75;
      const relY = y - roofPeakY;
      const totalH = roofBottomY - roofPeakY;

      const isInsideRoof = y >= roofPeakY && y <= roofBottomY && Math.abs(x - cx) <= (relY / totalH) * roofHalfWidth;
      const isInsideBody = y >= roofBottomY && y <= cy + innerRadius * 0.7 && Math.abs(x - cx) <= roofHalfWidth * 0.85;

      // Doorway in emerald / cyan
      const isInsideDoor = y >= cy + innerRadius * 0.1 && y <= cy + innerRadius * 0.7 && Math.abs(x - cx) <= roofHalfWidth * 0.3;

      // Location pin circle indicator
      const pinY = cy - innerRadius * 0.2;
      const pinDist = Math.sqrt((x - cx) * (x - cx) + (y - pinY) * (y - pinY));
      const isPin = pinDist <= innerRadius * 0.25;
      const isPinInner = pinDist <= innerRadius * 0.12;

      if (isPin) {
        if (isPinInner) {
          r = 67; g = 56; b = 202; // Indigo center
        } else {
          r = 16; g = 185; b = 129; // Emerald #10b981
        }
      } else if (isInsideDoor) {
        r = 16; g = 185; b = 129; // Emerald #10b981
      } else if (isInsideRoof || isInsideBody) {
        r = 255; g = 255; b = 255; // Crisp White
      }

      rawData[pixelOffset] = r;
      rawData[pixelOffset + 1] = g;
      rawData[pixelOffset + 2] = b;
      rawData[pixelOffset + 3] = a;
    }
  }

  const deflated = zlib.deflateSync(rawData, { level: 9 });
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  return Buffer.concat([signature, ihdrChunk, idatChunk, iendChunk]);
}

// Generate the icons
const publicDir = './public';
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

fs.writeFileSync(`${publicDir}/pwa-192x192.png`, generatePNG(192, 192, false));
fs.writeFileSync(`${publicDir}/pwa-512x512.png`, generatePNG(512, 512, false));
fs.writeFileSync(`${publicDir}/pwa-maskable-512x512.png`, generatePNG(512, 512, true));
fs.writeFileSync(`${publicDir}/apple-touch-icon.png`, generatePNG(180, 180, false));

console.log('PNG Icons successfully generated in ./public');
