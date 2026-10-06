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
                subject: "Toán, Lý, Ielts",
                avatar: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=500&auto=format&fit=crop&q=80",
                qrCode: "https://i.postimg.cc/66rKbPmb/trinh-duyet.png",
                totalStudents: 3,
                totalEarnings: 6000000,
                activeClasses: ["Toán 9 Ôn Vào 10", "Lý 12 Ôn Thi THPT", "Ielts 6.5+ Cấp Tốc"]
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
                parentName: "Bác Nam",
                gpa: "8.8",
                totalSessions: 10,
                absentSessions: 0,
                hwRate: "95%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                tuition_fee: 200000,
                billing_type: "session",
                billingType: "session",
                feeStatus: "Chưa đóng",
                thongBao: "Bài tập tuần này đã giao trên hệ thống.",
                logs: (typeof getDemoStudentLogs === 'function') ? getDemoStudentLogs('0912345678') : [
                    { tuan: 10, ngay: "04/10/2026", topic: "Hệ thức lượng trong tam giác vuông nâng cao", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.5", nhanXet: "Làm bài rất tốt, tư duy hình học không gian và tam giác vuông rất nhanh nhẹn.", tienDong: "Chưa đóng" },
                    { tuan: 9, ngay: "01/10/2026", topic: "Tỉ số lượng giác góc nhọn và bảng lượng giác", chuyenCan: "Có mặt", btvn: "Hoàn thành 100%", diemDG: "8.5", diemDK: "9.0", nhanXet: "Nắm chắc lý thuyết sin, cos, tan, cotan. Cần chú ý cách bấm máy tính Casio chính xác.", tienDong: "Chưa đóng" },
                    { tuan: 8, ngay: "27/09/2026", topic: "Rút gọn biểu thức chứa căn bậc hai (Dạng thi vào 10)", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "8.5", nhanXet: "Kỹ năng biến đổi đại số vững, không bị nhầm dấu ở các bước phân tích nhân tử.", tienDong: "Chưa đóng" },
                    { tuan: 7, ngay: "23/09/2026", topic: "Liên hệ giữa phép nhân, phép chia và phép khai phương", chuyenCan: "Có mặt", btvn: "Hoàn thành 90%", diemDG: "8.0", diemDK: "8.5", nhanXet: "Hiểu bài nhanh, hoàn thành đủ phần bài tập nâng cao.", tienDong: "Đã đóng", ngayDongTien: "24/09/2026" },
                    { tuan: 6, ngay: "20/09/2026", topic: "Căn bậc hai và hằng đẳng thức căn(A^2) = |A|", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "9.0", nhanXet: "Làm tốt bài tập đặt điều kiện xác định và phá dấu giá trị tuyệt đối.", tienDong: "Đã đóng", ngayDongTien: "24/09/2026" },
                    { tuan: 5, ngay: "16/09/2026", topic: "Luyện đề khảo sát chất lượng đầu năm môn Toán 9", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "8.8", nhanXet: "Bài làm điểm cao, phần hình học làm trọn vẹn 3 ý đầu.", tienDong: "Đã đóng", ngayDongTien: "24/09/2026" },
                    { tuan: 4, ngay: "13/09/2026", topic: "Ôn tập Phương trình bậc nhất một ẩn & Bất phương trình", chuyenCan: "Có mặt", btvn: "Hoàn thành 80%", diemDG: "8.0", diemDK: "8.0", nhanXet: "Nắm vững quy tắc chuyển vế đổi dấu, bài tập cơ bản làm rất tốt.", tienDong: "Đã đóng", ngayDongTien: "14/09/2026" },
                    { tuan: 3, ngay: "09/09/2026", topic: "Hình học: Định lý Talet và Tam giác đồng dạng", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "8.5", nhanXet: "Nhớ tốt các trường hợp đồng dạng của tam giác, trình bày lời giải rõ ràng.", tienDong: "Đã đóng", ngayDongTien: "14/09/2026" },
                    { tuan: 2, ngay: "06/09/2026", topic: "Phân tích đa thức thành nhân tử & Bất đẳng thức Cô-si", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "8.5", nhanXet: "Biết áp dụng BĐT Cô-si cho 2 số dương tìm GTNN, GTLN cơ bản.", tienDong: "Đã đóng", ngayDongTien: "14/09/2026" },
                    { tuan: 1, ngay: "02/09/2026", topic: "Khảo sát năng lực đầu vào & Lập lộ trình ôn thi vào 10", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.0", diemDK: "8.5", nhanXet: "Nền tảng kiến thức lớp 8 tốt, tiếp thu nhanh, thái độ học tập tích cực.", tienDong: "Đã đóng", ngayDongTien: "14/09/2026" }
                ]
            },
            {
                phone: "0987654321",
                maBaiTap: "0987654321",
                name: "Lê Minh Thư",
                classLevel: "Lớp 12",
                subject: "Lý",
                tutorName: "Thầy Trần Hoàng Nam",
                tutorPhone: "0123456789",
                parentName: "Cô Thư",
                gpa: "9.2",
                totalSessions: 10,
                absentSessions: 0,
                hwRate: "100%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                tuition_fee: 200000,
                billing_type: "session",
                billingType: "session",
                feeStatus: "Chưa đóng",
                thongBao: "Nhớ nộp bài phiếu 05 trước thứ Năm.",
                logs: (typeof getDemoStudentLogs === 'function') ? getDemoStudentLogs('0987654321') : [
                    { tuan: 10, ngay: "04/10/2026", topic: "Cực trị hàm số chứa dấu giá trị tuyệt đối (Vận dụng cao 9+)", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.5", diemDK: "9.5", nhanXet: "Tư duy giải toán cực nhanh, giải quyết tốt các bài toán tương giao đồ thị phức tạp.", tienDong: "Chưa đóng" },
                    { tuan: 9, ngay: "01/10/2026", topic: "Giao thoa sóng cơ học: Tìm số điểm cực đại, cực tiểu", chuyenCan: "Có mặt", btvn: "Hoàn thành 100%", diemDG: "9.0", diemDK: "9.5", nhanXet: "Nắm bản chất hình học của hypebol cực đại cực tiểu rất xuất sắc.", tienDong: "Chưa đóng" },
                    { tuan: 8, ngay: "27/09/2026", topic: "Khảo sát sự biến thiên và Đồ thị hàm hợp f(u(x))", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Phương pháp ghép trục và sơ đồ V được áp dụng rất thuần thục.", tienDong: "Chưa đóng" },
                    { tuan: 7, ngay: "24/09/2026", topic: "Sóng dừng: Điều kiện 2 đầu cố định & 1 đầu tự do", chuyenCan: "Có mặt", btvn: "Hoàn thành 90%", diemDG: "8.5", diemDK: "9.0", nhanXet: "Hiểu sâu về bụng sóng, nút sóng và độ lệch pha giữa các phần tử môi trường.", tienDong: "Đã đóng", ngayDongTien: "25/09/2026" },
                    { tuan: 6, ngay: "20/09/2026", topic: "Tiệm cận đứng, tiệm cận ngang của đồ thị hàm phân thức", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.5", nhanXet: "Làm bài cẩn thận, không bị bẫy ở các bài toán tìm m để hàm số có đúng k tiệm cận.", tienDong: "Đã đóng", ngayDongTien: "25/09/2026" },
                    { tuan: 5, ngay: "17/09/2026", topic: "Con lắc đơn & Sự phụ thuộc chu kỳ vào nhiệt độ, độ cao", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "8.5", nhanXet: "Bài làm chỉn chu, đã khắc phục được lỗi nhầm lẫn đơn vị ở công thức gia tốc g.", tienDong: "Đã đóng", ngayDongTien: "25/09/2026" },
                    { tuan: 4, ngay: "13/09/2026", topic: "Giá trị lớn nhất, nhỏ nhất của hàm số trên đoạn [a; b]", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Tốc độ tính đạo hàm và lập bảng biến thiên rất nhanh.", tienDong: "Đã đóng", ngayDongTien: "15/09/2026" },
                    { tuan: 3, ngay: "10/09/2026", topic: "Con lắc lò xo: Lực đàn hồi, Lực phục hồi và Đồ thị năng lượng", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "8.8", nhanXet: "Phân biệt rạch ròi giữa lực hồi phục và lực đàn hồi. Kỹ năng đọc đồ thị rất tốt.", tienDong: "Đã đóng", ngayDongTien: "15/09/2026" },
                    { tuan: 2, ngay: "06/09/2026", topic: "Tính đơn điệu của hàm số: Tìm tham số m để hàm đơn điệu", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "9.0", nhanXet: "Làm tốt bài toán cô lập m và bài toán tam thức bậc hai.", tienDong: "Đã đóng", ngayDongTien: "15/09/2026" },
                    { tuan: 1, ngay: "03/09/2026", topic: "Đại cương Dao động điều hòa: Li độ, Vận tốc, Gia tốc và Vòng tròn lượng giác", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Khởi động năm học mới rất hứng khởi, kỹ năng quét trục thời gian vòng tròn lượng giác tốt.", tienDong: "Đã đóng", ngayDongTien: "15/09/2026" }
                ]
            },
            {
                phone: "0905123456",
                maBaiTap: "0905123456",
                name: "Phạm Hải Đăng",
                classLevel: "Lớp 11",
                subject: "Ielts",
                tutorName: "Thầy Trần Hoàng Nam",
                tutorPhone: "0123456789",
                parentName: "Chú Đăng",
                gpa: "9.2",
                totalSessions: 9,
                absentSessions: 0,
                hwRate: "100%",
                fee: "200.000đ/buổi",
                tuition: 200000,
                tuition_fee: 200000,
                billing_type: "session",
                billingType: "session",
                feeStatus: "Chưa đóng",
                thongBao: "Điểm kiểm tra định kỳ 9.5 rất tốt.",
                logs: (typeof getDemoStudentLogs === 'function') ? getDemoStudentLogs('0905123456') : [
                    { tuan: 9, ngay: "04/10/2026", topic: "Tụ điện & Ghép bộ tụ điện song song, nối tiếp nâng cao", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.5", diemDK: "9.5", nhanXet: "Giải đề chuyên nhanh và chuẩn xác. Tính toán điện dung bộ tụ rất thông minh.", tienDong: "Chưa đóng" },
                    { tuan: 8, ngay: "02/10/2026", topic: "Điện thế, Hiệu điện thế & Công của lực điện trường", chuyenCan: "Có mặt", btvn: "Hoàn thành 100%", diemDG: "9.0", diemDK: "9.0", nhanXet: "Nắm vững công thức A = qEd, phân biệt rõ điện thế và thế năng tĩnh điện.", tienDong: "Chưa đóng" },
                    { tuan: 7, ngay: "25/09/2026", topic: "Điện trường đều & Bài toán chuyển động của hạt mang điện", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.5", nhanXet: "Áp dụng định lý động năng và phân tích quỹ đạo parabol hạt điện tích xuất sắc.", tienDong: "Chưa đóng" },
                    { tuan: 6, ngay: "22/09/2026", topic: "Cường độ điện trường & Nguyên lý chồng chất điện trường", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Kỹ năng cộng vector điện trường rất tốt, nắm chắc phương pháp hình học.", tienDong: "Đã đóng", ngayDongTien: "23/09/2026" },
                    { tuan: 5, ngay: "18/09/2026", topic: "Thuyết electron & Định luật bảo toàn điện tích", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.5", diemDK: "9.0", nhanXet: "Hiểu sâu sắc các hiện tượng nhiễm điện do cọ xát, tiếp xúc và hưởng ứng.", tienDong: "Đã đóng", ngayDongTien: "23/09/2026" },
                    { tuan: 4, ngay: "15/09/2026", topic: "Định luật Cu-lông và Cân bằng của hệ điện tích điểm", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Làm bài nhanh, biết cách xét cân bằng lực cho hệ 3 điện tích tự do.", tienDong: "Đã đóng", ngayDongTien: "23/09/2026" },
                    { tuan: 3, ngay: "11/09/2026", topic: "Luyện tập: Lực tương tác tĩnh điện giữa các quả cầu nhỏ", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "8.5", diemDK: "9.0", nhanXet: "Chăm chỉ, chủ động tìm kiếm các bài tập nâng cao.", tienDong: "Đã đóng", ngayDongTien: "12/09/2026" },
                    { tuan: 2, ngay: "08/09/2026", topic: "Tổng ôn tập cơ học lớp 10: Động lượng và Năng lượng", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Nền tảng Vật lý 10 rất vững, sẵn sàng học tốt chương trình 11.", tienDong: "Đã đóng", ngayDongTien: "12/09/2026" },
                    { tuan: 1, ngay: "04/09/2026", topic: "Khởi động năm học: Phương pháp học Vật Lý 11 theo SGK mới", chuyenCan: "Có mặt", btvn: "Hoàn thành", diemDG: "9.0", diemDK: "9.0", nhanXet: "Ý thức học tập tự giác cao, tiếp thu bài nhanh chóng.", tienDong: "Đã đóng", ngayDongTien: "12/09/2026" }
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

        // 5.1 Thời khóa biểu tuần của Gia sư (chuẩn cho Lịch dạy & FullCalendar)
        tutorSchedule: [
            {
                tutorPhone: "0123456789",
                tutorName: "Thầy Trần Hoàng Nam",
                studentName: "Lê Minh Thư",
                subject: "Toán 12",
                color: "#8E4DFF",
                fee: 200000,
                mon: "18:00 - 19:30",
                tue: "",
                wed: "",
                thu: "19:30 - 21:00",
                fri: "",
                sat: "",
                sun: "08:30 - 10:00"
            },
            {
                tutorPhone: "0123456789",
                tutorName: "Thầy Trần Hoàng Nam",
                studentName: "Nguyễn Hoàng Nam",
                subject: "Toán 9",
                color: "#10B981",
                fee: 200000,
                mon: "",
                tue: "",
                wed: "18:00 - 19:30",
                thu: "",
                fri: "",
                sat: "",
                sun: "14:30 - 16:00"
            },
            {
                tutorPhone: "0123456789",
                tutorName: "Thầy Trần Hoàng Nam",
                studentName: "Phạm Hải Đăng",
                subject: "Vật Lý 11",
                color: "#F59E0B",
                fee: 200000,
                mon: "",
                tue: "18:30 - 20:00",
                wed: "",
                thu: "",
                fri: "18:30 - 20:00",
                sat: "",
                sun: ""
            }
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
        if (!parsed.tutorSchedule || !Array.isArray(parsed.tutorSchedule) || parsed.tutorSchedule.length === 0) {
            var freshDataSched = generateInitialGiaSuDemoData();
            parsed.tutorSchedule = freshDataSched.tutorSchedule;
            sessionStorage.setItem(key, JSON.stringify(parsed));
        }
        return parsed;
    } catch(e) {
        var defaultData = generateInitialGiaSuDemoData();
        return defaultData;
    }
}
