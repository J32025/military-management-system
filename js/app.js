/**
 * app.js — Main SPA Application
 * ระบบบริหารจัดการ กกล.ยก.ทหาร
 */
(function () {
  'use strict';

  /* ================================================================
     STATE
  ================================================================ */
  var App = {
    user:  null,   // { id, username, role, fullname, dept }
    page:  null,   // current page hash (without #)
    cache: {
      cars: [],
      drivers: [],
      settings: {},
      carDropdown: []
    },
    charts: {}     // chart instances keyed by canvas id
  };

  var PAGE_LABELS = {
    'dashboard':     'ภาพรวม',
    'booking':       'จองรถ',
    'preapprove':    'รออนุมัติ',
    'approve':       'อนุมัติแล้ว',
    'mileout':       'ไมล์ออก',
    'milein':        'ไมล์เข้า',
    'mission-close': 'ปิดภารกิจ',
    'car-status':    'สถานะรถ',
    'car-daily':     'รถวันนี้',
    'history':       'ประวัติ',
    'personnel':     'กำลังพล',
    'housing':       'ที่พัก',
    'schedule':      'ตารางเวร',
    'cancel':        'ยกเลิกการจอง',
    'admin-users':   'จัดการผู้ใช้',
    'admin-cars':    'จัดการรถ',
    'admin-drivers': 'จัดการคนขับ',
    'settings':      'ตั้งค่าระบบ'
  };

  var ROLE_LABELS = {
    'admin':    'ผู้ดูแลระบบ',
    'vip':      'ผู้บังคับบัญชา',
    'user':     'ผู้ใช้งาน',
    'finance':  'การเงิน',
    'schedule': 'นายเวร'
  };

  /* ================================================================
     UTILITIES
  ================================================================ */

  function showToast(message, type) {
    type = type || 'info';
    var colorMap = { success: 'bg-success', danger: 'bg-danger', warning: 'bg-warning text-dark', info: 'bg-primary' };
    var iconMap  = { success: 'fa-check-circle', danger: 'fa-times-circle', warning: 'fa-exclamation-triangle', info: 'fa-info-circle' };
    var bgClass  = colorMap[type] || 'bg-primary';
    var icon     = iconMap[type]  || 'fa-info-circle';
    var id = 'toast-' + Date.now();
    var html = '<div id="' + id + '" class="toast align-items-center text-white ' + bgClass + ' border-0" role="alert" aria-live="assertive" aria-atomic="true">'
             + '  <div class="d-flex">'
             + '    <div class="toast-body"><i class="fas ' + icon + ' me-2"></i>' + message + '</div>'
             + '    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>'
             + '  </div>'
             + '</div>';
    var container = document.getElementById('toast-container');
    container.insertAdjacentHTML('beforeend', html);
    var el = document.getElementById(id);
    var toast = new bootstrap.Toast(el, { delay: 4000 });
    toast.show();
    el.addEventListener('hidden.bs.toast', function () { el.remove(); });
  }

  function showLoading() {
    document.getElementById('loading-overlay').style.display = 'flex';
  }

  function hideLoading() {
    document.getElementById('loading-overlay').style.display = 'none';
  }

  function formatDate(str) {
    if (!str) return '-';
    var d = new Date(str);
    if (isNaN(d.getTime())) return str;
    return d.toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  function formatDateInput(str) {
    if (!str) return '';
    var d = new Date(str);
    if (isNaN(d.getTime())) return '';
    var y = d.getFullYear();
    var m = String(d.getMonth() + 1).padStart(2, '0');
    var dd = String(d.getDate()).padStart(2, '0');
    return y + '-' + m + '-' + dd;
  }

  function getUser() { return App.user; }

  function hasRole(rolesArray) {
    if (!App.user) return false;
    if (rolesArray.indexOf('all') !== -1) return true;
    return rolesArray.indexOf(App.user.role) !== -1;
  }

  function navigate(hash) {
    window.location.hash = hash;
  }

  function statusBadge(status) {
    var map = {
      'ว่าง':           '<span class="badge badge-available">ว่าง</span>',
      'กำลังใช้งาน':   '<span class="badge badge-inuse">กำลังใช้งาน</span>',
      'รออนุมัติ':      '<span class="badge badge-pending">รออนุมัติ</span>',
      'อนุมัติแล้ว':   '<span class="badge badge-approved">อนุมัติแล้ว</span>',
      'ยกเลิก':        '<span class="badge badge-cancel">ยกเลิก</span>',
      'ปิดภารกิจแล้ว': '<span class="badge badge-closed">ปิดภารกิจ</span>'
    };
    return map[status] || '<span class="badge bg-secondary">' + (status || '-') + '</span>';
  }

  function buildTable(headers, rows, options) {
    options = options || {};
    var tableId = options.id ? ' id="' + options.id + '"' : '';
    var html = '<div class="table-responsive"><table' + tableId + ' class="table table-striped table-hover align-middle mb-0">';
    html += '<thead class="table-dark"><tr>';
    headers.forEach(function (h) { html += '<th>' + h + '</th>'; });
    html += '</tr></thead><tbody>';
    if (!rows || rows.length === 0) {
      html += '<tr><td colspan="' + headers.length + '" class="text-center text-muted py-4"><i class="fas fa-inbox me-2"></i>ไม่พบข้อมูล</td></tr>';
    } else {
      rows.forEach(function (row) {
        html += '<tr>';
        row.forEach(function (cell) { html += '<td>' + (cell !== null && cell !== undefined ? cell : '-') + '</td>'; });
        html += '</tr>';
      });
    }
    html += '</tbody></table></div>';
    return html;
  }

  function pageHeader(title, icon) {
    return '<div class="page-header mb-4">'
         + '  <h5 class="page-title"><i class="fas ' + icon + ' me-2 text-accent"></i>' + title + '</h5>'
         + '</div>';
  }

  function destroyChart(id) {
    if (App.charts[id]) {
      App.charts[id].destroy();
      delete App.charts[id];
    }
  }

  /* ================================================================
     SESSION MANAGEMENT
  ================================================================ */

  App.init = function () {
    var saved = sessionStorage.getItem('app_user');
    if (saved) {
      try {
        App.user = JSON.parse(saved);
        showAppShell();
        route();
      } catch (e) {
        showLoginScreen();
      }
    } else {
      showLoginScreen();
    }

    // Event: login button
    document.getElementById('login-btn').addEventListener('click', function () {
      var u = document.getElementById('login-username').value.trim();
      var p = document.getElementById('login-password').value;
      if (!u || !p) { showLoginAlert('กรุณากรอกชื่อผู้ใช้และรหัสผ่าน'); return; }
      App.login(u, p);
    });

    // Enter key on password
    document.getElementById('login-password').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('login-btn').click();
    });
    document.getElementById('login-username').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') document.getElementById('login-password').focus();
    });

    // Toggle password visibility
    document.getElementById('toggle-pw').addEventListener('click', function () {
      var pw = document.getElementById('login-password');
      var icon = this.querySelector('i');
      if (pw.type === 'password') {
        pw.type = 'text';
        icon.className = 'fas fa-eye-slash';
      } else {
        pw.type = 'password';
        icon.className = 'fas fa-eye';
      }
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', function () {
      App.logout();
    });

    // Sidebar toggle
    document.getElementById('sidebar-toggle').addEventListener('click', function () {
      var sidebar  = document.getElementById('sidebar');
      var main     = document.getElementById('main-content');
      var overlay  = document.getElementById('sidebar-overlay');
      if (window.innerWidth < 768) {
        sidebar.classList.toggle('sidebar-open');
        overlay.classList.toggle('d-none');
      } else {
        sidebar.classList.toggle('sidebar-collapsed');
        main.classList.toggle('main-expanded');
      }
    });

    // Sidebar close (mobile)
    var closeBtn = document.getElementById('sidebar-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        document.getElementById('sidebar').classList.remove('sidebar-open');
        document.getElementById('sidebar-overlay').classList.add('d-none');
      });
    }
    document.getElementById('sidebar-overlay').addEventListener('click', function () {
      document.getElementById('sidebar').classList.remove('sidebar-open');
      this.classList.add('d-none');
    });

    // Hash change → router
    window.addEventListener('hashchange', function () { route(); });
  };

  App.login = function (username, password) {
    var btn     = document.getElementById('login-btn');
    var btnText = document.getElementById('login-btn-text');
    var spinner = document.getElementById('login-btn-spinner');
    btn.disabled = true;
    btnText.classList.add('d-none');
    spinner.classList.remove('d-none');
    hideLoginAlert();

    API.login(username, password)
      .then(function (user) {
        if (!user || !user.username) {
          throw new Error('ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
        }
        App.user = user;
        if (!App.user.role) App.user.role = 'user';
        sessionStorage.setItem('app_user', JSON.stringify(App.user));
        // Log IP in background
        try {
          fetch('https://api.ipify.org?format=json')
            .then(function (r) { return r.json(); })
            .then(function (d) { API.logIp(username, d.ip || '', navigator.userAgent); })
            .catch(function () {});
        } catch (e) {}
        showAppShell();
        navigate('dashboard');
      })
      .catch(function (err) {
        showLoginAlert(err && err.message ? err.message : 'เกิดข้อผิดพลาด กรุณาลองใหม่');
      })
      .finally(function () {
        btn.disabled = false;
        btnText.classList.remove('d-none');
        spinner.classList.add('d-none');
      });
  };

  App.logout = function () {
    sessionStorage.removeItem('app_user');
    App.user  = null;
    App.cache = { cars: [], drivers: [], settings: {}, carDropdown: [] };
    // Destroy all charts
    Object.keys(App.charts).forEach(function (k) {
      try { App.charts[k].destroy(); } catch (e) {}
    });
    App.charts = {};
    showLoginScreen();
  };

  /* ================================================================
     SHOW / HIDE SCREENS
  ================================================================ */

  function showLoginScreen() {
    document.getElementById('login-screen').style.display = '';
    document.getElementById('app-shell').style.display = 'none';
    document.getElementById('login-username').value = '';
    document.getElementById('login-password').value = '';
    hideLoginAlert();
  }

  function showLoginAlert(msg) {
    var el = document.getElementById('login-alert');
    el.textContent = msg;
    el.classList.remove('d-none');
  }

  function hideLoginAlert() {
    document.getElementById('login-alert').classList.add('d-none');
  }

  function showAppShell() {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('app-shell').style.display = '';
    // Populate user info
    document.getElementById('sidebar-username').textContent = App.user.fullname || App.user.username || '-';
    document.getElementById('sidebar-role').textContent     = ROLE_LABELS[App.user.role] || App.user.role || '-';
    document.getElementById('topnav-username').textContent  = App.user.fullname || App.user.username || '';
    // Build role-filtered menu
    buildMenu();
  }

  /* ================================================================
     MENU BUILDING
  ================================================================ */

  function buildMenu() {
    var items = document.querySelectorAll('#sidebar-menu .sidebar-item');
    items.forEach(function (item) {
      var rolesAttr = item.getAttribute('data-roles') || 'all';
      var roles = rolesAttr.split(',').map(function (r) { return r.trim(); });
      if (hasRole(roles)) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
    // Also hide section labels if all items below are hidden
    var sections = document.querySelectorAll('#sidebar-menu .sidebar-section-label');
    sections.forEach(function (label) {
      var next = label.nextElementSibling;
      var hasVisible = false;
      while (next && !next.classList.contains('sidebar-section-label')) {
        if (next.style.display !== 'none') { hasVisible = true; break; }
        next = next.nextElementSibling;
      }
      label.style.display = hasVisible ? '' : 'none';
    });
  }

  function setActiveMenu(page) {
    document.querySelectorAll('#sidebar-menu .sidebar-item').forEach(function (item) {
      item.classList.toggle('active', item.getAttribute('data-page') === page);
    });
    var label = PAGE_LABELS[page] || page;
    document.getElementById('breadcrumb-current').textContent = label;
  }

  /* ================================================================
     ROUTER
  ================================================================ */

  function route() {
    if (!App.user) { showLoginScreen(); return; }
    var hash = window.location.hash.replace('#', '') || 'dashboard';
    App.page = hash;
    setActiveMenu(hash);

    var pc = document.getElementById('page-content');
    pc.innerHTML = '<div class="d-flex justify-content-center align-items-center py-5"><div class="spinner-border text-primary"></div></div>';

    // Destroy any existing charts
    Object.keys(App.charts).forEach(function (k) {
      try { App.charts[k].destroy(); } catch (e) {}
    });
    App.charts = {};

    switch (hash) {
      case 'dashboard':     renderDashboard();    break;
      case 'booking':       renderBooking();      break;
      case 'preapprove':    renderPreApprove();   break;
      case 'approve':       renderApprove();      break;
      case 'mileout':       renderMileOut();      break;
      case 'milein':        renderMileIn();       break;
      case 'mission-close': renderMissionClose(); break;
      case 'car-status':    renderCarStatus();    break;
      case 'car-daily':     renderCarDaily();     break;
      case 'history':       renderHistory();      break;
      case 'personnel':     renderPersonnel();    break;
      case 'housing':       renderHousing();      break;
      case 'schedule':      renderSchedule();     break;
      case 'cancel':        renderCancel();       break;
      case 'admin-users':   renderAdminUsers();   break;
      case 'admin-cars':    renderAdminCars();    break;
      case 'admin-drivers': renderAdminDrivers(); break;
      case 'settings':      renderSettings();     break;
      default:              renderNotFound(hash); break;
    }
  }

  function renderNotFound(hash) {
    document.getElementById('page-content').innerHTML =
      '<div class="text-center py-5 text-muted">'
    + '<i class="fas fa-exclamation-triangle fa-3x mb-3"></i>'
    + '<h5>ไม่พบหน้า: #' + hash + '</h5>'
    + '</div>';
  }

  /* ================================================================
     PAGE: DASHBOARD
  ================================================================ */

  function renderDashboard() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ภาพรวมระบบ', 'fa-chart-line')
      + '<div class="row g-3 mb-4" id="dash-cards">'
      + '  <div class="col-12 text-center py-3"><div class="spinner-border text-primary"></div></div>'
      + '</div>'
      + '<div class="row g-3">'
      + '  <div class="col-lg-8"><div class="card card-custom"><div class="card-header-custom">การใช้รถ (รายเดือน)</div><div class="card-body"><canvas id="barChart" height="100"></canvas></div></div></div>'
      + '  <div class="col-lg-4"><div class="card card-custom"><div class="card-header-custom">สัดส่วนสถานะรถ</div><div class="card-body"><canvas id="pieChart" height="200"></canvas></div></div></div>'
      + '</div>';

    API.getDashboard()
      .then(function (data) {
        data = data || {};
        var pending   = data.pending  || 0;
        var approved  = data.approved || 0;
        var inuse     = data.inuse    || 0;
        var available = data.available|| 0;
        var cards = [
          { label: 'รออนุมัติ',     value: pending,   icon: 'fa-clock',       color: 'border-warning', iconColor: 'text-warning' },
          { label: 'อนุมัติแล้ว',   value: approved,  icon: 'fa-check-circle',color: 'border-success', iconColor: 'text-success' },
          { label: 'กำลังใช้งาน',   value: inuse,     icon: 'fa-car',         color: 'border-primary', iconColor: 'text-primary' },
          { label: 'รถว่าง',        value: available, icon: 'fa-parking',     color: 'border-info',    iconColor: 'text-info'    }
        ];
        var html = cards.map(function (c) {
          return '<div class="col-sm-6 col-xl-3">'
               + '<div class="stat-card ' + c.color + '">'
               + '  <div class="stat-icon ' + c.iconColor + '"><i class="fas ' + c.icon + '"></i></div>'
               + '  <div class="stat-body"><div class="stat-value">' + c.value + '</div><div class="stat-label">' + c.label + '</div></div>'
               + '</div></div>';
        }).join('');
        document.getElementById('dash-cards').innerHTML = html;
      })
      .catch(function () {
        document.getElementById('dash-cards').innerHTML = '<div class="col-12"><div class="alert alert-warning">ไม่สามารถโหลดข้อมูลได้</div></div>';
      });

    API.getBarChart()
      .then(function (data) {
        data = data || {};
        var canvas = document.getElementById('barChart');
        if (!canvas) return;
        destroyChart('barChart');
        App.charts['barChart'] = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: data.labels || ['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],
            datasets: [{
              label: 'จำนวนครั้ง',
              data: data.values || [],
              backgroundColor: 'rgba(74,124,89,0.75)',
              borderColor: '#4a7c59',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } }
          }
        });
      })
      .catch(function () {});

    API.getDashboard()
      .then(function (data) {
        data = data || {};
        var canvas = document.getElementById('pieChart');
        if (!canvas) return;
        destroyChart('pieChart');
        App.charts['pieChart'] = new Chart(canvas, {
          type: 'doughnut',
          data: {
            labels: ['ว่าง', 'กำลังใช้งาน', 'รออนุมัติ'],
            datasets: [{
              data: [data.available || 0, data.inuse || 0, data.pending || 0],
              backgroundColor: ['#4fbf8a','#f59e0b','#3b82f6'],
              borderWidth: 2
            }]
          },
          options: {
            responsive: true,
            plugins: { legend: { position: 'bottom' } },
            cutout: '65%'
          }
        });
      })
      .catch(function () {});
  }

  /* ================================================================
     PAGE: BOOKING
  ================================================================ */

  function renderBooking() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('จองรถ', 'fa-calendar-plus')
      + '<div class="row g-3">'
      + '<div class="col-lg-5">'
      + '<div class="card card-custom">'
      + '<div class="card-header-custom">แบบฟอร์มจองรถ</div>'
      + '<div class="card-body">'
      + '<form id="booking-form">'
      + '<div class="mb-2"><label class="form-label">ยศ-ชื่อ-สกุล <span class="text-danger">*</span></label>'
      + '<input type="text" class="form-control" id="bk-name" required placeholder="ยศ ชื่อ สกุล" /></div>'
      + '<div class="mb-2"><label class="form-label">แผนก / หน่วย <span class="text-danger">*</span></label>'
      + '<input type="text" class="form-control" id="bk-dept" required /></div>'
      + '<div class="mb-2"><label class="form-label">ประเภทรถ <span class="text-danger">*</span></label>'
      + '<select class="form-select" id="bk-car"><option value="">-- เลือกประเภทรถ --</option></select></div>'
      + '<div class="mb-2"><label class="form-label">จุดหมาย / ภารกิจ <span class="text-danger">*</span></label>'
      + '<input type="text" class="form-control" id="bk-dest" required /></div>'
      + '<div class="row g-2 mb-2">'
      + '<div class="col"><label class="form-label">วันที่เริ่ม <span class="text-danger">*</span></label>'
      + '<input type="date" class="form-control" id="bk-start" required /></div>'
      + '<div class="col"><label class="form-label">วันสิ้นสุด <span class="text-danger">*</span></label>'
      + '<input type="date" class="form-control" id="bk-end" required /></div>'
      + '</div>'
      + '<div class="mb-2"><label class="form-label">เวลา</label>'
      + '<input type="time" class="form-control" id="bk-time" /></div>'
      + '<div class="mb-2"><label class="form-label">ชื่อผู้ขับ</label>'
      + '<input type="text" class="form-control" id="bk-driver" /></div>'
      + '<div class="mb-3"><label class="form-label">หมายเหตุ</label>'
      + '<textarea class="form-control" id="bk-remark" rows="2"></textarea></div>'
      + '<button type="submit" class="btn btn-success w-100"><i class="fas fa-paper-plane me-2"></i>ส่งคำขอจอง</button>'
      + '</form></div></div></div>'
      + '<div class="col-lg-7">'
      + '<div class="card card-custom">'
      + '<div class="card-header-custom">รายการจองล่าสุด</div>'
      + '<div class="card-body p-0" id="booking-table-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div></div></div>';

    // Load car dropdown
    API.getCarDropdown()
      .then(function (list) {
        App.cache.carDropdown = list || [];
        var sel = document.getElementById('bk-car');
        (list || []).forEach(function (c) {
          var opt = document.createElement('option');
          opt.value = c.id || c.name || c;
          opt.textContent = c.name || c;
          sel.appendChild(opt);
        });
      })
      .catch(function () {});

    // Set default dates
    var today = new Date();
    var todayStr = formatDateInput(today.toISOString());
    document.getElementById('bk-start').value = todayStr;
    document.getElementById('bk-end').value   = todayStr;

    // Load bookings list
    loadBookingList();

    // Form submit
    document.getElementById('booking-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var obj = {
        name:    document.getElementById('bk-name').value.trim(),
        dept:    document.getElementById('bk-dept').value.trim(),
        carId:   document.getElementById('bk-car').value,
        dest:    document.getElementById('bk-dest').value.trim(),
        dateStart: document.getElementById('bk-start').value,
        dateEnd:   document.getElementById('bk-end').value,
        time:    document.getElementById('bk-time').value,
        driver:  document.getElementById('bk-driver').value.trim(),
        remark:  document.getElementById('bk-remark').value.trim(),
        username: App.user.username
      };
      if (!obj.name || !obj.dept || !obj.carId || !obj.dest || !obj.dateStart || !obj.dateEnd) {
        showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบ', 'warning'); return;
      }
      showLoading();
      API.createBooking(obj)
        .then(function (res) {
          if (res && res.status === 'error') throw new Error(res.message);
          showToast('ส่งคำขอจองเรียบร้อยแล้ว', 'success');
          document.getElementById('booking-form').reset();
          document.getElementById('bk-start').value = todayStr;
          document.getElementById('bk-end').value   = todayStr;
          loadBookingList();
        })
        .catch(function (err) { showToast(err.message || 'เกิดข้อผิดพลาด', 'danger'); })
        .finally(hideLoading);
    });
  }

  function loadBookingList() {
    var wrap = document.getElementById('booking-table-wrap');
    if (!wrap) return;
    API.getBookings()
      .then(function (list) {
        list = list || [];
        var rows = list.slice(0, 20).map(function (b, i) {
          return [i+1, b.name||'-', b.dept||'-', b.carName||b.carId||'-', formatDate(b.dateStart), statusBadge(b.status)];
        });
        wrap.innerHTML = buildTable(['#','ชื่อ','แผนก','รถ','วันที่','สถานะ'], rows);
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
  }

  /* ================================================================
     PAGE: PRE-APPROVE
  ================================================================ */

  function renderPreApprove() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('รายการรออนุมัติ', 'fa-clock')
      + '<div class="card card-custom mb-3">'
      + '<div class="card-body">'
      + '<div class="row g-2 align-items-end">'
      + '<div class="col-sm-6 col-md-4">'
      + '<label class="form-label">ค้นหาตามแผนก</label>'
      + '<input type="text" class="form-control" id="pa-search" placeholder="ชื่อแผนก..." />'
      + '</div>'
      + '<div class="col-auto">'
      + '<button class="btn btn-primary" id="pa-search-btn"><i class="fas fa-search me-1"></i>ค้นหา</button>'
      + '<button class="btn btn-outline-secondary ms-2" id="pa-reset-btn"><i class="fas fa-redo me-1"></i>รีเซ็ต</button>'
      + '</div></div></div></div>'
      + '<div class="card card-custom">'
      + '<div class="card-header-custom">รายการรออนุมัติ</div>'
      + '<div class="card-body p-0" id="pa-table-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div>';

    function loadPA(searchDept) {
      var wrap = document.getElementById('pa-table-wrap');
      if (!wrap) return;
      var p = searchDept ? API.searchApproval({ dept: searchDept }) : API.getPreApproveList();
      p.then(function (list) {
        list = list || [];
        var rows = list.map(function (b, i) {
          var approveBtn = '<button class="btn btn-sm btn-success me-1 pa-approve-btn" data-id="' + (b.id||'') + '" data-name="' + (b.name||'') + '"><i class="fas fa-check"></i> อนุมัติ</button>';
          var rejectBtn  = '<button class="btn btn-sm btn-danger pa-reject-btn"  data-id="' + (b.id||'') + '" data-name="' + (b.name||'') + '"><i class="fas fa-times"></i> ปฏิเสธ</button>';
          return [i+1, b.name||'-', b.dept||'-', b.carName||b.carId||'-', formatDate(b.dateStart), statusBadge(b.status||'รออนุมัติ'), approveBtn+rejectBtn];
        });
        wrap.innerHTML = buildTable(['#','ชื่อ','แผนก','รถ','วันที่','สถานะ','การดำเนินการ'], rows);
        // Approve buttons
        wrap.querySelectorAll('.pa-approve-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!confirm('อนุมัติคำขอของ ' + this.dataset.name + ' ?')) return;
            showLoading();
            API.approve({ id: this.dataset.id, approvedBy: App.user.username })
              .then(function () { showToast('อนุมัติเรียบร้อย', 'success'); loadPA(); })
              .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
              .finally(hideLoading);
          });
        });
        // Reject buttons
        wrap.querySelectorAll('.pa-reject-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var reason = prompt('เหตุผลการปฏิเสธ (ถ้ามี):');
            if (reason === null) return;
            showLoading();
            API.reject({ id: this.dataset.id, reason: reason, rejectedBy: App.user.username })
              .then(function () { showToast('ปฏิเสธเรียบร้อย', 'info'); loadPA(); })
              .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
              .finally(hideLoading);
          });
        });
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadPA();
    document.getElementById('pa-search-btn').addEventListener('click', function () {
      loadPA(document.getElementById('pa-search').value.trim());
    });
    document.getElementById('pa-reset-btn').addEventListener('click', function () {
      document.getElementById('pa-search').value = '';
      loadPA();
    });
  }

  /* ================================================================
     PAGE: APPROVE
  ================================================================ */

  function renderApprove() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('รายการอนุมัติแล้ว', 'fa-check-circle')
      + '<ul class="nav nav-tabs mb-3" id="approveTabs">'
      + '  <li class="nav-item"><button class="nav-link active" data-tab="1">อาคาร 1</button></li>'
      + '  <li class="nav-item"><button class="nav-link" data-tab="2">อาคาร 2</button></li>'
      + '</ul>'
      + '<div id="approve-content"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>';

    function loadApprove(building) {
      var wrap = document.getElementById('approve-content');
      if (!wrap) return;
      wrap.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';
      var p = building === 2 ? API.getApprovedList2() : API.getApprovedList();
      p.then(function (list) {
        list = list || [];
        var rows = list.map(function (b, i) {
          var editBtn = '<button class="btn btn-sm btn-outline-primary ap-driver-btn" data-id="' + (b.id||'') + '" data-driver="' + (b.driver||'') + '"><i class="fas fa-edit me-1"></i>แก้ไขคนขับ</button>';
          return [i+1, b.name||'-', b.dept||'-', b.carName||b.carId||'-', b.driver||'-', formatDate(b.dateStart), formatDate(b.dateEnd), statusBadge(b.status), editBtn];
        });
        wrap.innerHTML = '<div class="card card-custom"><div class="card-body p-0">'
          + buildTable(['#','ชื่อ','แผนก','รถ','คนขับ','วันเริ่ม','วันสิ้นสุด','สถานะ','การดำเนินการ'], rows)
          + '</div></div>';
        // Assign driver buttons
        wrap.querySelectorAll('.ap-driver-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var newDriver = prompt('ชื่อคนขับใหม่:', this.dataset.driver || '');
            if (newDriver === null) return;
            showLoading();
            API.approve({ id: this.dataset.id, driver: newDriver.trim(), updatedBy: App.user.username })
              .then(function () { showToast('บันทึกคนขับเรียบร้อย', 'success'); loadApprove(building); })
              .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
              .finally(hideLoading);
          });
        });
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    var currentBuilding = 1;
    loadApprove(1);

    document.querySelectorAll('#approveTabs .nav-link').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('#approveTabs .nav-link').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        currentBuilding = parseInt(this.dataset.tab);
        loadApprove(currentBuilding);
      });
    });
  }

  /* ================================================================
     PAGE: MILEOUT
  ================================================================ */

  function renderMileOut() {
    renderMilePage('out');
  }

  function renderMileIn() {
    renderMilePage('in');
  }

  function renderMilePage(direction) {
    var isOut   = direction === 'out';
    var title   = isOut ? 'บันทึกไมล์ออก' : 'บันทึกไมล์เข้า';
    var icon    = isOut ? 'fa-arrow-right' : 'fa-arrow-left';
    var modalId = 'mile-modal';
    var pc      = document.getElementById('page-content');

    pc.innerHTML = pageHeader(title, icon)
      + '<div class="card card-custom mb-3">'
      + '<div class="card-body">'
      + '<div class="row g-2 align-items-end">'
      + '<div class="col-sm-5"><label class="form-label">ค้นหาชื่อ</label>'
      + '<input type="text" class="form-control" id="mile-search-name" placeholder="ชื่อผู้ใช้รถ..." /></div>'
      + '<div class="col-sm-4"><label class="form-label">ประเภทรถ</label>'
      + '<input type="text" class="form-control" id="mile-search-car" placeholder="ประเภทรถ..." /></div>'
      + '<div class="col-auto">'
      + '<button class="btn btn-primary" id="mile-search-btn"><i class="fas fa-search me-1"></i>ค้นหา</button>'
      + '<button class="btn btn-outline-secondary ms-2" id="mile-reset-btn"><i class="fas fa-redo"></i></button>'
      + '</div></div></div></div>'
      + '<div class="card card-custom">'
      + '<div class="card-header-custom d-flex justify-content-between align-items-center">'
      + title
      + '<button class="btn btn-sm btn-success" id="mile-add-btn"><i class="fas fa-plus me-1"></i>บันทึกไมล์</button>'
      + '</div>'
      + '<div class="card-body p-0" id="mile-table-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div>'
      // Modal
      + '<div class="modal fade" id="' + modalId + '" tabindex="-1"><div class="modal-dialog"><div class="modal-content">'
      + '<div class="modal-header"><h5 class="modal-title">' + title + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>'
      + '<div class="modal-body">'
      + '<form id="mile-form">'
      + '<div class="mb-2"><label class="form-label">เลขทะเบียน / รหัสรถ <span class="text-danger">*</span></label>'
      + '<input type="text" class="form-control" id="mile-plate" required /></div>'
      + '<div class="mb-2"><label class="form-label">ชื่อผู้ใช้รถ <span class="text-danger">*</span></label>'
      + '<input type="text" class="form-control" id="mile-name" required /></div>'
      + '<div class="mb-2"><label class="form-label">เลขไมล์ <span class="text-danger">*</span></label>'
      + '<input type="number" class="form-control" id="mile-km" required min="0" /></div>'
      + '<div class="mb-2"><label class="form-label">วันที่</label>'
      + '<input type="date" class="form-control" id="mile-date" /></div>'
      + '<div class="mb-2"><label class="form-label">หมายเหตุ</label>'
      + '<textarea class="form-control" id="mile-remark" rows="2"></textarea></div>'
      + '</form></div>'
      + '<div class="modal-footer">'
      + '<button class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>'
      + '<button class="btn btn-success" id="mile-save-btn"><i class="fas fa-save me-1"></i>บันทึก</button>'
      + '</div></div></div></div>';

    var today = formatDateInput(new Date().toISOString());

    function loadMileList(q) {
      var wrap = document.getElementById('mile-table-wrap');
      if (!wrap) return;
      var p;
      if (q) {
        p = isOut ? API.searchMileOut(q) : API.searchMileIn(q);
      } else {
        p = isOut ? API.getMileOutList() : API.getMileInList();
      }
      p.then(function (list) {
        list = list || [];
        var rows = list.map(function (m, i) {
          return [i+1, m.plate||m.carId||'-', m.name||'-', m.km||'-', formatDate(m.date), m.remark||'-'];
        });
        wrap.innerHTML = buildTable(['#','ทะเบียน/รหัสรถ','ชื่อ','เลขไมล์','วันที่','หมายเหตุ'], rows);
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadMileList();
    document.getElementById('mile-date').value = today;

    document.getElementById('mile-search-btn').addEventListener('click', function () {
      loadMileList({ name: document.getElementById('mile-search-name').value.trim(), car: document.getElementById('mile-search-car').value.trim() });
    });
    document.getElementById('mile-reset-btn').addEventListener('click', function () {
      document.getElementById('mile-search-name').value = '';
      document.getElementById('mile-search-car').value  = '';
      loadMileList();
    });
    document.getElementById('mile-add-btn').addEventListener('click', function () {
      document.getElementById('mile-form').reset();
      document.getElementById('mile-date').value = today;
      var modal = new bootstrap.Modal(document.getElementById(modalId));
      modal.show();
    });
    document.getElementById('mile-save-btn').addEventListener('click', function () {
      var obj = {
        plate:  document.getElementById('mile-plate').value.trim(),
        name:   document.getElementById('mile-name').value.trim(),
        km:     document.getElementById('mile-km').value,
        date:   document.getElementById('mile-date').value,
        remark: document.getElementById('mile-remark').value.trim(),
        recordedBy: App.user.username
      };
      if (!obj.plate || !obj.name || !obj.km) { showToast('กรุณากรอกข้อมูลที่จำเป็น','warning'); return; }
      showLoading();
      var p = isOut ? API.recordMileOut(obj) : API.recordMileIn(obj);
      p.then(function () {
        bootstrap.Modal.getInstance(document.getElementById(modalId)).hide();
        showToast('บันทึกเรียบร้อย', 'success');
        loadMileList();
      })
      .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
      .finally(hideLoading);
    });
  }

  /* ================================================================
     PAGE: MISSION CLOSE
  ================================================================ */

  function renderMissionClose() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ปิดภารกิจ', 'fa-flag-checkered')
      + '<div class="card card-custom mb-3"><div class="card-body">'
      + '<div class="row g-2 align-items-end">'
      + '<div class="col-sm-6"><label class="form-label">ค้นหา</label>'
      + '<input type="text" class="form-control" id="mc-search" placeholder="ชื่อ / ทะเบียน..." /></div>'
      + '<div class="col-auto">'
      + '<button class="btn btn-primary" id="mc-search-btn"><i class="fas fa-search me-1"></i>ค้นหา</button>'
      + '<button class="btn btn-outline-secondary ms-2" id="mc-reset-btn"><i class="fas fa-redo"></i></button>'
      + '</div></div></div></div>'
      + '<div class="card card-custom">'
      + '<div class="card-header-custom d-flex justify-content-between align-items-center">รายการปิดภารกิจ'
      + '<button class="btn btn-sm btn-success" id="mc-add-btn"><i class="fas fa-plus me-1"></i>ปิดภารกิจ</button>'
      + '</div>'
      + '<div class="card-body p-0" id="mc-table-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div>'
      + '<div class="modal fade" id="mc-modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">'
      + '<div class="modal-header"><h5 class="modal-title" id="mc-modal-title">ปิดภารกิจ</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>'
      + '<div class="modal-body"><form id="mc-form">'
      + '<input type="hidden" id="mc-id" />'
      + '<div class="mb-2"><label class="form-label">ทะเบียน/รหัสรถ <span class="text-danger">*</span></label><input type="text" class="form-control" id="mc-plate" required /></div>'
      + '<div class="mb-2"><label class="form-label">ชื่อผู้ใช้รถ <span class="text-danger">*</span></label><input type="text" class="form-control" id="mc-name" required /></div>'
      + '<div class="mb-2"><label class="form-label">วันที่ปิดภารกิจ</label><input type="date" class="form-control" id="mc-date" /></div>'
      + '<div class="mb-2"><label class="form-label">ระยะทาง (กม.)</label><input type="number" class="form-control" id="mc-dist" min="0" /></div>'
      + '<div class="mb-2"><label class="form-label">หมายเหตุ</label><textarea class="form-control" id="mc-remark" rows="2"></textarea></div>'
      + '</form></div>'
      + '<div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>'
      + '<button class="btn btn-success" id="mc-save-btn"><i class="fas fa-save me-1"></i>บันทึก</button>'
      + '</div></div></div></div>';

    var today = formatDateInput(new Date().toISOString());

    function loadMC(q) {
      var wrap = document.getElementById('mc-table-wrap');
      if (!wrap) return;
      var p = q ? API.searchMission(q) : API.getMissionCloseList();
      p.then(function (list) {
        list = list || [];
        var rows = list.map(function (m, i) {
          var del = '<button class="btn btn-sm btn-danger mc-del-btn" data-id="' + (m.id||'') + '"><i class="fas fa-trash"></i></button>';
          var edit = '<button class="btn btn-sm btn-outline-primary me-1 mc-edit-btn" data-row=\'' + JSON.stringify(m) + '\'><i class="fas fa-edit"></i></button>';
          return [i+1, m.plate||m.carId||'-', m.name||'-', formatDate(m.date), m.dist||'-', m.remark||'-', edit+del];
        });
        wrap.innerHTML = buildTable(['#','ทะเบียน','ชื่อ','วันที่','ระยะทาง','หมายเหตุ','จัดการ'], rows);
        wrap.querySelectorAll('.mc-del-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            if (!confirm('ลบรายการนี้?')) return;
            showLoading();
            API.deleteMission(this.dataset.id)
              .then(function () { showToast('ลบเรียบร้อย','success'); loadMC(); })
              .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
              .finally(hideLoading);
          });
        });
        wrap.querySelectorAll('.mc-edit-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var row = JSON.parse(this.dataset.row);
            document.getElementById('mc-id').value     = row.id||'';
            document.getElementById('mc-plate').value  = row.plate||row.carId||'';
            document.getElementById('mc-name').value   = row.name||'';
            document.getElementById('mc-date').value   = formatDateInput(row.date);
            document.getElementById('mc-dist').value   = row.dist||'';
            document.getElementById('mc-remark').value = row.remark||'';
            document.getElementById('mc-modal-title').textContent = 'แก้ไขภารกิจ';
            new bootstrap.Modal(document.getElementById('mc-modal')).show();
          });
        });
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadMC();
    document.getElementById('mc-search-btn').addEventListener('click', function () { loadMC({ q: document.getElementById('mc-search').value.trim() }); });
    document.getElementById('mc-reset-btn').addEventListener('click', function () { document.getElementById('mc-search').value=''; loadMC(); });
    document.getElementById('mc-add-btn').addEventListener('click', function () {
      document.getElementById('mc-form').reset();
      document.getElementById('mc-id').value   = '';
      document.getElementById('mc-date').value = today;
      document.getElementById('mc-modal-title').textContent = 'ปิดภารกิจ';
      new bootstrap.Modal(document.getElementById('mc-modal')).show();
    });
    document.getElementById('mc-save-btn').addEventListener('click', function () {
      var obj = {
        id:     document.getElementById('mc-id').value,
        plate:  document.getElementById('mc-plate').value.trim(),
        name:   document.getElementById('mc-name').value.trim(),
        date:   document.getElementById('mc-date').value,
        dist:   document.getElementById('mc-dist').value,
        remark: document.getElementById('mc-remark').value.trim(),
        closedBy: App.user.username
      };
      if (!obj.plate || !obj.name) { showToast('กรุณากรอกข้อมูลที่จำเป็น','warning'); return; }
      showLoading();
      API.closeMission(obj)
        .then(function () { bootstrap.Modal.getInstance(document.getElementById('mc-modal')).hide(); showToast('บันทึกเรียบร้อย','success'); loadMC(); })
        .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
        .finally(hideLoading);
    });
  }

  /* ================================================================
     PAGE: CAR STATUS
  ================================================================ */

  function renderCarStatus() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('สถานะรถ', 'fa-car')
      + '<div class="card card-custom">'
      + '<div class="card-header-custom">รายการสถานะยานพาหนะ</div>'
      + '<div class="card-body p-0" id="cs-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div>';

    API.getCarStatus()
      .then(function (list) {
        list = list || [];
        var rows = list.map(function (c, i) {
          return [i+1, c.plate||c.id||'-', c.name||c.type||'-', c.dept||'-', statusBadge(c.status||'ว่าง'), c.user||'-', formatDate(c.lastUsed)];
        });
        document.getElementById('cs-wrap').innerHTML = buildTable(['#','ทะเบียน','ชื่อ/ประเภท','หน่วย','สถานะ','ผู้ใช้ปัจจุบัน','ใช้ล่าสุด'], rows);
      })
      .catch(function () { document.getElementById('cs-wrap').innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
  }

  /* ================================================================
     PAGE: CAR DAILY
  ================================================================ */

  function renderCarDaily() {
    var pc = document.getElementById('page-content');
    var todayLabel = new Date().toLocaleDateString('th-TH', { weekday:'long', year:'numeric', month:'long', day:'numeric' });
    pc.innerHTML = pageHeader('รถวันนี้ — ' + todayLabel, 'fa-calendar-day')
      + '<div class="card card-custom">'
      + '<div class="card-body p-0" id="cd-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div>';

    API.getCarDaily()
      .then(function (list) {
        list = list || [];
        var rows = list.map(function (c, i) {
          return [i+1, c.plate||c.carId||'-', c.carName||c.type||'-', c.name||'-', c.dept||'-', c.dest||'-', c.driver||'-', statusBadge(c.status)];
        });
        document.getElementById('cd-wrap').innerHTML = buildTable(['#','ทะเบียน','รถ','ชื่อผู้ใช้','แผนก','จุดหมาย','คนขับ','สถานะ'], rows);
      })
      .catch(function () { document.getElementById('cd-wrap').innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
  }

  /* ================================================================
     PAGE: HISTORY
  ================================================================ */

  function renderHistory() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ประวัติการใช้รถ', 'fa-history')
      + '<div class="card card-custom mb-3"><div class="card-body">'
      + '<div class="row g-2 align-items-end">'
      + '<div class="col-sm-3"><label class="form-label">ค้นหาชื่อ</label><input type="text" class="form-control" id="hist-name" placeholder="ชื่อ..." /></div>'
      + '<div class="col-sm-3"><label class="form-label">ประเภทรถ</label><input type="text" class="form-control" id="hist-car" placeholder="รถ..." /></div>'
      + '<div class="col-sm-2"><label class="form-label">จากวันที่</label><input type="date" class="form-control" id="hist-from" /></div>'
      + '<div class="col-sm-2"><label class="form-label">ถึงวันที่</label><input type="date" class="form-control" id="hist-to" /></div>'
      + '<div class="col-auto">'
      + '<button class="btn btn-primary" id="hist-search-btn"><i class="fas fa-search me-1"></i>ค้นหา</button>'
      + '<button class="btn btn-outline-secondary ms-2" id="hist-reset-btn"><i class="fas fa-redo"></i></button>'
      + '</div></div></div></div>'
      + '<div class="card card-custom"><div class="card-body p-0" id="hist-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div></div>';

    function loadHist(q) {
      var wrap = document.getElementById('hist-wrap');
      if (!wrap) return;
      API.getBookingHistory()
        .then(function (list) {
          list = list || [];
          if (q) {
            list = list.filter(function (r) {
              var name = (r.name||'').toLowerCase();
              var car  = (r.carName||r.carId||'').toLowerCase();
              var nameOk = !q.name || name.indexOf(q.name.toLowerCase()) !== -1;
              var carOk  = !q.car  || car.indexOf(q.car.toLowerCase()) !== -1;
              var dateOk = true;
              if (q.from && r.dateStart) dateOk = dateOk && r.dateStart >= q.from;
              if (q.to   && r.dateStart) dateOk = dateOk && r.dateStart <= q.to;
              return nameOk && carOk && dateOk;
            });
          }
          var rows = list.map(function (b, i) {
            return [i+1, b.name||'-', b.dept||'-', b.carName||b.carId||'-', formatDate(b.dateStart), formatDate(b.dateEnd), b.dest||'-', statusBadge(b.status)];
          });
          wrap.innerHTML = buildTable(['#','ชื่อ','แผนก','รถ','วันเริ่ม','วันสิ้นสุด','จุดหมาย','สถานะ'], rows);
        })
        .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadHist();
    document.getElementById('hist-search-btn').addEventListener('click', function () {
      loadHist({ name: document.getElementById('hist-name').value.trim(), car: document.getElementById('hist-car').value.trim(), from: document.getElementById('hist-from').value, to: document.getElementById('hist-to').value });
    });
    document.getElementById('hist-reset-btn').addEventListener('click', function () {
      ['hist-name','hist-car','hist-from','hist-to'].forEach(function (id) { document.getElementById(id).value=''; });
      loadHist();
    });
  }

  /* ================================================================
     PAGE: PERSONNEL
  ================================================================ */

  function renderPersonnel() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('กำลังพล', 'fa-users')
      + '<div class="row g-3 mb-4" id="pers-cards"><div class="col-12 text-center py-3"><div class="spinner-border text-primary"></div></div></div>'
      + '<div class="card card-custom"><div class="card-header-custom">สัดส่วนกำลังพลตามสังกัด</div>'
      + '<div class="card-body"><canvas id="personnelChart" height="80"></canvas></div></div>';

    API.getPersonnelSummary()
      .then(function (data) {
        data = data || {};
        var total    = data.total    || 0;
        var present  = data.present  || 0;
        var absent   = data.absent   || 0;
        var onLeave  = data.onLeave  || 0;
        var cards = [
          { label:'กำลังพลทั้งหมด', value: total,   icon:'fa-users',          color:'border-primary',  iconColor:'text-primary'  },
          { label:'ปฏิบัติงาน',     value: present, icon:'fa-user-check',      color:'border-success',  iconColor:'text-success'  },
          { label:'ลาหยุด',         value: onLeave, icon:'fa-user-clock',      color:'border-warning',  iconColor:'text-warning'  },
          { label:'ขาด/อื่นๆ',      value: absent,  icon:'fa-user-times',      color:'border-danger',   iconColor:'text-danger'   }
        ];
        var html = cards.map(function (c) {
          return '<div class="col-sm-6 col-xl-3"><div class="stat-card ' + c.color + '"><div class="stat-icon ' + c.iconColor + '"><i class="fas ' + c.icon + '"></i></div><div class="stat-body"><div class="stat-value">' + c.value + '</div><div class="stat-label">' + c.label + '</div></div></div></div>';
        }).join('');
        document.getElementById('pers-cards').innerHTML = html;
      })
      .catch(function () { document.getElementById('pers-cards').innerHTML = '<div class="col-12"><div class="alert alert-warning">ไม่สามารถโหลดข้อมูล</div></div>'; });

    API.getPersonnelChart()
      .then(function (data) {
        data = data || {};
        var canvas = document.getElementById('personnelChart');
        if (!canvas) return;
        destroyChart('personnelChart');
        App.charts['personnelChart'] = new Chart(canvas, {
          type: 'bar',
          data: {
            labels: data.labels || [],
            datasets: [{
              label: 'จำนวนกำลังพล',
              data: data.values || [],
              backgroundColor: 'rgba(42,101,176,0.7)',
              borderColor: '#2a65b0',
              borderWidth: 1,
              borderRadius: 4
            }]
          },
          options: { responsive: true, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { stepSize: 1 } } } }
        });
      })
      .catch(function () {});
  }

  /* ================================================================
     PAGE: HOUSING
  ================================================================ */

  function renderHousing() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ที่พัก', 'fa-home')
      + '<ul class="nav nav-tabs mb-3" id="housingTabs">'
      + '<li class="nav-item"><button class="nav-link active" data-tab="general">ที่พักทั่วไป</button></li>'
      + '<li class="nav-item"><button class="nav-link" data-tab="rent">ที่พักเช่า</button></li>'
      + '<li class="nav-item"><button class="nav-link" data-tab="senior">ส./น. พักห้อง</button></li>'
      + '</ul>'
      + '<div id="housing-content"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>';

    function loadHousing(tab) {
      var wrap = document.getElementById('housing-content');
      if (!wrap) return;
      wrap.innerHTML = '<div class="text-center py-4"><div class="spinner-border text-primary"></div></div>';
      var p;
      if (tab === 'rent')   p = API.getHousingRent();
      else if (tab === 'senior') p = API.getHousingSenior();
      else p = API.getHousing();
      p.then(function (list) {
        list = list || [];
        var headers, rows;
        if (tab === 'senior') {
          headers = ['#','ยศ-ชื่อ','ห้อง','อาคาร','วันที่เข้าพัก','หมายเหตุ'];
          rows = list.map(function (h, i) { return [i+1, h.name||'-', h.room||'-', h.building||'-', formatDate(h.dateIn), h.remark||'-']; });
        } else if (tab === 'rent') {
          headers = ['#','ยศ-ชื่อ','บ้านเลขที่','ค่าเช่า (บาท)','วันที่เริ่ม','สถานะ'];
          rows = list.map(function (h, i) { return [i+1, h.name||'-', h.houseNo||'-', h.rent||'-', formatDate(h.dateStart), statusBadge(h.status||'ปกติ')]; });
        } else {
          headers = ['#','ยศ-ชื่อ','ห้อง','อาคาร','วันที่เข้าพัก','ประเภท'];
          rows = list.map(function (h, i) { return [i+1, h.name||'-', h.room||'-', h.building||'-', formatDate(h.dateIn), h.type||'-']; });
        }
        wrap.innerHTML = '<div class="card card-custom"><div class="card-body p-0">' + buildTable(headers, rows) + '</div></div>';
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadHousing('general');
    document.querySelectorAll('#housingTabs .nav-link').forEach(function (tab) {
      tab.addEventListener('click', function () {
        document.querySelectorAll('#housingTabs .nav-link').forEach(function (t) { t.classList.remove('active'); });
        this.classList.add('active');
        loadHousing(this.dataset.tab);
      });
    });
  }

  /* ================================================================
     PAGE: SCHEDULE
  ================================================================ */

  function renderSchedule() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ตารางเวร', 'fa-calendar-alt')
      + '<div class="row g-3">'
      + '<div class="col-lg-5"><div class="card card-custom"><div class="card-header-custom">อัพโหลดตารางเวร</div><div class="card-body">'
      + '<form id="sched-form">'
      + '<div class="mb-3"><label class="form-label">ชื่อตาราง</label><input type="text" class="form-control" id="sched-title" placeholder="เช่น ตารางเวรประจำเดือน มิ.ย." /></div>'
      + '<div class="mb-3"><label class="form-label">เดือน/ปี</label><input type="month" class="form-control" id="sched-month" /></div>'
      + '<div class="mb-3"><label class="form-label">ข้อมูลตาราง (JSON/Text)</label><textarea class="form-control" id="sched-data" rows="5" placeholder="วางข้อมูลตารางเวรที่นี่..."></textarea></div>'
      + '<button type="submit" class="btn btn-success w-100"><i class="fas fa-upload me-2"></i>อัพโหลดตาราง</button>'
      + '</form></div></div></div>'
      + '<div class="col-lg-7"><div class="card card-custom"><div class="card-header-custom">รายการตารางเวร</div>'
      + '<div class="card-body p-0" id="sched-list"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div>'
      + '</div></div></div>';

    function loadSchedList() {
      var wrap = document.getElementById('sched-list');
      if (!wrap) return;
      API.getScheduleList()
        .then(function (list) {
          list = list || [];
          var rows = list.map(function (s, i) {
            return [i+1, s.title||'-', s.month||'-', formatDate(s.uploadedAt), s.uploadedBy||'-'];
          });
          wrap.innerHTML = buildTable(['#','ชื่อตาราง','เดือน','วันที่อัพโหลด','โดย'], rows);
        })
        .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadSchedList();
    document.getElementById('sched-form').addEventListener('submit', function (e) {
      e.preventDefault();
      var obj = {
        title:  document.getElementById('sched-title').value.trim(),
        month:  document.getElementById('sched-month').value,
        data:   document.getElementById('sched-data').value.trim(),
        uploadedBy: App.user.username
      };
      if (!obj.title || !obj.data) { showToast('กรุณากรอกชื่อตารางและข้อมูล','warning'); return; }
      showLoading();
      API.uploadSchedule(obj)
        .then(function () { showToast('อัพโหลดเรียบร้อย','success'); this.reset && this.reset(); loadSchedList(); }.bind(this))
        .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
        .finally(hideLoading);
    });
  }

  /* ================================================================
     PAGE: CANCEL
  ================================================================ */

  function renderCancel() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ยกเลิกการจอง', 'fa-times-circle')
      + '<div class="card card-custom mb-3"><div class="card-body">'
      + '<div class="row g-2 align-items-end">'
      + '<div class="col-sm-5"><label class="form-label">ค้นหา</label><input type="text" class="form-control" id="cancel-search" placeholder="ชื่อ / แผนก..." /></div>'
      + '<div class="col-auto">'
      + '<button class="btn btn-primary" id="cancel-search-btn"><i class="fas fa-search me-1"></i>ค้นหา</button>'
      + '<button class="btn btn-outline-secondary ms-2" id="cancel-reset-btn"><i class="fas fa-redo"></i></button>'
      + '</div></div></div></div>'
      + '<div class="card card-custom"><div class="card-header-custom">รายการสำหรับยกเลิก</div>'
      + '<div class="card-body p-0" id="cancel-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div></div>';

    function loadCancel(q) {
      var wrap = document.getElementById('cancel-wrap');
      if (!wrap) return;
      var p = q ? API.searchCancel(q) : API.getCancelList();
      p.then(function (list) {
        list = list || [];
        var rows = list.map(function (b, i) {
          var cancelBtn = '<button class="btn btn-sm btn-danger cancel-do-btn" data-id="' + (b.id||'') + '" data-name="' + (b.name||'') + '"><i class="fas fa-ban me-1"></i>ยกเลิก</button>';
          return [i+1, b.name||'-', b.dept||'-', b.carName||b.carId||'-', formatDate(b.dateStart), statusBadge(b.status), cancelBtn];
        });
        wrap.innerHTML = buildTable(['#','ชื่อ','แผนก','รถ','วันที่','สถานะ','การดำเนินการ'], rows);
        wrap.querySelectorAll('.cancel-do-btn').forEach(function (btn) {
          btn.addEventListener('click', function () {
            var reason = prompt('เหตุผลการยกเลิก (ถ้ามี):');
            if (reason === null) return;
            showLoading();
            API.cancelAdmin({ id: this.dataset.id, reason: reason, cancelledBy: App.user.username })
              .then(function () { showToast('ยกเลิกการจองเรียบร้อย','success'); loadCancel(); })
              .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
              .finally(hideLoading);
          });
        });
      })
      .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadCancel();
    document.getElementById('cancel-search-btn').addEventListener('click', function () { loadCancel({ q: document.getElementById('cancel-search').value.trim() }); });
    document.getElementById('cancel-reset-btn').addEventListener('click', function () { document.getElementById('cancel-search').value=''; loadCancel(); });
  }

  /* ================================================================
     PAGE: ADMIN — USERS
  ================================================================ */

  function renderAdminUsers() {
    renderAdminCRUD({
      title:   'จัดการผู้ใช้',
      icon:    'fa-user-cog',
      loadFn:  API.getUsers.bind(API),
      saveFn:  API.saveUser.bind(API),
      delFn:   API.deleteUser.bind(API),
      headers: ['#','ชื่อผู้ใช้','ชื่อ-นามสกุล','แผนก','บทบาท','การดำเนินการ'],
      rowFn: function (u) { return [u.username||'-', u.fullname||'-', u.dept||'-', ROLE_LABELS[u.role]||u.role||'-']; },
      formFields: [
        { id:'au-username', label:'ชื่อผู้ใช้', type:'text', required:true },
        { id:'au-fullname', label:'ชื่อ-นามสกุล', type:'text', required:true },
        { id:'au-dept',     label:'แผนก', type:'text' },
        { id:'au-role',     label:'บทบาท', type:'select', options:[
          {value:'admin',label:'ผู้ดูแลระบบ'},{value:'vip',label:'ผู้บังคับบัญชา'},
          {value:'user',label:'ผู้ใช้งาน'},{value:'finance',label:'การเงิน'},{value:'schedule',label:'นายเวร'}
        ]},
        { id:'au-password', label:'รหัสผ่าน (เว้นว่างหากไม่เปลี่ยน)', type:'password' }
      ],
      objFn: function () {
        return {
          id:       document.getElementById('au-id').value,
          username: document.getElementById('au-username').value.trim(),
          fullname: document.getElementById('au-fullname').value.trim(),
          dept:     document.getElementById('au-dept').value.trim(),
          role:     document.getElementById('au-role').value,
          password: document.getElementById('au-password').value
        };
      },
      fillFn: function (u) {
        document.getElementById('au-username').value = u.username||'';
        document.getElementById('au-fullname').value = u.fullname||'';
        document.getElementById('au-dept').value     = u.dept||'';
        document.getElementById('au-role').value     = u.role||'user';
        document.getElementById('au-password').value = '';
      }
    });
  }

  /* ================================================================
     PAGE: ADMIN — CARS
  ================================================================ */

  function renderAdminCars() {
    renderAdminCRUD({
      title:   'จัดการรถ',
      icon:    'fa-car-side',
      loadFn:  API.getCars.bind(API),
      saveFn:  API.saveCar.bind(API),
      delFn:   API.deleteCar.bind(API),
      headers: ['#','ทะเบียน','ชื่อ/ประเภทรถ','ประเภท','หน่วย','สถานะ','การดำเนินการ'],
      rowFn: function (c) { return [c.plate||'-', c.name||'-', c.type||'-', c.dept||'-', statusBadge(c.status||'ว่าง')]; },
      formFields: [
        { id:'ac-plate',  label:'ทะเบียน',       type:'text', required:true },
        { id:'ac-name',   label:'ชื่อ/ประเภทรถ', type:'text', required:true },
        { id:'ac-type',   label:'ประเภท',         type:'text' },
        { id:'ac-dept',   label:'หน่วย',          type:'text' },
        { id:'ac-status', label:'สถานะ',          type:'select', options:[
          {value:'ว่าง',label:'ว่าง'},{value:'กำลังใช้งาน',label:'กำลังใช้งาน'},{value:'ซ่อม',label:'ซ่อมบำรุง'}
        ]}
      ],
      objFn: function () {
        return {
          id:     document.getElementById('ac-id').value,
          plate:  document.getElementById('ac-plate').value.trim(),
          name:   document.getElementById('ac-name').value.trim(),
          type:   document.getElementById('ac-type').value.trim(),
          dept:   document.getElementById('ac-dept').value.trim(),
          status: document.getElementById('ac-status').value
        };
      },
      fillFn: function (c) {
        document.getElementById('ac-plate').value  = c.plate||'';
        document.getElementById('ac-name').value   = c.name||'';
        document.getElementById('ac-type').value   = c.type||'';
        document.getElementById('ac-dept').value   = c.dept||'';
        document.getElementById('ac-status').value = c.status||'ว่าง';
      }
    });
  }

  /* ================================================================
     PAGE: ADMIN — DRIVERS
  ================================================================ */

  function renderAdminDrivers() {
    renderAdminCRUD({
      title:   'จัดการคนขับ',
      icon:    'fa-id-card',
      loadFn:  API.getDrivers.bind(API),
      saveFn:  API.saveDriver.bind(API),
      delFn:   API.deleteDriver.bind(API),
      headers: ['#','รหัส','ยศ-ชื่อ','แผนก','เบอร์โทร','สถานะ','การดำเนินการ'],
      rowFn: function (d) { return [d.driverId||d.id||'-', d.name||'-', d.dept||'-', d.phone||'-', statusBadge(d.status||'พร้อม')]; },
      formFields: [
        { id:'ad-driverid', label:'รหัสคนขับ',   type:'text' },
        { id:'ad-name',     label:'ยศ-ชื่อ-สกุล',type:'text', required:true },
        { id:'ad-dept',     label:'แผนก',         type:'text' },
        { id:'ad-phone',    label:'เบอร์โทร',     type:'tel'  },
        { id:'ad-status',   label:'สถานะ',        type:'select', options:[
          {value:'พร้อม',label:'พร้อม'},{value:'ไม่พร้อม',label:'ไม่พร้อม'},{value:'ลา',label:'ลา'}
        ]}
      ],
      objFn: function () {
        return {
          id:       document.getElementById('ad-id').value,
          driverId: document.getElementById('ad-driverid').value.trim(),
          name:     document.getElementById('ad-name').value.trim(),
          dept:     document.getElementById('ad-dept').value.trim(),
          phone:    document.getElementById('ad-phone').value.trim(),
          status:   document.getElementById('ad-status').value
        };
      },
      fillFn: function (d) {
        document.getElementById('ad-driverid').value = d.driverId||d.id||'';
        document.getElementById('ad-name').value     = d.name||'';
        document.getElementById('ad-dept').value     = d.dept||'';
        document.getElementById('ad-phone').value    = d.phone||'';
        document.getElementById('ad-status').value   = d.status||'พร้อม';
      }
    });
  }

  /* ─── Generic CRUD renderer ─── */
  function renderAdminCRUD(cfg) {
    var pc     = document.getElementById('page-content');
    var prefix = cfg.formFields[0].id.split('-')[0];
    // Build form fields HTML
    var fieldsHtml = '<input type="hidden" id="' + prefix + '-id" />';
    cfg.formFields.forEach(function (f) {
      fieldsHtml += '<div class="mb-2"><label class="form-label">' + f.label + (f.required ? ' <span class="text-danger">*</span>' : '') + '</label>';
      if (f.type === 'select') {
        fieldsHtml += '<select class="form-select" id="' + f.id + '">';
        (f.options || []).forEach(function (o) { fieldsHtml += '<option value="' + o.value + '">' + o.label + '</option>'; });
        fieldsHtml += '</select>';
      } else {
        fieldsHtml += '<input type="' + f.type + '" class="form-control" id="' + f.id + '" ' + (f.required ? 'required' : '') + ' />';
      }
      fieldsHtml += '</div>';
    });

    pc.innerHTML = pageHeader(cfg.title, cfg.icon)
      + '<div class="card card-custom">'
      + '<div class="card-header-custom d-flex justify-content-between align-items-center">' + cfg.title
      + '<button class="btn btn-sm btn-success" id="crud-add-btn"><i class="fas fa-plus me-1"></i>เพิ่มใหม่</button>'
      + '</div><div class="card-body p-0" id="crud-table-wrap"><div class="text-center py-4"><div class="spinner-border text-primary"></div></div></div></div>'
      + '<div class="modal fade" id="crud-modal" tabindex="-1"><div class="modal-dialog"><div class="modal-content">'
      + '<div class="modal-header"><h5 class="modal-title" id="crud-modal-title">เพิ่ม' + cfg.title + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div>'
      + '<div class="modal-body"><form id="crud-form">' + fieldsHtml + '</form></div>'
      + '<div class="modal-footer"><button class="btn btn-secondary" data-bs-dismiss="modal">ยกเลิก</button>'
      + '<button class="btn btn-success" id="crud-save-btn"><i class="fas fa-save me-1"></i>บันทึก</button>'
      + '</div></div></div></div>';

    function loadList() {
      var wrap = document.getElementById('crud-table-wrap');
      if (!wrap) return;
      cfg.loadFn()
        .then(function (list) {
          list = list || [];
          var rows = list.map(function (item, i) {
            var editBtn = '<button class="btn btn-sm btn-outline-primary me-1 crud-edit-btn" data-row=\'' + JSON.stringify(item) + '\'><i class="fas fa-edit"></i></button>';
            var delBtn  = '<button class="btn btn-sm btn-danger crud-del-btn" data-id="' + (item.id||'') + '"><i class="fas fa-trash"></i></button>';
            return [i+1].concat(cfg.rowFn(item)).concat([editBtn + delBtn]);
          });
          wrap.innerHTML = buildTable(cfg.headers, rows);
          wrap.querySelectorAll('.crud-edit-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
              var item = JSON.parse(this.dataset.row);
              document.getElementById(prefix + '-id').value = item.id || '';
              cfg.fillFn(item);
              document.getElementById('crud-modal-title').textContent = 'แก้ไข' + cfg.title;
              new bootstrap.Modal(document.getElementById('crud-modal')).show();
            });
          });
          wrap.querySelectorAll('.crud-del-btn').forEach(function (btn) {
            btn.addEventListener('click', function () {
              if (!confirm('ลบรายการนี้?')) return;
              showLoading();
              cfg.delFn(this.dataset.id)
                .then(function () { showToast('ลบเรียบร้อย','success'); loadList(); })
                .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
                .finally(hideLoading);
            });
          });
        })
        .catch(function () { wrap.innerHTML = '<div class="alert alert-warning m-3">ไม่สามารถโหลดข้อมูล</div>'; });
    }

    loadList();

    document.getElementById('crud-add-btn').addEventListener('click', function () {
      document.getElementById('crud-form').reset();
      document.getElementById(prefix + '-id').value = '';
      document.getElementById('crud-modal-title').textContent = 'เพิ่ม' + cfg.title;
      new bootstrap.Modal(document.getElementById('crud-modal')).show();
    });

    document.getElementById('crud-save-btn').addEventListener('click', function () {
      var obj = cfg.objFn();
      // Check required fields
      var missing = cfg.formFields.filter(function (f) { return f.required && !document.getElementById(f.id).value.trim(); });
      if (missing.length) { showToast('กรุณากรอก: ' + missing.map(function (f) { return f.label; }).join(', '),'warning'); return; }
      showLoading();
      cfg.saveFn(obj)
        .then(function () {
          bootstrap.Modal.getInstance(document.getElementById('crud-modal')).hide();
          showToast('บันทึกเรียบร้อย','success');
          loadList();
        })
        .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
        .finally(hideLoading);
    });
  }

  /* ================================================================
     PAGE: SETTINGS
  ================================================================ */

  function renderSettings() {
    var pc = document.getElementById('page-content');
    pc.innerHTML = pageHeader('ตั้งค่าระบบ', 'fa-cog')
      + '<div class="row g-3">'
      + '<div class="col-lg-6"><div class="card card-custom"><div class="card-header-custom">ข้อมูลหน่วย</div><div class="card-body" id="settings-org-body">'
      + '<div class="text-center py-3"><div class="spinner-border text-primary"></div></div>'
      + '</div></div></div>'
      + '<div class="col-lg-6"><div class="card card-custom"><div class="card-header-custom">Line Notify / Bot Token</div><div class="card-body" id="settings-line-body">'
      + '<div class="text-center py-3"><div class="spinner-border text-primary"></div></div>'
      + '</div></div></div>'
      + '</div>';

    API.getSettings()
      .then(function (data) {
        data = data || {};
        App.cache.settings = data;
        document.getElementById('settings-org-body').innerHTML =
          '<form id="settings-org-form">'
          + '<div class="mb-2"><label class="form-label">ชื่อหน่วย</label><input type="text" class="form-control" id="set-orgname" value="' + (data.orgName||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">ที่ตั้ง</label><input type="text" class="form-control" id="set-address" value="' + (data.address||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">เบอร์โทรศัพท์</label><input type="text" class="form-control" id="set-phone" value="' + (data.phone||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">อีเมล</label><input type="email" class="form-control" id="set-email" value="' + (data.email||'') + '" /></div>'
          + '<button type="submit" class="btn btn-primary w-100 mt-2"><i class="fas fa-save me-2"></i>บันทึกข้อมูลหน่วย</button>'
          + '</form>';

        document.getElementById('settings-line-body').innerHTML =
          '<form id="settings-line-form">'
          + '<div class="mb-2"><label class="form-label">Line Notify Token</label><input type="text" class="form-control" id="set-linenotify" value="' + (data.lineNotifyToken||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">Line Bot Channel Token</label><input type="text" class="form-control" id="set-linebot" value="' + (data.lineBotToken||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">Line Group ID</label><input type="text" class="form-control" id="set-linegroupid" value="' + (data.lineGroupId||'') + '" /></div>'
          + '<div class="mb-2"><label class="form-label">Line Channel Secret</label><input type="password" class="form-control" id="set-linesecret" value="' + (data.lineChannelSecret||'') + '" /></div>'
          + '<button type="submit" class="btn btn-primary w-100 mt-2"><i class="fas fa-save me-2"></i>บันทึก Line Token</button>'
          + '</form>';

        document.getElementById('settings-org-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var obj = Object.assign({}, App.cache.settings, {
            orgName: document.getElementById('set-orgname').value.trim(),
            address: document.getElementById('set-address').value.trim(),
            phone:   document.getElementById('set-phone').value.trim(),
            email:   document.getElementById('set-email').value.trim()
          });
          showLoading();
          API.saveSettings(obj)
            .then(function () { showToast('บันทึกข้อมูลหน่วยเรียบร้อย','success'); App.cache.settings = obj; })
            .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
            .finally(hideLoading);
        });

        document.getElementById('settings-line-form').addEventListener('submit', function (e) {
          e.preventDefault();
          var obj = Object.assign({}, App.cache.settings, {
            lineNotifyToken:    document.getElementById('set-linenotify').value.trim(),
            lineBotToken:       document.getElementById('set-linebot').value.trim(),
            lineGroupId:        document.getElementById('set-linegroupid').value.trim(),
            lineChannelSecret:  document.getElementById('set-linesecret').value.trim()
          });
          showLoading();
          API.saveSettings(obj)
            .then(function () { showToast('บันทึก Line Token เรียบร้อย','success'); App.cache.settings = obj; })
            .catch(function (e) { showToast(e.message||'ผิดพลาด','danger'); })
            .finally(hideLoading);
        });
      })
      .catch(function () {
        document.getElementById('settings-org-body').innerHTML  = '<div class="alert alert-warning">ไม่สามารถโหลดข้อมูล</div>';
        document.getElementById('settings-line-body').innerHTML = '<div class="alert alert-warning">ไม่สามารถโหลดข้อมูล</div>';
      });
  }

  /* ================================================================
     BOOT
  ================================================================ */

  document.addEventListener('DOMContentLoaded', function () {
    App.init();
  });

  // Expose for debugging
  window.App = App;

})();
