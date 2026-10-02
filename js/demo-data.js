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
                qrCode: "https://i.postimg.cc/66rKbPmb/trinh-duyet.png",
                totalStudents: 3,
                totalEarnings: 6000000,
                activeClasses: ["Toán 9 Ôn Vào 10", "Toán 12 & Vật Lý 12", "Vật Lý 11 Nâng Cao"]
            }
        ],

        // 2. Danh sách Học sinh & Lịch sử học tập
        students: [
            {
                phone: "0912345678",
                maBaiTap: "0912345678",
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
                    { tuan: 9, ngay: getGiaSuDemoDate(5), topic: "Tỉ số lượng giác của góc nhọn", chuyenCan: "Có mặt", btvn: "Hoàn thành 90%", diemDG: "8.5", diemDK: "9.0", nhanXet: "Hiểu bài nhanh, cần làm đủ phần bài tập nâng cao." },
                    { tuan: 8, ngay: getGiaSuDemoDate(9), topic: "Căn bậc hai & Hằng đẳng thức", chuyenCan: "Có mặt", btvn: "Hoàn thành 75%", diemDG: "8.0", diemDK: "8.5", nhanXet: "Nắm vững lý thuyết rút gọn biểu thức chứa căn." },
                    { tuan: 7, ngay: getGiaSuDemoDate(14), topic: "Ôn tập Đại số đầu năm", chuyenCan: "Vắng", btvn: "Không làm", diemDG: "Không có", diemDK: "Không có", nhanXet: "Báo nghỉ có phép do bận việc gia đình." }
                ]
            },
            {
                phone: "0987654321",
                maBaiTap: "0987654321",
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
                    { tuan: 9, ngay: getGiaSuDemoDate(4), topic: "Giao thoa sóng & Sóng dừng trên dây", chuyenCan: "Có mặt", btvn: "Hoàn thành 90%", diemDG: "8.5", diemDK: "9.0", nhanXet: "Nắm vững bản chất hiện tượng giao thoa 2 nguồn cùng pha." },
                    { tuan: 8, ngay: getGiaSuDemoDate(8), topic: "Đại cương Dao động cơ & Con lắc lò xo", chuyenCan: "Có mặt", btvn: "Hoàn thành 60%", diemDG: "8.0", diemDK: "8.5", nhanXet: "Chăm chỉ, hoàn thành bài tập về nhà ở mức khá." }
                ]
            },
            {
                phone: "0905123456",
                maBaiTap: "0905123456",
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
                lessonName: "Phiếu 05: Đề thi thử Tốt nghiệp THPT 2026 - Môn Toán (Lần 1)",
                timestamp: getGiaSuDemoDate(0) + " 21:30:00",
                submissionDate: getGiaSuDemoDate(0),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "leminhthu_de_thi_thu_toan.pdf",
                score: "9.5",
                comment: "Bài làm rất xuất sắc, câu 48 và 50 tư duy cực kỳ nhanh nhạy. Phát huy tốt nhé em!",
                status: "Active"
            },
            {
                subId: "SUB_02",
                rowIndex: 2,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Chuyên đề: Ứng dụng tích phân tính diện tích hình phẳng",
                timestamp: getGiaSuDemoDate(1) + " 20:15:00",
                submissionDate: getGiaSuDemoDate(1),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "leminhthu_tich_phan.pdf",
                score: "9.0",
                comment: "Trình bày rõ ràng, vẽ hình chuẩn xác.",
                status: "Active"
            },
            {
                subId: "SUB_03",
                rowIndex: 3,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Khảo sát sự biến thiên và vẽ đồ thị hàm số bậc 3",
                timestamp: getGiaSuDemoDate(2) + " 22:10:00",
                submissionDate: getGiaSuDemoDate(2),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "khao_sat_do_thi_bac3.pdf",
                score: "8.5",
                comment: "Chú ý bảng biến thiên cần điền đầy đủ giới hạn vô cùng.",
                status: "Active"
            },
            {
                subId: "SUB_04",
                rowIndex: 4,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Phiếu 02: Phương trình & Bất phương trình mũ - logarit",
                timestamp: getGiaSuDemoDate(3) + " 19:45:00",
                submissionDate: getGiaSuDemoDate(3),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "mu_logarit_nang_cao.pdf",
                score: "9.0",
                comment: "Tốt lắm, đã nắm vững điều kiện xác định của logarit.",
                status: "Active"
            },
            {
                subId: "SUB_05",
                rowIndex: 5,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Thales",
                timestamp: "2026-08-07 11:00:55",
                submissionDate: "07/08/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "dinh_ly_thales.pdf",
                score: "",
                comment: "",
                status: "Active"
            },
            {
                subId: "SUB_06",
                rowIndex: 6,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Bài tập 06: Hình học không gian Oxyz và khoảng cách",
                timestamp: "2026-08-05 18:20:00",
                submissionDate: "05/08/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "hinh_oxyz_khoang_cach.pdf",
                score: "8.5",
                comment: "Áp dụng công thức khoảng cách chính xác.",
                status: "Active"
            },
            {
                subId: "SUB_07",
                rowIndex: 7,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                timestamp: "2026-08-03 21:15:30",
                submissionDate: "03/08/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "leminhthu_dao_ham_done.pdf",
                score: "9.5",
                comment: "Bài giải rất chuẩn xác, trình bày sạch đẹp.",
                status: "Active"
            },
            {
                subId: "SUB_08",
                rowIndex: 8,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Bài tập: Cực trị của hàm số chứa dấu giá trị tuyệt đối",
                timestamp: "2026-08-01 20:00:00",
                submissionDate: "01/08/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "cuc_tri_tri_tuyet_doi.pdf",
                score: "9.0",
                comment: "Phương pháp ghép trục giải quyết bài toán rất nhanh.",
                status: "Active"
            },
            {
                subId: "SUB_09",
                rowIndex: 9,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Chuyên đề: Định lý Sin, Cosin và công thức diện tích tam giác",
                timestamp: "2026-07-28 19:30:00",
                submissionDate: "28/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "dinh_ly_sin_cosin.pdf",
                score: "8.0",
                comment: "Cần chú ý góc tù trong tam giác khi tính cosin.",
                status: "Active"
            },
            {
                subId: "SUB_10",
                rowIndex: 10,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Phiếu ôn tập: Cấp số cộng và cấp số nhân nâng cao",
                timestamp: "2026-07-25 21:10:00",
                submissionDate: "25/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "cap_so_cong_nhan.pdf",
                score: "9.0",
                comment: "Làm bài tốt, các bài toán thực tế giải quyết gọn gàng.",
                status: "Active"
            },
            {
                subId: "SUB_11",
                rowIndex: 11,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Bài tập: Lượng giác và phương trình lượng giác cơ bản",
                timestamp: "2026-07-20 18:45:00",
                submissionDate: "20/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "phuong_trinh_luong_giac.pdf",
                score: "8.5",
                comment: "Nhớ ghi đủ họ nghiệm đuôi k2pi hoặc kpi.",
                status: "Active"
            },
            {
                subId: "SUB_12",
                rowIndex: 12,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Phiếu kiểm tra định kỳ tháng 7 môn Toán 12",
                timestamp: "2026-07-15 20:30:00",
                submissionDate: "15/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "kiem_tra_dinh_ky_t7.pdf",
                score: "9.0",
                comment: "Điểm số phản ánh đúng năng lực học tập chăm chỉ.",
                status: "Active"
            },
            {
                subId: "SUB_13",
                rowIndex: 13,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Chuyên đề: Nhị thức Newton và bài toán xác suất cổ điển",
                timestamp: "2026-07-10 19:15:00",
                submissionDate: "10/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "xac_suat_newton.pdf",
                score: "8.0",
                comment: "Phân biệt kỹ bài toán chọn có thứ tự và không thứ tự.",
                status: "Active"
            },
            {
                subId: "SUB_14",
                rowIndex: 14,
                studentName: "Lê Minh Thư",
                studentPhone: "0987654321",
                lessonName: "Bài tập mở đầu: Khái niệm hàm số và tập xác định",
                timestamp: "2026-07-05 17:00:00",
                submissionDate: "05/07/2026",
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "tap_xac_dinh_ham_so.pdf",
                score: "9.5",
                comment: "Khởi đầu rất tốt, chữ viết và trình bày sạch đẹp.",
                status: "Active"
            },
            {
                subId: "SUB_15",
                rowIndex: 15,
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
                subId: "SUB_16",
                rowIndex: 16,
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
        ],

        // 6. Bài tập đã giao cho từng học sinh (Assigned Homework của Gia sư)
        assignedHomework: [
            {
                rowIndex: 1,
                hwId: "HW_DEMO_01",
                studentName: "Lê Minh Thư",
                tutorPhone: "0123456789",
                homework_code: "0987654321",
                title: "Phiếu 01: 50 Câu Trắc Nghiệm Đạo Hàm & Cực Trị",
                releaseDate: getGiaSuDemoDate(5),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "leminhthu_phieu01_daoham.pdf",
                externalLink: "",
                status: "Active",
                deleted_date: null
            },
            {
                rowIndex: 2,
                hwId: "HW_DEMO_02",
                studentName: "Lê Minh Thư",
                tutorPhone: "0123456789",
                homework_code: "0987654321",
                title: "Chuyên đề: Giao thoa sóng cơ học nâng cao (40 câu)",
                releaseDate: getGiaSuDemoDate(2),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "giao_thoa_song_nang_cao.pdf",
                externalLink: "https://forms.gle/demo-link-nop-bai",
                status: "Active",
                deleted_date: null
            },
            {
                rowIndex: 3,
                hwId: "HW_DEMO_03",
                studentName: "Nguyễn Hoàng Nam",
                tutorPhone: "0123456789",
                homework_code: "0912345678",
                title: "Chuyên đề: Hệ thức lượng trong tam giác vuông",
                releaseDate: getGiaSuDemoDate(4),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "he_thuc_luong.pdf",
                externalLink: "",
                status: "Active",
                deleted_date: null
            },
            {
                rowIndex: 4,
                hwId: "HW_DEMO_04",
                studentName: "Phạm Hải Đăng",
                tutorPhone: "0123456789",
                homework_code: "0905123456",
                title: "Bài tập 03: Khúc xạ ánh sáng & Lăng kính",
                releaseDate: getGiaSuDemoDate(3),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "khuc_xa_anh_sang.pdf",
                externalLink: "",
                status: "Active",
                deleted_date: null
            },
            {
                rowIndex: 5,
                hwId: "HW_DEMO_05",
                studentName: "Lê Minh Thư",
                tutorPhone: "0123456789",
                homework_code: "0987654321",
                title: "Đề ôn tập Khảo sát hàm số (Đã xóa vào thùng rác)",
                releaseDate: getGiaSuDemoDate(10),
                fileUrl: "https://drive.google.com/file/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/preview",
                fileName: "de_on_tap_cu.pdf",
                externalLink: "",
                status: "Trash",
                deleted_date: getGiaSuDemoDate(1)
            }
        ]
    };
}

const INITIAL_GIASU_DEMO_DATA = generateInitialGiaSuDemoData();

// Quản lý sessionStorage cho phiên demo Gia Sư
function getGiaSuDemoStore() {
    var key = "DEMO_GIASU_DATA_V6";
    var data = sessionStorage.getItem(key);
    if (!data) {
        var oldV5 = sessionStorage.getItem("DEMO_GIASU_DATA_V5");
        if (oldV5) {
            try {
                var parsedOld = JSON.parse(oldV5);
                var fresh = generateInitialGiaSuDemoData();
                parsedOld.assignedHomework = parsedOld.assignedHomework || fresh.assignedHomework;
                sessionStorage.setItem(key, JSON.stringify(parsedOld));
                return parsedOld;
            } catch(e) {}
        }
        var freshData = generateInitialGiaSuDemoData();
        sessionStorage.setItem(key, JSON.stringify(freshData));
        return freshData;
    }
    try {
        var parsed = JSON.parse(data);
        if (!parsed.assignedHomework || !Array.isArray(parsed.assignedHomework) || parsed.assignedHomework.length === 0) {
            var freshData2 = generateInitialGiaSuDemoData();
            parsed.assignedHomework = freshData2.assignedHomework;
            sessionStorage.setItem(key, JSON.stringify(parsed));
        }
        if (!parsed.submissions || !Array.isArray(parsed.submissions) || parsed.submissions.length < 5) {
            var freshData3 = generateInitialGiaSuDemoData();
            parsed.submissions = freshData3.submissions;
            sessionStorage.setItem(key, JSON.stringify(parsed));
        }
        return parsed;
    } catch(e) {
        var defaultData = generateInitialGiaSuDemoData();
        return defaultData;
    }
}
