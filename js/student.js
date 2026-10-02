var currentChartInstance = null;
var currentStudentName = "";

// Hàm chuẩn hoá chuỗi loại bỏ dấu tiếng Việt để kiểm tra chính xác
function normalizeStr(str) {
    if (!str) return "";
    return String(str).toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .trim();
}

// Hàm nhận diện buổi nghỉ (chỉ dựa trên thẻ / trạng thái điểm danh do người dùng chọn)
function isAbsentSession(statusOrItem) {
    var rawStatus = "";
    if (typeof statusOrItem === 'object' && statusOrItem !== null) {
        rawStatus = statusOrItem.trangThai || statusOrItem.chuyenCan || statusOrItem.attendance_status || statusOrItem.attendance || statusOrItem.status || "";
    } else {
        rawStatus = String(statusOrItem || "");
    }
    var normTt = normalizeStr(rawStatus);

    // 1. Nếu là học bù / đã bù thì luôn tính là buổi có học
    if (normTt.includes('hoc bu') || normTt.includes('da bu')) {
        return false;
    }

    // 2. Kiểm tra trạng thái / thẻ điểm danh rõ ràng
    if (
        normTt.includes('nghi') ||
        normTt.includes('huy') ||
        normTt.includes('vang') ||
        normTt.includes('off') ||
        normTt.includes('khong hoc') ||
        normTt.includes('chua hoc') ||
        normTt.includes('tam hoan') ||
        normTt === 'v' ||
        normTt === 'n' ||
        normTt === 'x'
    ) {
        return true;
    }

    return false;
}

function renderStudentView(ketQua) {
    if (!ketQua) return;
    
    // Đảm bảo có mảng danh sách lịch sử học tập
    var lichSu = ketQua.lichSuHocTap || ketQua.danhSachNhatKy || [];

    // Hủy biểu đồ cũ nếu có
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
    }
    if (window._btvnInst) {
        window._btvnInst.destroy();
        window._btvnInst = null;
    }
    if (window._ccInst) {
        window._ccInst.destroy();
        window._ccInst = null;
    }

    // Ẩn màn hình chính và các nhân vật 3D nếu tồn tại
    var mainScr = document.getElementById('mainScreen');
    if (mainScr) mainScr.style.display = 'none';
    var deskSurf = document.getElementById('deskSurface');
    if (deskSurf) deskSurf.style.display = 'none';
    var boy = document.getElementById('charBoy');
    if (boy) boy.style.display = 'none';
    var girl = document.getElementById('charGirl');
    if (girl) girl.style.display = 'none';
    
    var headerEl = document.querySelector('.header');
    if (headerEl) headerEl.style.display = 'none';

    // Hiện khung kết quả
    var resBox = document.getElementById('resultBox');
    if (resBox) resBox.style.display = 'block';
    
    var studentPhone = sessionStorage.getItem('userPhone') || localStorage.getItem('userPhone') || "";
    if (studentPhone && studentPhone.charAt(0) !== '0' && studentPhone.length === 9) {
        studentPhone = '0' + studentPhone;
    }
    
    var lopHoc = ketQua.lop || "Đang cập nhật";
    if ((lopHoc === "Đang cập nhật" || !lopHoc) && lichSu.length > 0) {
        for (var k = 0; k < lichSu.length; k++) {
            if (lichSu[k].mon) {
                lopHoc = lichSu[k].mon;
                break;
            }
        }
    }
    
    var loiChaoEl = document.getElementById('loiChao');
    if (loiChaoEl) {
        // Lấy 2 chữ initials từ tên
        var nameParts = (ketQua.tenHocSinh || 'HS').trim().split(/\s+/);
        var initials = nameParts.length >= 2
            ? nameParts[0][0] + nameParts[nameParts.length - 1][0]
            : nameParts[0].substring(0, 2);
        initials = initials.toUpperCase();

        // Tháng hiện tại
        var now = new Date();
        var monthLabel = 'Tháng ' + (now.getMonth() + 1) + '/' + now.getFullYear();

        var displayPhone = studentPhone || ketQua.sdt || "";

        loiChaoEl.innerHTML =
            '<div class="student-hero-card">' +
                '<div class="hero-avatar">' + initials + '</div>' +
                '<div class="hero-info">' +
                    '<h2 class="hero-name">Xin chào, <strong>' + (ketQua.tenHocSinh || 'Học sinh') + '</strong> 👋</h2>' +
                    '<div class="hero-meta">' +
                        '<span class="hero-tag"><i class="fa-solid fa-book"></i> ' + lopHoc + '</span>' +
                        (ketQua.giaSu ? '<span class="hero-tag"><i class="fa-solid fa-chalkboard-user"></i> Gia sư: ' + ketQua.giaSu + '</span>' : '') +
                        (displayPhone ? '<span class="hero-tag"><i class="fa-solid fa-phone"></i> ' + displayPhone + '</span>' : '') +
                    '</div>' +
                '</div>' +
                '<div class="hero-month-badge"><i class="fa-solid fa-calendar-days"></i> ' + monthLabel + '</div>' +
            '</div>';
    }
    currentStudentName = ketQua.tenHocSinh || "";
    
    // Khôi phục trạng thái active cho các nút legend tùy chọn
    var btnDauGio = document.getElementById('btnLegDauGio');
    var btnDinhKi = document.getElementById('btnLegDinhKi');
    if (btnDauGio && btnDinhKi) {
        btnDauGio.className = 'legend-btn active btn-dau-gio';
        btnDinhKi.className = 'legend-btn active btn-dinh-ki';
    }
    
    // --- 1. HIỂN THỊ KHUNG THÔNG BÁO (TASK 15.6) ---
    var khuVucThongBao = document.getElementById('khuVucThongBao');
    if (khuVucThongBao) {
        var thongBaoText = ketQua.thongBaoHocSinh || ketQua.thongBao || "";
        if (thongBaoText.trim() !== "") {
            khuVucThongBao.innerHTML = 
                '<div class="announce-card announce-has">' +
                    '<div class="announce-icon"><i class="fa-solid fa-bullhorn"></i></div>' +
                    '<div class="announce-body">' +
                        '<div class="announce-title">Thông báo từ gia sư</div>' +
                        '<div class="announce-text">' + thongBaoText + '</div>' +
                    '</div>' +
                '</div>';
        } else {
            khuVucThongBao.innerHTML = 
                '<div class="announce-card announce-empty">' +
                    '<i class="fa-regular fa-bell"></i>' +
                    '<span>Chưa có thông báo mới</span>' +
                '</div>';
        }
    }

    // --- 2. TÍNH TOÁN SỐ LIỆU TÓM TẮT THEO THÁNG ---
    var today = new Date();
    var currentMonth = today.getMonth(); // 0 - 11
    var currentYear = today.getFullYear();
    
    // Helper phân tích ngày học linh hoạt từ mọi định dạng
    function parseLessonDate(rawStr) {
        if (!rawStr) return null;
        var s = String(rawStr).trim();
        var mIso = s.match(/(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
        var mDmy = s.match(/(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
        var mDm = s.match(/(\d{1,2})[-/.](\d{1,2})/);
        if (mIso) return { year: parseInt(mIso[1], 10), month: parseInt(mIso[2], 10) - 1 };
        if (mDmy) return { year: parseInt(mDmy[3], 10), month: parseInt(mDmy[2], 10) - 1 };
        if (mDm) return { year: currentYear, month: parseInt(mDm[2], 10) - 1 };
        var d = new Date(s);
        return isNaN(d.getTime()) ? null : { year: d.getFullYear(), month: d.getMonth() };
    }

    // Kiểm tra xem trong danh sách có bản ghi nào thuộc tháng hiện tại không
    var targetMonth = currentMonth;
    var targetYear = currentYear;
    var hasCurrentMonthLogs = false;

    lichSu.forEach(function(item) {
        var pd = parseLessonDate(item.ngay);
        if (pd && pd.year === currentYear && pd.month === currentMonth) {
            hasCurrentMonthLogs = true;
        }
    });

    // Nếu không có buổi nào trong tháng hiện tại nhưng có logs, lấy tháng gần nhất có dữ liệu
    if (!hasCurrentMonthLogs && lichSu.length > 0) {
        for (var idx = lichSu.length - 1; idx >= 0; idx--) {
            var pDate = parseLessonDate(lichSu[idx].ngay);
            if (pDate) {
                targetMonth = pDate.month;
                targetYear = pDate.year;
                break;
            }
        }
    }

    // Thiết lập nhãn động cho tháng
    var elLblBuoiHoc = document.getElementById('lblBuoiHoc');
    if (elLblBuoiHoc) elLblBuoiHoc.innerText = "Số buổi đã học (Tháng " + (targetMonth + 1) + ")";
    var elLblBuoiNghi = document.getElementById('lblBuoiNghi');
    if (elLblBuoiNghi) elLblBuoiNghi.innerText = "Số buổi nghỉ (Tháng " + (targetMonth + 1) + ")";

    var buoiHocThangNay = 0;
    var buoiNghiThangNay = 0;
    var totalPresentAllTime = 0;
    var totalAbsentAllTime = 0;
    var listDiemDauGioThangNay = [];
    var listDiemDinhKiThangNay = [];
    var tongBTVNThangNay = 0;
    var completedBTVNThangNay = 0;

    lichSu.forEach(function(item) {
        var parsedDate = parseLessonDate(item.ngay);
        var isAbsent = isAbsentSession(item);
        var isPresent = !isAbsent;

        // Tổng hợp toàn bộ lịch sử (All-time)
        if (isAbsent) {
            totalAbsentAllTime++;
        } else {
            totalPresentAllTime++;
        }

        // Chỉ tính toán nếu buổi học nằm trong tháng mục tiêu
        if (parsedDate && parsedDate.year === targetYear && parsedDate.month === targetMonth) {
            if (isAbsent) {
                buoiNghiThangNay++;
            } else if (isPresent) {
                buoiHocThangNay++;

                // Điểm đầu giờ & định kì (chỉ tính cho buổi đã học)
                var scoreDG = parseFloat(item.diemDauGio);
                var scoreDK = parseFloat(item.diemDinhKi);
                if (!isNaN(scoreDG) && scoreDG >= 0 && scoreDG <= 10) {
                    listDiemDauGioThangNay.push(scoreDG);
                }
                if (!isNaN(scoreDK) && scoreDK >= 0 && scoreDK <= 10) {
                    listDiemDinhKiThangNay.push(scoreDK);
                }

                // Đánh giá BTVN (chỉ tính cho buổi đã học)
                var btvnStr = (item.danhGiaBTVN || item.btvn || "").trim().toLowerCase();
                if (btvnStr !== "" && btvnStr !== "không có" && btvnStr !== "-" && btvnStr !== "chưa có") {
                    tongBTVNThangNay++;
                    var pctMatch = btvnStr.match(/(\d+(\.\d+)?)\s*%/);
                    if (pctMatch) {
                        var pVal = parseFloat(pctMatch[1]);
                        if (!isNaN(pVal)) {
                            completedBTVNThangNay += Math.min(Math.max(pVal / 100.0, 0), 1.0);
                        }
                    } else if (btvnStr.indexOf("không làm") !== -1 || btvnStr.indexOf("chưa làm") !== -1 || btvnStr.indexOf("chưa nộp") !== -1 || btvnStr === "không") {
                        completedBTVNThangNay += 0.0;
                    } else if (btvnStr.indexOf("hoàn thành") !== -1 || btvnStr.indexOf("phụ huynh") !== -1 || btvnStr === "đạt" || btvnStr === "tốt" || btvnStr === "xuất sắc" || btvnStr === "có") {
                        completedBTVNThangNay += 1.0;
                    } else if (btvnStr.indexOf("thiếu") !== -1) {
                        var match = btvnStr.match(/thiếu\s+(\d+)/);
                        if (match) {
                            var missingCount = parseInt(match[1], 10);
                            var completedCount = 5 - missingCount;
                            if (completedCount < 0) completedCount = 0;
                            completedBTVNThangNay += (completedCount / 5.0);
                        } else {
                            completedBTVNThangNay += 0.5;
                        }
                    } else {
                        completedBTVNThangNay += 1.0;
                    }
                }
            }
        }
    });

    // Gán chỉ số trung bình điểm Đầu Giờ (tháng)
    var valDiemDauGio = "Chưa có";
    var numDiemDauGio = null;
    if (listDiemDauGioThangNay.length > 0) {
        var sumDG = 0;
        for (var s = 0; s < listDiemDauGioThangNay.length; s++) {
            sumDG += listDiemDauGioThangNay[s];
        }
        numDiemDauGio = sumDG / listDiemDauGioThangNay.length;
        valDiemDauGio = numDiemDauGio.toFixed(2);
    }
    var elDauGio = document.getElementById('valDiemDauGio');
    if (elDauGio) elDauGio.innerText = valDiemDauGio;

    // Gán chỉ số trung bình điểm Định Kỳ (tháng)
    var valDiemDinhKi = "Chưa có";
    var numDiemDinhKi = null;
    if (listDiemDinhKiThangNay.length > 0) {
        var sumDK = 0;
        for (var k = 0; k < listDiemDinhKiThangNay.length; k++) {
            sumDK += listDiemDinhKiThangNay[k];
        }
        numDiemDinhKi = sumDK / listDiemDinhKiThangNay.length;
        valDiemDinhKi = numDiemDinhKi.toFixed(2);
    }
    var elDinhKi = document.getElementById('valDiemDinhKi');
    if (elDinhKi) elDinhKi.innerText = valDiemDinhKi;

    // Gán tỷ lệ BTVN (%)
    var valBTVNText = "Chưa có";
    var btvnPercent = null;
    if (tongBTVNThangNay > 0) {
        btvnPercent = Math.round((completedBTVNThangNay / tongBTVNThangNay) * 100);
        valBTVNText = btvnPercent + "%";
    } else if (buoiHocThangNay > 0) {
        btvnPercent = 100;
        valBTVNText = "100%";
    }
    var elBTVN = document.getElementById('valBTVN');
    if (elBTVN) elBTVN.innerText = valBTVNText;

    // Gán số buổi học & nghỉ
    var elBuoiHoc = document.getElementById('valBuoiHoc');
    if (elBuoiHoc) elBuoiHoc.innerText = buoiHocThangNay + " buổi";

    var elBuoiNghi = document.getElementById('valBuoiNghi');
    if (elBuoiNghi) elBuoiNghi.innerText = buoiNghiThangNay + " buổi";

    // Phân loại mức điểm đánh giá
    function scoreLevelBadge(val) {
        var n = parseFloat(val);
        if (isNaN(n) || val === '-' || val === '' || val === null) return '';
        if (n >= 9.0) return '<span class="score-badge-xs badge-excellent">Xuất sắc ⭐</span>';
        if (n >= 7.0) return '<span class="score-badge-xs badge-good">Giỏi 👍</span>';
        if (n >= 5.0) return '<span class="score-badge-xs badge-average">Khá 📚</span>';
        return '<span class="score-badge-xs badge-poor">Cần cố gắng 💪</span>';
    }
    var badgeDauGioEl = document.getElementById('badgeDauGioContainer');
    if (badgeDauGioEl) badgeDauGioEl.innerHTML = scoreLevelBadge(numDiemDauGio);

    var badgeDinhKiEl = document.getElementById('badgeDinhKiContainer');
    if (badgeDinhKiEl) badgeDinhKiEl.innerHTML = scoreLevelBadge(numDiemDinhKi);

    // --- 3. KHỞI TẠO BIỂU ĐỒ ĐIỂM SỐ ---
    var labels = [];
    var dataDauGio = [];
    var dataDinhKi = [];
    
    // Sắp xếp dữ liệu theo trình tự thời gian từ cũ đến mới (trái qua phải)
    // để biểu đồ thể hiện rõ tiến trình tiến bộ học tập của học sinh
    var lichSuVe = lichSu.slice();
    if (lichSuVe.length > 1) {
        var parseDateNum = function(str) {
            if (!str) return 0;
            var parts = String(str).split('/');
            if (parts.length >= 2) {
                var d = parseInt(parts[0], 10) || 0;
                var m = parseInt(parts[1], 10) || 0;
                var y = (parts.length >= 3) ? (parseInt(parts[2], 10) || 2026) : 2026;
                return y * 10000 + m * 100 + d;
            }
            return 0;
        };
        var firstD = parseDateNum(lichSuVe[0].ngay);
        var lastD = parseDateNum(lichSuVe[lichSuVe.length - 1].ngay);
        if (firstD > lastD) {
            lichSuVe.reverse();
        }
    }

    lichSuVe.forEach(function(item) {
        var valDG = parseFloat(item.diemDauGio !== undefined && item.diemDauGio !== null ? item.diemDauGio : item.diemDG);
        var valDK = parseFloat(item.diemDinhKi !== undefined && item.diemDinhKi !== null ? item.diemDinhKi : item.diemDK);
        var isValidDG = !isNaN(valDG) && valDG >= 0 && valDG <= 10;
        var isValidDK = !isNaN(valDK) && valDK >= 0 && valDK <= 10;

        // Chỉ đưa vào biểu đồ điểm số những buổi học CÓ ĐIỂM (loại bỏ các buổi vắng hoặc không có điểm kiểm tra)
        if (isValidDG || isValidDK) {
            var rawDate = item.ngay || "";
            var shortDate = rawDate;
            if (typeof formatDateOnly === 'function') {
                shortDate = formatDateOnly(rawDate);
            } else {
                var dateParts = rawDate.match(/(\d{1,2})\/(\d{1,2})/);
                if (dateParts) shortDate = dateParts[1] + "/" + dateParts[2];
            }
            labels.push(shortDate);
            dataDauGio.push(isValidDG ? valDG : null);
            dataDinhKi.push(isValidDK ? valDK : null);
        }
    });

    var chartCanvas = document.getElementById('diemChart');
    if (chartCanvas && labels.length > 0) {
        var ctx = chartCanvas.getContext('2d');

        // 1. Tạo linear gradient fill chuyển sắc mượt mà chuẩn phong cách Hình 1
        var gradDauGio = ctx.createLinearGradient(0, 0, 0, 260);
        gradDauGio.addColorStop(0, 'rgba(59, 130, 246, 0.35)');
        gradDauGio.addColorStop(1, 'rgba(59, 130, 246, 0.01)');

        var gradDinhKi = ctx.createLinearGradient(0, 0, 0, 260);
        gradDinhKi.addColorStop(0, 'rgba(245, 158, 11, 0.32)');
        gradDinhKi.addColorStop(1, 'rgba(245, 158, 11, 0.01)');

        // Tính toán dải trục Y linh hoạt để đường cong có độ võng/nhấp nhô tự nhiên chuẩn Hình 1
        var allScores = dataDauGio.concat(dataDinhKi).filter(function(v) { return v !== null && !isNaN(v); });
        var minScore = allScores.length > 0 ? Math.min.apply(null, allScores) : 0;
        var maxScore = allScores.length > 0 ? Math.max.apply(null, allScores) : 10;
        var yMin = (minScore >= 6) ? Math.max(0, Math.floor(minScore) - 1) : 0;
        var yMax = Math.min(10.5, Math.max(10, maxScore + 0.5));

        currentChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Điểm đầu giờ',
                        data: dataDauGio,
                        borderColor: '#3B82F6',
                        backgroundColor: gradDauGio,
                        borderWidth: 3,
                        fill: true,
                        tension: 0.38,
                        pointBackgroundColor: '#3B82F6',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7.5,
                        spanGaps: true
                    },
                    {
                        label: 'Điểm định kì',
                        data: dataDinhKi,
                        borderColor: '#F59E0B',
                        backgroundColor: gradDinhKi,
                        borderWidth: 3,
                        fill: false, // Đường cam nổi bật sắc sảo trên nền gradient xanh
                        tension: 0.38,
                        pointBackgroundColor: '#F59E0B',
                        pointBorderColor: '#FFFFFF',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7.5,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                layout: {
                    padding: {
                        left: 16,
                        right: 28,
                        top: 12,
                        bottom: 6
                    }
                },
                interaction: { mode: 'index', intersect: false },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: '#1E293B',
                        titleColor: '#FFFFFF',
                        titleFont: { family: 'Inter', size: 12, weight: 'bold' },
                        bodyColor: '#FFFFFF',
                        bodyFont: { family: 'Inter', size: 11, weight: '600' },
                        borderColor: 'rgba(59, 130, 246, 0.4)',
                        borderWidth: 1,
                        padding: 10,
                        cornerRadius: 10,
                        boxPadding: 4,
                        usePointStyle: true,
                        callbacks: {
                            title: function(items) {
                                return items.length > 0 ? ('Buổi ngày ' + items[0].label) : '';
                            },
                            label: function(c) {
                                if (c.raw === null || c.raw === undefined) return null;
                                return ' ' + c.dataset.label + ': ' + c.parsed.y + ' điểm';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        ticks: {
                            color: '#94A3B8',
                            font: { family: 'Inter', size: 11, weight: '500' }
                        }
                    },
                    y: {
                        display: false,
                        grid: {
                            display: false,
                            drawBorder: false
                        },
                        min: yMin,
                        suggestedMax: yMax
                    }
                }
            }
        });
    }

    // Task 15.3: Render 2 biểu đồ tròn donut (BTVN + Chuyên cần)
    renderDonutCharts(lichSu);

    // --- 4. RENDER BẢNG LỊCH SỬ & MOBILE CARDS ---
    var htmlLichSu = "";
    var totalBuoi = lichSu.length;
    if (totalBuoi > 0) {
        // Cập nhật tiêu đề Lịch sử có kèm tổng số buổi rõ ràng
        var historyHeaderEl = document.querySelector('#resultBox .result-section h4');
        if (historyHeaderEl && historyHeaderEl.innerHTML.includes('Lịch sử')) {
            historyHeaderEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Lịch sử Đánh giá Học tập <span style="font-size: 12px; color: var(--text-secondary); font-weight: normal; margin-left: 8px;">(Tổng đã học: <b style="color:var(--text-primary);">' + totalPresentAllTime + ' buổi</b> • Nghỉ: <b style="color:var(--text-primary);">' + totalAbsentAllTime + ' buổi</b>)</span>';
        }

        // Helper màu sắc điểm số (Task 15.5)
        function scoreColor(val) {
            var n = parseFloat(val);
            if (isNaN(n)) return '#94A3B8';
            if (n >= 9) return '#059669';
            if (n >= 7) return '#2563EB';
            if (n >= 5) return '#D97706';
            return '#DC2626';
        }

        // Helper chip BTVN (Task 15.5)
        function btvnChip(raw, isAbsent) {
            if (isAbsent) return '<span class="btvn-chip btvn-na">—</span>';
            var n = normalizeStr(raw || '');
            if (n.includes('hoan') || n.includes('tot') || n.includes('day du') || n.includes('xuat') || n === 'co' || n === 'dat')
                return '<span class="btvn-chip btvn-done">✅ Hoàn thành</span>';
            return '<span class="btvn-chip btvn-fail">❌ Chưa HT</span>';
        }

        // Helper định dạng ngày chỉ lấy ngày/tháng, bỏ thứ (Ví dụ: "22/09")
        function formatDateOnly(dStr) {
            if (typeof window.formatDateOnly === 'function') return window.formatDateOnly(dStr);
            if (!dStr || dStr === "-" || dStr === "null") return "-";
            var s = String(dStr).trim();
            s = s.replace(/^(thứ\s*\d+|chủ nhật|cn)\s*[,.-]?\s*/i, '').trim();
            var day = null, month = null;
            var mIso = s.match(/^(\d{4})[-/.](\d{1,2})[-/.](\d{1,2})/);
            if (mIso) {
                month = parseInt(mIso[2], 10);
                day = parseInt(mIso[3], 10);
            } else {
                var mDmy = s.match(/^(\d{1,2})[-/.](\d{1,2})[-/.](\d{4})/);
                if (mDmy) {
                    day = parseInt(mDmy[1], 10);
                    month = parseInt(mDmy[2], 10);
                } else {
                    var mDm = s.match(/^(\d{1,2})[-/.](\d{1,2})/);
                    if (mDm) {
                        day = parseInt(mDm[1], 10);
                        month = parseInt(mDm[2], 10);
                    }
                }
            }
            if (day && month) {
                return String(day).padStart(2, '0') + '/' + String(month).padStart(2, '0');
            }
            return s;
        }

        htmlLichSu += "<table class='history-table'>";
        htmlLichSu += "<thead><tr>" +
            "<th>Ngày</th>" +
            "<th>Môn</th>" +
            "<th>Nội dung</th>" +
            "<th>BTVN</th>" +
            "<th>Đầu giờ</th>" +
            "<th>Định kì</th>" +
            "<th>Chuyên cần</th>" +
            "<th style='text-align:center;'>Chi tiết</th>" +
            "</tr></thead><tbody>";

        lichSu.slice().reverse().forEach(function(item, idx) {
            var isAbsent = isAbsentSession(item);
            var isHidden = (idx >= 5);
            var hiddenAttr = isHidden ? ' style="display:none;" class="history-row hidden-row' + (isAbsent ? ' row-absent' : '') + '"' : ' class="history-row' + (isAbsent ? ' row-absent' : '') + '"';
            var detailHiddenAttr = isHidden ? ' style="display:none;" class="history-detail-row hidden-row"' : ' style="display:table-row;" class="history-detail-row"';
            var rawDate = formatDateOnly(item.ngay);
            var diemDau = item.diemDauGio !== undefined && item.diemDauGio !== null ? item.diemDauGio : item.diemDG;
            var diemDinh = item.diemDinhKi !== undefined && item.diemDinhKi !== null ? item.diemDinhKi : item.diemDK;

            htmlLichSu +=
                '<tr' + hiddenAttr + '>' +
                    '<td><span class="date-badge">' + rawDate + '</span></td>' +
                    '<td><span class="subj-chip">' + (item.mon || '-') + '</span></td>' +
                    '<td class="cell-noidung">' + (item.noiDung || item.topic || '-') + '</td>' +
                    '<td>' + btvnChip(item.danhGiaBTVN || item.btvn, isAbsent) + '</td>' +
                    '<td style="font-weight:700;font-size:15px;color:' + scoreColor(diemDau) + ';">' + (diemDau !== undefined && diemDau !== null && diemDau !== '' ? diemDau : '—') + '</td>' +
                    '<td style="font-weight:700;font-size:15px;color:' + scoreColor(diemDinh) + ';">' + (diemDinh !== undefined && diemDinh !== null && diemDinh !== '' ? diemDinh : '—') + '</td>' +
                    '<td><span class="status-chip ' + (isAbsent ? 'status-absent' : 'status-present') + '">' + (isAbsent ? '❌ Vắng' : '✅ Có mặt') + '</span></td>' +
                    '<td style="text-align:center;"><button class="btn-expand-row open" onclick="toggleRowDetail(this)" title="Thu gọn / Mở rộng nhận xét"><i class="fa-solid fa-chevron-down"></i></button></td>' +
                '</tr>' +
                '<tr' + detailHiddenAttr + '>' +
                    '<td colspan="8"><div class="detail-content"><i class="fa-solid fa-comment-dots" style="color:#3B82F6;margin-right:6px;"></i><strong>Nhận xét:</strong> ' + (item.nhanXet || 'Chưa có nhận xét cho buổi học này.') + '</div></td>' +
                '</tr>';
        });

        htmlLichSu += "</tbody></table>";
    } else {
        htmlLichSu = "<p style='color: #A6ADCE; padding: 16px;'>Chưa có dữ liệu đánh giá nào được cập nhật.</p>";
    }
    
    var khuVucLichSuEl = document.getElementById('khuVucLichSu');
    if (khuVucLichSuEl) khuVucLichSuEl.innerHTML = htmlLichSu;
    
    // Ẩn/Hiện nút Xem thêm (...) dựa trên số lượng buổi học
    var loadMoreContainer = document.getElementById('loadMoreContainer');
    if (loadMoreContainer) {
        if (totalBuoi > 5) {
            loadMoreContainer.style.display = 'block';
        } else {
            loadMoreContainer.style.display = 'none';
        }
    }
    
    // Render Bài tập / File tải về
    var khuVucBaiTapEl = document.getElementById('khuVucBaiTap');
    if (khuVucBaiTapEl) {
        var htmlBaiTap = "";
        var listBt = ketQua.baiTap || ketQua.danhSachBaiTap || [];
        if (listBt.length > 0) {
            listBt.slice().reverse().forEach(function(bt) {
                htmlBaiTap += "<div class='bt-item'>";
                htmlBaiTap += "<div><strong style='color: var(--text-heading);'>[" + (bt.mon || "Gia sư") + "]</strong> <span style='color: var(--text-primary); font-weight: 500; font-size: 15px; margin-left: 8px;'>" + (bt.tenBai || bt.title || "Tài liệu học tập") + "</span></div>";
                if (bt.link || bt.file) {
                    htmlBaiTap += "<a href='" + (bt.link || bt.file) + "' target='_blank' class='btn-download'><i class='fa-solid fa-cloud-arrow-down'></i> Tải Xuống</a>";
                }
                htmlBaiTap += "</div>";
            });
        } else {
            htmlBaiTap = "<p style='color: #A6ADCE;'>Chưa có bài kiểm tra hoặc tài liệu nào.</p>";
        }
        khuVucBaiTapEl.innerHTML = htmlBaiTap;
    }
} // End renderStudentView

// ===== TASK 15.3: 2 BIỂU ĐỒ TRÒN DONUT (BTVN & CHUYÊN CẦN) =====
function renderDonutCharts(lichSu) {
    if (!lichSu) lichSu = [];

    // --- TÍNH BTVN ---
    var btvnHT = 0, btvnKHT = 0;
    lichSu.forEach(function(item) {
        if (!isAbsentSession(item)) {
            var raw = normalizeStr(item.danhGiaBTVN || item.btvn || '');
            if (raw.includes('hoan') || raw.includes('tot') || raw === 'co' || raw.includes('day du') || raw.includes('xuat')) {
                btvnHT++;
            } else {
                btvnKHT++;
            }
        }
    });
    var btvnActive = btvnHT + btvnKHT; // buổi có học (không vắng)
    var btvnPct = btvnActive > 0 ? Math.round(btvnHT / btvnActive * 100) : 0;

    var btvnPctEl = document.getElementById('btvnPct');
    var btvnLegEl = document.getElementById('btvnLegend');
    if (btvnPctEl) btvnPctEl.textContent = btvnPct + '%';
    if (btvnLegEl) {
        btvnLegEl.innerHTML =
            donutLegItem('#10B981', 'Hoàn thành', btvnHT) +
            donutLegItem('#F97316', 'Chưa hoàn thành', btvnKHT);
    }

    // Khích lệ BTVN bằng huy hiệu / cúp
    var btvnRewardEl = document.getElementById('btvnRewardBadge');
    if (btvnRewardEl) {
        var btvnRewardHtml = "";
        if (btvnActive > 0) {
            if (btvnPct === 100) {
                btvnRewardHtml = '<div class="donut-reward-pill reward-trophy"><i class="fa-solid fa-trophy" style="color: #D97706;"></i> Chăm chỉ Xuất sắc 🏆</div>';
            } else if (btvnPct >= 90) {
                btvnRewardHtml = '<div class="donut-reward-pill reward-gold"><i class="fa-solid fa-medal" style="color: #2563EB;"></i> Tích cực Làm bài 🥇</div>';
            } else if (btvnPct >= 80) {
                btvnRewardHtml = '<div class="donut-reward-pill reward-silver"><i class="fa-solid fa-award" style="color: #059669;"></i> Tiến bộ Vượt bậc 🥈</div>';
            } else if (btvnPct >= 60) {
                btvnRewardHtml = '<div class="donut-reward-pill reward-cheer"><i class="fa-solid fa-star" style="color: #9333EA;"></i> Đang Cố gắng 🥉</div>';
            } else {
                btvnRewardHtml = '<div class="donut-reward-pill reward-cheer"><i class="fa-solid fa-hand-sparkles" style="color: #EA580C;"></i> Cần Cố gắng Hơn 💪</div>';
            }
        }
        btvnRewardEl.innerHTML = btvnRewardHtml;
    }

    var btvnCtx = document.getElementById('btvnChart');
    if (btvnCtx) {
        if (window._btvnInst) { window._btvnInst.destroy(); }
        var chartData = (btvnHT === 0 && btvnKHT === 0) ? [0, 1] : [btvnHT, btvnKHT];
        var chartColors = (btvnHT === 0 && btvnKHT === 0) ? ['#10B981', '#E2E8F0'] : ['#10B981', '#F97316'];
        window._btvnInst = new Chart(btvnCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: chartData,
                    backgroundColor: chartColors,
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '72%',
                responsive: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(c) {
                                var L = ['Hoàn thành', 'Chưa hoàn thành'];
                                return ' ' + (L[c.dataIndex] || '') + ': ' + c.raw + ' buổi';
                            }
                        }
                    }
                }
            }
        });
    }

    // --- TÍNH CHUYÊN CẦN ---
    var coMat = 0, vangHoc = 0;
    lichSu.forEach(function(item) {
        if (isAbsentSession(item)) { vangHoc++; } else { coMat++; }
    });
    var ccTotal = coMat + vangHoc;
    var ccPct = ccTotal > 0 ? Math.round(coMat / ccTotal * 100) : 0;

    var ccPctEl = document.getElementById('chuyenCanPct');
    var ccLegEl = document.getElementById('chuyenCanLegend');
    if (ccPctEl) ccPctEl.textContent = ccPct + '%';
    if (ccLegEl) {
        ccLegEl.innerHTML =
            donutLegItem('#3B82F6', 'Có mặt', coMat) +
            donutLegItem('#EF4444', 'Vắng', vangHoc);
    }

    // Khích lệ Chuyên cần bằng huy hiệu / cúp
    var ccRewardEl = document.getElementById('chuyenCanRewardBadge');
    if (ccRewardEl) {
        var ccRewardHtml = "";
        if (ccTotal > 0) {
            if (ccPct === 100) {
                ccRewardHtml = '<div class="donut-reward-pill reward-trophy"><i class="fa-solid fa-crown" style="color: #D97706;"></i> Chuyên cần 100% 👑</div>';
            } else if (ccPct >= 90) {
                ccRewardHtml = '<div class="donut-reward-pill reward-gold"><i class="fa-solid fa-medal" style="color: #2563EB;"></i> Đi học Đều đặn 🌟</div>';
            } else if (ccPct >= 80) {
                ccRewardHtml = '<div class="donut-reward-pill reward-silver"><i class="fa-solid fa-thumbs-up" style="color: #059669;"></i> Chuyên cần Tốt 👍</div>';
            } else {
                ccRewardHtml = '<div class="donut-reward-pill reward-cheer"><i class="fa-solid fa-seedling" style="color: #EA580C;"></i> Đi học Đều Hơn Nhé 🌱</div>';
            }
        }
        ccRewardEl.innerHTML = ccRewardHtml;
    }

    var ccCtx = document.getElementById('chuyenCanChart');
    if (ccCtx) {
        if (window._ccInst) { window._ccInst.destroy(); }
        window._ccInst = new Chart(ccCtx, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [coMat, vangHoc],
                    backgroundColor: ['#3B82F6', '#EF4444'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                cutout: '72%',
                responsive: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(c) {
                                var L = ['Có mặt', 'Vắng'];
                                return ' ' + L[c.dataIndex] + ': ' + c.raw + ' buổi';
                            }
                        }
                    }
                }
            }
        });
    }
}

function donutLegItem(color, label, count) {
    return '<div class="donut-legend-item">' +
        '<span class="donut-legend-dot" style="background:' + color + ';"></span>' +
        '<span>' + label + '</span>' +
        '<span class="donut-legend-count">' + count + '</span>' +
        '</div>';
}

// Hàm chuyển đổi link Google Drive sang link ảnh trực tiếp
function convertDriveLink(url) {
    if (!url) return "";
    var match = url.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    match = url.match(/id=([a-zA-Z0-9_-]+)/);
    if (match && match[1]) return "https://drive.google.com/uc?export=view&id=" + match[1];
    return url;
}

// ================= TUTOR LOGIC =================

function isSinglePageApp() {
    return (document.getElementById('mainScreen') !== null);
}

function quayLai() {
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
    }
    if (window._btvnInst) {
        window._btvnInst.destroy();
        window._btvnInst = null;
    }
    if (window._ccInst) {
        window._ccInst.destroy();
        window._ccInst = null;
    }
    sessionStorage.clear();
    if (isSinglePageApp()) {
        var resBox = document.getElementById('resultBox');
        if (resBox) resBox.style.display = 'none';
        var mainScr = document.getElementById('mainScreen');
        if (mainScr) mainScr.style.display = 'flex';
        navigateToPage('student');
    } else {
        window.location.href = 'student-login.html';
    }
}

// --- Student Dashboard UI Helpers ---
function hienThemBuoi() {
    var hiddenRows = document.querySelectorAll('.history-row.hidden-row');
    var showCount = 0;
    for (var i = 0; i < hiddenRows.length; i++) {
        if (showCount < 5) {
            hiddenRows[i].style.display = '';
            var nextDetail = hiddenRows[i].nextElementSibling;
            if (nextDetail && nextDetail.classList.contains('history-detail-row')) {
                nextDetail.style.display = 'table-row';
                nextDetail.classList.remove('hidden-row');
            }
            hiddenRows[i].classList.remove('hidden-row');
            showCount++;
        } else {
            break;
        }
    }
    
    // Ẩn nút nếu không còn dòng nào bị ẩn
    var remainingHidden = document.querySelectorAll('.history-row.hidden-row');
    if (remainingHidden.length === 0) {
        var loadMoreContainer = document.getElementById('loadMoreContainer');
        if (loadMoreContainer) loadMoreContainer.style.display = 'none';
    }
}

function toggleDataset(index) {
    if (!currentChartInstance) return;
    
    var meta = currentChartInstance.getDatasetMeta(index);
    var btn = (index === 0) ? document.getElementById('btnLegDauGio') : document.getElementById('btnLegDinhKi');
    if (!btn) return;
    
    // Đảo ngược trạng thái ẩn/hiện của dataset
    meta.hidden = meta.hidden === null ? !currentChartInstance.data.datasets[index].hidden : null;
    
    // Cập nhật lớp CSS (active/inactive) của nút
    if (meta.hidden) {
        btn.classList.remove('active');
        btn.classList.add('inactive');
    } else {
        btn.classList.remove('inactive');
        btn.classList.add('active');
    }
    
    // Nếu đường điểm đầu giờ bị ẩn, bật fill cho điểm định kì để luôn có gradient đẹp mắt
    var meta0 = currentChartInstance.getDatasetMeta(0);
    if (meta0 && meta0.hidden) {
        currentChartInstance.data.datasets[1].fill = true;
    } else {
        currentChartInstance.data.datasets[1].fill = false;
    }

    currentChartInstance.update();
}

function toggleAccordion(idx) {
    var body = document.getElementById('accordion-body-' + idx);
    if (!body) return;
    var item = body.closest('.accordion-item');
    
    if (body.style.display === 'flex') {
        body.style.display = 'none';
        if (item) item.classList.remove('active');
    } else {
        body.style.display = 'flex';
        if (item) item.classList.add('active');
    }
}

function toggleRowDetail(btn) {
    var tr = btn.closest('tr');
    var detailRow = tr ? tr.nextElementSibling : null;
    if (!detailRow) return;
    var isOpen = detailRow.style.display !== 'none';
    detailRow.style.display = isOpen ? 'none' : 'table-row';
    btn.classList.toggle('open', !isOpen);
}

function guiPhanHoiPhuHuynh() {
    var textarea = document.getElementById('feedbackInput');
    var btn = document.getElementById('btnSubmitFeedback');
    var msg = document.getElementById('feedbackMessage');
    if (!textarea || !btn || !msg) return;
    
    var content = textarea.value.trim();
    if (content === "") {
        msg.innerText = "Vui lòng nhập nội dung nhận xét/phản hồi trước khi gửi!";
        msg.className = "feedback-message-status error";
        msg.style.display = "block";
        return;
    }
    
    var maHS = sessionStorage.getItem('userPhone') || "";
    var tenHocSinh = currentStudentName;
    
    btn.disabled = true;
    btn.innerHTML = 'Đang gửi... <i class="fa-solid fa-circle-notch fa-spin"></i>';
    msg.style.display = 'none';
    
    // Kiểm tra môi trường Apps Script hoặc Local Demo API
    if (typeof google !== 'undefined' && google.script && google.script.run) {
        google.script.run
            .withSuccessHandler(function(response) {
                btn.disabled = false;
                btn.innerHTML = 'Gửi phản hồi <i class="fa-regular fa-paper-plane"></i>';
                if (response && response.thanhCong) {
                    textarea.value = "";
                    msg.innerText = "Gửi phản hồi thành công! Cảm ơn ý kiến đóng góp của phụ huynh.";
                    msg.className = "feedback-message-status success";
                    msg.style.display = "block";
                    setTimeout(function() {
                        msg.style.display = "none";
                    }, 5000);
                } else {
                    msg.innerText = "Lỗi khi gửi: " + (response.thongBao || "Không rõ nguyên nhân.");
                    msg.className = "feedback-message-status error";
                    msg.style.display = "block";
                }
            })
            .withFailureHandler(function(err) {
                btn.disabled = false;
                btn.innerHTML = 'Gửi phản hồi <i class="fa-regular fa-paper-plane"></i>';
                msg.innerText = "Lỗi hệ thống: " + err.toString();
                msg.className = "feedback-message-status error";
                msg.style.display = "block";
            })
            .guiPhanHoi(maHS, tenHocSinh, content);
    } else {
        // Mock demo handler
        setTimeout(function() {
            btn.disabled = false;
            btn.innerHTML = 'Gửi phản hồi <i class="fa-regular fa-paper-plane"></i>';
            textarea.value = "";
            msg.innerText = "Gửi phản hồi thành công! Cảm ơn ý kiến đóng góp của phụ huynh.";
            msg.className = "feedback-message-status success";
            msg.style.display = "block";
            setTimeout(function() {
                msg.style.display = "none";
            }, 5000);
        }, 500);
    }
}
