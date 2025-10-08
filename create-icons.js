// Script لإنشاء أيقونات PNG من SVG
const fs = require('fs');
const path = require('path');

// نسخ ملف placeholder للأيقونات المطلوبة
const iconSizes = ['16x16', '32x32', '48x48', '64x64', '128x128', '256x256', '512x512'];
const assetsPath = './assets';
const iconsPath = path.join(assetsPath, 'icons');

// قراءة ملف SVG
const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="256" height="256" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#2E8B57;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#228B22;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="256" height="256" rx="20" fill="url(#grad1)"/>
  <circle cx="128" cy="100" r="30" fill="white"/>
  <rect x="110" y="140" width="36" height="50" fill="white"/>
  <polygon points="128,70 140,90 116,90" fill="#FFD700"/>
  <text x="128" y="220" text-anchor="middle" fill="white" font-size="16" font-family="Arial">نظام الاستثمار</text>
</svg>`;

iconSizes.forEach(size => {
    const sizePath = path.join(iconsPath, size);
    if (!fs.existsSync(sizePath)) {
        fs.mkdirSync(sizePath, { recursive: true });
    }
    
    // إنشاء ملف SVG مؤقت لكل حجم
    const iconPath = path.join(sizePath, 'icon.png');
    const svgPath = path.join(sizePath, 'temp.svg');
    
    fs.writeFileSync(svgPath, svgContent);
    console.log('تم إنشاء ملف SVG مؤقت في: ' + svgPath);
});

console.log('تم إنشاء ملفات SVG للأحجام المختلفة');
console.log('يرجى تحويلها إلى PNG باستخدام أداة تحويل أو برنامج تحرير الصور');