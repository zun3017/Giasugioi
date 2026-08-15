/**
 * DỮ LIỆU DEMO CLIENT-SIDE HOÀN CHỈNH CHO HỆ THỐNG GIA SƯ 1-1
 * Thư mục: Gia sư - demo
 */
const INITIAL_GIASU_DEMO_DATA = {
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

    // 2. Danh sách Học sinh
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
            absentSessions: 0,
            hwRate: "100%",
            fee: "2.000.000đ",
            feeStatus: "Đã đóng",
            logs: [
                { tuan: 10, ngay: "15/08/2026", topic: "Hệ thức lượng trong tam giác vuông", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.0", diemDK: "9.0", nhanXet: "Làm bài rất tốt, nắm chắc các hệ thức và tỉ số lượng giác." },
                { tuan: 9, ngay: "12/08/2026", topic: "Tỉ số lượng giác của góc nhọn", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.5", diemDK: "9.0", nhanXet: "Hiểu bài nhanh, giải quyết tốt các bài toán thực tế." },
                { tuan: 8, ngay: "08/08/2026", topic: "Căn bậc hai & Hằng đẳng thức", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.0", diemDK: "8.5", nhanXet: "Nắm vững lý thuyết rút gọn biểu thức chứa căn." }
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
            fee: "2.000.000đ",
            feeStatus: "Đã đóng",
            logs: [
                { tuan: 10, ngay: "15/08/2026", topic: "Cực trị Hàm số & Tích phân ứng dụng", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.0", diemDK: "9.5", nhanXet: "Tư duy giải toán nhanh, làm tốt các câu phân loại 8.5+." },
                { tuan: 9, ngay: "12/08/2026", topic: "Giao thoa sóng & Sóng dừng trên dây", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.5", diemDK: "9.0", nhanXet: "Nắm vững bản chất hiện tượng giao thoa 2 nguồn cùng pha." },
                { tuan: 8, ngay: "08/08/2026", topic: "Đại cương Dao động cơ & Con lắc lò xo", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "8.0", diemDK: "8.5", nhanXet: "Chăm chỉ, hoàn thành đầy đủ bài tập về nhà." }
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
            fee: "2.000.000đ",
            feeStatus: "Đã đóng",
            logs: [
                { tuan: 10, ngay: "15/08/2026", topic: "Điện tích & Định luật Cu-lông", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.5", diemDK: "9.0", nhanXet: "Rất xuất sắc, giải đề nhanh và đúng phương pháp." },
                { tuan: 9, ngay: "12/08/2026", topic: "Thuyết electron & Định luật bảo toàn điện tích", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.0", diemDK: "9.5", nhanXet: "Ý thức học tập tốt, chủ động hỏi bài tập khó." },
                { tuan: 8, ngay: "08/08/2026", topic: "Điện trường & Cường độ điện trường", chuyenCan: "Có mặt", btvn: "Đạt", diemDG: "9.0", diemDK: "9.0", nhanXet: "Hiểu bản chất hiện tượng vật lý rất tốt." }
            ]
        }
    ],

    // 3. Bài tập về nhà
    homework: [
        {
            id: "HW_01",
            title: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
            deadline: "20/08/2026",
            file: "de_on_tap_dao_ham.pdf",
            status: "Đã nộp",
            score: "9.5",
            submittedAt: "16/08/2026 21:15",
            comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp. Chú ý thêm câu 48 có thể dùng phương pháp loại trừ nhanh hơn nhé."
        },
        {
            id: "HW_02",
            title: "Chuyên đề: Giao thoa sóng cơ học nâng cao (40 câu)",
            deadline: "22/08/2026",
            file: "giao_thoa_song_co.pdf",
            status: "Chưa nộp",
            score: "-",
            submittedAt: "-",
            comment: "Yêu cầu làm ra giấy và chụp ảnh nộp bài trước 22/08."
        }
    ],

    // 4. Lịch dạy tuần
    schedules: [
        { day: "Thứ 2 (15/08)", time: "18:00 - 19:30", student: "Lê Minh Thư", subject: "Toán 12", topic: "Đạo hàm & Cực trị", status: "Đã dạy" },
        { day: "Thứ 4 (17/08)", time: "19:30 - 21:00", student: "Nguyễn Hoàng Nam", subject: "Toán 9", topic: "Hệ thức lượng trong tam giác", status: "Đã dạy" },
        { day: "Thứ 6 (19/08)", time: "18:00 - 19:30", student: "Phạm Hải Đăng", subject: "Vật Lý 11", topic: "Điện tích & Cu-lông", status: "Sắp tới" },
        { day: "Chủ Nhật (21/08)", time: "08:30 - 10:00", student: "Lê Minh Thư", subject: "Vật Lý 12", topic: "Giao thoa sóng cơ", status: "Sắp tới" }
    ]
};

// Quản lý sessionStorage cho phiên demo Gia Sư
function getGiaSuDemoStore() {
    var key = "DEMO_GIASU_DATA_V1";
    var data = sessionStorage.getItem(key);
    if (!data) {
        sessionStorage.setItem(key, JSON.stringify(INITIAL_GIASU_DEMO_DATA));
        return INITIAL_GIASU_DEMO_DATA;
    }
    try {
        return JSON.parse(data);
    } catch(e) {
        return INITIAL_GIASU_DEMO_DATA;
    }
}
