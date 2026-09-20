# NHẬT KÝ THAY ĐỔI TRANG WEB (CUỘC ĐẠI TU)

> **Ghi chú:** Tài liệu này dùng để ghi lại toàn bộ các yêu cầu thay đổi từ bạn trong đợt đại tu hệ thống (thực hiện trên Bản Demo trước khi đưa vào Web Chính). Chỉ cập nhật khi có chỉ thị thay đổi từ bạn.

---

## 1. Danh sách các hạng mục thay đổi

| STT | Phân hệ / Màn hình | Nội dung thay đổi yêu cầu | Trạng thái Demo | Trạng thái Web Chính | Ghi chú |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Gia sư & Học sinh (Bảng lịch sử buổi học) | Thêm Thứ vào cột Ngày dạy (ví dụ: `Thứ 7, 08/08` thay vì chỉ để `08/08`) trên cả bảng Desktop và thẻ Mobile Accordion | ✅ Đã hoàn thành | ⏳ Chưa thực hiện | Không can thiệp dữ liệu gốc, chỉ format khi render HTML |

---

## 2. Chi tiết từng đợt cập nhật

### Đợt 1: Hiển thị thứ kèm ngày dạy trong lịch sử buổi học
- **Yêu cầu**: Cột Ngày dạy không chỉ để mỗi ngày tháng (`08/08`, `12/08`, `15/08`), mà phải hiển thị rõ thứ trong tuần (ví dụ: `Thứ 7, 08/08`).
- **Phạm vi áp dụng**:
  - Giao diện Gia sư (`tutor.html` / `js/tutor.js`): Bảng danh sách buổi học (Desktop) và Card Accordion (Mobile).
  - Giao diện Học sinh (`student.html` / `js/student.js`): Bảng danh sách lịch sử học tập (Desktop) và Card Accordion (Mobile).
- **Trạng thái**: Đã chạy thực tế trên bản Demo và kiểm tra hiển thị chuẩn xác.
