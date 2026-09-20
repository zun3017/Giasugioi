# CHI TIẾT CÁCH THAY ĐỔI SO VỚI WEB CHÍNH

> **Ghi chú:** Tài liệu này dùng để ghi chi tiết cách thức kỹ thuật thay đổi code trên Bản Demo so với Web Chính (sự khác biệt về HTML, CSS, JavaScript, luồng dữ liệu). Chỉ cập nhật khi có chỉ thị thay đổi từ bạn.

---

## 1. Bảng đối chiếu các file sửa đổi

| STT | File trên Demo | File tương ứng trên Web Chính | Mục đích thay đổi |
| :---: | :--- | :--- | :--- |
| 1 | `js/api.js` | `js/api.js` | Bổ sung hàm dùng chung toàn cục `window.formatDateWithDayOfWeek(dStr)` |
| 2 | `js/tutor.js` | `js/tutor.js` | Áp dụng hàm `formatDateWithDayOfWeek` vào cột Ngày dạy (Desktop & Mobile) |
| 3 | `js/student.js` | `js/student.js` | Áp dụng hàm `formatDateWithDayOfWeek` vào cột Ngày dạy (Desktop & Mobile) |

---

## 2. Chi tiết cách thay đổi kỹ thuật theo từng hạng mục

### Hạng mục 1: Hiển thị thứ kèm ngày dạy (`Thứ X, DD/MM`)

#### 1. File `js/api.js`
- **Vị trí**: Ngay dưới hàm `normalizePhone`.
- **Code bổ sung**:
```javascript
// ĐỊNH DẠNG NGÀY KÈM THỨ (VÍ DỤ: "Thứ 7, 08/08")
window.formatDateWithDayOfWeek = function(dStr) {
    if (!dStr || dStr === "-" || dStr === "null") return "-";
    let s = String(dStr).trim();
    if (/thứ|chủ nhật|\bcn\b/i.test(s)) return s;
    let day = null, month = null, year = null;
    let mIso = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
    if (mIso) {
        year = parseInt(mIso[1], 10);
        month = parseInt(mIso[2], 10);
        day = parseInt(mIso[3], 10);
    } else {
        let mDmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
        if (mDmy) {
            day = parseInt(mDmy[1], 10);
            month = parseInt(mDmy[2], 10);
            year = parseInt(mDmy[3], 10);
        } else {
            let mDm = s.match(/^(\d{1,2})[-/.](\d{1,2})/);
            if (mDm) {
                day = parseInt(mDm[1], 10);
                month = parseInt(mDm[2], 10);
                year = new Date().getFullYear();
            }
        }
    }
    if (!day || !month || !year) return s;
    let dateObj = new Date(year, month - 1, day);
    if (isNaN(dateObj.getTime())) return s;
    let dayOfWeek = dateObj.getDay();
    let dayName = ['Chủ Nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'][dayOfWeek];
    let dStrFormatted = String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0');
    return dayName + ', ' + dStrFormatted;
};
```

#### 2. File `js/tutor.js`
- **Vị trí**: Hàm render bảng lịch sử buổi học `renderTutorHistoryTable`.
- **Thay đổi Desktop**:
  - *Cũ:* `htmlLichSu += "<td>" + (item.ngay || "") + "</td>";`
  - *Mới:* `htmlLichSu += "<td>" + (typeof formatDateWithDayOfWeek === 'function' ? formatDateWithDayOfWeek(item.ngay) : (item.ngay || "")) + "</td>";`
- **Thay đổi Mobile Accordion**:
  - *Cũ:* `<span class='accordion-header-date'>" + (item.ngay || "") + "</span>`
  - *Mới:* `<span class='accordion-header-date'>" + (typeof formatDateWithDayOfWeek === 'function' ? formatDateWithDayOfWeek(item.ngay) : (item.ngay || "")) + "</span>`

#### 3. File `js/student.js`
- **Vị trí**: Hàm render bảng lịch sử học sinh `renderStudentHistory`.
- **Thay đổi Desktop**:
  - *Cũ:* `htmlLichSu += "<td>" + (item.ngay || "") + "</td>";`
  - *Mới:* `htmlLichSu += "<td>" + (typeof formatDateWithDayOfWeek === 'function' ? formatDateWithDayOfWeek(item.ngay) : (item.ngay || "")) + "</td>";`
- **Thay đổi Mobile Accordion**:
  - *Cũ:* `<span class='accordion-header-date'>" + (item.ngay || "") + "</span>`
  - *Mới:* `<span class='accordion-header-date'>" + (typeof formatDateWithDayOfWeek === 'function' ? formatDateWithDayOfWeek(item.ngay) : (item.ngay || "")) + "</span>`
