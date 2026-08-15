/**
 * CÔNG CỤ CHỤP ẢNH TOÀN TRANG HD (PNG) TỰ ĐỘNG CHO HỆ THỐNG GIA SƯ
 * Tích hợp trực tiếp trên mọi trang web:
 * 1. Tự động tăng độ tương phản (High Contrast), chữ trắng sáng #FFF, vàng #FFD23F
 * 2. Tự động ẩn các nút nổi (Zalo, Nút chụp, Mặt bàn che khuất)
 * 3. Sao chép trực tiếp biểu đồ Chart.js sang ảnh 100%
 * 4. Xuất ảnh độ nét cao 2x Retina HD
 */
(function() {
    function loadScript(src, callback) {
        if (document.querySelector('script[src="' + src + '"]')) {
            if (callback) callback();
            return;
        }
        var s = document.createElement('script');
        s.src = src;
        s.onload = callback;
        document.head.appendChild(s);
    }

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js', function() {
        loadScript('https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js', function() {
            initScreenshotButton();
        });
    });

    function initScreenshotButton() {
        if (document.getElementById('floatingScreenshotBtn')) return;

        var btn = document.createElement('button');
        btn.id = 'floatingScreenshotBtn';
        btn.innerHTML = '<i class="fa-solid fa-camera" style="font-size:16px;"></i> <span>Tải Ảnh Trang Này (HD)</span>';
        btn.style.cssText = `
            position: fixed;
            bottom: 25px;
            left: 25px;
            z-index: 999999;
            background: linear-gradient(135deg, #FFD23F 0%, #F59E0B 100%);
            color: #000;
            border: 2px solid #FFF;
            border-radius: 30px;
            padding: 12px 22px;
            font-family: 'Inter', sans-serif;
            font-size: 13.5px;
            font-weight: 800;
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 8px 30px rgba(0,0,0,0.6), 0 0 25px rgba(255,210,63,0.6);
            transition: all 0.25s ease;
        `;
        
        btn.onmouseover = function() { btn.style.transform = 'translateY(-3px) scale(1.05)'; };
        btn.onmouseout = function() { btn.style.transform = 'translateY(0) scale(1)'; };

        btn.onclick = function() {
            btn.style.display = 'none'; // Tự ẩn nút chụp
            
            var toast = document.createElement('div');
            toast.id = 'tempScreenshotToast';
            toast.innerText = '📸 Đang kết xuất ảnh Full HD toàn bộ trang...';
            toast.style.cssText = 'position:fixed;top:25px;right:25px;z-index:9999999;background:rgba(15,11,46,0.98);border:1px solid #10B981;color:#FFF;padding:14px 24px;border-radius:12px;font-weight:700;font-size:14px;box-shadow:0 10px 40px rgba(0,0,0,0.8);';
            document.body.appendChild(toast);

            var pageName = window.location.pathname.split('/').pop().replace('.html', '') || 'trang_chu_giasu';

            // Xử lý html2canvas với onclone quét toàn bộ DOM
            html2canvas(document.documentElement, {
                scale: 2, // Độ nét gấp 2 lần (Retina HD)
                useCORS: true,
                allowTaint: true,
                backgroundColor: '#070514',
                logging: false,
                scrollX: 0,
                scrollY: 0,
                onclone: function(clonedDoc) {
                    // 1. Tiêm CSS Tăng Cường Độ Tương Phản & Sáng Rõ Toàn Diện
                    var styleOverride = clonedDoc.createElement('style');
                    styleOverride.innerHTML = `
                        /* Ẩn các nút nổi và thông báo */
                        #floatingScreenshotBtn, #tempScreenshotToast, .fab-container, .homework-shortcut-left, .desk-surface {
                            display: none !important;
                        }

                        /* Nền trang đồng nhất tối sang trọng */
                        html, body {
                            background-color: #070514 !important;
                            background-image: none !important;
                            color: #FFFFFF !important;
                            overflow: visible !important;
                        }

                        /* Tăng độ sáng và khối cho tất cả các thẻ Card */
                        .card-box, .tutor-header-card, .search-card, .feature-card, .feature-card-premium, .result-section, #resultBox, .panel-box, .stat-card {
                            background: #120D33 !important;
                            border: 1px solid rgba(142, 77, 255, 0.4) !important;
                            box-shadow: 0 10px 30px rgba(0,0,0,0.7) !important;
                            opacity: 1 !important;
                        }

                        /* Bảng biểu: Làm sáng rõ từng dòng, cột, chữ số */
                        table {
                            background: #0E0A28 !important;
                            border: 1px solid rgba(255,255,255,0.1) !important;
                        }
                        th {
                            background: rgba(142,77,255,0.25) !important;
                            color: #E2D1FF !important;
                            font-weight: 800 !important;
                            font-size: 13.5px !important;
                            border-bottom: 2px solid rgba(142,77,255,0.5) !important;
                        }
                        td {
                            color: #F8FAFC !important;
                            font-weight: 600 !important;
                            font-size: 13px !important;
                            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
                        }
                        tr:hover td {
                            background: rgba(142,77,255,0.1) !important;
                        }

                        /* Tăng độ sáng cho tất cả các văn bản và tiêu đề */
                        h1, h2, h3, h4, h5, h6, strong, b {
                            color: #FFFFFF !important;
                            opacity: 1 !important;
                            text-shadow: none !important;
                        }
                        p, span, label, small, div {
                            opacity: 1 !important;
                        }
                        .text-muted, [class*="muted"], [class*="subtitle"], .sub-title {
                            color: #CBD5E1 !important;
                            opacity: 1 !important;
                        }

                        /* Màu sắc điểm nhấn rực rỡ */
                        .highlight, [class*="gold"], [class*="yellow"] {
                            color: #FFD23F !important;
                            -webkit-text-fill-color: #FFD23F !important;
                            background: none !important;
                        }
                        .section-title {
                            color: #FFFFFF !important;
                            background: none !important;
                            -webkit-text-fill-color: #FFFFFF !important;
                            font-weight: 800 !important;
                        }
                        .main-title {
                            color: #FFFFFF !important;
                            font-weight: 900 !important;
                            text-shadow: 0 0 20px rgba(255,255,255,0.3) !important;
                        }

                        /* Ô nhập liệu sáng rõ */
                        input, select, textarea {
                            background: #060412 !important;
                            color: #FFFFFF !important;
                            border: 1px solid rgba(142, 77, 255, 0.6) !important;
                            opacity: 1 !important;
                        }

                        /* Mở sáng 100% các thành phần hiệu ứng cuộn */
                        .fade-up, .fade-in, [class*="fade"] {
                            opacity: 1 !important;
                            transform: none !important;
                            visibility: visible !important;
                            transition: none !important;
                            animation: none !important;
                        }
                    `;
                    clonedDoc.head.appendChild(styleOverride);

                    // 2. Sao chép trực tiếp nội dung các thẻ Canvas (Biểu đồ Chart.js)
                    var origCanvases = document.querySelectorAll('canvas');
                    var clonedCanvases = clonedDoc.querySelectorAll('canvas');
                    for (var i = 0; i < origCanvases.length; i++) {
                        if (clonedCanvases[i]) {
                            try {
                                var destCtx = clonedCanvases[i].getContext('2d');
                                destCtx.drawImage(origCanvases[i], 0, 0);
                            } catch(e) {}
                        }
                    }
                }
            }).then(function(canvas) {
                canvas.toBlob(function(blob) {
                    saveAs(blob, pageName + '_screenshot_HD.png');
                    toast.innerText = '✅ Đã tải ảnh HD thành công!';
                    setTimeout(function() { toast.remove(); }, 2000);
                    btn.style.display = 'flex';
                }, 'image/png');
            }).catch(function(err) {
                console.error(err);
                toast.innerText = '❌ Lỗi: ' + err.message;
                setTimeout(function() { toast.remove(); }, 3000);
                btn.style.display = 'flex';
            });
        };

        document.body.appendChild(btn);
    }
})();
