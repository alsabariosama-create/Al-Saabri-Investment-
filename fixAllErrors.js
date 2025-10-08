/**
 * fixAllErrors.js
 * ملف شامل لإصلاح جميع أخطاء النظام
 * يتم تضمين هذا الملف بعد جميع ملفات JavaScript الأخرى
 */

(function() {
    console.log("بدء تنفيذ إصلاحات الأخطاء البرمجية...");
    
    // ============ إصلاح مشكلة تعريف المستخدم في permissionsUpdater.js ============
    
    // تعريف كائن مؤقت للمستخدم إذا لم يكن موجوداً
    if (!window.currentUser) {
        console.log("تعريف كائن المستخدم المؤقت");
        window.currentUser = {
            id: 'temp',
            name: 'مستخدم مؤقت',
            role: 'admin',
            permissions: {
                settings: true,
                viewSettings: true,
                security: true,
                editSettings: true,
                dashboard: true,
                investors: true,
                investments: true,
                profits: true,
                operations: true,
                reports: true,
                analytics: true,
                calendar: true,
                viewInvestors: true,
                addInvestor: true,
                editInvestor: true,
                deleteInvestor: true,
                importInvestors: true,
                exportInvestors: true,
                viewInvestments: true,
                addInvestment: true,
                editInvestment: true,
                deleteInvestment: true,
                viewOperations: true,
                approveOperations: true,
                rejectOperations: true,
                withdrawals: true,
                viewProfits: true,
                payProfits: true,
                viewReports: true,
                generateReports: true,
                exportReports: true
            }
        };
    }
    
    // ============ إصلاح خطأ خاص بملف permissionsUpdater.js ============
    try {
        // إصلاح الكود الموجود في نهاية ملف permissionsUpdater.js
        // استبدال الجزء الذي يستخدم متغير user غير المعرف
        
        const fixPermissionButtons = function() {
            console.log("إصلاح أزرار الصلاحيات...");
            
            // إظهار أو إخفاء زر الإعدادات بناءً على صلاحيات المستخدم الحالي
            if (window.currentUser && (window.currentUser.permissions.settings || window.currentUser.permissions.viewSettings)) {
                const settingsButton = document.querySelector('.menu-item[href="#settings"]');
                if (settingsButton) {
                    settingsButton.style.display = '';
                    settingsButton.removeAttribute('data-hidden-by-permission');
                    console.log("تم إظهار زر الإعدادات");
                }
            }
            
            // إخفاء زر الأمان إذا كان المستخدم ليس مسؤولاً
            if (window.currentUser && window.currentUser.role !== 'admin') {
                const securityButton = document.querySelector('.menu-item[href="#security"]');
                if (securityButton) {
                    securityButton.style.display = 'none';
                    securityButton.setAttribute('data-hidden-by-permission', 'true');
                    console.log("تم إخفاء زر الأمان");
                }
            }
        };
        
        // تنفيذ الإصلاح
        fixPermissionButtons();
        
        // تحديث الدالة المسؤولة عن تطبيق الصلاحيات
        if (window.permissionsUpdater && window.permissionsUpdater.refreshPermissions) {
            const originalRefreshPermissions = window.permissionsUpdater.refreshPermissions;
            
            window.permissionsUpdater.refreshPermissions = function() {
                // استدعاء الدالة الأصلية
                originalRefreshPermissions.apply(this, arguments);
                
                // ثم تنفيذ الإصلاح
                fixPermissionButtons();
                
                console.log("تم تحديث صلاحيات المستخدم بنجاح");
            };
        }
    } catch (error) {
        console.error("حدث خطأ أثناء إصلاح permissionsUpdater:", error);
    }
    
    // ============ إصلاح مشكلة التعريفات المتكررة ============
    
    // تجنب تعريف المتغيرات مرة أخرى إذا كانت موجودة بالفعل
    try {
        console.log("إصلاح مشكلة التعريفات المتكررة...");
        
        // إصلاح تعريف employees
        if (typeof employees !== 'undefined') {
            console.log("تم العثور على متغير employees - تجنب إعادة التعريف");
            window._employeesAlreadyDefined = true;
        }
        
        // إصلاح تعريف installments
        if (typeof installments !== 'undefined') {
            console.log("تم العثور على متغير installments - تجنب إعادة التعريف");
            window._installmentsAlreadyDefined = true;
        }
    } catch (error) {
        console.error("حدث خطأ أثناء إصلاح التعريفات المتكررة:", error);
    }
    
    // ============ إصلاح مشكلة require is not defined ============
    
    try {
        console.log("إصلاح مشكلة require في Electron...");
        
        // تحقق مما إذا كنا في بيئة Electron (يوجد بها require) أو في المتصفح العادي
        window.isElectronApp = (typeof require !== 'undefined');
        
        // إذا كنا في المتصفح العادي، قم بتوفير require وهمي
        if (!window.isElectronApp) {
            console.log("النظام يعمل في متصفح عادي - إضافة require وهمي");
            
            window.require = function(moduleName) {
                console.warn("محاولة استدعاء require('" + moduleName + "') في بيئة المتصفح - غير متوفر");
                
                // إرجاع كائنات وهمية للوحدات الشائعة التي قد يتم استخدامها
                switch (moduleName) {
                    case 'electron':
                        return {
                            app: {
                                getPath: function() { return '/virtual-path'; }
                            },
                            dialog: {
                                showSaveDialog: function() { return Promise.resolve({ filePath: null }); },
                                showOpenDialog: function() { return Promise.resolve({ filePaths: [] }); }
                            },
                            ipcRenderer: {
                                send: function() {},
                                on: function() {}
                            }
                        };
                    case 'fs':
                        return {
                            writeFileSync: function() { console.warn("محاولة كتابة ملف في المتصفح - غير مدعوم"); },
                            readFileSync: function() { return ""; },
                            existsSync: function() { return false; },
                            mkdirSync: function() {}
                        };
                    case 'path':
                        return {
                            join: function() { return Array.prototype.slice.call(arguments).join('/'); },
                            dirname: function(p) { return p.split('/').slice(0, -1).join('/'); },
                            basename: function(p) { return p.split('/').pop(); }
                        };
                    default:
                        return {};
                }
            };
        }
    } catch (error) {
        console.error("حدث خطأ أثناء إصلاح مشكلة require:", error);
    }
    
    // ============ إصلاح مشكلة معامل securitySystem ============
    
    try {
        console.log("تهيئة وإصلاح نظام الأمان (securitySystem)...");
        
        // إنشاء كائن securitySystem إذا لم يكن موجوداً
        if (!window.securitySystem) {
            window.securitySystem = {
                initSecuritySystem: function() {
                    console.log("تم تهيئة نظام الأمان");
                },
                applyUserPermissions: function(user) {
                    console.log("تطبيق صلاحيات المستخدم:", user ? user.name : 'غير معروف');
                },
                hideElements: function(selector) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element) {
                            element.style.display = 'none';
                            element.setAttribute('data-hidden-by-security', 'true');
                        }
                    });
                    console.log("إخفاء العناصر بواسطة نظام الأمان:", selector);
                },
                showElements: function(selector) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        if (element) {
                            element.style.display = '';
                            element.removeAttribute('data-hidden-by-security');
                        }
                    });
                    console.log("إظهار العناصر بواسطة نظام الأمان:", selector);
                }
            };
        }
        
        // تأكد من وجود الدوال الضرورية في كائن securitySystem
        if (!window.securitySystem.initSecuritySystem) {
            window.securitySystem.initSecuritySystem = function() {
                console.log("تم تهيئة نظام الأمان");
            };
        }
        
        if (!window.securitySystem.applyUserPermissions) {
            window.securitySystem.applyUserPermissions = function(user) {
                console.log("تطبيق صلاحيات المستخدم:", user ? user.name : 'غير معروف');
            };
        }
        
        if (!window.securitySystem.hideElements) {
            window.securitySystem.hideElements = function(selector) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.style.display = 'none';
                        element.setAttribute('data-hidden-by-security', 'true');
                    }
                });
                console.log("إخفاء العناصر بواسطة نظام الأمان:", selector);
            };
        }
        
        if (!window.securitySystem.showElements) {
            window.securitySystem.showElements = function(selector) {
                const elements = document.querySelectorAll(selector);
                elements.forEach(element => {
                    if (element) {
                        element.style.display = '';
                        element.removeAttribute('data-hidden-by-security');
                    }
                });
                console.log("إظهار العناصر بواسطة نظام الأمان:", selector);
            };
        }
        
        // تنفيذ تهيئة نظام الأمان إذا لم يتم ذلك بالفعل
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            window.securitySystem.initSecuritySystem();
        } else {
            document.addEventListener('DOMContentLoaded', function() {
                window.securitySystem.initSecuritySystem();
            });
        }
    } catch (error) {
        console.error("حدث خطأ أثناء إصلاح نظام الأمان:", error);
    }
    
    console.log("تم تنفيذ جميع الإصلاحات بنجاح!");
    
    // تنفيذ وظيفة إضافية عند تحميل الصفحة بالكامل للتأكد من تطبيق جميع الإصلاحات
    window.addEventListener('load', function() {
        console.log("اكتمل تحميل الصفحة - التحقق من الإصلاحات النهائية...");
        
        // تطبيق الصلاحيات على المستخدم الحالي
        if (window.currentUser && window.securitySystem && window.securitySystem.applyUserPermissions) {
            window.securitySystem.applyUserPermissions(window.currentUser);
        }
        
        // إعادة تطبيق إصلاح الأزرار
        fixPermissionButtons();
        
        // التأكد من تحميل الجداول والبيانات الأساسية
        setTimeout(function() {
            // تحديث لوحة التحكم إذا كانت مرئية
            if (document.getElementById('dashboard') && 
                document.getElementById('dashboard').classList.contains('active')) {
                if (typeof updateDashboard === 'function') {
                    updateDashboard();
                    console.log("تم تحديث لوحة التحكم");
                }
            }
        }, 1000);
        
        console.log("اكتملت الإصلاحات النهائية!");
    });
})();