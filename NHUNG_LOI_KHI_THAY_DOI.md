# NHẬT KÝ LỖI PHÁT SINH TRONG QUÁ TRÌNH THAY ĐỔI

> **Ghi chú:** Tài liệu này dùng để ghi lại toàn bộ các lỗi phát sinh trong quá trình thực hiện đại tu trên Bản Demo, nguyên nhân và cách xử lý triệt để nhằm đảm bảo khi đưa vào Web Chính sẽ không bị dính phải. Chỉ ghi nhận khi có lỗi thực tế phát sinh trong đợt đại tu này.

---

## 1. Danh sách các lỗi phát sinh khi đại tu Bản Demo

| STT | Thời gian | Lỗi gặp phải (Triệu chứng) | Nguyên nhân | Cách khắc phục trên Demo | Đã áp dụng sang Web Chính? |
| :---: | :---: | :--- | :--- | :--- | :---: |
| 1 | 20/09/2026 | Dữ liệu ngày chỉ có `DD/MM` (thiếu năm) hoặc đã có sẵn tiền tố "Thứ" có thể bị lỗi `Invalid Date` hoặc lặp lại "Thứ Thứ 7, 08/08" | JavaScript `new Date()` mặc định không phân tích được chuỗi ngày chỉ có `08/08`, và nếu gọi hàm nhiều lần có thể nối chuỗi nhiều lần | Xây dựng bộ Regex kiểm tra tiền tố có sẵn; tự động bổ sung năm hiện tại (`new Date().getFullYear()`) khi chuỗi chỉ có `DD/MM` | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 2 | 20/09/2026 | Biểu đồ tiến độ học tập và tính năng lọc / sắp xếp có nguy cơ bị lỗi nếu sửa trực tiếp vào thuộc tính `item.ngay` | Các hàm `parseLessonDate` và vẽ Chart yêu cầu định dạng ngày nguyên bản dạng `DD/MM` hoặc `YYYY-MM-DD` | Giữ nguyên dữ liệu `item.ngay` trong đối tượng bộ nhớ, chỉ gọi hàm định dạng `formatDateWithDayOfWeek` tại thời điểm xuất chuỗi ra thẻ HTML `<td>` và `<span>` | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 3 | 20/09/2026 | Khi gia sư chọn "Khác" mà không nhập phần trăm hoặc nhập số âm / vượt quá 100% | Người dùng có thể vô tình bấm lưu khi chưa điền ô input hoặc gõ nhầm số | Thêm bước validation trong `previewLessonLog` và `saveEditedLesson`: nếu rỗng hoặc ngoài khoảng [0, 100], hiển thị Toast cảnh báo và tự động focus vào ô nhập | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 4 | 20/09/2026 | Khi mở modal sửa hoặc nhân bản buổi học có dữ liệu BTVN cũ hoặc mức % tùy chỉnh (ví dụ "Hoàn thành 60%"), thẻ `<select>` bị nhảy về option đầu tiên | Thẻ `<select>` không có option trùng khớp với chuỗi "Hoàn thành 60%" hay dữ liệu cũ | Trong `openEditLessonModal` và `duplicateLesson`, kiểm tra nếu giá trị không thuộc 4 giá trị cố định thì tự động chọn option "Khác", hiển thị container nhập và trích xuất số % đưa vào ô input | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 5 | 20/09/2026 | Tỷ lệ hoàn thành BTVN tháng của học sinh bị tính sai (ví dụ đạt 75% hay 90% vẫn bị tính là 100%) | Hàm cũ trong `student.js` chỉ kiểm tra `indexOf("hoàn thành") !== -1` và cộng luôn `1.0` | Thay thế bằng Regex `(\d+(\.\d+)?)\s*%` để lấy đúng số % thực tế và cộng tỷ lệ `pVal / 100.0` vào tổng | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 6 | 23/09/2026 | Gia sư không đăng được bài tập mới lên, danh sách bài tập đã giao luôn báo rỗng ("Chưa giao bài tập nào") | (1) `api.js` bản demo thiếu hoàn toàn hàm `uploadAssignedHomework`, `editAssignedHomework`, `deleteAssignedHomework`, `restoreAssignedHomework`; (2) `getAssignedHomework` trả về Mảng thay vì `{ activeList, trashList }`; (3) Học sinh thiếu `maBaiTap` bị chặn upload; (4) Bản chính nguy cơ lỗi `ECONNRESET` nếu file Base64 lớn lưu trực tiếp vào Supabase | Bổ sung đầy đủ bộ 5 API CRUD bài tập giao trong `api.js` demo; chuẩn hóa cấu trúc `{ activeList, trashList }`; thêm fallback `maBaiTap || phone`; trên bản chính gia cố chặn Base64 quá tải và thông báo lỗi rõ ràng | ✅ Đã xử lý đồng bộ trên cả Demo và Web Chính |

---

## 2. Chi tiết phân tích và giải pháp cho từng lỗi

### Lỗi 1: Xử lý chuỗi ngày không chuẩn (thiếu năm, định dạng ngày/tháng VN)
- **Triệu chứng**: Chuỗi `08/08` truyền vào `new Date('08/08')` sẽ trả về `Invalid Date` trên các trình duyệt hiện đại, dẫn đến không xác định được thứ.
- **Nguyên nhân**: Chuẩn ngày tháng Việt Nam là Ngày/Tháng (DD/MM), không kèm năm.
- **Giải pháp áp dụng**: Dùng regex tách độc lập `day`, `month`, `year` và gán năm hiện tại nếu thiếu.

### Lỗi 2: Tránh làm vỡ các hàm phụ thuộc vào ngày gốc
- **Triệu chứng**: Nếu ghi đè trực tiếp `item.ngay = "Thứ 7, 08/08"`, hàm vẽ biểu đồ sẽ bị lỗi.
- **Giải pháp áp dụng**: Chỉ format tại thời điểm hiển thị HTML, giữ nguyên biến trong bộ nhớ.

### Lỗi 3: Ràng buộc nhập liệu phần trăm khi chọn "Khác"
- **Triệu chứng**: Dữ liệu lưu vào sheet có thể bị rác dạng `"Hoàn thành %"` hoặc `"Hoàn thành 999%"`.
- **Giải pháp áp dụng**:
  ```javascript
  var pct = parseInt(customVal, 10);
  if (isNaN(pct) || pct < 0 || pct > 100) {
      showToast("Phần trăm hoàn thành BTVN phải từ 0% đến 100%!", "error");
      return;
  }
  ```
  Tự động chuẩn hóa: 0 -> `"Không làm"`, 100 -> `"Hoàn thành"`, còn lại -> `"Hoàn thành " + pct + "%"`.

### Lỗi 4: Xử lý tương thích ngược khi sửa hoặc nhân bản buổi học
- **Triệu chứng**: Khi bấm nút "Sửa" hoặc "Nhân bản" một buổi học có BTVN là "Hoàn thành 60%" hoặc "Thiếu 1 bài", giao diện popup chọn sai giá trị.
- **Giải pháp áp dụng**:
  - So khớp nếu thuộc `["Hoàn thành", "Không làm", "Hoàn thành 90%", "Hoàn thành 75%"]` thì chọn đúng option đó và ẩn ô tùy chỉnh.
  - Ngược lại, đặt select về `"Khác"`, mở ô tùy chỉnh và tách số % bằng regex để điền sẵn vào ô input.

### Lỗi 5: Tính toán tỷ lệ hoàn thành BTVN hàng tháng chuẩn xác
- **Triệu chứng**: Điểm tổng kết BTVN tháng không phản ánh đúng khi học sinh có các buổi làm 90% hay 75%.
- **Giải pháp áp dụng**:
  - Bóc tách số % bằng regex `(\d+(\.\d+)?)\s*%` và cộng `pVal / 100.0`.
  - Tính trung bình: `btvnPercent = Math.round((completedBTVNThangNay / tongBTVNThangNay) * 100);`.

### Lỗi 6: Lỗi không đăng / không tải được bài tập giao của gia sư
- **Triệu chứng**: Gia sư nhấn nút "Giao bài" trong mục Bài tập, giao diện chạy tiến trình 100% nhưng danh sách bài tập đã giao luôn rỗng ("Chưa giao bài tập nào cho học sinh này!"). Bài tập mới không được lưu trữ, đồng thời không thể chỉnh sửa, xóa hay xem lại bài tập.
- **Nguyên nhân cốt lõi**:
  1. File `Gia sư - demo/js/api.js` bị khuyết hoàn toàn các hàm xử lý Mock: `uploadAssignedHomework`, `editAssignedHomework`, `deleteAssignedHomework`, `restoreAssignedHomework`. Khi frontend gọi các hàm này, request rơi vào fallback trả về `{ success: true }` rỗng mà không ghi dữ liệu vào Store.
  2. Hàm `getAssignedHomework` trong `api.js` bản demo trả về một Mảng đối tượng thô, trong khi hàm `loadTutorAssignedHomework()` trong `tutor.js` yêu cầu cấu trúc chuẩn dạng đối tượng `{ success: true, activeList: [...], trashList: [...] }`. Việc này khiến `res.activeList` bị `undefined`, dẫn đến bảng luôn rỗng.
  3. Khi thêm học sinh mới hoặc ở dữ liệu khởi tạo thiếu trường `maBaiTap`, logic kiểm tra `if (!maBaiTap)` trong `tutor.js` sẽ chặn đứng quy trình giao bài và báo lỗi bắt cập nhật thông tin học sinh.
  4. Trên Web Chính (Supabase): Khi gia sư đính kèm tệp dung lượng trung bình/lớn mà kết nối Google Drive gặp trục trặc, hàm cố gắng đẩy trực tiếp chuỗi Base64 siêu dài vào PostgREST (`supaPost`), gây sập kết nối HTTP (`ECONNRESET` / Payload too large) khiến toàn bộ thao tác tải lên thất bại.
- **Giải pháp áp dụng triệt để**:
  - Triển khai đầy đủ trọn bộ 5 API quản lý bài tập giao cho Mock API (`uploadAssignedHomework`, `getAssignedHomework`, `editAssignedHomework`, `deleteAssignedHomework`, `restoreAssignedHomework`).
  - Chuẩn hóa cấu trúc trả về `{ success: true, activeList: [...], trashList: [...] }` đồng bộ hoàn toàn giữa Mock API và Supabase API.
  - Bổ sung cơ chế fallback tự động `currentTutorStudent.maBaiTap || currentTutorStudent.phone` để không bao giờ bị chặn vì thiếu mã bài tập.
  - Tự động reset form nhập và chọn file về trắng sau khi giao bài thành công để sẵn sàng giao bài tiếp theo.
  - Trên Web Chính: Thêm cơ chế chặn kích thước chuỗi Base64 (> 500KB) tránh làm sập kết nối Supabase, đồng thời ném thông báo lỗi chi tiết, dễ hiểu cho người dùng.

