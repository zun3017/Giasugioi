// Báº¢O Máº¬T: CHá»NG XSS (dÃ¹ng chung cho má»i trang cÃ³ náº¡p api.js)
// ============================================================================
// escapeHtml: dÃ¹ng cho Má»ŒI dá»¯ liá»‡u ngÆ°á»i dÃ¹ng chÃ¨n vÃ o innerHTML / thuá»™c tÃ­nh HTML
function escapeHtml(v) {
    if (v === null || v === undefined) return '';
    return String(v).replace(/[&<>"'`]/g, function (c) {
        return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;', '`': '&#96;' }[c];
    });
}
// safeUrl: chá»‰ cho phÃ©p http(s), blob, data:image, hoáº·c Ä‘Æ°á»ng dáº«n tÆ°Æ¡ng Ä‘á»‘i. Cháº·n javascript:, vbscript:, data:text/html...
function safeUrl(u) {
    if (u === null || u === undefined) return '';
    var s = String(u).trim();
    if (!s) return '';
    var probe = s.replace(/[\u0000-\u0020\u007f-\u009f]/g, '').toLowerCase();
    if (/^(https?:|blob:)/.test(probe)) return s;
    if (/^data:(image\/(png|jpe?g|gif|webp|bmp)|application\/pdf);base64,/.test(probe)) return s;
    if (!/^[a-z][a-z0-9+.\-]*:/.test(probe)) return s; // tÆ°Æ¡ng Ä‘á»‘i
    return '#';
}
// safeUrlAttr: safeUrl + escape Ä‘á»ƒ Ä‘áº·t trong href="..." / src="..."
function safeUrlAttr(u) { return escapeHtml(safeUrl(u)); }
// jsStr: chÃ¨n giÃ¡ trá»‹ vÃ o chuá»—i JS náº±m trong thuá»™c tÃ­nh onclick="fn('...')" hoáº·c onclick='fn("...")'
function jsStr(v) {
    var s = (v === null || v === undefined) ? '' : String(v);
    s = s.replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '\\"')
         .replace(/\r/g, '\\r').replace(/\n/g, '\\n').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029')
         .replace(/</g, '\\x3C').replace(/>/g, '\\x3E');
    return escapeHtml(s);
}
window.escapeHtml = escapeHtml;
window.safeUrl = safeUrl;
window.safeUrlAttr = safeUrlAttr;
window.jsStr = jsStr;

/**
 * ============================================================================
 * CLIENT-SIDE MOCK API GATEWAY CHO Há»† THá»NG GIA SÆ¯ 1-1 (DEMO GIA SÆ¯ GIá»ŽI)
 * ============================================================================
 * - Hoáº¡t Ä‘á»™ng Ä‘á»™c láº­p 100%, khÃ´ng cáº§n káº¿t ná»‘i máº¡ng hay mÃ¡y chá»§ backend
 * - Tá»‘c Ä‘á»™ pháº£n há»“i tá»©c thÃ¬, giáº£ láº­p Ä‘áº§y Ä‘á»§ luá»“ng dá»¯ liá»‡u cá»§a Google Apps Script
 * - Äáº§y Ä‘á»§ phÃ¢n quyá»n: PH/HS (Tra cá»©u), BÃ€I Táº¬P (Ná»™p bÃ i), GIA SÆ¯ (Quáº£n lÃ½), ADMIN
 */

(function() {
    const STORAGE_KEY = 'DEMO_GIASU_DATA_V6';

    function getDemoStore() {
        let store = null;
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) store = JSON.parse(raw);
        } catch(e) {}

        const initial = (typeof INITIAL_GIASU_DEMO_DATA !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_GIASU_DEMO_DATA)) : {
            tutors: [
                { phone: "0123456789", pin: "1234", name: "Tháº§y Tráº§n HoÃ ng Nam", subject: "ToÃ¡n & Váº­t LÃ½" }
            ],
            students: [
                { phone: "0912345678", maBaiTap: "0912345678", name: "Nguyá»…n HoÃ ng Nam", classLevel: "Lá»›p 9", subject: "ToÃ¡n", gpa: "8.6", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] },
                { phone: "0987654321", maBaiTap: "0987654321", name: "LÃª Minh ThÆ°", classLevel: "Lá»›p 12", subject: "ToÃ¡n & Váº­t LÃ½", gpa: "8.9", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] },
                { phone: "0905123456", maBaiTap: "0905123456", name: "Pháº¡m Háº£i ÄÄƒng", classLevel: "Lá»›p 11", subject: "Váº­t LÃ½", gpa: "9.2", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] }
            ],
            homework: [],
            assignedHomework: [],
            schedules: []
        };

        if (!store) {
            store = initial;
            saveDemoStore(store);
        } else {
            let changed = false;
            if (!store.assignedHomework || !Array.isArray(store.assignedHomework) || store.assignedHomework.length === 0) {
                store.assignedHomework = (initial && initial.assignedHomework) ? JSON.parse(JSON.stringify(initial.assignedHomework)) : [];
                changed = true;
            }
            if (!store.submissions || !Array.isArray(store.submissions) || store.submissions.length < 5) {
                store.submissions = (initial && initial.submissions) ? JSON.parse(JSON.stringify(initial.submissions)) : [];
                changed = true;
            }
            if (changed) saveDemoStore(store);
        }
        if (store && purgeExpiredDemoSubmissions(store)) {
            saveDemoStore(store);
        }
        return store;
    }

    function saveDemoStore(store) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(store));
        } catch(e) {}
    }

    function normalizePhone(p) {
        if (!p) return "";
        return String(p).replace(/\D/g, '').replace(/^84/, '0').replace(/^0+/, '');
    }

    // Äá»ŠNH Dáº NG NGÃ€Y KÃˆM THá»¨ (VÃ Dá»¤: "Thá»© 7, 08/08")
    window.formatDateWithDayOfWeek = function(dStr) {
        if (!dStr || dStr === "-" || dStr === "null") return "-";
        let s = String(dStr).trim();
        if (/thá»©|chá»§ nháº­t|\bcn\b/i.test(s)) return s;
        let day = null, month = null, year = null;
        let mIso = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        if (mIso) {
            year = parseInt(mIso[1], 10);
            month = parseInt(mIso[2], 10);
            day = parseInt(mIso[3], 10);
        } else {
            let mDmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
            if (mDmy) {
                day = parseInt(mDmy[1], 10);
                month = parseInt(mDmy[2], 10);
                year = parseInt(mDmy[3], 10);
            } else {
                let mDm = s.match(/^(\d{1,2})[-/.](\d{1,2})/);
                if (mDm) {
                    day = parseInt(mDm[1], 10);
                    month = parseInt(mDm[2], 10);
                    year = new Date().getFullYear();
                }
            }
        }
        if (!day || !month || !year) return s;
        let dateObj = new Date(year, month - 1, day);
        if (isNaN(dateObj.getTime())) return s;
        let dayOfWeek = dateObj.getDay();
        let dayName = ['Chá»§ Nháº­t', 'Thá»© 2', 'Thá»© 3', 'Thá»© 4', 'Thá»© 5', 'Thá»© 6', 'Thá»© 7'][dayOfWeek];
        let dStrFormatted = String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0');
        return dayName + ', ' + dStrFormatted;
    };

    // Äá»ŠNH Dáº NG CHá»ˆ NGÃ€Y (VÃ Dá»¤: "22/09", Bá»Ž THá»¨)
    window.formatDateOnly = function(dStr) {
        if (!dStr || dStr === "-" || dStr === "null") return "-";
        let s = String(dStr).trim();
        s = s.replace(/^(thá»©\s*\d+|chá»§ nháº­t|cn)\s*[,.-]?\s*/i, '').trim();
        let day = null, month = null;
        let mIso = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        if (mIso) {
            month = parseInt(mIso[2], 10);
            day = parseInt(mIso[3], 10);
        } else {
            let mDmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
            if (mDmy) {
                day = parseInt(mDmy[1], 10);
                month = parseInt(mDmy[2], 10);
            } else {
                let mDm = s.match(/^(\d{1,2})[-/.](\d{1,2})/);
                if (mDm) {
                    day = parseInt(mDm[1], 10);
                    month = parseInt(mDm[2], 10);
                }
            }
        }
        if (day && month) {
            return String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0');
        }
        return s;
    };

    function isOlderThan10Days(dateVal) {
        if (!dateVal) return false;
        let ts = 0;
        if (typeof dateVal === 'number') {
            ts = dateVal;
        } else {
            let str = String(dateVal).trim();
            let parts = str.split(/\s+/);
            let datePart = parts.find(p => p.includes('/') || p.includes('-')) || parts[0];
            if (datePart && datePart.includes('/')) {
                let dp = datePart.split('/');
                if (dp.length === 3) {
                    if (dp[0].length === 4) ts = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10)).getTime();
                    else ts = new Date(parseInt(dp[2], 10), parseInt(dp[1], 10) - 1, parseInt(dp[0], 10)).getTime();
                }
            } else if (datePart && datePart.includes('-')) {
                let dp = datePart.split('-');
                if (dp.length === 3) {
                    if (dp[0].length === 4) ts = new Date(parseInt(dp[0], 10), parseInt(dp[1], 10) - 1, parseInt(dp[2], 10)).getTime();
                    else ts = new Date(parseInt(dp[2], 10), parseInt(dp[1], 10) - 1, parseInt(dp[0], 10)).getTime();
                }
            } else {
                let d = new Date(str);
                if (!isNaN(d.getTime())) ts = d.getTime();
            }
        }
        if (!ts) return false;
        return (Date.now() - ts) > (10 * 24 * 60 * 60 * 1000);
    }

    function purgeExpiredDemoSubmissions(store) {
        if (!store || !Array.isArray(store.submissions)) return false;
        let originalLen = store.submissions.length;
        store.submissions = store.submissions.filter(s => {
            if (s.status === 'Deleted') {
                let delTime = s.deleted_at || s.timestamp || s.submissionDate;
                if (s.comment && s.comment.includes('DELETED_AT:')) {
                    let m = s.comment.match(/DELETED_AT:(\d+)/);
                    if (m) delTime = parseInt(m[1], 10);
                }
                return !isOlderThan10Days(delTime);
            }
            return true;
        });
        return store.submissions.length !== originalLen;
    }

    // Google Apps Script Run Shim
    class MockGoogleScriptRunInstance {
        constructor() {
            this._successHandler = null;
            this._failureHandler = null;

            return new Proxy(this, {
                get: (target, prop) => {
                    if (prop in target) return target[prop];
                    return (...args) => target._execute(prop, args);
                }
            });
        }

        withSuccessHandler(callback) {
            this._successHandler = callback;
            return this;
        }

        withFailureHandler(callback) {
            this._failureHandler = callback;
            return this;
        }

        async _execute(functionName, args) {
            const self = this;
            let result = null;

            // Äá»™ trá»… pháº£n há»“i nháº¹ 80ms
            await new Promise(r => setTimeout(r, 80));

            try {
                let store = getDemoStore();

                // 1. ÄÄ‚NG NHáº¬P & XÃC THá»°C Há»† THá»NG
                if (functionName === 'loginSystem') {
                    const phone = String(args[0] || "").trim();
                    const pin = String(args[1] || "").trim();
                    const childName = String(args[2] || "").trim();
                    const norm = normalizePhone(phone);

                    // A. ÄÄƒng nháº­p Gia SÆ° hoáº·c Admin (CÃ³ MÃ£ PIN)
                    if (pin && pin !== "") {
                        if (phone.toLowerCase() === 'admin' || norm === '302001' || norm === '0975546830') {
                            result = {
                                role: 'admin',
                                thongBao: "ÄÄƒng nháº­p vá»›i quyá»n Admin thÃ nh cÃ´ng!",
                                data: {
                                    tutors: store.tutors.map(t => ({
                                        name: t.name,
                                        phone: t.phone,
                                        pin: t.pin || "1234",
                                        status: "Hoáº¡t Ä‘á»™ng",
                                        createdDate: "18/07/2026",
                                        nextBillingDate: "18/09/2026",
                                        lastActive: "Vá»«a xong",
                                        accountType: "Gia sÆ° (1-1)"
                                    })),
                                    students: store.students.map(s => ({
                                        name: s.name,
                                        parentName: "Phá»¥ huynh em " + s.name,
                                        phone: s.phone,
                                        tutorPhone: "0123456789",
                                        tuition: s.tuition || 200000
                                    })),
                                    deletedTutors: [],
                                    incomeReports: {},
                                    marqueeAnnouncement: "Báº£ng Quáº£n Trá»‹ Há»‡ Thá»‘ng Trung TÃ¢m Gia SÆ° 4.0"
                                }
                            };
                        } else {
                            // Gia sÆ° Tháº§y Nam
                            let tutor = store.tutors[0];
                            result = {
                                role: 'tutor',
                                thongBao: "ÄÄƒng nháº­p vá»›i quyá»n Gia sÆ° thÃ nh cÃ´ng!",
                                data: {
                                    tutorPhone: tutor.phone,
                                    tutorName: tutor.name,
                                    tutorPin: tutor.pin || "1234",
                                    qrCode: (tutor && tutor.qrCode && tutor.qrCode !== "https://i.postimg.cc/Zn8NjRbg/ma-qr-chuyen-khoan-ZN.jpg") ? tutor.qrCode : ((typeof localStorage !== 'undefined' && localStorage.getItem('tutor_qr_code') && localStorage.getItem('tutor_qr_code') !== "https://i.postimg.cc/Zn8NjRbg/ma-qr-chuyen-khoan-ZN.jpg") ? localStorage.getItem('tutor_qr_code') : "https://i.postimg.cc/66rKbPmb/trinh-duyet.png"),
                                    students: store.students.map(s => ({
                                        phone: s.phone,
                                        name: s.name,
                                        parentName: "Phá»¥ huynh em " + s.name,
                                        tuition: s.tuition || 200000,
                                        maBaiTap: s.phone,
                                        thongBao: "Em há»c táº­p ráº¥t chÄƒm chá»‰ vÃ  tiáº¿n bá»™."
                                    })),
                                    deletedStudents: [],
                                    totalUnpaidIncome: 0,
                                    classCount: store.students.length,
                                    marqueeAnnouncement: ""
                                }
                            };
                        }
                    }
                    // B. Tra cá»©u Phá»¥ Huynh & Há»c Sinh (KhÃ´ng cáº§n PIN)
                    else {
                        let target = store.students.find(s => normalizePhone(s.phone) === norm || s.name.toLowerCase() === phone.toLowerCase());
                        if (!target && store.students.length > 0) {
                            target = store.students[1] || store.students[0]; // Máº·c Ä‘á»‹nh LÃª Minh ThÆ°
                        }

                        if (target) {
                            let formattedLogs = (target.logs || []).map((l, idx) => ({
                                rowIndex: idx + 1,
                                tuan: l.tuan || (idx + 1),
                                ngay: l.ngay || (typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(idx * 3) : "15/08/2026"),
                                mon: target.subject || "ToÃ¡n",
                                noiDung: l.topic || l.noiDung || "Luyá»‡n táº­p chuyÃªn Ä‘á»",
                                danhGiaBTVN: l.btvn || l.danhGiaBTVN || "HoÃ n thÃ nh",
                                btvn: l.btvn || l.danhGiaBTVN || "HoÃ n thÃ nh",
                                diemDauGio: l.diemDG || l.diemDauGio || "9.0",
                                diemDinhKi: l.diemDK || l.diemDinhKi || "9.5",
                                nhanXet: l.nhanXet || "Tiáº¿p thu bÃ i nhanh.",
                                trangThai: l.chuyenCan || l.trangThai || "CÃ³ máº·t"
                            }));

                            result = {
                                role: 'student',
                                data: {
                                    timThay: true,
                                    tenHocSinh: target.name,
                                    sdt: target.phone,
                                    lop: target.classLevel + " - " + target.subject,
                                    giaSu: target.tutorName || "Tháº§y Tráº§n HoÃ ng Nam",
                                    sdtGiaSu: "0123456789",
                                    gpa: target.gpa || "8.9",
                                    buoiHoc: target.totalSessions || 10,
                                    buoiNghi: target.absentSessions || 0,
                                    btvnRate: target.hwRate || "100%",
                                    thongBaoHocSinh: "ChÃºc má»«ng em Ä‘áº¡t káº¿t quáº£ xuáº¥t sáº¯c trong buá»•i há»c vá»«a qua!",
                                    lichSuHocTap: formattedLogs,
                                    danhSachNhatKy: formattedLogs,
                                    danhSachBaiTap: store.homework.map(h => ({
                                        mon: target.subject || "Gia sÆ°",
                                        tenBai: h.title,
                                        link: h.file || ""
                                    })),
                                    danhSachHuyChuong: []
                                }
                            };
                        } else {
                            result = { error: "KhÃ´ng tÃ¬m tháº¥y há»c sinh vá»›i sá»‘ Ä‘iá»‡n thoáº¡i nÃ y." };
                        }
                    }
                }

                // 2. CHI TIáº¾T Há»ŒC SINH CHO GIA SÆ¯ (BIá»‚U Äá»’, Lá»ŠCH Sá»¬ ÄÃNH GIÃ & HÃ“A ÄÆ N)
                else if (functionName === 'getStudentDetailsForTutor' || functionName === 'getStudentDetails') {
                    const studentPhone = String(args[0] || "");
                    const studentName = String(args[1] || "");
                    const norm = normalizePhone(studentPhone);
                    let target = store.students.find(s => normalizePhone(s.phone) === norm || (studentName && s.name.toLowerCase() === studentName.toLowerCase()));
                    if (!target) target = store.students[1] || store.students[0];

                    let formattedLogs = (target.logs || []).map((l, idx) => ({
                        rowIndex: idx + 1,
                        tuan: l.tuan || (idx + 1),
                        ngay: l.ngay || (typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(idx * 3) : "15/08/2026"),
                        mon: target.subject || "ToÃ¡n",
                        noiDung: l.topic || l.noiDung || "Luyá»‡n táº­p cá»±c trá»‹ hÃ m sá»‘ & tÃ­ch phÃ¢n",
                        danhGiaBTVN: l.btvn || l.danhGiaBTVN || "HoÃ n thÃ nh",
                        btvn: l.btvn || l.danhGiaBTVN || "HoÃ n thÃ nh",
                        diemDauGio: l.diemDG || l.diemDauGio || "9.0",
                        diemDinhKi: l.diemDK || l.diemDinhKi || "9.5",
                        nhanXet: l.nhanXet || "TÆ° duy giáº£i toÃ¡n nhanh, lÃ m tá»‘t cÃ¡c cÃ¢u phÃ¢n loáº¡i 8.5+.",
                        trangThai: l.chuyenCan || l.trangThai || "CÃ³ máº·t",
                        tienDong: "ÄÃ£ Ä‘Ã³ng",
                        ngayDongTien: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(10) : "05/08/2026"
                    }));

                    result = {
                        success: true,
                        student: {
                            name: target.name,
                            phone: target.phone,
                            parentName: "Phá»¥ huynh em " + target.name,
                            classLevel: target.classLevel,
                            subject: target.subject,
                            tuition: target.tuition || 200000,
                            billing_type: target.billing_type || 'session'
                        },
                        logs: formattedLogs
                    };
                }

                // 3. DASHBOARD GIA SÆ¯ Tá»”NG QUAN
                else if (functionName === 'getTutorDashboardData') {
                    let tutor = store.tutors[0];
                    result = {
                        tutorPhone: tutor.phone,
                        tutorName: tutor.name,
                        tutorPin: tutor.pin || "1234",
                        qrCode: (tutor && tutor.qrCode && tutor.qrCode !== "https://i.postimg.cc/Zn8NjRbg/ma-qr-chuyen-khoan-ZN.jpg") ? tutor.qrCode : ((typeof localStorage !== 'undefined' && localStorage.getItem('tutor_qr_code') && localStorage.getItem('tutor_qr_code') !== "https://i.postimg.cc/Zn8NjRbg/ma-qr-chuyen-khoan-ZN.jpg") ? localStorage.getItem('tutor_qr_code') : "https://i.postimg.cc/66rKbPmb/trinh-duyet.png"),
                        students: store.students.map(s => ({
                            phone: s.phone,
                            name: s.name,
                            parentName: s.parentName || ("Phá»¥ huynh em " + s.name),
                            tuition: s.tuition || 200000,
                            billing_type: s.billing_type || 'session',
                            maBaiTap: s.maBaiTap || s.phone,
                            thongBao: s.thongBao || "Em há»c táº­p ráº¥t chÄƒm chá»‰ vÃ  tiáº¿n bá»™."
                        })),
                        deletedStudents: [],
                        totalUnpaidIncome: 0,
                        classCount: store.students.length,
                        marqueeAnnouncement: ""
                    };
                }

                // 3.1 THÃŠM & Sá»¬A Há»ŒC SINH MOCK
                else if (functionName === 'themHocSinhMoi' || functionName === 'saveTutorStudent') {
                    const [tutorPhone, phuHuynhName, studentName, studentPhone, tuition, maBaiTap, thongBao, billingType] = args;
                    const newSt = {
                        phone: studentPhone || ("09" + Date.now().toString().slice(-8)),
                        maBaiTap: maBaiTap || studentPhone || ("09" + Date.now().toString().slice(-8)),
                        name: studentName,
                        parentName: phuHuynhName || ("Phá»¥ huynh em " + studentName),
                        classLevel: "Lá»›p 12",
                        subject: "ToÃ¡n",
                        tutorName: "Tháº§y Tráº§n HoÃ ng Nam",
                        tutorPhone: tutorPhone || "0123456789",
                        gpa: "8.5",
                        totalSessions: 0,
                        absentSessions: 0,
                        hwRate: "100%",
                        tuition: parseFloat(tuition) || 200000,
                        billing_type: billingType || 'session',
                        thongBao: thongBao || "Em há»c táº­p ráº¥t chÄƒm chá»‰ vÃ  tiáº¿n bá»™.",
                        logs: []
                    };
                    store.students.push(newSt);
                    if (typeof saveDemoStore === 'function') saveDemoStore(store);
                    result = { success: true };
                }

                else if (functionName === 'suaThongTinHocSinh' || functionName === 'updateTutorStudent') {
                    const [oldPhone, phuHuynhName, studentName, studentPhone, tuition, maBaiTap, thongBao, billingType] = args;
                    let target = store.students.find(s => s.phone === oldPhone || normalizePhone(s.phone) === normalizePhone(oldPhone));
                    if (target) {
                        target.name = studentName;
                        target.parentName = phuHuynhName;
                        target.phone = studentPhone || oldPhone;
                        target.tuition = parseFloat(tuition) || target.tuition;
                        target.billing_type = billingType || target.billing_type || 'session';
                        if (maBaiTap) target.maBaiTap = maBaiTap;
                        if (thongBao !== undefined) target.thongBao = thongBao;
                    }
                    if (typeof saveDemoStore === 'function') saveDemoStore(store);
                    result = { success: true };
                }

                else if (functionName === 'getStudentParentName') {
                    const studentPhone = args[0];
                    let target = store.students ? store.students.find(s => s.phone === studentPhone || normalizePhone(s.phone) === normalizePhone(studentPhone)) : null;
                    result = (target && target.parentName) ? target.parentName : (target ? ("Phá»¥ huynh em " + target.name) : "");
                }

                // 3.2 Cáº¬P NHáº¬T THÃ”NG TIN GIA SÆ¯ & MÃƒ QR THANH TOÃN
                else if (functionName === 'capNhatThongTinGiaSu' || functionName === 'updateTutorAccount') {
                    const [oldPhone, name, phone, pin, qrCode] = args;
                    let tutor = (store.tutors && store.tutors.length > 0) ? (store.tutors.find(t => t.phone === oldPhone || normalizePhone(t.phone) === normalizePhone(oldPhone)) || store.tutors[0]) : null;
                    if (tutor) {
                        if (name) tutor.name = name;
                        if (phone) tutor.phone = phone;
                        if (pin) tutor.pin = pin;
                        if (qrCode !== undefined) tutor.qrCode = qrCode;
                    }
                    if (qrCode !== undefined && typeof localStorage !== 'undefined') {
                        try { localStorage.setItem('tutor_qr_code', qrCode); } catch(e){}
                    }
                    if (typeof saveDemoStore === 'function') saveDemoStore(store);
                    result = { success: true, message: "Cáº­p nháº­t tÃ i khoáº£n gia sÆ° thÃ nh cÃ´ng!" };
                }

                // 4. DANH SÃCH Ã KIáº¾N PHáº¢N Há»’I Cá»¦A PHá»¤ HUYNH
                else if (functionName === 'getTutorFeedback' || functionName === 'getFeedbacks') {
                    result = {
                        success: true,
                        feedbacks: [
                            {
                                studentName: "LÃª Minh ThÆ°",
                                studentPhone: "0987654321",
                                timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(1) + " 21:30" : "HÃ´m qua 21:30",
                                content: "Gia Ä‘Ã¬nh ráº¥t cáº£m Æ¡n Tháº§y Nam, chÃ¡u ThÆ° tiáº¿n bá»™ mÃ´n ToÃ¡n vÃ  Váº­t LÃ½ ráº¥t nhiá»u sau khÃ³a há»c áº¡!"
                            },
                            {
                                studentName: "Nguyá»…n HoÃ ng Nam",
                                studentPhone: "0912345678",
                                timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(2) + " 19:45" : "2 ngÃ y trÆ°á»›c",
                                content: "Tháº§y giáº£ng bÃ i ráº¥t dá»… hiá»ƒu vÃ  táº­n tÃ¢m, chÃ¡u Nam Ä‘Ã£ tá»± tin lÃ m Ä‘á» kiá»ƒm tra trÃªn lá»›p."
                            },
                            {
                                studentName: "Pháº¡m Háº£i ÄÄƒng",
                                studentPhone: "0905123456",
                                timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(3) + " 20:10" : "3 ngÃ y trÆ°á»›c",
                                content: "ChÃ¡u ÄÄƒng ráº¥t hÃ o há»©ng vá»›i cÃ¡c bÃ i mÃ´ phá»ng Váº­t LÃ½ 4K cá»§a Tháº§y."
                            }
                        ]
                    };
                }

                // 5. THá»œI KHÃ“A BIá»‚U & Lá»ŠCH Dáº Y GIA SÆ¯
                else if (functionName === 'getTutorSchedule') {
                    if (store.tutorSchedule && Array.isArray(store.tutorSchedule) && store.tutorSchedule.length > 0) {
                        result = store.tutorSchedule;
                    } else {
                        result = [
                            {
                                rowIndex: 1,
                                studentName: "LÃª Minh ThÆ°",
                                color: "#8E4DFF",
                                mon: "18:00 - 19:30",
                                tue: "",
                                wed: "",
                                thu: "",
                                fri: "",
                                sat: "",
                                sun: "08:30 - 10:00"
                            },
                            {
                                rowIndex: 2,
                                studentName: "Nguyá»…n HoÃ ng Nam",
                                color: "#10B981",
                                mon: "",
                                tue: "",
                                wed: "19:30 - 21:00",
                                thu: "",
                                fri: "",
                                sat: "18:00 - 19:30",
                                sun: ""
                            },
                            {
                                rowIndex: 3,
                                studentName: "Pháº¡m Háº£i ÄÄƒng",
                                color: "#F59E0B",
                                mon: "",
                                tue: "18:00 - 19:30",
                                wed: "",
                                thu: "",
                                fri: "18:00 - 19:30",
                                sat: "",
                                sun: ""
                            }
                        ];
                        store.tutorSchedule = result;
                        saveDemoStore(store);
                    }
                }

                // 6. QUáº¢N LÃ BÃ€I Táº¬P ÄÃƒ GIAO CHO Há»ŒC SINH
                else if (functionName === 'getAssignedHomework' || functionName === 'getTutorHomeworkList') {
                    const studentName = String(args[0] || "").trim();
                    const tutorPhone = String(args[1] || "").trim();
                    const normTutor = normalizePhone(tutorPhone);

                    store.assignedHomework = store.assignedHomework || [];

                    function matchStudent(h) {
                        let matchTutor = !normTutor || normalizePhone(h.tutorPhone) === normTutor || String(h.tutorPhone || "").trim() === tutorPhone;
                        let matchName = !studentName || (h.studentName && h.studentName.trim().toLowerCase() === studentName.toLowerCase());
                        return matchTutor && matchName;
                    }

                    let active = store.assignedHomework.filter(h => !h.deleted_date && matchStudent(h));
                    let trash = store.assignedHomework.filter(h => !!h.deleted_date && matchStudent(h));

                    result = {
                        success: true,
                        activeList: active.map(h => ({
                            rowIndex: h.rowIndex || h.hwId,
                            hwId: h.hwId,
                            studentName: h.studentName,
                            title: h.title,
                            releaseDate: h.releaseDate || "",
                            fileUrl: h.fileUrl || "",
                            externalLink: h.externalLink || "",
                            status: h.status || "Active"
                        })),
                        trashList: trash.map(h => ({
                            rowIndex: h.rowIndex || h.hwId,
                            hwId: h.hwId,
                            studentName: h.studentName,
                            title: h.title,
                            releaseDate: h.releaseDate || "",
                            fileUrl: h.fileUrl || "",
                            externalLink: h.externalLink || "",
                            deletedTime: h.deleted_date || "",
                            deletedDate: h.deleted_date || ""
                        }))
                    };
                }

                else if (functionName === 'uploadAssignedHomework' || functionName === 'assignHomework') {
                    const [tutorPhone, studentName, title, releaseDate, fileBase64, fileName, mimeType, maBaiTap, externalLink] = args;
                    store.assignedHomework = store.assignedHomework || [];

                    const newRowIndex = store.assignedHomework.length > 0 
                        ? Math.max(...store.assignedHomework.map(h => Number(h.rowIndex) || 0)) + 1 
                        : 1;
                    const hwId = `HW_DEMO_${Date.now()}`;
                    
                    let fileUrl = externalLink || "";
                    if (fileBase64) {
                        const mime = mimeType || "application/pdf";
                        fileUrl = `data:${mime};base64,${fileBase64}`;
                    } else if (!fileUrl) {
                        fileUrl = "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview";
                    }

                    const relDate = releaseDate || (typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) : new Date().toLocaleDateString('vi-VN'));

                    const newHw = {
                        rowIndex: newRowIndex,
                        hwId: hwId,
                        studentName: studentName || "",
                        tutorPhone: tutorPhone || "0123456789",
                        homework_code: maBaiTap || "",
                        title: title || "BÃ i táº­p má»›i",
                        releaseDate: relDate,
                        fileUrl: fileUrl,
                        fileName: fileName || (title ? `${title}.pdf` : "BaiTap.pdf"),
                        externalLink: externalLink || "",
                        status: "Active",
                        deleted_date: null
                    };

                    store.assignedHomework.unshift(newHw);

                    // Äá»“ng bá»™ sang store.homework Ä‘á»ƒ há»c sinh tra cá»©u bÃ i táº­p
                    store.homework = store.homework || [];
                    store.homework.unshift({
                        id: hwId,
                        title: newHw.title,
                        deadline: newHw.releaseDate,
                        file: newHw.fileUrl,
                        status: "ChÆ°a ná»™p",
                        score: "-",
                        submittedAt: "-",
                        comment: ""
                    });

                    saveDemoStore(store);
                    result = { success: true, hwId: hwId, fileUrl: fileUrl, rowIndex: newRowIndex };
                }

                else if (functionName === 'editAssignedHomework' || functionName === 'updateAssignedHomework') {
                    const [rowIndex, title, releaseDate, fileBase64, fileName, mimeType, externalLink] = args;
                    store.assignedHomework = store.assignedHomework || [];
                    
                    let target = store.assignedHomework.find(h => String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex));
                    if (target) {
                        target.title = title || target.title;
                        target.releaseDate = releaseDate || target.releaseDate;
                        if (externalLink !== undefined) target.externalLink = externalLink;
                        if (fileBase64) {
                            const mime = mimeType || "application/pdf";
                            target.fileUrl = `data:${mime};base64,${fileBase64}`;
                            target.fileName = fileName || target.fileName;
                        }
                        
                        // Äá»“ng bá»™ store.homework
                        if (store.homework) {
                            let hwTarget = store.homework.find(h => h.id === target.hwId || h.title === target.title);
                            if (hwTarget) {
                                hwTarget.title = target.title;
                                hwTarget.deadline = target.releaseDate;
                                if (target.fileUrl) hwTarget.file = target.fileUrl;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'deleteAssignedHomework') {
                    const [rowIndex] = args;
                    store.assignedHomework = store.assignedHomework || [];
                    let target = store.assignedHomework.find(h => String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex));
                    if (target) {
                        target.deleted_date = typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) : new Date().toLocaleDateString('vi-VN');
                        target.status = "Trash";
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'restoreAssignedHomework') {
                    const [rowIndex] = args;
                    store.assignedHomework = store.assignedHomework || [];
                    let target = store.assignedHomework.find(h => String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex));
                    if (target) {
                        target.deleted_date = null;
                        target.status = "Active";
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                // 7. QUáº¢N LÃ BÃ€I Ná»˜P Cá»¦A Há»ŒC SINH
                else if (functionName === 'getStudentSubmissionsForTutor' || functionName === 'getSubmittedHomework' || functionName === 'getTutorSubmissions') {
                    const maBaiTap = String(args[0] || "");
                    const studentName = String(args[1] || "");
                    
                    if (purgeExpiredDemoSubmissions(store)) {
                        saveDemoStore(store);
                    }
                    let subs = (store.submissions && store.submissions.length > 0) ? store.submissions : [
                        {
                            subId: "SUB_01",
                            rowIndex: 1,
                            studentName: "LÃª Minh ThÆ°",
                            studentPhone: "0987654321",
                            lessonName: "Phiáº¿u 01: 50 CÃ¢u Tráº¯c Nghiá»‡m Äáº¡o HÃ m & Cá»±c Trá»‹",
                            timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(1) + " 21:15:30" : "16/08/2026 21:15:30",
                            submissionDate: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(1) : "16/08/2026",
                            fileName: "leminhthu_dao_ham_done.pdf",
                            fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                            score: "9.5",
                            comment: "BÃ i giáº£i ráº¥t chuáº©n xÃ¡c, trÃ¬nh bÃ y sáº¡ch Ä‘áº¹p. ChÃº Ã½ thÃªm cÃ¢u 48 cÃ³ thá»ƒ dÃ¹ng phÆ°Æ¡ng phÃ¡p loáº¡i trá»« nhanh hÆ¡n nhÃ©.",
                            status: "Active"
                        },
                        {
                            subId: "SUB_02",
                            rowIndex: 2,
                            studentName: "Nguyá»…n HoÃ ng Nam",
                            studentPhone: "0912345678",
                            lessonName: "ChuyÃªn Ä‘á»: Há»‡ thá»©c lÆ°á»£ng trong tam giÃ¡c",
                            timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(2) + " 22:00:15" : "15/08/2026 22:00:15",
                            submissionDate: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(2) : "15/08/2026",
                            fileName: "nguyenhoangnam_he_thuc.jpg",
                            fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop",
                            score: "9.0",
                            comment: "LÃ m bÃ i tá»‘t, nhá»› váº½ hÃ¬nh báº±ng thÆ°á»›c tháº³ng rÃµ nÃ©t.",
                            status: "Active"
                        },
                        {
                            subId: "SUB_03",
                            rowIndex: 3,
                            studentName: "Pháº¡m Háº£i ÄÄƒng",
                            studentPhone: "0905123456",
                            lessonName: "BÃ i táº­p 03: KhÃºc xáº¡ Ã¡nh sÃ¡ng & LÄƒng kÃ­nh",
                            timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) + " 19:30:00" : "17/08/2026 19:30:00",
                            submissionDate: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) : "17/08/2026",
                            fileName: "phamhaidang_vatly.jpg",
                            fileUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop",
                            score: "",
                            comment: "",
                            status: "Active"
                        }
                    ];

                    subs = subs.filter(s => {
                        if (s.status === 'Deleted') {
                            let delTime = s.deleted_at || s.timestamp || s.submissionDate;
                            if (s.comment && s.comment.includes('DELETED_AT:')) {
                                let m = s.comment.match(/DELETED_AT:(\d+)/);
                                if (m) delTime = parseInt(m[1], 10);
                            }
                            return !isOlderThan10Days(delTime);
                        }
                        return true;
                    });

                    if (studentName) {
                        let filtered = subs.filter(s => s.studentName.toLowerCase().includes(studentName.toLowerCase()));
                        if (filtered.length > 0) subs = filtered;
                    }

                    result = {
                        submissions: subs.map(s => ({
                            subId: s.subId || String(s.rowIndex),
                            rowIndex: s.rowIndex || s.subId,
                            studentName: s.studentName,
                            lessonName: s.lessonName,
                            timestamp: s.timestamp,
                            submissionDate: s.submissionDate || "",
                            fileUrl: s.fileUrl,
                            fileName: s.fileName || "",
                            score: s.score || "",
                            comment: s.comment || "",
                            status: s.status || "Active"
                        }))
                    };
                }

                else if (functionName === 'gradeSubmission') {
                    const [subId, score, comment] = args;
                    if (store.submissions) {
                        for (let i = 0; i < store.submissions.length; i++) {
                            let s = store.submissions[i];
                            if (String(s.subId) === String(subId) || String(s.rowIndex) === String(subId)) {
                                s.score = String(score || "").trim();
                                s.comment = String(comment || "").trim();
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'getDriveFolderImages') {
                    const [folderUrl] = args;
                    result = [
                        {
                            id: "img_01",
                            name: "Trang 1 - BÃ i giáº£i chi tiáº¿t.jpg",
                            isImage: true,
                            url: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1600&auto=format&fit=crop"
                        },
                        {
                            id: "img_02",
                            name: "Trang 2 - HÃ¬nh váº½ & ÄÃ¡p sá»‘.jpg",
                            isImage: true,
                            url: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1600&auto=format&fit=crop"
                        }
                    ];
                }

                // 8. DASHBOARD ADMIN
                else if (functionName === 'getAdminDashboardData') {
                    result = {
                        tutors: store.tutors.map(t => ({
                            name: t.name,
                            phone: t.phone,
                            pin: t.pin || "1234",
                            status: "Hoáº¡t Ä‘á»™ng",
                            createdDate: "18/07/2026",
                            nextBillingDate: "18/09/2026",
                            lastActive: "Vá»«a xong",
                            accountType: "Gia sÆ° (1-1)"
                        })),
                        students: store.students.map(s => ({
                            name: s.name,
                            parentName: "Phá»¥ huynh em " + s.name,
                            phone: s.phone,
                            tutorPhone: "0123456789",
                            tuition: s.tuition || 200000
                        })),
                        deletedTutors: [],
                        incomeReports: {},
                        marqueeAnnouncement: "Báº£ng Quáº£n Trá»‹ Há»‡ Thá»‘ng Trung TÃ¢m Gia SÆ° 4.0"
                    };
                }

                // 9. XÃC THá»°C MÃƒ BÃ€I Táº¬P (HOMEWORK GATEWAY)
                else if (functionName === 'xacThucMaBaiTap' || functionName === 'checkHomework') {
                    const code = String(args[0] || "").trim();
                    const norm = normalizePhone(code);
                    let target = store.students.find(s => normalizePhone(s.phone) === norm || s.name.toLowerCase().includes(code.toLowerCase()));
                    if (!target) target = store.students[1] || store.students[0];

                    if (purgeExpiredDemoSubmissions(store)) {
                        saveDemoStore(store);
                    }
                    let allSubs = (store.submissions || []).filter(s => {
                        if (s.status === 'Deleted') {
                            let delTime = s.deleted_at || s.timestamp || s.submissionDate;
                            if (s.comment && s.comment.includes('DELETED_AT:')) {
                                let m = s.comment.match(/DELETED_AT:(\d+)/);
                                if (m) delTime = parseInt(m[1], 10);
                            }
                            return !isOlderThan10Days(delTime);
                        }
                        return true;
                    });
                    let mySubs = allSubs.filter(s => normalizePhone(s.studentPhone) === normalizePhone(target.phone) || s.studentName.toLowerCase() === target.name.toLowerCase());
                    if (mySubs.length === 0 && allSubs.length > 0) {
                        mySubs = [allSubs[0]];
                    }

                    result = {
                        timThay: true,
                        ma: target.phone,
                        studentName: target.name,
                        tenHocSinh: target.name,
                        maHocSinh: target.phone,
                        assignedList: (function() {
                            let myAssigned = (store.assignedHomework || []).filter(h => !h.deleted_date && (
                                (h.studentName && target.name && h.studentName.trim().toLowerCase() === target.name.trim().toLowerCase()) ||
                                (h.homework_code && normalizePhone(h.homework_code) === normalizePhone(target.phone))
                            ));
                            if (myAssigned.length === 0 && store.homework && store.homework.length > 0) {
                                return store.homework.map((h, idx) => ({
                                    rowIndex: idx + 1,
                                    title: h.title,
                                    releaseDate: h.deadline,
                                    fileUrl: h.file,
                                    externalLink: ""
                                }));
                            }
                            return myAssigned.map((h, idx) => ({
                                rowIndex: h.rowIndex || (idx + 1),
                                title: h.title,
                                releaseDate: h.releaseDate || "",
                                fileUrl: h.fileUrl || "",
                                externalLink: h.externalLink || ""
                            }));
                        })(),
                        submissions: mySubs.map((s, idx) => ({
                            subId: s.subId || String(idx + 1),
                            rowIndex: s.rowIndex || (idx + 1),
                            studentName: s.studentName || target.name,
                            lessonName: s.lessonName || "BÃ i táº­p rÃ¨n luyá»‡n",
                            timestamp: s.timestamp || (typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(1) + " 21:15:30" : "16/08/2026 21:15:30"),
                            submissionDate: s.submissionDate || (typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(1) : "16/08/2026"),
                            fileUrl: s.fileUrl || "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                            status: s.status || "Active",
                            score: s.score || "",
                            comment: s.comment || ""
                        }))
                    };
                }

                // 10. NHáº¬T KÃ & GHI ÄIá»‚M
                else if (functionName === 'getStudentLogs') {
                    const studentPhone = String(args[0] || "");
                    const norm = normalizePhone(studentPhone);
                    let target = store.students.find(s => normalizePhone(s.phone) === norm) || store.students[0];
                    result = (target.logs || []).map((l, idx) => ({
                        rowIndex: idx + 1,
                        tuan: l.tuan || (idx + 1),
                        ngay: l.ngay,
                        mon: target.subject,
                        noiDung: l.topic,
                        danhGiaBTVN: l.btvn,
                        diemDauGio: l.diemDG,
                        diemDinhKi: l.diemDK,
                        nhanXet: l.nhanXet,
                        trangThai: l.chuyenCan
                    }));
                }

                // 11. CÃC TÃC Vá»¤ Ná»˜P BÃ€I Táº¬P & Sá»¬A XÃ“A TRÃŠN DEMO
                else if (functionName === 'uploadHomeworkFiles' || functionName === 'uploadHomeworkFile') {
                    const [ma, studentName, lessonName, filesList] = args;
                    if (!store.submissions) store.submissions = [];
                    
                    let fileUrl = "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop";
                    let fileName = "bai_lam.jpg";
                    if (filesList && filesList.length > 0) {
                        if (filesList.length === 1) {
                            fileName = filesList[0].fileName || "bai_lam.jpg";
                            if (filesList[0].fileBase64) {
                                fileUrl = "data:" + (filesList[0].mimeType || "image/jpeg") + ";base64," + filesList[0].fileBase64;
                            }
                        } else {
                            fileName = filesList.length + " áº£nh bÃ i ná»™p";
                            fileUrl = JSON.stringify(filesList.map((f, fIdx) => {
                                const mime = f.mimeType || "image/jpeg";
                                return {
                                    name: f.fileName || (`áº¢nh ${fIdx + 1}`),
                                    url: f.url || `data:${mime};base64,${f.fileBase64}`,
                                    isImage: !mime.includes("pdf") && !mime.includes("zip")
                                };
                            }));
                        }
                    }

                    const newSub = {
                        subId: "SUB_" + Date.now(),
                        rowIndex: store.submissions.length + 1,
                        studentName: studentName || "Há»c sinh",
                        studentPhone: ma || "0987654321",
                        lessonName: lessonName || "BÃ i táº­p má»›i",
                        timestamp: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) + " " + new Date().toTimeString().split(' ')[0] : "HÃ´m nay",
                        submissionDate: typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) : "HÃ´m nay",
                        fileUrl: fileUrl,
                        fileName: fileName,
                        score: "",
                        comment: "",
                        status: "Active"
                    };

                    store.submissions.unshift(newSub);
                    saveDemoStore(store);

                    result = {
                        success: true,
                        fileUrl: fileUrl,
                        submissionDate: newSub.submissionDate,
                        timestamp: newSub.timestamp,
                        status: "Active",
                        rowIndex: newSub.rowIndex
                    };
                }

                else if (functionName === 'editHomeworkFile') {
                    const [rowIndex, lessonName, filesList] = args;
                    if (store.submissions) {
                        for (let i = 0; i < store.submissions.length; i++) {
                            let s = store.submissions[i];
                            if (String(s.rowIndex) === String(rowIndex) || String(s.subId) === String(rowIndex)) {
                                s.lessonName = lessonName;
                                if (filesList && filesList.length > 0 && filesList[0].fileBase64) {
                                    s.fileUrl = "data:" + (filesList[0].mimeType || "image/jpeg") + ";base64," + filesList[0].fileBase64;
                                    s.fileName = filesList[0].fileName;
                                }
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'deleteHomeworkFile') {
                    const [rowIndex] = args;
                    if (store.submissions) {
                        for (let i = 0; i < store.submissions.length; i++) {
                            let s = store.submissions[i];
                            if (String(s.rowIndex) === String(rowIndex) || String(s.subId) === String(rowIndex)) {
                                s.status = "Deleted";
                                s.deleted_at = Date.now();
                                s.comment = `DELETED_AT:${Date.now()}`;
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'restoreHomeworkFile') {
                    const [rowIndex] = args;
                    if (store.submissions) {
                        for (let i = 0; i < store.submissions.length; i++) {
                            let s = store.submissions[i];
                            if (String(s.rowIndex) === String(rowIndex) || String(s.subId) === String(rowIndex)) {
                                s.status = "Active";
                                delete s.deleted_at;
                                s.comment = "";
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                // ==========================================
                // BÃ€I Táº¬P ÄÃƒ GIAO Cá»¦A GIA SÆ¯ (DEMO)
                // ==========================================

                else if (functionName === 'getAssignedHomework') {
                    const studentName = String(args[0] || "").trim().toLowerCase();
                    const tutorPhone = String(args[1] || "").trim();
                    if (!store.assignedHomework) store.assignedHomework = [];
                    
                    let activeList = store.assignedHomework.filter(h => (!h.status || h.status === 'Active') && (!studentName || (h.studentName && h.studentName.toLowerCase() === studentName)));
                    let trashList = store.assignedHomework.filter(h => h.status === 'Trash' && (!studentName || (h.studentName && h.studentName.toLowerCase() === studentName)));
                    
                    result = {
                        success: true,
                        activeList: activeList,
                        trashList: trashList
                    };
                }

                else if (functionName === 'editAssignedHomework' || functionName === 'updateAssignedHomework') {
                    const [rowIndex, title, releaseDate, fileBase64, fileName, mimeType, externalLink] = args;
                    if (store.assignedHomework) {
                        for (let i = 0; i < store.assignedHomework.length; i++) {
                            let h = store.assignedHomework[i];
                            if (String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex)) {
                                h.title = title;
                                h.releaseDate = releaseDate || h.releaseDate;
                                if (externalLink !== undefined) h.externalLink = externalLink;
                                if (fileBase64) {
                                    h.fileUrl = "data:" + (mimeType || "image/jpeg") + ";base64," + fileBase64;
                                    h.fileName = fileName;
                                }
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'deleteAssignedHomework') {
                    const [rowIndex] = args;
                    if (store.assignedHomework) {
                        for (let i = 0; i < store.assignedHomework.length; i++) {
                            let h = store.assignedHomework[i];
                            if (String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex)) {
                                h.status = "Trash";
                                h.deletedDate = typeof getGiaSuDemoDate === 'function' ? getGiaSuDemoDate(0) : "HÃ´m nay";
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'restoreAssignedHomework') {
                    const [rowIndex] = args;
                    if (store.assignedHomework) {
                        for (let i = 0; i < store.assignedHomework.length; i++) {
                            let h = store.assignedHomework[i];
                            if (String(h.rowIndex) === String(rowIndex) || String(h.hwId) === String(rowIndex)) {
                                h.status = "Active";
                                delete h.deletedDate;
                                break;
                            }
                        }
                        saveDemoStore(store);
                    }
                    result = { success: true };
                }

                else if (functionName === 'saveEvaluation' || functionName === 'deleteEvaluation') {
                    result = { success: true, thongBao: "Cáº­p nháº­t Ä‘Ã¡nh giÃ¡ buá»•i há»c thÃ nh cÃ´ng!" };
                }
                else if (functionName === 'saveScheduleToBackend' || functionName === 'capNhatThoiKhoaBieu') {
                    const studentName = String(args[1] || "").trim();
                    const mon = String(args[2] || "").trim();
                    const tue = String(args[3] || "").trim();
                    const wed = String(args[4] || "").trim();
                    const thu = String(args[5] || "").trim();
                    const fri = String(args[6] || "").trim();
                    const sat = String(args[7] || "").trim();
                    const sun = String(args[8] || "").trim();
                    
                    if (!store.tutorSchedule || !Array.isArray(store.tutorSchedule)) {
                        store.tutorSchedule = [
                            { rowIndex: 1, studentName: "LÃª Minh ThÆ°", color: "#8E4DFF", mon: "18:00 - 19:30", tue: "", wed: "", thu: "", fri: "", sat: "", sun: "08:30 - 10:00" },
                            { rowIndex: 2, studentName: "Nguyá»…n HoÃ ng Nam", color: "#10B981", mon: "", tue: "", wed: "19:30 - 21:00", thu: "", fri: "", sat: "18:00 - 19:30", sun: "" },
                            { rowIndex: 3, studentName: "Pháº¡m Háº£i ÄÄƒng", color: "#F59E0B", mon: "", tue: "18:00 - 19:30", wed: "", thu: "", fri: "18:00 - 19:30", sat: "", sun: "" }
                        ];
                    }
                    let item = store.tutorSchedule.find(s => s.studentName.trim() === studentName);
                    if (item) {
                        item.mon = mon; item.tue = tue; item.wed = wed; item.thu = thu; item.fri = fri; item.sat = sat; item.sun = sun;
                    } else {
                        store.tutorSchedule.push({
                            rowIndex: store.tutorSchedule.length + 1,
                            studentName: studentName,
                            color: "#8E4DFF",
                            mon: mon, tue: tue, wed: wed, thu: thu, fri: fri, sat: sat, sun: sun
                        });
                    }
                    saveDemoStore(store);
                    result = { success: true, thongBao: "ÄÃ£ lÆ°u lá»‹ch dáº¡y thÃ nh cÃ´ng!" };
                }
                else if (functionName === 'updateAnnouncement') {
                    result = { success: true, thongBao: "Cáº­p nháº­t thÃ´ng bÃ¡o há»c sinh thÃ nh cÃ´ng!" };
                }
                else if (functionName === 'updateStudentTuitionStatus') {
                    result = { success: true, thongBao: "ÄÃ£ cáº­p nháº­t tráº¡ng thÃ¡i há»c phÃ­ thÃ nh cÃ´ng!" };
                }
                else if (functionName === 'guiPhanHoiPhuHuynh') {
                    result = { success: true, thongBao: "Cáº£m Æ¡n QuÃ½ Phá»¥ huynh Ä‘Ã£ gá»­i pháº£n há»“i! Gia sÆ° Ä‘Ã£ nháº­n Ä‘Æ°á»£c tin nháº¯n." };
                }
                else if (functionName === 'submitHomework' || functionName === 'uploadHomework') {
                    result = { success: true, thongBao: "Ná»™p bÃ i táº­p thÃ nh cÃ´ng! Gia sÆ° sáº½ cháº¥m vÃ  pháº£n há»“i sá»›m nháº¥t." };
                }

                // Default Fallback
                else {
                    result = { success: true, thongBao: "Thá»±c hiá»‡n tÃ¡c vá»¥ thÃ nh cÃ´ng!" };
                }

            } catch (err) {
                console.error("API Mock Error:", err);
                result = { error: "Lá»—i xá»­ lÃ½: " + err.message };
            }

            if (result && result.error && self._failureHandler) {
                self._failureHandler(result.error);
            } else if (self._successHandler) {
                self._successHandler(result);
            }
            return result;
        }
    }

    // Expose store helpers for synchronous client state access
    window.getGiaSuDemoStore = getDemoStore;
    window.saveGiaSuDemoStore = saveDemoStore;

    // GÃ¡n Mock API vÃ o window.google.script.run
    window.google = {
        script: {
            get run() {
                return new MockGoogleScriptRunInstance();
            }
        }
    };

})();
