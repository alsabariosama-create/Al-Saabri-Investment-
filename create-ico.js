// إنشاء ملف ICO بحجم 256x256
const fs = require('fs');
const path = require('path');

// إنشاء ملف ICO بسيط
function createSimpleICO() {
    // هذا مثال على بيانات ICO بسيطة بحجم 256x256
    // في الواقع، سنقوم بنسخ الأيقونة الموجودة وتوسيعها
    
    const originalIcoPath = './assets/IraqiInvestmentIcon.ico';
    const newIcoPath = './assets/IraqiInvestmentIcon-256.ico';
    
    // إنشاء header ICO جديد بحجم 256x256
    const icoHeader = Buffer.alloc(6);
    icoHeader.writeUInt16LE(0, 0); // Reserved
    icoHeader.writeUInt16LE(1, 2); // Type (1 = ICO)
    icoHeader.writeUInt16LE(1, 4); // Number of images
    
    // إنشاء directory entry للصورة 256x256
    const directoryEntry = Buffer.alloc(16);
    directoryEntry.writeUInt8(0, 0); // Width (0 = 256)
    directoryEntry.writeUInt8(0, 1); // Height (0 = 256)
    directoryEntry.writeUInt8(0, 2); // Color palette
    directoryEntry.writeUInt8(0, 3); // Reserved
    directoryEntry.writeUInt16LE(1, 4); // Color planes
    directoryEntry.writeUInt16LE(32, 6); // Bits per pixel
    
    // إنشاء بيانات الصورة (مبسطة)
    const imageDataSize = 256 * 256 * 4; // 32-bit RGBA
    const imageData = Buffer.alloc(imageDataSize);
    
    // ملء الصورة بلون أزرق بسيط مع نص
    for (let y = 0; y < 256; y++) {
        for (let x = 0; x < 256; x++) {
            const offset = (y * 256 + x) * 4;
            imageData[offset] = 37;     // Blue
            imageData[offset + 1] = 99; // Green
            imageData[offset + 2] = 235; // Red
            imageData[offset + 3] = 255; // Alpha
        }
    }
    
    directoryEntry.writeUInt32LE(imageDataSize, 8); // Size of image data
    directoryEntry.writeUInt32LE(22, 12); // Offset to image data
    
    // دمج البيانات
    const icoData = Buffer.concat([icoHeader, directoryEntry, imageData]);
    
    fs.writeFileSync(newIcoPath, icoData);
    console.log('تم إنشاء ملف ICO جديد بحجم 256x256: ' + newIcoPath);
    
    return newIcoPath;
}

// تشغيل الدالة
try {
    createSimpleICO();
} catch (error) {
    console.error('خطأ في إنشاء ملف ICO:', error.message);
    console.log('سنستخدم طريقة أخرى...');
    
    // طريقة بديلة: نسخ أيقونة موجودة وإعادة تسميتها
    const originalPath = './assets/IraqiInvestmentIcon.ico';
    const newPath = './assets/IraqiInvestmentIcon-256.ico';
    
    if (fs.existsSync(originalPath)) {
        fs.copyFileSync(originalPath, newPath);
        console.log('تم نسخ الأيقونة الأصلية إلى: ' + newPath);
    }
}