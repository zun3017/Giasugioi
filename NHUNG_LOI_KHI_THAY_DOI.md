# NHẬT KÝ LỖI PHÁT SINH TRONG QUÁ TRÌNH THAY ĐỔI

> **Ghi chú:** Tài liệu này dùng để ghi lại toàn bộ các lỗi phát sinh trong quá trình thực hiện đại tu trên Bản Demo, nguyên nhân và cách xử lý triệt để nhằm đảm bảo khi đưa vào Web Chính sẽ không bị dính phải. Chỉ ghi nhận khi có lỗi thực tế phát sinh trong đợt đại tu này.

---

## 1. Danh sách các lỗi phát sinh khi đại tu Bản Demo

| STT | Thời gian | Lỗi gặp phải (Triệu chứng) | Nguyên nhân | Cách khắc phục trên Demo | Đã áp dụng sang Web Chính? |
| :---: | :---: | :--- | :--- | :--- | :---: |
| 1 | 20/09/2026 | Dữ liệu ngày chỉ có `DD/MM` (thiếu năm) hoặc đã có sẵn tiền tố "Thứ" có thể bị lỗi `Invalid Date` hoặc lặp lại "Thứ Thứ 7, 08/08" | JavaScript `new Date()` mặc định không phân tích được chuỗi ngày chỉ có `08/08`, và nếu gọi hàm nhiều lần có thể nối chuỗi nhiều lần | Xây dựng bộ Regex kiểm tra tiền tố có sẵn; tự động bổ sung năm hiện tại (`new Date().getFullYear()`) khi chuỗi chỉ có `DD/MM` | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |
| 2 | 20/09/2026 | Biểu đồ tiến độ học tập và tính năng lọc / sắp xếp có nguy cơ bị lỗi nếu sửa trực tiếp vào thuộc tính `item.ngay` | Các hàm `parseLessonDate` và vẽ Chart yêu cầu định dạng ngày nguyên bản dạng `DD/MM` hoặc `YYYY-MM-DD` | Giữ nguyên dữ liệu `item.ngay` trong đối tượng bộ nhớ, chỉ gọi hàm định dạng `formatDateWithDayOfWeek` tại thời điểm xuất chuỗi ra thẻ HTML `<td>` và `<span>` | ⏳ Chưa (Áp dụng khi đẩy lên Web Chính) |

---

## 2. Chi tiết phân tích và giải pháp cho từng lỗi

### Lỗi 1: Xử lý chuỗi ngày không chuẩn (thiếu năm, định dạng ngày/tháng VN)
- **Triệu chứng**: Chuỗi `08/08` truyền vào `new Date('08/08')` sẽ trả về `Invalid Date` trên các trình duyệt hiện đại, dẫn đến không xác định được thứ.
- **Nguyên nhân**: Chuẩn ngày tháng Việt Nam là Ngày/Tháng (DD/MM), không kèm năm.
- **Giải pháp áp dụng**:
  - Dùng biểu thức chính quy tách độc lập: `day`, `month`, `year`.
  - Nếu thiếu năm: gán `year = new Date().getFullYear()`.
  - Khởi tạo chính xác qua `new Date(year, month - 1, day)`.
  - Lấy thứ qua mảng ánh xạ: `['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7']`.

### Lỗi 2: Tránh làm vỡ các hàm phụ thuộc vào ngày gốc
- **Triệu chứng**: Nếu mutate (ghi đè) trực tiếp `item.ngay = "Thứ 7, 08/08"`, hàm `parseLessonDate(item.ngay)` trong `student.js` (dùng cho biểu đồ) sẽ bị `NaN`, khiến biểu đồ không vẽ được.
- **Nguyên nhân**: Biểu đồ dùng regex tách ngày và tháng từ `item.ngay`.
- **Giải pháp áp dụng**:
  - Tuyệt đối không thay đổi giá trị thuộc tính `item.ngay` trong mảng dữ liệu.
  - Chỉ gọi `formatDateWithDayOfWeek(item.ngay)` khi render HTML vào bảng/card.
