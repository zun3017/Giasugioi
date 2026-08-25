var currentChartInstance = null;
var currentStudentName = "";

function renderStudentView(ketQua) {
    if (!ketQua) return;
    
    // Đảm bảo có mảng danh sách lịch sử học tập
    var lichSu = ketQua.lichSuHocTap || ketQua.danhSachNhatKy || [];

    // Hủy biểu đồ cũ nếu có
    if (currentChartInstance) {
        currentChartInstance.destroy();
        currentChartInstance = null;
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
        loiChaoEl.innerHTML = 
            "<h3 style='color: #FFD23F; font-size: 20px; font-weight: 800; margin: 0 0 8px 0; text-align: center; font-family: Inter;'>Xin chào, <span style='color: #FFFFFF;'>" + (ketQua.tenHocSinh || 'Học sinh') + "</span> 👋</h3>" +
            "<p style='color: #A6ADCE; font-size: 13px; text-align: center; margin: 0 0 25px 0; font-family: Inter;'>(" + lopHoc + " • Số điện thoại: " + (studentPhone || ketQua.sdt || "") + ")</p>";
    }
    currentStudentName = ketQua.tenHocSinh || "";
    
    // Khôi phục trạng thái active cho các nút legend tùy chọn
    var btnDauGio = document.getElementById('btnLegDauGio');
    var btnDinhKi = document.getElementById('btnLegDinhKi');
    if (btnDauGio && btnDinhKi) {
        btnDauGio.className = 'legend-btn active btn-dau-gio';
        btnDinhKi.className = 'legend-btn active btn-dinh-ki';
    }
    
    // --- 1. HIỂN THỊ KHUNG THÔNG BÁO ---
    var khuVucThongBao = document.getElementById('khuVucThongBao');
    if (khuVucThongBao) {
        var thongBaoText = ketQua.thongBaoHocSinh || ketQua.thongBao || "";
        if (thongBaoText.trim() !== "") {
            khuVucThongBao.innerHTML = 
                '<div class="announcement-box has-msg">' +
                    '<div class="announcement-icon"><i class="fa-solid fa-bullhorn"></i></div>' +
                    '<div class="announcement-content">' +
                        '<div class="announcement-title">Thông báo từ gia sư</div>' +
                        '<div class="announcement-text">' + thongBaoText + '</div>' +
                    '</div>' +
                '</div>';
        } else {
            khuVucThongBao.innerHTML = 
                '<div class="announcement-box no-msg">' +
                    '<div class="announcement-icon"><i class="fa-regular fa-bell"></i></div>' +
                    '<div class="announcement-content">' +
                        '<div class="announcement-title">Thông báo</div>' +
                        '<div class="announcement-text">Chưa có thông báo</div>' +
                    '</div>' +
                '</div>';
        }
    }

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
                    if (btvnStr.indexOf("hoàn thành") !== -1 || btvnStr.indexOf("phụ huynh") !== -1 || btvnStr === "đạt" || btvnStr === "tốt") {
                        completedBTVNThangNay += 1.0;
                    } else if (btvnStr.indexOf("thiếu") !== -1) {
                        var match = btvnStr.match(/thiếu\s+(\d+)/);
                        if (match) {
                            var missingCount = parseInt(match[1], 10);
                            var completedCount = 5 - missingCount;
                            if (completedCount < 0) completedCount = 0;
                            completedBTVNThangNay += (completedCount / 5.0);
                        } else {
                            completedBTVNThangNay += 0.0;
                        }
                    } else if (btvnStr.indexOf("không làm") !== -1 || btvnStr.indexOf("chưa làm") !== -1 || btvnStr.indexOf("chưa nộp") !== -1) {
                        completedBTVNThangNay += 0.0;
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

    // Sinh huy chương vinh danh động cho 2 loại điểm
    function createScoreBadgeHtml(scoreNum) {
        if (scoreNum === null) return "";
        if (scoreNum >= 9.0) {
            return '<div class="medal-badge medal-academic"><i class="fa-solid fa-award"></i> Học giỏi 🎖️</div>';
        } else if (scoreNum >= 8.0) {
            return '<div class="medal-badge medal-silver"><i class="fa-solid fa-award"></i> Học khá 🎖️</div>';
        } else if (scoreNum >= 7.0) {
            return '<div class="medal-badge medal-bronze"><i class="fa-solid fa-award"></i> Học TB 🎖️</div>';
        } else {
            return '<div class="medal-badge" style="background: rgba(255, 51, 51, 0.15); border: 1px solid #FF3333; color: #FF3333; text-shadow: 0 0 5px rgba(255, 51, 51, 0.3);"><i class="fa-solid fa-triangle-exclamation"></i> Học yếu</div>';
        }
    }
    var badgeDauGioEl = document.getElementById('badgeDauGioContainer');
    if (badgeDauGioEl) badgeDauGioEl.innerHTML = createScoreBadgeHtml(numDiemDauGio);

    var badgeDinhKiEl = document.getElementById('badgeDinhKiContainer');
    if (badgeDinhKiEl) badgeDinhKiEl.innerHTML = createScoreBadgeHtml(numDiemDinhKi);

    var btvnBadgeHtml = "";
    if (btvnPercent !== null) {
        if (btvnPercent === 100) {
            btvnBadgeHtml = '<div class="medal-badge medal-platinum"><i class="fa-solid fa-trophy"></i> Chăm chỉ Xuất sắc 🏆</div>';
        } else if (btvnPercent >= 90) {
            btvnBadgeHtml = '<div class="medal-badge medal-gold"><i class="fa-solid fa-medal"></i> Tích cực 🥇</div>';
        } else if (btvnPercent >= 80) {
            btvnBadgeHtml = '<div class="medal-badge medal-silver"><i class="fa-solid fa-medal"></i> Tiến bộ 🥈</div>';
        } else if (btvnPercent >= 70) {
            btvnBadgeHtml = '<div class="medal-badge medal-bronze"><i class="fa-solid fa-medal"></i> Cố gắng 🥉</div>';
        }
    }
    var elBtvnBadge = document.getElementById('btvnBadgeContainer');
    if (elBtvnBadge) elBtvnBadge.innerHTML = btvnBadgeHtml;

    // --- 3. KHỞI TẠO BIỂU ĐỒ ĐIỂM SỐ ---
    var labels = [];
    var dataDauGio = [];
    var dataDinhKi = [];
    
    var lichSuVe = lichSu.slice();
    lichSuVe.forEach(function(item) {
        var rawDate = item.ngay || "";
        var shortDate = rawDate;
        var dateParts = rawDate.match(/(\d{1,2})\/(\d{1,2})/);
        if (dateParts) shortDate = dateParts[1] + "/" + dateParts[2];
        labels.push(shortDate);

        var valDG = parseFloat(item.diemDauGio || item.diemDG);
        var valDK = parseFloat(item.diemDinhKi || item.diemDK);

        dataDauGio.push(!isNaN(valDG) && valDG >= 0 && valDG <= 10 ? valDG : null);
        dataDinhKi.push(!isNaN(valDK) && valDK >= 0 && valDK <= 10 ? valDK : null);
    });

    var chartCanvas = document.getElementById('diemChart');
    if (chartCanvas && labels.length > 0) {
        var ctx = chartCanvas.getContext('2d');
        currentChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Điểm đầu giờ',
                        data: dataDauGio,
                        borderColor: '#8E4DFF',
                        backgroundColor: 'rgba(142, 77, 255, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#8E4DFF',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 5,
                        tension: 0.3,
                        spanGaps: true
                    },
                    {
                        label: 'Điểm định kì',
                        data: dataDinhKi,
                        borderColor: '#FFD23F',
                        backgroundColor: 'rgba(255, 210, 63, 0.1)',
                        borderWidth: 2,
                        pointBackgroundColor: '#FFD23F',
                        pointBorderColor: '#ffffff',
                        pointHoverRadius: 5,
                        tension: 0.3,
                        spanGaps: true
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        backgroundColor: 'rgba(11, 8, 38, 0.95)',
                        titleColor: '#FFF',
                        bodyColor: '#A6ADCE',
                        titleFont: { family: 'Inter', weight: 'bold', size: 11 },
                        bodyFont: { family: 'Inter', size: 10 },
                        borderColor: '#8E4DFF',
                        borderWidth: 1
                    }
                },
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: {
                            color: '#A6ADCE',
                            font: { family: 'Inter', size: 9.5 },
                            maxRotation: 45,
                            minRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 12
                        }
                    },
                    y: {
                        min: 0,
                        max: 10,
                        grid: { color: 'rgba(255, 255, 255, 0.03)' },
                        ticks: { color: '#A6ADCE', font: { family: 'Inter', size: 9.5 }, stepSize: 2 }
                    }
                }
            }
        });
    }

    // --- 4. RENDER BẢNG LỊCH SỬ & MOBILE CARDS ---
    var htmlLichSu = "";
    var totalBuoi = lichSu.length;
    if (totalBuoi > 0) {
        // Cập nhật tiêu đề Lịch sử có kèm tổng số buổi rõ ràng
        var historyHeaderEl = document.querySelector('#resultBox .result-section h4');
        if (historyHeaderEl && historyHeaderEl.innerHTML.includes('Lịch sử')) {
            historyHeaderEl.innerHTML = '<i class="fa-solid fa-clock-rotate-left"></i> Lịch sử Đánh giá Học tập <span style="font-size: 12px; color: #E2D1FF; font-weight: normal; margin-left: 8px;">(Tổng đã học: <b style="color:#10B981;">' + totalPresentAllTime + ' buổi</b> • Nghỉ: <b style="color:#F59E0B;">' + totalAbsentAllTime + ' buổi</b>)</span>';
        }

        // Đồng bộ hoàn toàn hàm getStatusBadge với web chính
        var getStatusBadge = function(trangThai) {
            if (isAbsentSession(trangThai)) return '<span class="status-badge badge-nghi">Hủy/Nghỉ</span>';
            var normTt = normalizeStr(trangThai);
            if (normTt.includes('hoc bu') || normTt.includes('da bu')) return '<span class="status-badge badge-hocbu">Học bù</span>';
            if (normTt.includes('di muon')) return '<span class="status-badge badge-hocbu" style="background:rgba(245,158,11,0.15); border-color:rgba(245,158,11,0.4); color:#F59E0B;">Đi muộn</span>';
            return '<span class="status-badge badge-dahoc">Có mặt</span>';
        };

        // Đồng bộ hoàn toàn hàm getBtvnBadge với web chính
        var getBtvnBadge = function(btvn) {
            var raw = (btvn || "").trim();
            var bt = raw.toLowerCase();
            if (!raw || raw === "-" || raw === "không có") return '<span class="status-badge" style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: #A6ADCE;">-</span>';
            if (bt.indexOf("hoàn thành") !== -1 || bt === "đạt" || bt === "tốt" || bt === "xuất sắc" || bt === "có") {
                return '<span class="status-badge badge-hoanthanh">' + raw + '</span>';
            }
            if (bt.indexOf("thiếu") !== -1) {
                return '<span class="status-badge badge-thieu">' + raw + '</span>';
            }
            if (bt.indexOf("không làm") !== -1 || bt.indexOf("chưa làm") !== -1 || bt.indexOf("chưa nộp") !== -1 || bt.indexOf("chưa đạt") !== -1 || bt === "không") {
                return '<span class="status-badge badge-nghi">' + raw + '</span>';
            }
            if (bt.indexOf("phụ huynh") !== -1 || bt.indexOf("nhắc") !== -1) {
                return '<span class="status-badge badge-hocbu" style="font-size:10.5px; padding:3px 8px;">' + raw + '</span>';
            }
            return '<span class="status-badge badge-hoanthanh">' + raw + '</span>';
        };

        // 1. Desktop View (Table)
        htmlLichSu += "<div class='desktop-table-view'>";
        htmlLichSu += "<table><tr><th>Tuần</th><th>Ngày dạy</th><th>Môn</th><th>Nội dung</th><th>Đánh giá BTVN</th><th>KT Đầu giờ</th><th>KT Định kì</th><th>Trạng thái</th></tr>";
        
        // 2. Mobile View (Accordion list)
        var htmlMobile = "<div class='mobile-cards-view'>";

        lichSu.slice().reverse().forEach(function(item, idx) {
            var styleStr = (idx >= 5) ? 'style="display: none;" class="history-row hidden-row"' : 'class="history-row"';
            var btvnValue = item.danhGiaBTVN || item.btvn || "";
            var diemDau = item.diemDauGio || item.diemDG || "-";
            var diemDinh = item.diemDinhKi || item.diemDK || "-";
            var badgeHtml = getStatusBadge(item);
            
            // Desktop Row
            htmlLichSu += "<tr " + styleStr + ">";
            htmlLichSu += "<td>" + (item.tuan || (idx + 1)) + "</td>";
            htmlLichSu += "<td>" + (item.ngay || "") + "</td>";
            htmlLichSu += "<td>" + (item.mon || "") + "</td>";
            htmlLichSu += "<td>" + (item.noiDung || item.topic || "") + "</td>";
            htmlLichSu += "<td>" + getBtvnBadge(btvnValue) + "</td>";
            htmlLichSu += "<td>" + diemDau + "</td>";
            htmlLichSu += "<td>" + diemDinh + "</td>";
            htmlLichSu += "<td>" + badgeHtml + "</td>";
            htmlLichSu += "</tr>";

            // Mobile Row (Accordion Card)
            var mobileStyleStr = (idx >= 5) ? 'style="display: none;" class="accordion-item history-row hidden-row"' : 'class="accordion-item history-row"';
            htmlMobile += "<div " + mobileStyleStr + ">";
            htmlMobile += "  <div class='accordion-header' onclick='toggleAccordion(" + idx + ")'>";
            htmlMobile += "    <div class='accordion-header-title'>";
            htmlMobile += "      <span>Tuần " + (item.tuan || (idx + 1)) + "</span>";
            htmlMobile += "      <span class='accordion-header-date'>" + (item.ngay || "") + "</span>";
            htmlMobile += "    </div>";
            htmlMobile += "    <div class='accordion-header-status'>";
            htmlMobile += "      " + badgeHtml;
            htmlMobile += "      <i class='fa-solid fa-chevron-down' id='chevron-" + idx + "'></i>";
            htmlMobile += "    </div>";
            htmlMobile += "  </div>";
            htmlMobile += "  <div class='accordion-body' id='accordion-body-" + idx + "'>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Môn học</span><span class='accordion-body-val'>" + (item.mon || "") + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Nội dung dạy học</span><span class='accordion-body-val'>" + (item.noiDung || item.topic || "") + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Đánh giá bài tập về nhà</span><span class='accordion-body-val'>" + getBtvnBadge(btvnValue) + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Kiểm tra đầu giờ</span><span class='accordion-body-val'>" + diemDau + "</span></div>";
            htmlMobile += "    <div class='accordion-body-row'><span class='accordion-body-label'>Kiểm tra định kì</span><span class='accordion-body-val'>" + diemDinh + "</span></div>";
            htmlMobile += "  </div>";
            htmlMobile += "</div>";
        });

        htmlLichSu += "</table></div>";
        htmlMobile += "</div>";
        
        htmlLichSu = htmlLichSu + htmlMobile;
    } else {
        htmlLichSu = "<p style='color: #A6ADCE;'>Chưa có dữ liệu đánh giá nào được cập nhật.</p>";
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
                htmlBaiTap += "<div><strong style='color: #FFD23F;'>[" + (bt.mon || "Gia sư") + "]</strong> <span style='color: #FFF; font-weight: 500; font-size: 15px; margin-left: 8px;'>" + (bt.tenBai || bt.title || "Tài liệu học tập") + "</span></div>";
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
