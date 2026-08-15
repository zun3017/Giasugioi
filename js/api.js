/**
 * ============================================================================
 * CLIENT-SIDE MOCK API GATEWAY CHO HỆ THỐNG GIA SƯ 1-1 (DEMO GIA SƯ GIỎI)
 * ============================================================================
 * - Hoạt động độc lập 100%, không cần kết nối mạng hay máy chủ backend
 * - Tốc độ phản hồi tức thì, giả lập đầy đủ luồng dữ liệu của Google Apps Script
 * - Đầy đủ phân quyền: PH/HS (Tra cứu), BÀI TẬP (Nộp bài), GIA SƯ (Quản lý), ADMIN
 */

(function() {
    const STORAGE_KEY = 'DEMO_GIASU_DATA_V1';

    function getDemoStore() {
        let store = null;
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            if (raw) store = JSON.parse(raw);
        } catch(e) {}

        const initial = (typeof INITIAL_GIASU_DEMO_DATA !== 'undefined') ? JSON.parse(JSON.stringify(INITIAL_GIASU_DEMO_DATA)) : {
            tutors: [
                { phone: "0123456789", pin: "1234", name: "Thầy Trần Hoàng Nam", subject: "Toán & Vật Lý" }
            ],
            students: [
                { phone: "0912345678", name: "Nguyễn Hoàng Nam", classLevel: "Lớp 9", subject: "Toán", gpa: "8.6", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] },
                { phone: "0987654321", name: "Lê Minh Thư", classLevel: "Lớp 12", subject: "Toán & Vật Lý", gpa: "8.9", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] },
                { phone: "0905123456", name: "Phạm Hải Đăng", classLevel: "Lớp 11", subject: "Vật Lý", gpa: "9.2", totalSessions: 10, absentSessions: 0, hwRate: "100%", logs: [] }
            ],
            homework: [],
            schedules: []
        };

        if (!store) {
            store = initial;
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

            // Độ trễ phản hồi nhẹ 80ms
            await new Promise(r => setTimeout(r, 80));

            try {
                let store = getDemoStore();

                // 1. ĐĂNG NHẬP & XÁC THỰC HỆ THỐNG
                if (functionName === 'loginSystem') {
                    const phone = String(args[0] || "").trim();
                    const pin = String(args[1] || "").trim();
                    const childName = String(args[2] || "").trim();
                    const norm = normalizePhone(phone);

                    // A. Đăng nhập Gia Sư hoặc Admin (Có Mã PIN)
                    if (pin && pin !== "") {
                        if (phone.toLowerCase() === 'admin' || norm === '302001' || norm === '0975546830') {
                            result = {
                                role: 'admin',
                                thongBao: "Đăng nhập với quyền Admin thành công!",
                                data: {
                                    tutors: store.tutors.map(t => ({
                                        name: t.name,
                                        phone: t.phone,
                                        pin: t.pin || "1234",
                                        status: "Hoạt động",
                                        createdDate: "18/07/2026",
                                        nextBillingDate: "18/09/2026",
                                        lastActive: "Vừa xong",
                                        accountType: "Gia sư (1-1)"
                                    })),
                                    students: store.students.map(s => ({
                                        name: s.name,
                                        parentName: "Phụ huynh em " + s.name,
                                        phone: s.phone,
                                        tutorPhone: "0123456789",
                                        tuition: 2000000
                                    })),
                                    deletedTutors: [],
                                    incomeReports: {},
                                    marqueeAnnouncement: "Bảng Quản Trị Hệ Thống Trung Tâm Gia Sư 4.0"
                                }
                            };
                        } else {
                            // Gia sư Thầy Nam
                            let tutor = store.tutors[0];
                            result = {
                                role: 'tutor',
                                thongBao: "Đăng nhập với quyền Gia sư thành công!",
                                data: {
                                    tutorPhone: tutor.phone,
                                    tutorName: tutor.name,
                                    tutorPin: tutor.pin || "1234",
                                    qrCode: "https://i.postimg.cc/66rKbPmb/trinh-duyet.png",
                                    students: store.students.map(s => ({
                                        phone: s.phone,
                                        name: s.name,
                                        parentName: "Phụ huynh em " + s.name,
                                        tuition: 2000000,
                                        maBaiTap: s.phone,
                                        thongBao: "Em học tập rất chăm chỉ và tiến bộ."
                                    })),
                                    deletedStudents: [],
                                    totalUnpaidIncome: 0,
                                    classCount: store.students.length,
                                    marqueeAnnouncement: "Chào mừng " + tutor.name + " đến với Bảng Quản Lý Gia Sư 4.0!"
                                }
                            };
                        }
                    }
                    // B. Tra cứu Phụ Huynh & Học Sinh (Không cần PIN)
                    else {
                        let target = store.students.find(s => normalizePhone(s.phone) === norm || s.name.toLowerCase() === phone.toLowerCase());
                        if (!target && store.students.length > 0) {
                            target = store.students[1] || store.students[0]; // Mặc định Lê Minh Thư
                        }

                        if (target) {
                            let formattedLogs = (target.logs || []).map((l, idx) => ({
                                rowIndex: idx + 1,
                                tuan: l.tuan || (idx + 1),
                                ngay: l.ngay || "15/08/2026",
                                mon: target.subject || "Toán",
                                noiDung: l.topic || "Luyện tập chuyên đề",
                                danhGiaBTVN: l.btvn || "Đạt",
                                btvn: l.btvn || "Đạt",
                                diemDauGio: l.diemDG || "9.0",
                                diemDinhKi: l.diemDK || "9.5",
                                nhanXet: l.nhanXet || "Tiếp thu bài nhanh.",
                                trangThai: l.chuyenCan || "Có mặt"
                            }));

                            result = {
                                role: 'student',
                                data: {
                                    timThay: true,
                                    tenHocSinh: target.name,
                                    sdt: target.phone,
                                    lop: target.classLevel + " - " + target.subject,
                                    giaSu: target.tutorName || "Thầy Trần Hoàng Nam",
                                    sdtGiaSu: "0123456789",
                                    gpa: target.gpa || "8.9",
                                    buoiHoc: target.totalSessions || 10,
                                    buoiNghi: target.absentSessions || 0,
                                    btvnRate: target.hwRate || "100%",
                                    thongBaoHocSinh: "Chúc mừng em đạt kết quả xuất sắc trong buổi học vừa qua!",
                                    lichSuHocTap: formattedLogs,
                                    danhSachNhatKy: formattedLogs,
                                    danhSachBaiTap: store.homework.map(h => ({
                                        mon: target.subject || "Gia sư",
                                        tenBai: h.title,
                                        link: h.file || ""
                                    })),
                                    danhSachHuyChuong: []
                                }
                            };
                        } else {
                            result = { error: "Không tìm thấy học sinh với số điện thoại này." };
                        }
                    }
                }

                // 2. CHI TIẾT HỌC SINH CHO GIA SƯ (BIỂU ĐỒ, LỊCH SỬ ĐÁNH GIÁ & HÓA ĐƠN)
                else if (functionName === 'getStudentDetailsForTutor' || functionName === 'getStudentDetails') {
                    const studentPhone = String(args[0] || "");
                    const studentName = String(args[1] || "");
                    const norm = normalizePhone(studentPhone);
                    let target = store.students.find(s => normalizePhone(s.phone) === norm || (studentName && s.name.toLowerCase() === studentName.toLowerCase()));
                    if (!target) target = store.students[1] || store.students[0];

                    let formattedLogs = (target.logs || []).map((l, idx) => ({
                        rowIndex: idx + 1,
                        tuan: l.tuan || (idx + 1),
                        ngay: l.ngay || "15/08/2026",
                        mon: target.subject || "Toán",
                        noiDung: l.topic || "Luyện tập cực trị hàm số & tích phân",
                        danhGiaBTVN: l.btvn || "Đạt",
                        btvn: l.btvn || "Đạt",
                        diemDauGio: l.diemDG || "9.0",
                        diemDinhKi: l.diemDK || "9.5",
                        nhanXet: l.nhanXet || "Tư duy giải toán nhanh, làm tốt các câu phân loại 8.5+.",
                        trangThai: l.chuyenCan || "Có mặt",
                        tienDong: "Đã đóng",
                        ngayDongTien: "05/08/2026"
                    }));

                    result = {
                        success: true,
                        student: {
                            name: target.name,
                            phone: target.phone,
                            parentName: "Phụ huynh em " + target.name,
                            classLevel: target.classLevel,
                            subject: target.subject,
                            tuition: 2000000
                        },
                        logs: formattedLogs
                    };
                }

                // 3. DASHBOARD GIA SƯ TỔNG QUAN
                else if (functionName === 'getTutorDashboardData') {
                    let tutor = store.tutors[0];
                    result = {
                        tutorPhone: tutor.phone,
                        tutorName: tutor.name,
                        tutorPin: tutor.pin || "1234",
                        qrCode: "https://i.postimg.cc/66rKbPmb/trinh-duyet.png",
                        students: store.students.map(s => ({
                            phone: s.phone,
                            name: s.name,
                            parentName: "Phụ huynh em " + s.name,
                            tuition: 2000000,
                            maBaiTap: s.phone,
                            thongBao: "Em học tập rất chăm chỉ và tiến bộ."
                        })),
                        deletedStudents: [],
                        totalUnpaidIncome: 0,
                        classCount: store.students.length,
                        marqueeAnnouncement: "Chào mừng " + tutor.name + " đến với Bảng Quản Lý Gia Sư 4.0!"
                    };
                }

                // 4. DANH SÁCH Ý KIẾN PHẢN HỒI CỦA PHỤ HUYNH
                else if (functionName === 'getFeedbacks') {
                    result = [
                        {
                            studentName: "Lê Minh Thư",
                            parentPhone: "0987654321",
                            time: "16/08/2026 21:30",
                            content: "Gia đình rất cảm ơn Thầy Nam, cháu Thư tiến bộ môn Toán và Vật Lý rất nhiều sau khóa học ạ!"
                        },
                        {
                            studentName: "Nguyễn Hoàng Nam",
                            parentPhone: "0912345678",
                            time: "15/08/2026 19:45",
                            content: "Thầy giảng bài rất dễ hiểu và tận tâm, cháu Nam đã tự tin làm đề kiểm tra trên lớp."
                        },
                        {
                            studentName: "Phạm Hải Đăng",
                            parentPhone: "0905123456",
                            time: "14/08/2026 20:10",
                            content: "Cháu Đăng rất hào hứng với các bài mô phỏng Vật Lý 4K của Thầy."
                        }
                    ];
                }

                // 5. THỜI KHÓA BIỂU & LỊCH DẠY GIA SƯ
                else if (functionName === 'getTutorSchedule') {
                    result = [
                        {
                            rowIndex: 1,
                            studentName: "Lê Minh Thư",
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
                            studentName: "Nguyễn Hoàng Nam",
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
                            studentName: "Phạm Hải Đăng",
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
                }

                // 6. QUẢN LÝ BÀI TẬP ĐÃ GIAO CHO HỌC SINH
                else if (functionName === 'getAssignedHomework' || functionName === 'getTutorHomeworkList') {
                    result = store.homework.map(h => ({
                        hwId: h.id,
                        title: h.title,
                        deadline: h.deadline,
                        fileUrl: h.file,
                        classLevel: "Lớp 12",
                        assignedDate: "15/08/2026"
                    }));
                }

                // 7. QUẢN LÝ BÀI NỘP CỦA HỌC SINH
                else if (functionName === 'getSubmittedHomework' || functionName === 'getTutorSubmissions') {
                    result = [
                        {
                            subId: "SUB_01",
                            studentName: "Lê Minh Thư",
                            hwTitle: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                            submittedAt: "16/08/2026 21:15",
                            fileName: "leminhthu_dao_ham_done.pdf",
                            fileUrl: "leminhthu_dao_ham_done.pdf",
                            score: "9.5",
                            comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp. Chú ý thêm câu 48 có thể dùng phương pháp loại trừ nhanh hơn nhé.",
                            status: "Đã chấm"
                        },
                        {
                            subId: "SUB_02",
                            studentName: "Nguyễn Hoàng Nam",
                            hwTitle: "Chuyên đề: Hệ thức lượng trong tam giác",
                            submittedAt: "15/08/2026 22:00",
                            fileName: "nguyenhoangnam_he_thuc.jpg",
                            fileUrl: "nguyenhoangnam_he_thuc.jpg",
                            score: "9.0",
                            comment: "Làm bài tốt, nhớ vẽ hình bằng thước thẳng rõ nét.",
                            status: "Đã chấm"
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
                            status: "Hoạt động",
                            createdDate: "18/07/2026",
                            nextBillingDate: "18/09/2026",
                            lastActive: "Vừa xong",
                            accountType: "Gia sư (1-1)"
                        })),
                        students: store.students.map(s => ({
                            name: s.name,
                            parentName: "Phụ huynh em " + s.name,
                            phone: s.phone,
                            tutorPhone: "0123456789",
                            tuition: 2000000
                        })),
                        deletedTutors: [],
                        incomeReports: {},
                        marqueeAnnouncement: "Bảng Quản Trị Hệ Thống Trung Tâm Gia Sư 4.0"
                    };
                }

                // 9. XÁC THỰC MÃ BÀI TẬP (HOMEWORK GATEWAY)
                else if (functionName === 'xacThucMaBaiTap' || functionName === 'checkHomework') {
                    const code = String(args[0] || "").trim();
                    const norm = normalizePhone(code);
                    let target = store.students.find(s => normalizePhone(s.phone) === norm || s.name.toLowerCase().includes(code.toLowerCase()));
                    if (!target) target = store.students[1] || store.students[0];

                    result = {
                        timThay: true,
                        ma: target.phone,
                        studentName: target.name,
                        tenHocSinh: target.name,
                        maHocSinh: target.phone,
                        sdtGiaSu: "0123456789",
                        assignedList: store.homework.map(h => ({
                            title: h.title,
                            releaseDate: h.deadline,
                            fileUrl: h.file,
                            externalLink: ""
                        })),
                        filesList: [
                            {
                                rowIndex: 1,
                                title: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                                time: "16/08/2026 21:15",
                                fileName: "leminhthu_dao_ham_done.pdf",
                                status: "Đã chấm",
                                score: "9.5 / 10",
                                comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp. Chú ý thêm câu 48 có thể dùng phương pháp loại trừ nhanh hơn nhé.",
                                fileUrl: "leminhthu_dao_ham_done.pdf"
                            }
                        ],
                        danhSachBaiTap: store.homework.map(h => ({
                            id: h.id,
                            tieuDe: h.title,
                            hanNop: h.deadline,
                            fileGiao: h.file,
                            trangThai: h.status,
                            diem: h.score,
                            ngayNop: h.submittedAt,
                            nhanXet: h.comment
                        }))
                    };
                }

                // 10. NHẬT KÝ & GHI ĐIỂM
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

                // 11. CÁC TÁC VỤ THÊM / SỬA / XÓA GIẢ LẬP
                else if (functionName === 'saveEvaluation' || functionName === 'deleteEvaluation') {
                    result = { success: true, thongBao: "Cập nhật đánh giá buổi học thành công!" };
                }
                else if (functionName === 'saveScheduleToBackend') {
                    result = { success: true, thongBao: "Đã lưu lịch dạy thành công!" };
                }
                else if (functionName === 'updateAnnouncement') {
                    result = { success: true, thongBao: "Cập nhật thông báo học sinh thành công!" };
                }
                else if (functionName === 'updateStudentTuitionStatus') {
                    result = { success: true, thongBao: "Đã cập nhật trạng thái học phí thành công!" };
                }
                else if (functionName === 'guiPhanHoiPhuHuynh') {
                    result = { success: true, thongBao: "Cảm ơn Quý Phụ huynh đã gửi phản hồi! Gia sư đã nhận được tin nhắn." };
                }
                else if (functionName === 'submitHomework' || functionName === 'uploadHomework') {
                    result = { success: true, thongBao: "Nộp bài tập thành công! Gia sư sẽ chấm và phản hồi sớm nhất." };
                }

                // Default Fallback
                else {
                    result = { success: true, thongBao: "Thực hiện tác vụ thành công!" };
                }

            } catch (err) {
                console.error("API Mock Error:", err);
                result = { error: "Lỗi xử lý: " + err.message };
            }

            if (result && result.error && self._failureHandler) {
                self._failureHandler(result.error);
            } else if (self._successHandler) {
                self._successHandler(result);
            }
            return result;
        }
    }

    // Gán Mock API vào window.google.script.run
    window.google = {
        script: {
            get run() {
                return new MockGoogleScriptRunInstance();
            }
        }
    };

})();
