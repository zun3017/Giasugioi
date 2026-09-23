# CHI TIẾT CÁCH THAY ĐỔI SO VỚI WEB CHÍNH

> **Ghi chú:** Tài liệu này dùng để ghi chi tiết cách thức kỹ thuật thay đổi code trên Bản Demo so với Web Chính (sự khác biệt về HTML, CSS, JavaScript, luồng dữ liệu). Chỉ cập nhật khi có chỉ thị thay đổi từ bạn.

---

## 1. Bảng đối chiếu các file sửa đổi

| STT | File trên Demo | File tương ứng trên Web Chính | Mục đích thay đổi |
| :---: | :--- | :--- | :--- |
| 1 | `js/api.js` | `js/api.js` | Bổ sung hàm dùng chung toàn cục `window.formatDateWithDayOfWeek(dStr)` |
| 2 | `tutor-dashboard.html` | `tutor-dashboard.html` | Cập nhật options cho `#lesBtvn`, `#editLesBtvn` và thêm ô input nhập % khi chọn "Khác" |
| 3 | `js/tutor.js` | `js/tutor.js` | Cập nhật logic Thêm/Sửa/Nhân bản buổi học với BTVN mới; cập nhật `getBtvnBadge` theo % và thống kê hóa đơn |
| 4 | `js/student.js` | `js/student.js` | Cập nhật `getBtvnBadge` theo %; cập nhật công thức tính % hoàn thành BTVN tháng dựa trên số % thực tế |
| 5 | `js/demo-data.js` | `js/demo-data.js` | Cập nhật dữ liệu mẫu minh họa các mức BTVN mới |

---

## 2. Chi tiết cách thay đổi kỹ thuật theo từng hạng mục

### Hạng mục 1: Hiển thị thứ kèm ngày dạy (`Thứ X, DD/MM`)

#### 1. File `js/api.js`
- Bổ sung hàm toàn cục `window.formatDateWithDayOfWeek(dStr)` phân tích chuỗi ngày hỗ trợ cả `DD/MM`, `DD/MM/YYYY`, `YYYY-MM-DD`. Nếu chuỗi thiếu năm, tự lấy năm hiện tại `new Date().getFullYear()`.

#### 2. File `js/tutor.js` & `js/student.js`
- Tại các vị trí render cột Ngày dạy trong bảng Desktop và thẻ Accordion Mobile: bọc qua `formatDateWithDayOfWeek(item.ngay)`.

---

### Hạng mục 2: Đại tu logic Đánh giá BTVN

#### 1. File `tutor-dashboard.html`
- **Thẻ `<select id="lesBtvn">` (Thêm buổi học)** và **`<select id="editLesBtvn">` (Sửa buổi học)**:
  - Thay toàn bộ option cũ bằng:
    ```html
    <option value="Hoàn thành">Hoàn thành</option>
    <option value="Không làm">Không làm</option>
    <option value="Hoàn thành 90%">Hoàn thành 90%</option>
    <option value="Hoàn thành 75%">Hoàn thành 75%</option>
    <option value="Khác">Khác</option>
    ```
  - Bổ sung thêm sự kiện `onchange="toggleBtvnCustomInput(...)"`.
  - Bổ sung container nhập % hoàn thành ngay bên dưới:
    ```html
    <div id="lesBtvnCustomWrap" style="display: none; margin-top: 8px;">
        <div style="display: flex; align-items: center; gap: 8px;">
            <input type="number" id="lesBtvnCustom" min="0" max="100" placeholder="Nhập % hoàn thành (ví dụ: 60)" style="...">
            <span style="font-weight: bold; color: #FFD23F; font-size: 15px;">%</span>
        </div>
    </div>
    ```
    (Tương tự với `#editLesBtvnCustomWrap` và `#editLesBtvnCustom` trong popup sửa).

#### 2. File `js/tutor.js`
- **Hàm `toggleBtvnCustomInput(selectId, wrapId, inputId)`**:
  - Ẩn/hiện ô nhập % tùy theo giá trị chọn có phải là `"Khác"` hay không. Tự động focus vào ô nhập khi mở.
- **Hàm `openAddLessonModal`**:
  - Reset `lesBtvn` về `"Hoàn thành"`, ẩn wrap nhập tùy chỉnh và xóa trắng ô input.
- **Hàm `previewLessonLog` & `saveEditedLesson`**:
  - Khi `btvn === "Khác"`, lấy giá trị từ ô input tùy chỉnh, kiểm tra hợp lệ (từ 0 đến 100%).
  - Chuẩn hóa lưu trữ: nếu 0 -> `"Không làm"`, nếu 100 -> `"Hoàn thành"`, còn lại -> `"Hoàn thành " + pct + "%"`.
- **Hàm `openEditLessonModal` & `duplicateLesson`**:
  - Kiểm tra giá trị BTVN của buổi học: nếu thuộc các tùy chọn cố định thì gán trực tiếp; nếu là giá trị khác (ví dụ "Hoàn thành 60%" hoặc dữ liệu cũ "Thiếu 1 bài") thì chuyển select sang `"Khác"`, hiển thị ô input và trích xuất số % tương ứng điền vào ô input.
- **Hàm `getBtvnBadge(btvn)`**:
  - Sử dụng Regex `(\d+(\.\d+)?)\s*%` để bắt tỷ lệ phần trăm:
    - `>= 90%`: Dùng class `.badge-hoanthanh` (xanh lá).
    - `50% - 89%`: Dùng class `.badge-thieu` (cam).
    - `< 50%`: Dùng class `.badge-nghi` (đỏ).
  - Duy trì các kiểm tra chuỗi truyền thống ("Không làm" -> đỏ, "Hoàn thành" -> xanh, "Thiếu" -> cam).
- **Hàm `renderInvoice`**:
  - Cập nhật điều kiện đếm buổi hoàn thành/thiếu BTVN: nếu có phần trăm `< 100%`, tăng số buổi thiếu bài và bổ sung vào danh sách thông báo ngày thiếu bài cho phụ huynh.

#### 3. File `js/student.js`
- **Hàm `getBtvnBadge`**: Đồng bộ hoàn toàn logic hiển thị màu sắc theo % như `tutor.js`.
- **Hàm tính Tỷ lệ BTVN theo tháng (`completedBTVNThangNay`)**:
  - Thay vì trước đây `indexOf("hoàn thành") !== -1` luôn cộng `1.0` (100%), nay sử dụng Regex tách số % thực tế:
    ```javascript
    var pctMatch = btvnStr.match(/(\d+(\.\d+)?)\s*%/);
    if (pctMatch) {
        var pVal = parseFloat(pctMatch[1]);
        if (!isNaN(pVal)) {
            completedBTVNThangNay += Math.min(Math.max(pVal / 100.0, 0), 1.0);
        }
    }
    ```
  - Đảm bảo điểm hoàn thành tháng phản ánh chính xác từng buổi (ví dụ: buổi 90% tính 0.9, buổi 75% tính 0.75).

---

### Hạng mục 3: Sửa triệt để lỗi không đăng được bài tập của Gia sư

#### 1. File `Gia sư - demo/js/api.js` (Mock API)
- **Bổ sung 5 API quản lý bài tập giao**:
  - `uploadAssignedHomework` / `assignHomework`: Tiếp nhận `[tutorPhone, studentName, title, releaseDate, fileBase64, fileName, mimeType, maBaiTap, externalLink]`, sinh ID bài tập `HW_DEMO_...`, lưu vào `store.assignedHomework` và đồng bộ sang `store.homework` để học sinh tra cứu nộp bài.
  - `getAssignedHomework` / `getTutorHomeworkList`: Nhận `[studentName, tutorPhone]`, lọc bài tập hoạt động và bài tập trong thùng rác, trả về cấu trúc chuẩn `{ success: true, activeList: [...], trashList: [...] }`.
  - `editAssignedHomework`: Cập nhật bài tập đã giao theo `rowIndex` hoặc `hwId`.
  - `deleteAssignedHomework`: Đưa bài tập vào thùng rác (gán `deleted_date: ...`, `status: "Trash"`).
  - `restoreAssignedHomework`: Khôi phục bài tập từ thùng rác (`deleted_date: null`, `status: "Active"`).
- **Lưu trữ mã bài tập (`maBaiTap`)**:
  - Cập nhật hàm `themHocSinhMoi` và `suaThongTinHocSinh` lưu giữ trường `maBaiTap: maBaiTap || studentPhone`.

#### 2. File `Gia sư - demo/js/demo-data.js`
- Bổ sung trường `maBaiTap` cho từng học sinh mẫu.
- Bổ sung mảng `assignedHomework` vào `generateInitialGiaSuDemoData()` với các bài tập mẫu thực tế (gồm cả bài tập hoạt động và bài tập trong thùng rác).
- Cập nhật `getGiaSuDemoStore()` tự động phát hiện và bù đắp dữ liệu `assignedHomework` nếu phiên làm việc hiện tại của trình duyệt chưa có.

#### 3. File `js/tutor.js` (Cả Demo và Web Chính)
- **Hàm `submitAssignedHomework`**:
  - Bổ sung fallback mã bài tập `var maBaiTap = currentTutorStudent.maBaiTap || currentTutorStudent.phone || ""` tránh bị chặn vô lý nếu học sinh chưa nhập mã bài tập riêng.
  - Tự động xóa trắng ô nhập tên bài tập, link và file đính kèm sau khi đăng thành công để sẵn sàng cho bài tập tiếp theo.
- **Hàm `loadTutorAssignedHomework`**:
  - Thêm cơ chế nhận diện dữ liệu linh hoạt: xử lý tốt cả khi backend trả về dạng mảng trực tiếp lẫn dạng đối tượng `{ activeList, trashList }`.

#### 4. File `Gia sư/js/api.js` (Web Chính kết nối Supabase)
- **Hàm `uploadAssignedHomework` & `editAssignedHomework`**:
  - Thêm chốt chặn dung lượng tệp Base64: nếu việc đẩy lên Google Drive gặp sự cố và chuỗi Base64 vượt quá 500KB, lập tức ném thông báo lỗi rõ ràng cho người dùng thay vì tiếp tục gửi chuỗi khổng lồ vào Supabase (vốn gây sập kết nối HTTP `ECONNRESET` / 413 Payload Too Large).
