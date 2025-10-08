const fs = require('fs');
const path = require('path');

// Function to convert PNG to ICO format (simplified)
function createIcoFromPng() {
    const pngPath = path.join(__dirname, 'assets', 'app-icon.png');
    const icoPath = path.join(__dirname, 'assets', 'app-icon-new.ico');
    
    try {
        // قراءة ملف PNG
        const pngBuffer = fs.readFileSync(pngPath);
        console.log(`تم قراءة ملف PNG: ${pngBuffer.length} بايت`);
        
        // إنشاء ICO header بسيط
        const icoHeader = Buffer.alloc(6);
        icoHeader.writeUInt16LE(0, 0);      // Reserved
        icoHeader.writeUInt16LE(1, 2);      // Type (1 = ICO)
        icoHeader.writeUInt16LE(1, 4);      // Number of images
        
        // إنشاء directory entry
        const dirEntry = Buffer.alloc(16);
        dirEntry.writeUInt8(0, 0);          // Width (0 = 256)
        dirEntry.writeUInt8(0, 1);          // Height (0 = 256)
        dirEntry.writeUInt8(0, 2);          // Colors (0 = no palette)
        dirEntry.writeUInt8(0, 3);          // Reserved
        dirEntry.writeUInt16LE(1, 4);       // Planes
        dirEntry.writeUInt16LE(32, 6);      // Bits per pixel
        dirEntry.writeUInt32LE(pngBuffer.length, 8);  // Size of image data
        dirEntry.writeUInt32LE(22, 12);     // Offset to image data
        
        // دمج كل شيء
        const icoBuffer = Buffer.concat([icoHeader, dirEntry, pngBuffer]);
        
        // كتابة ملف ICO
        fs.writeFileSync(icoPath, icoBuffer);
        console.log(`تم إنشاء ملف ICO بنجاح: ${icoPath}`);
        console.log(`حجم الملف: ${icoBuffer.length} بايت`);
        
        return true;
    } catch (error) {
        console.error('خطأ في تحويل الملف:', error.message);
        return false;
    }
}

// تشغيل التحويل
if (createIcoFromPng()) {
    console.log('تم التحويل بنجاح!');
} else {
    console.log('فشل التحويل');
}