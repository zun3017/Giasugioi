/**
 * DỮ LIỆU DEMO CLIENT-SIDE HOÀN CHỈNH CHO HỆ THỐNG GIA SƯ 1-1
 * Thư mục: Gia sư - demo
 */

// Helper sinh ngày động theo ngày thực tế hiện tại
function getGiaSuDemoDate(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - daysAgo);
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    var year = d.getFullYear();
    return day + "/" + month + "/" + year;
}

function getGiaSuDemoShortDate(daysAgo) {
    var d = new Date();
    d.setDate(d.getDate() - daysAgo);
    var day = String(d.getDate()).padStart(2, '0');
    var month = String(d.getMonth() + 1).padStart(2, '0');
    return day + "/" + month;
}

function generateInitialGiaSuDemoData() {
    return {
        // 1. Danh sách Gia sư
        tutors: [
            {
                phone: "0123456789",
                pin: "1234",
                name: "Thầy Trần Hoàng Nam",
                subject: "Toán & Vật Lý",
                avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80",
                totalStudents: 3,
                totalEarnings: 6000000,
                activeClasses: ["Toán 9 Ôn Vào 10", "Toán 12 & Vật Lý 12", "Vật Lý 11 Nâng Cao"]
            }
        ],

        // 2. Danh sách Học sinh & Lịch sử học tập
        students: [
            {
                phone: "0912345678",
                name: "Nguyễn Hoàng Nam",
                classLevel: "Lớp 9",
                subject: "Toán",
                tutorName: "Thầy Trần Hoàng Nam",
                tutorPhone: "0123456789",
                gpa: "8.6",
                totalSessions: 10,
                absentSessions: 1,
                hwRate: "90%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                billing_type: "session",
                feeStatus: "Đã đóng",
                logs: [
                    { tuan: 10, ngay: getGiaSuDemoDate(2), topic: "Hệ thức lượng trong tam giác vuông", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Làm bài rất tốt, nắm chắc các hệ thức và tỉ số lượng giác." },
                    { tuan: 9, ngay: getGiaSuDemoDate(5), topic: "Tỉ số lượng giác của góc nhọn", chuyenCan: "Có mặt", btvn: "Thiếu 1 bài", diemDG: "8.5", diemDK: "9.0", nhanXet: "Hiểu bài nhanh, cần làm đủ phần bài tập nâng cao." },
                    { tuan: 8, ngay: getGiaSuDemoDate(9), topic: "Căn bậc hai & Hằng đẳng thức", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.0", diemDK: "8.5", nhanXet: "Nắm vững lý thuyết rút gọn biểu thức chứa căn." },
                    { tuan: 7, ngay: getGiaSuDemoDate(14), topic: "Ôn tập Đại số đầu năm", chuyenCan: "Vắng", btvn: "Không làm", diemDG: "Không có", diemDK: "Không có", nhanXet: "Báo nghỉ có phép do bận việc gia đình." }
                ]
            },
            {
                phone: "0987654321",
                name: "Lê Minh Thư",
                classLevel: "Lớp 12",
                subject: "Toán & Vật Lý",
                tutorName: "Thầy Trần Hoàng Nam",
                tutorPhone: "0123456789",
                gpa: "8.9",
                totalSessions: 10,
                absentSessions: 0,
                hwRate: "100%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                billing_type: "session",
                feeStatus: "Đã đóng",
                logs: [
                    { tuan: 10, ngay: getGiaSuDemoDate(1), topic: "Cực trị Hàm số & Tích phân ứng dụng", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.5", nhanXet: "Tư duy giải toán nhanh, làm tốt các câu phân loại 8.5+." },
                    { tuan: 9, ngay: getGiaSuDemoDate(4), topic: "Giao thoa sóng & Sóng dừng trên dây", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.5", diemDK: "9.0", nhanXet: "Nắm vững bản chất hiện tượng giao thoa 2 nguồn cùng pha." },
                    { tuan: 8, ngay: getGiaSuDemoDate(8), topic: "Đại cương Dao động cơ & Con lắc lò xo", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.0", diemDK: "8.5", nhanXet: "Chăm chỉ, hoàn thành đầy đủ bài tập về nhà." }
                ]
            },
            {
                phone: "0905123456",
                name: "Phạm Hải Đăng",
                classLevel: "Lớp 11",
                subject: "Vật Lý",
                tutorName: "Thầy Trần Hoàng Nam",
                tutorPhone: "0123456789",
                gpa: "9.2",
                totalSessions: 10,
                absentSessions: 0,
                hwRate: "100%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                billing_type: "session",
                feeStatus: "Đã đóng",
                logs: [
                    { tuan: 10, ngay: getGiaSuDemoDate(2), topic: "Điện tích & Định luật Cu-lông", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.5", diemDK: "9.0", nhanXet: "Rất xuất sắc, giải đề nhanh và đúng phương pháp." },
                    { tuan: 9, ngay: getGiaSuDemoDate(6), topic: "Thuyết electron & Định luật bảo toàn điện tích", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.0", diemDK: "9.5", nhanXet: "Ý thức học tập tốt, chủ động hỏi bài tập khó." },
                    { tuan: 8, ngay: getGiaSuDemoDate(10), topic: "Điện trường & Cường độ điện trường", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Hiểu bản chất hiện tượng vật lý rất tốt." }
                ]
            }
        ],

        // 3. Bài tập về nhà
        homework: [
            {
                id: "HW_01",
                title: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                deadline: getGiaSuDemoDate(-3),
                file: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                status: "Đã nộp",
                score: "9.5",
                submittedAt: getGiaSuDemoDate(1) + " 21:15",
                comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp. Chú ý thêm câu 48 có thể dùng phương pháp loại trừ nhanh hơn nhé."
            },
            {
                id: "HW_02",
                title: "Chuyên đề: Giao thoa sóng cơ học nâng cao (40 câu)",
                deadline: getGiaSuDemoDate(-5),
                file: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                status: "Chưa nộp",
                score: "-",
                submittedAt: "-",
                comment: "Yêu cầu làm ra giấy và chụp ảnh nộp bài trước hạn."
            }
        ],

        // 4. Bài nộp của học sinh (Submissions)
        submissions: [
            {
                subId: "SUB_01",
                rowIndex: 1,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                timestamp: getGiaSuDemoDate(1) + " 21:15:30",
                submissionDate: getGiaSuDemoDate(1),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "leminhthu_dao_ham_done.pdf",
                score: "9.5",
                comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp. Chú ý thêm câu 48 có thể dùng phương pháp loại trừ nhanh hơn nhé.",
                status: "Active"
            },
            {
                subId: "SUB_02",
                rowIndex: 2,
                studentName: "Nguyễn Hoàng Nam",
                studentPhone: "0912345678",
                lessonName: "Chuyên đề: Hệ thức lượng trong tam giác",
                timestamp: getGiaSuDemoDate(2) + " 22:00:15",
                submissionDate: getGiaSuDemoDate(2),
                fileUrl: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&auto=format&fit=crop",
                fileName: "nguyenhoangnam_he_thuc.jpg",
                score: "9.0",
                comment: "Làm bài tốt, nhớ vẽ hình bằng thước thẳng rõ nét.",
                status: "Active"
            },
            {
                subId: "SUB_03",
                rowIndex: 3,
                studentName: "Phạm Hải Đăng",
                studentPhone: "0905123456",
                lessonName: "Bài tập 03: Khúc xạ ánh sáng & Lăng kính",
                timestamp: getGiaSuDemoDate(0) + " 19:30:00",
                submissionDate: getGiaSuDemoDate(0),
                fileUrl: "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=1200&auto=format&fit=crop",
                fileName: "phamhaidang_vatly.jpg",
                score: "",
                comment: "",
                status: "Active"
            }
        ],

        // 5. Lịch dạy tuần
        schedules: [
            { day: "Thứ 2 (" + getGiaSuDemoShortDate(2) + ")", time: "18:00 - 19:30", student: "Lê Minh Thư", subject: "Toán 12", topic: "Đạo hàm & Cực trị", status: "Đã dạy" },
            { day: "Thứ 4 (" + getGiaSuDemoShortDate(0) + ")", time: "19:30 - 21:00", student: "Nguyễn Hoàng Nam", subject: "Toán 9", topic: "Hệ thức lượng trong tam giác", status: "Đã dạy" },
            { day: "Thứ 6 (" + getGiaSuDemoShortDate(-2) + ")", time: "18:00 - 19:30", student: "Phạm Hải Đăng", subject: "Vật Lý 11", topic: "Điện tích & Cu-lông", status: "Sắp tới" },
            { day: "Chủ Nhật (" + getGiaSuDemoShortDate(-4) + ")", time: "08:30 - 10:00", student: "Lê Minh Thư", subject: "Vật Lý 12", topic: "Giao thoa sóng cơ", status: "Sắp tới" }
        ]
    };
}

const INITIAL_GIASU_DEMO_DATA = generateInitialGiaSuDemoData();

// Quản lý sessionStorage cho phiên demo Gia Sư
function getGiaSuDemoStore() {
    var key = "DEMO_GIASU_DATA_V5";
    var data = sessionStorage.getItem(key);
    if (!data) {
        var freshData = generateInitialGiaSuDemoData();
        sessionStorage.setItem(key, JSON.stringify(freshData));
        return freshData;
    }
    try {
        return JSON.parse(data);
    } catch(e) {
        var defaultData = generateInitialGiaSuDemoData();
        return defaultData;
    }
}
