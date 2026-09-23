# NHẬT KÝ THAY ĐỔI TRANG WEB (CUỘC ĐẠI TU)

> **Ghi chú:** Tài liệu này dùng để ghi lại toàn bộ các yêu cầu thay đổi từ bạn trong đợt đại tu hệ thống (thực hiện trên Bản Demo trước khi đưa vào Web Chính). Chỉ cập nhật khi có chỉ thị thay đổi từ bạn.

---

## 1. Danh sách các hạng mục thay đổi

| STT | Phân hệ / Màn hình | Nội dung thay đổi yêu cầu | Trạng thái Demo | Trạng thái Web Chính | Ghi chú |
| :---: | :--- | :--- | :---: | :---: | :--- |
| 1 | Gia sư & Học sinh (Bảng lịch sử buổi học) | Thêm Thứ vào cột Ngày dạy (ví dụ: `Thứ 7, 08/08` thay vì chỉ để `08/08`) trên cả bảng Desktop và thẻ Mobile Accordion | ✅ Đã hoàn thành | ⏳ Chưa thực hiện | Không can thiệp dữ liệu gốc, chỉ format khi render HTML |
| 2 | Gia sư & Học sinh (Đánh giá BTVN) | Đại tu logic Đánh giá BTVN: chuyển danh sách chọn thành `Hoàn thành`, `Không làm`, `Hoàn thành 90%`, `Hoàn thành 75%`, `Khác`. Khi chọn `Khác` cho phép gia sư tự nhập số % hoàn thành. Đồng bộ màu sắc huy hiệu và công thức tính % BTVN tháng. | ✅ Đã hoàn thành | ⏳ Chưa thực hiện | Tự động parse %, validation 0-100%, tương thích hoàn toàn dữ liệu cũ |
| 3 | Gia sư (Quản lý & Giao bài tập) | Sửa triệt để lỗi không đăng được bài tập của gia sư: triển khai toàn diện bộ API CRUD bài tập giao, chuẩn hóa cấu trúc dữ liệu `{ activeList, trashList }`, bổ sung fallback mã bài tập và chặn rủi ro tải file Base64 quá tải lên Supabase | ✅ Đã hoàn thành | ✅ Đã hoàn thành | Đồng bộ hoàn hảo giữa Bản Demo và Web Chính |

---

## 2. Chi tiết từng đợt cập nhật

### Đợt 1: Hiển thị thứ kèm ngày dạy trong lịch sử buổi học
- **Yêu cầu**: Cột Ngày dạy không chỉ để mỗi ngày tháng (`08/08`, `12/08`, `15/08`), mà phải hiển thị rõ thứ trong tuần (ví dụ: `Thứ 7, 08/08`).
- **Phạm vi áp dụng**:
  - Giao diện Gia sư (`tutor.html` / `js/tutor.js`): Bảng danh sách buổi học (Desktop) và Card Accordion (Mobile).
  - Giao diện Học sinh (`student.html` / `js/student.js`): Bảng danh sách lịch sử học tập (Desktop) và Card Accordion (Mobile).
- **Trạng thái**: Đã chạy thực tế trên bản Demo và kiểm tra hiển thị chuẩn xác.

### Đợt 2: Đại tu logic mục Đánh giá Bài tập về nhà (BTVN)
- **Yêu cầu**: Thay đổi toàn bộ logic chọn đánh giá BTVN thành:
  1. `Hoàn thành` (100%)
  2. `Không làm` (0%)
  3. `Hoàn thành 90%`
  4. `Hoàn thành 75%`
  5. `Khác` (khi chọn mục này thì phải để gia sư tự nhập số phần trăm hoàn thành bài tập của học sinh).
- **Phạm vi áp dụng**:
  - Popup Thêm buổi học (`tutor-dashboard.html` / `js/tutor.js`)
  - Popup Sửa buổi học (`tutor-dashboard.html` / `js/tutor.js`)
  - Tính năng Nhân bản buổi học (`js/tutor.js`)
  - Bảng lịch sử & thẻ Accordion của Gia sư (`js/tutor.js`)
  - Bảng lịch sử & thẻ Accordion của Học sinh (`js/student.js`)
  - Logic tính tỷ lệ hoàn thành BTVN theo tháng (`js/student.js`)
  - Logic thống kê BTVN trên hóa đơn học phí (`js/tutor.js`)
- **Trạng thái**: Đã hoàn thành trên bản Demo, kiểm thử đầy đủ các trường hợp.

### Đợt 3: Khắc phục triệt để lỗi không đăng được bài tập của Gia sư
- **Yêu cầu**: Kiểm tra và sửa lỗi ngay lập tức khi Gia sư đăng bài tập mới lên nhưng không được lưu trữ / không hiển thị.
- **Phạm vi áp dụng**:
  - Giao diện Gia sư (`tutor-dashboard.html` / `js/tutor.js`): Form Giao bài tập, bảng Danh sách bài tập đã giao và Modal Thùng rác.
  - Mock API Gateway (`Gia sư - demo/js/api.js`): Bổ sung trọn bộ 5 API quản lý bài tập (`uploadAssignedHomework`, `getAssignedHomework`, `editAssignedHomework`, `deleteAssignedHomework`, `restoreAssignedHomework`).
  - Dữ liệu demo (`Gia sư - demo/js/demo-data.js`): Khởi tạo mảng `assignedHomework` chuẩn và tự động nạp vào Store.
  - Bản chính Supabase (`Gia sư/js/api.js`): Khống chế dung lượng chuỗi Base64 tránh lỗi `ECONNRESET` / sập mạng PostgREST, ném cảnh báo thân thiện cho gia sư.
- **Trạng thái**: Đã hoàn thành đồng bộ trên cả Bản Demo và Web Chính, kiểm thử CRUD (Thêm, Xem, Sửa, Xóa, Khôi phục) thành công 100%.
