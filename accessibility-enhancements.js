/**
 * Accessibility Enhancement Script
 * إضافة خصائص إمكانية الوصول للعناصر الموجودة
 */

document.addEventListener('DOMContentLoaded', function() {
    enhanceAccessibility();
});

function enhanceAccessibility() {
    // إضافة خصائص الوصولية لعناصر القائمة الجانبية
    enhanceMenuItems();
    
    // إضافة خصائص الوصولية للأزرار
    enhanceButtons();
    
    // إضافة خصائص الوصولية للحقول
    enhanceInputFields();
    
    // إضافة خصائص الوصولية للجداول
    enhanceTables();
    
    // إضافة خصائص الوصولية للنوافذ المنبثقة
    enhanceModals();
    
    // تحسين إعلانات الشاشة القارئة
    addScreenReaderAnnouncements();
}

function enhanceMenuItems() {
    const menuItems = document.querySelectorAll('.menu-item');
    
    menuItems.forEach((item, index) => {
        if (!item.hasAttribute('tabindex')) {
            item.setAttribute('tabindex', '0');
        }
        
        if (!item.hasAttribute('role')) {
            item.setAttribute('role', 'button');
        }
        
        // إضافة وصف للعنصر إذا لم يكن موجوداً
        if (!item.hasAttribute('aria-label')) {
            const text = item.querySelector('span:last-child')?.textContent?.trim();
            if (text) {
                item.setAttribute('aria-label', `الانتقال إلى صفحة ${text}`);
            }
        }
        
        // إضافة مفاتيح الاختصار
        const shortcutKey = index + 1;
        if (shortcutKey <= 9) {
            item.setAttribute('data-shortcut', `Alt+${shortcutKey}`);
            item.title = `${item.getAttribute('aria-label')} (Alt+${shortcutKey})`;
        }
        
        // إضافة معالج لوحة المفاتيح
        item.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
}

function enhanceButtons() {
    const buttons = document.querySelectorAll('button:not([aria-label]):not([aria-labelledby])');
    
    buttons.forEach(button => {
        // إضافة وصف للزر إذا لم يكن موجوداً
        const text = button.textContent?.trim() || button.getAttribute('title');
        if (text && !button.hasAttribute('aria-label')) {
            button.setAttribute('aria-label', text);
        }
        
        // إضافة حالة للأزرار القابلة للتبديل
        if (button.classList.contains('toggle-btn') || button.hasAttribute('data-toggle')) {
            button.setAttribute('aria-pressed', 'false');
        }
        
        // تحسين أزرار الإغلاق
        if (button.classList.contains('close-btn') || button.classList.contains('modal-close')) {
            button.setAttribute('aria-label', 'إغلاق');
            button.setAttribute('title', 'إغلاق (Escape)');
        }
    });
}

function enhanceInputFields() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // ربط التسميات بالحقول
        const label = document.querySelector(`label[for="${input.id}"]`) || 
                     input.closest('.form-group')?.querySelector('label');
        
        if (label && !input.hasAttribute('aria-labelledby')) {
            if (!label.id) {
                label.id = `label-${input.id || generateRandomId()}`;
            }
            input.setAttribute('aria-labelledby', label.id);
        }
        
        // إضافة وصف للحقول المطلوبة
        if (input.hasAttribute('required') && !input.hasAttribute('aria-required')) {
            input.setAttribute('aria-required', 'true');
        }
        
        // إضافة وصف للحقول غير الصالحة
        if (input.classList.contains('invalid') || input.hasAttribute('aria-invalid')) {
            input.setAttribute('aria-invalid', 'true');
        }
        
        // إضافة معلومات إضافية للحقول
        const helpText = input.closest('.form-group')?.querySelector('.help-text, .form-help');
        if (helpText && !input.hasAttribute('aria-describedby')) {
            if (!helpText.id) {
                helpText.id = `help-${input.id || generateRandomId()}`;
            }
            input.setAttribute('aria-describedby', helpText.id);
        }
    });
}

function enhanceTables() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        // إضافة وصف للجدول
        if (!table.hasAttribute('aria-label') && !table.hasAttribute('aria-labelledby')) {
            const caption = table.querySelector('caption')?.textContent ||
                           table.closest('.table-container')?.querySelector('h1, h2, h3, h4, h5, h6')?.textContent;
            
            if (caption) {
                table.setAttribute('aria-label', caption);
            } else {
                table.setAttribute('aria-label', 'جدول البيانات');
            }
        }
        
        // تحسين رؤوس الجدول
        const headers = table.querySelectorAll('th');
        headers.forEach((header, index) => {
            if (!header.id) {
                header.id = `header-${index}-${generateRandomId()}`;
            }
            if (!header.hasAttribute('scope')) {
                header.setAttribute('scope', 'col');
            }
        });
        
        // ربط الخلايا بالرؤوس
        const rows = table.querySelectorAll('tbody tr');
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            cells.forEach((cell, cellIndex) => {
                const correspondingHeader = headers[cellIndex];
                if (correspondingHeader && !cell.hasAttribute('headers')) {
                    cell.setAttribute('headers', correspondingHeader.id);
                }
            });
        });
    });
}

function enhanceModals() {
    const modals = document.querySelectorAll('.modal, .dialog');
    
    modals.forEach(modal => {
        // إضافة خصائص الحوار
        if (!modal.hasAttribute('role')) {
            modal.setAttribute('role', 'dialog');
        }
        
        if (!modal.hasAttribute('aria-modal')) {
            modal.setAttribute('aria-modal', 'true');
        }
        
        // ربط العنوان بالحوار
        const title = modal.querySelector('.modal-title, .dialog-title, h1, h2, h3');
        if (title && !modal.hasAttribute('aria-labelledby')) {
            if (!title.id) {
                title.id = `modal-title-${generateRandomId()}`;
            }
            modal.setAttribute('aria-labelledby', title.id);
        }
        
        // إضافة وصف للحوار
        const description = modal.querySelector('.modal-description, .dialog-description');
        if (description && !modal.hasAttribute('aria-describedby')) {
            if (!description.id) {
                description.id = `modal-desc-${generateRandomId()}`;
            }
            modal.setAttribute('aria-describedby', description.id);
        }
        
        // إضافة معالج الهروب
        modal.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const closeBtn = modal.querySelector('.close-btn, .modal-close, [data-dismiss="modal"]');
                if (closeBtn) {
                    closeBtn.click();
                }
            }
        });
    });
}

function addScreenReaderAnnouncements() {
    // إنشاء منطقة للإعلانات
    const liveRegion = document.createElement('div');
    liveRegion.id = 'screen-reader-announcements';
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.setAttribute('aria-atomic', 'true');
    liveRegion.className = 'sr-only';
    document.body.appendChild(liveRegion);
    
    // مراقبة تغييرات الصفحة
    const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                const target = mutation.target;
                if (target.classList.contains('page') && target.classList.contains('active')) {
                    const pageName = target.querySelector('.page-title')?.textContent || 
                                   target.id || 'صفحة جديدة';
                    announceToScreenReader(`تم الانتقال إلى ${pageName}`);
                }
            }
        });
    });
    
    // مراقبة التغييرات في الصفحات
    document.querySelectorAll('.page').forEach(page => {
        observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    });
}

function announceToScreenReader(message) {
    const liveRegion = document.getElementById('screen-reader-announcements');
    if (liveRegion) {
        liveRegion.textContent = message;
        // مسح الرسالة بعد ثانيتين
        setTimeout(() => {
            liveRegion.textContent = '';
        }, 2000);
    }
}

function generateRandomId() {
    return 'id-' + Math.random().toString(36).substr(2, 9);
}

// إضافة معالجات للتنقل بلوحة المفاتيح في الجداول
function addTableKeyboardNavigation() {
    const tables = document.querySelectorAll('table');
    
    tables.forEach(table => {
        const cells = table.querySelectorAll('td, th');
        
        cells.forEach((cell, index) => {
            cell.addEventListener('keydown', function(e) {
                const row = cell.parentElement;
                const rows = Array.from(table.querySelectorAll('tr'));
                const cellsInRow = Array.from(row.querySelectorAll('td, th'));
                
                const currentRowIndex = rows.indexOf(row);
                const currentCellIndex = cellsInRow.indexOf(cell);
                
                let targetCell = null;
                
                switch(e.key) {
                    case 'ArrowRight':
                        if (currentCellIndex < cellsInRow.length - 1) {
                            targetCell = cellsInRow[currentCellIndex + 1];
                        }
                        break;
                        
                    case 'ArrowLeft':
                        if (currentCellIndex > 0) {
                            targetCell = cellsInRow[currentCellIndex - 1];
                        }
                        break;
                        
                    case 'ArrowDown':
                        if (currentRowIndex < rows.length - 1) {
                            const nextRow = rows[currentRowIndex + 1];
                            const nextRowCells = nextRow.querySelectorAll('td, th');
                            if (nextRowCells[currentCellIndex]) {
                                targetCell = nextRowCells[currentCellIndex];
                            }
                        }
                        break;
                        
                    case 'ArrowUp':
                        if (currentRowIndex > 0) {
                            const prevRow = rows[currentRowIndex - 1];
                            const prevRowCells = prevRow.querySelectorAll('td, th');
                            if (prevRowCells[currentCellIndex]) {
                                targetCell = prevRowCells[currentCellIndex];
                            }
                        }
                        break;
                        
                    case 'Home':
                        targetCell = cellsInRow[0];
                        break;
                        
                    case 'End':
                        targetCell = cellsInRow[cellsInRow.length - 1];
                        break;
                }
                
                if (targetCell) {
                    e.preventDefault();
                    targetCell.focus();
                }
            });
            
            // جعل الخلايا قابلة للتركيز
            if (!cell.hasAttribute('tabindex')) {
                cell.setAttribute('tabindex', index === 0 ? '0' : '-1');
            }
        });
    });
}

// تشغيل تحسينات الجداول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', addTableKeyboardNavigation);

// إضافة معالج لتحديث التركيز في الجداول
function updateTableFocus(table) {
    const cells = table.querySelectorAll('td, th');
    cells.forEach((cell, index) => {
        cell.setAttribute('tabindex', index === 0 ? '0' : '-1');
    });
}

// تصدير الوظائف للاستخدام الخارجي
window.accessibilityEnhancer = {
    enhanceAccessibility,
    announceToScreenReader,
    updateTableFocus,
    addTableKeyboardNavigation
};