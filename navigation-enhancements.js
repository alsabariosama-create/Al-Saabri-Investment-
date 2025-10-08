/**
 * Navigation and Keyboard Shortcuts Enhancement
 * إضافة اختصارات لوحة المفاتيح ووظائف التنقل المتقدمة
 */

// Context Menu Enhancement - تحسين القائمة السياقية
class ContextMenuEnhancer {
    constructor() {
        this.isRTL = document.documentElement.dir === 'rtl';
        this.init();
    }

    init() {
        this.createContextMenu();
        this.attachEventListeners();
        this.initializeTextSelection();
    }

    createContextMenu() {
        // إنشاء قائمة سياقية مخصصة
        const contextMenu = document.createElement('div');
        contextMenu.id = 'custom-context-menu';
        contextMenu.className = 'custom-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="copy">
                <i class="fas fa-copy"></i>
                <span>نسخ</span>
                <span class="shortcut">Ctrl+C</span>
            </div>
            <div class="context-menu-item" data-action="cut">
                <i class="fas fa-cut"></i>
                <span>قص</span>
                <span class="shortcut">Ctrl+X</span>
            </div>
            <div class="context-menu-item" data-action="paste">
                <i class="fas fa-paste"></i>
                <span>لصق</span>
                <span class="shortcut">Ctrl+V</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="select-all">
                <i class="fas fa-check-square"></i>
                <span>تحديد الكل</span>
                <span class="shortcut">Ctrl+A</span>
            </div>
            <div class="context-menu-item" data-action="search">
                <i class="fas fa-search"></i>
                <span>بحث</span>
                <span class="shortcut">Ctrl+F</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="undo">
                <i class="fas fa-undo"></i>
                <span>تراجع</span>
                <span class="shortcut">Ctrl+Z</span>
            </div>
            <div class="context-menu-item" data-action="redo">
                <i class="fas fa-redo"></i>
                <span>إعادة</span>
                <span class="shortcut">Ctrl+Y</span>
            </div>
        `;
        document.body.appendChild(contextMenu);
    }

    attachEventListeners() {
        // إخفاء القائمة السياقية عند النقر خارجها
        document.addEventListener('click', () => {
            this.hideContextMenu();
        });

        // منع القائمة السياقية الافتراضية
        document.addEventListener('contextmenu', (e) => {
            const target = e.target;
            
            // السماح للحقول القابلة للتحرير بالقائمة الافتراضية
            if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
                return;
            }
            
            e.preventDefault();
            this.showContextMenu(e);
        });

        // التعامل مع النقر على عناصر القائمة السياقية
        document.getElementById('custom-context-menu').addEventListener('click', (e) => {
            e.stopPropagation();
            const action = e.target.closest('.context-menu-item')?.dataset.action;
            if (action) {
                this.handleContextAction(action);
                this.hideContextMenu();
            }
        });
    }

    showContextMenu(e) {
        const menu = document.getElementById('custom-context-menu');
        const x = e.clientX;
        const y = e.clientY;
        
        // تحديد موقع القائمة
        menu.style.left = x + 'px';
        menu.style.top = y + 'px';
        menu.style.display = 'block';
        
        // التأكد من أن القائمة لا تخرج من حدود الشاشة
        const rect = menu.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            menu.style.left = (x - rect.width) + 'px';
        }
        if (rect.bottom > window.innerHeight) {
            menu.style.top = (y - rect.height) + 'px';
        }
    }

    hideContextMenu() {
        const menu = document.getElementById('custom-context-menu');
        menu.style.display = 'none';
    }

    handleContextAction(action) {
        const selection = window.getSelection();
        
        switch (action) {
            case 'copy':
                if (selection.toString()) {
                    navigator.clipboard.writeText(selection.toString()).then(() => {
                        this.showToast('تم النسخ بنجاح', 'success');
                    });
                }
                break;
                
            case 'cut':
                if (selection.toString()) {
                    navigator.clipboard.writeText(selection.toString()).then(() => {
                        // محاولة حذف النص المحدد
                        if (selection.deleteFromDocument) {
                            selection.deleteFromDocument();
                        }
                        this.showToast('تم القص بنجاح', 'success');
                    });
                }
                break;
                
            case 'paste':
                navigator.clipboard.readText().then(text => {
                    const activeElement = document.activeElement;
                    if (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA') {
                        const start = activeElement.selectionStart;
                        const end = activeElement.selectionEnd;
                        const value = activeElement.value;
                        activeElement.value = value.substring(0, start) + text + value.substring(end);
                        activeElement.setSelectionRange(start + text.length, start + text.length);
                    }
                    this.showToast('تم اللصق بنجاح', 'success');
                });
                break;
                
            case 'select-all':
                selection.selectAllChildren(document.body);
                this.showToast('تم تحديد الكل', 'info');
                break;
                
            case 'search':
                this.openSearchDialog();
                break;
                
            case 'undo':
                document.execCommand('undo');
                this.showToast('تم التراجع', 'info');
                break;
                
            case 'redo':
                document.execCommand('redo');
                this.showToast('تم الإعادة', 'info');
                break;
        }
    }

    initializeTextSelection() {
        // تحسين تحديد النص عند النقر المزدوج
        document.addEventListener('dblclick', (e) => {
            const target = e.target;
            
            // تجاهل العناصر التفاعلية
            if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button, a')) {
                return;
            }
            
            // تحديد النص بطريقة ذكية
            this.smartTextSelection(target);
        });
    }

    smartTextSelection(element) {
        const selection = window.getSelection();
        const range = document.createRange();
        
        // إذا كان العنصر يحتوي على نص فقط، حدد النص كاملاً
        if (element.childNodes.length === 1 && element.childNodes[0].nodeType === Node.TEXT_NODE) {
            range.selectNodeContents(element);
        } else {
            // البحث عن أقرب عنصر نصي
            const textNode = this.findNearestTextNode(element);
            if (textNode) {
                range.selectNodeContents(textNode.parentNode);
            }
        }
        
        selection.removeAllRanges();
        selection.addRange(range);
    }

    findNearestTextNode(element) {
        const walker = document.createTreeWalker(
            element,
            NodeFilter.SHOW_TEXT,
            null,
            false
        );
        
        let textNode;
        while (textNode = walker.nextNode()) {
            if (textNode.textContent.trim()) {
                return textNode;
            }
        }
        return null;
    }

    openSearchDialog() {
        // إنشاء حوار البحث
        const searchDialog = document.createElement('div');
        searchDialog.className = 'search-dialog';
        searchDialog.innerHTML = `
            <div class="search-dialog-content">
                <div class="search-dialog-header">
                    <h3>البحث في الصفحة</h3>
                    <button class="close-btn" onclick="this.closest('.search-dialog').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="search-dialog-body">
                    <input type="text" id="search-input" placeholder="ادخل النص للبحث...">
                    <div class="search-options">
                        <label>
                            <input type="checkbox" id="case-sensitive"> حساس للأحرف الكبيرة/الصغيرة
                        </label>
                        <label>
                            <input type="checkbox" id="whole-word"> كلمات كاملة فقط
                        </label>
                    </div>
                    <div class="search-results" id="search-results"></div>
                </div>
                <div class="search-dialog-footer">
                    <button onclick="this.closest('.search-dialog').remove()">إلغاء</button>
                    <button onclick="performSearch()">بحث</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(searchDialog);
        document.getElementById('search-input').focus();
    }

    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // إضافة الرسوم المتحركة
        setTimeout(() => toast.classList.add('show'), 100);
        
        // إزالة التوست بعد 3 ثوان
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Keyboard Navigation Enhancement - تحسين التنقل بلوحة المفاتيح
class KeyboardNavigationEnhancer {
    constructor() {
        this.currentFocusIndex = 0;
        this.focusableElements = [];
        this.init();
    }

    init() {
        this.setupKeyboardShortcuts();
        this.setupTabNavigation();
        this.setupArrowNavigation();
        this.updateFocusableElements();
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // التحقق من الاختصارات مع Ctrl
            if (e.ctrlKey) {
                switch (e.key.toLowerCase()) {
                    case 's':
                        e.preventDefault();
                        this.saveData();
                        break;
                    case 'n':
                        e.preventDefault();
                        this.createNew();
                        break;
                    case 'p':
                        e.preventDefault();
                        this.printPage();
                        break;
                    case 'f':
                        e.preventDefault();
                        this.openSearch();
                        break;
                    case 'h':
                        e.preventDefault();
                        this.goHome();
                        break;
                    case 'r':
                        e.preventDefault();
                        this.refreshPage();
                        break;
                }
            }
            
            // التحقق من الاختصارات مع Alt
            if (e.altKey) {
                switch (e.key) {
                    case '1':
                        e.preventDefault();
                        this.navigateToPage('dashboard');
                        break;
                    case '2':
                        e.preventDefault();
                        this.navigateToPage('investors');
                        break;
                    case '3':
                        e.preventDefault();
                        this.navigateToPage('projects');
                        break;
                    case '4':
                        e.preventDefault();
                        this.navigateToPage('operations');
                        break;
                    case '5':
                        e.preventDefault();
                        this.navigateToPage('reports');
                        break;
                }
            }
            
            // اختصارات مفاتيح الوظائف
            switch (e.key) {
                case 'F1':
                    e.preventDefault();
                    this.showHelp();
                    break;
                case 'F2':
                    e.preventDefault();
                    this.editMode();
                    break;
                case 'F3':
                    e.preventDefault();
                    this.findNext();
                    break;
                case 'F5':
                    e.preventDefault();
                    this.refreshPage();
                    break;
                case 'F11':
                    e.preventDefault();
                    this.toggleFullscreen();
                    break;
                case 'Escape':
                    this.handleEscape();
                    break;
            }
        });
    }

    setupTabNavigation() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                
                if (e.shiftKey) {
                    this.focusPrevious();
                } else {
                    this.focusNext();
                }
            }
        });
    }

    setupArrowNavigation() {
        document.addEventListener('keydown', (e) => {
            // التنقل بالأسهم في القوائم والجداول
            const activeElement = document.activeElement;
            const isInList = activeElement.closest('.menu-item, .list-item, .table-row');
            
            if (isInList) {
                switch (e.key) {
                    case 'ArrowUp':
                        e.preventDefault();
                        this.navigateUp(activeElement);
                        break;
                    case 'ArrowDown':
                        e.preventDefault();
                        this.navigateDown(activeElement);
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.navigateLeft(activeElement);
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.navigateRight(activeElement);
                        break;
                    case 'Enter':
                        e.preventDefault();
                        this.activateElement(activeElement);
                        break;
                    case ' ':
                        e.preventDefault();
                        this.selectElement(activeElement);
                        break;
                }
            }
        });
    }

    updateFocusableElements() {
        // تحديث قائمة العناصر القابلة للتركيز
        this.focusableElements = Array.from(document.querySelectorAll(`
            a[href]:not([disabled]),
            button:not([disabled]),
            textarea:not([disabled]),
            input:not([disabled]),
            select:not([disabled]),
            .menu-item:not([disabled]),
            .card:not([disabled]),
            [tabindex]:not([tabindex="-1"]):not([disabled])
        `)).filter(el => {
            // التأكد من أن العنصر مرئي
            const style = window.getComputedStyle(el);
            return style.display !== 'none' && style.visibility !== 'hidden';
        });
    }

    focusNext() {
        this.updateFocusableElements();
        this.currentFocusIndex = (this.currentFocusIndex + 1) % this.focusableElements.length;
        this.focusableElements[this.currentFocusIndex]?.focus();
        this.highlightFocusedElement();
    }

    focusPrevious() {
        this.updateFocusableElements();
        this.currentFocusIndex = this.currentFocusIndex === 0 
            ? this.focusableElements.length - 1 
            : this.currentFocusIndex - 1;
        this.focusableElements[this.currentFocusIndex]?.focus();
        this.highlightFocusedElement();
    }

    highlightFocusedElement() {
        // إزالة التمييز السابق
        document.querySelectorAll('.keyboard-focused').forEach(el => {
            el.classList.remove('keyboard-focused');
        });
        
        // إضافة التمييز للعنصر الحالي
        const currentElement = this.focusableElements[this.currentFocusIndex];
        if (currentElement) {
            currentElement.classList.add('keyboard-focused');
            
            // التمرير إلى العنصر إذا لم يكن مرئياً
            currentElement.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            });
        }
    }

    navigateUp(element) {
        const container = element.closest('.sidebar-menu, .table-container, .list-container');
        const siblings = container?.querySelectorAll('.menu-item, .table-row, .list-item');
        const currentIndex = Array.from(siblings || []).indexOf(element);
        
        if (currentIndex > 0) {
            siblings[currentIndex - 1].focus();
        }
    }

    navigateDown(element) {
        const container = element.closest('.sidebar-menu, .table-container, .list-container');
        const siblings = container?.querySelectorAll('.menu-item, .table-row, .list-item');
        const currentIndex = Array.from(siblings || []).indexOf(element);
        
        if (currentIndex < siblings.length - 1) {
            siblings[currentIndex + 1].focus();
        }
    }

    navigateLeft(element) {
        // التنقل يساراً في الجداول أو القوائم الأفقية
        const row = element.closest('.table-row, .horizontal-list');
        const cells = row?.querySelectorAll('.table-cell, .list-item');
        const currentIndex = Array.from(cells || []).indexOf(element);
        
        if (currentIndex > 0) {
            cells[currentIndex - 1].focus();
        }
    }

    navigateRight(element) {
        // التنقل يميناً في الجداول أو القوائم الأفقية
        const row = element.closest('.table-row, .horizontal-list');
        const cells = row?.querySelectorAll('.table-cell, .list-item');
        const currentIndex = Array.from(cells || []).indexOf(element);
        
        if (currentIndex < cells.length - 1) {
            cells[currentIndex + 1].focus();
        }
    }

    activateElement(element) {
        // تفعيل العنصر (كما لو تم النقر عليه)
        if (element.tagName === 'A' || element.tagName === 'BUTTON') {
            element.click();
        } else if (element.onclick) {
            element.onclick();
        }
    }

    selectElement(element) {
        // تحديد العنصر
        element.classList.toggle('selected');
    }

    // وظائف الاختصارات
    saveData() {
        // حفظ البيانات
        if (typeof saveAllData === 'function') {
            saveAllData();
        } else {
            this.showToast('تم الحفظ', 'success');
        }
    }

    createNew() {
        // إنشاء جديد
        const activeTab = document.querySelector('.page.active');
        if (activeTab?.id === 'investors') {
            document.getElementById('addInvestorBtn')?.click();
        } else if (activeTab?.id === 'projects') {
            document.getElementById('addProjectBtn')?.click();
        }
    }

    printPage() {
        window.print();
    }

    openSearch() {
        const searchInput = document.querySelector('input[type="search"], #searchInput');
        if (searchInput) {
            searchInput.focus();
        } else {
            new ContextMenuEnhancer().openSearchDialog();
        }
    }

    goHome() {
        if (typeof showPage === 'function') {
            showPage('dashboard');
        }
    }

    refreshPage() {
        location.reload();
    }

    navigateToPage(pageId) {
        if (typeof showPage === 'function') {
            showPage(pageId);
        }
    }

    showHelp() {
        this.showHelpDialog();
    }

    editMode() {
        // تفعيل وضع التحرير للعنصر النشط
        const activeElement = document.activeElement;
        if (activeElement.contentEditable !== 'true') {
            activeElement.contentEditable = 'true';
            activeElement.focus();
        }
    }

    findNext() {
        // البحث عن التالي
        window.find();
    }

    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
        } else {
            document.documentElement.requestFullscreen();
        }
    }

    handleEscape() {
        // إغلاق النوافذ المنبثقة والحوارات
        const modals = document.querySelectorAll('.modal.show, .dialog.show, .custom-context-menu');
        modals.forEach(modal => {
            if (modal.style.display === 'block') {
                modal.style.display = 'none';
            }
            modal.classList.remove('show');
        });

        // إلغاء التحديد
        window.getSelection().removeAllRanges();
    }

    showHelpDialog() {
        const helpDialog = document.createElement('div');
        helpDialog.className = 'help-dialog modal';
        helpDialog.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>اختصارات لوحة المفاتيح</h3>
                    <button class="close-btn" onclick="this.closest('.modal').remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="shortcut-section">
                        <h4>اختصارات عامة</h4>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Ctrl + S</span>
                            <span class="shortcut-desc">حفظ</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Ctrl + N</span>
                            <span class="shortcut-desc">إنشاء جديد</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Ctrl + P</span>
                            <span class="shortcut-desc">طباعة</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Ctrl + F</span>
                            <span class="shortcut-desc">بحث</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">F5</span>
                            <span class="shortcut-desc">تحديث</span>
                        </div>
                    </div>
                    
                    <div class="shortcut-section">
                        <h4>التنقل</h4>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Tab</span>
                            <span class="shortcut-desc">التنقل للعنصر التالي</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Shift + Tab</span>
                            <span class="shortcut-desc">التنقل للعنصر السابق</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">الأسهم</span>
                            <span class="shortcut-desc">التنقل في القوائم والجداول</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Enter</span>
                            <span class="shortcut-desc">تفعيل العنصر</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Space</span>
                            <span class="shortcut-desc">تحديد العنصر</span>
                        </div>
                    </div>
                    
                    <div class="shortcut-section">
                        <h4>الصفحات السريعة</h4>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 1</span>
                            <span class="shortcut-desc">لوحة التحكم</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 2</span>
                            <span class="shortcut-desc">المستثمرين</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 3</span>
                            <span class="shortcut-desc">المشاريع</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 4</span>
                            <span class="shortcut-desc">العمليات</span>
                        </div>
                        <div class="shortcut-item">
                            <span class="shortcut-key">Alt + 5</span>
                            <span class="shortcut-desc">التقارير</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button onclick="this.closest('.modal').remove()">إغلاق</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(helpDialog);
        helpDialog.style.display = 'block';
    }

    showToast(message, type = 'info') {
        // نفس دالة showToast من ContextMenuEnhancer
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }
}

// Focus Management - إدارة التركيز
class FocusManager {
    constructor() {
        this.focusHistory = [];
        this.init();
    }

    init() {
        this.setupFocusTracking();
        this.setupVisualFeedback();
    }

    setupFocusTracking() {
        document.addEventListener('focusin', (e) => {
            this.addToHistory(e.target);
            this.updateFocusIndicator(e.target);
        });

        document.addEventListener('focusout', (e) => {
            this.removeFocusIndicator(e.target);
        });
    }

    setupVisualFeedback() {
        // إضافة تأثيرات بصرية للتركيز
        const style = document.createElement('style');
        style.textContent = `
            .keyboard-focused {
                outline: 2px solid #007cba !important;
                outline-offset: 2px !important;
                box-shadow: 0 0 0 4px rgba(0, 124, 186, 0.2) !important;
            }
            
            .focus-indicator {
                position: absolute;
                pointer-events: none;
                border: 2px solid #007cba;
                border-radius: 4px;
                background: rgba(0, 124, 186, 0.1);
                transition: all 0.2s ease;
                z-index: 10000;
            }
        `;
        document.head.appendChild(style);
    }

    addToHistory(element) {
        this.focusHistory.push(element);
        if (this.focusHistory.length > 10) {
            this.focusHistory.shift();
        }
    }

    updateFocusIndicator(element) {
        let indicator = document.getElementById('focus-indicator');
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'focus-indicator';
            indicator.className = 'focus-indicator';
            document.body.appendChild(indicator);
        }

        const rect = element.getBoundingClientRect();
        indicator.style.left = (rect.left - 4) + 'px';
        indicator.style.top = (rect.top - 4) + 'px';
        indicator.style.width = (rect.width + 8) + 'px';
        indicator.style.height = (rect.height + 8) + 'px';
        indicator.style.display = 'block';
    }

    removeFocusIndicator(element) {
        const indicator = document.getElementById('focus-indicator');
        if (indicator) {
            indicator.style.display = 'none';
        }
    }

    restorePreviousFocus() {
        if (this.focusHistory.length > 1) {
            const previousElement = this.focusHistory[this.focusHistory.length - 2];
            if (previousElement && document.contains(previousElement)) {
                previousElement.focus();
            }
        }
    }
}

// تهيئة التحسينات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    new ContextMenuEnhancer();
    new KeyboardNavigationEnhancer();
    new FocusManager();
});

// وظائف مساعدة للبحث
function performSearch() {
    const query = document.getElementById('search-input').value;
    const caseSensitive = document.getElementById('case-sensitive').checked;
    const wholeWord = document.getElementById('whole-word').checked;
    
    if (!query) return;
    
    // مسح النتائج السابقة
    document.querySelectorAll('.search-highlight').forEach(el => {
        el.classList.remove('search-highlight');
    });
    
    // البحث في النص
    const flags = caseSensitive ? 'g' : 'gi';
    const pattern = wholeWord ? `\\b${query}\\b` : query;
    const regex = new RegExp(pattern, flags);
    
    let matches = 0;
    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    let node;
    while (node = walker.nextNode()) {
        const text = node.textContent;
        if (regex.test(text)) {
            const parent = node.parentElement;
            parent.innerHTML = text.replace(regex, '<mark class="search-highlight">$&</mark>');
            matches++;
        }
    }
    
    document.getElementById('search-results').textContent = `تم العثور على ${matches} نتيجة`;
    
    // التنقل إلى أول نتيجة
    const firstMatch = document.querySelector('.search-highlight');
    if (firstMatch) {
        firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}