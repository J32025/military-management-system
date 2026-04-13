// Admin.gs — User, Car, Driver CRUD

function _genId() {
  return Utilities.getUuid().replace(/-/g, '').substring(0, 8).toUpperCase();
}

// ── Users ─────────────────────────────────────────────────────────────────────

function adminUserGetList() {
  var sheet = _getSheet(SHEET.USERS);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function adminUserSave(obj) {
  var sheet = _getSheet(SHEET.USERS);
  var data  = sheet.getDataRange().getDisplayValues();
  var id    = obj.id || obj.user_numiduser || '';
  var row   = [
    id || _genId(),
    obj.username || obj.user_nameuser || '',
    obj.password || obj.user_passuser || '',
    obj.role     || obj.user_possibilityuser || 'user',
    obj.fullname || obj.user_fullnameuser || '',
    obj.dept     || obj.user_depuser || '',
    obj.pic      || obj.user_picuser || ''
  ];
  if (id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return true;
      }
    }
  }
  sheet.appendRow(row);
  return true;
}

function adminUserDelete(userId) {
  var sheet = _getSheet(SHEET.USERS);
  var data  = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == userId) { sheet.deleteRow(i + 1); return true; }
  }
  return false;
}

// ── Cars ──────────────────────────────────────────────────────────────────────

function adminCarGetList() {
  var sheet = _getSheet(SHEET.CARS);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function adminCarSave(obj) {
  var sheet = _getSheet(SHEET.CARS);
  var data  = sheet.getDataRange().getDisplayValues();
  var id    = obj.id || obj.car_numid || '';
  var row   = [id || _genId(), obj.carName || obj.car_name || ''];
  if (id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return true;
      }
    }
  }
  sheet.appendRow(row);
  return true;
}

function adminCarDelete(carId) {
  var sheet = _getSheet(SHEET.CARS);
  var data  = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == carId) { sheet.deleteRow(i + 1); return true; }
  }
  return false;
}

// ── Drivers ───────────────────────────────────────────────────────────────────

function adminDriverGetList() {
  var sheet = _getSheet(SHEET.DRIVERS);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function adminDriverSave(obj) {
  var sheet = _getSheet(SHEET.DRIVERS);
  var data  = sheet.getDataRange().getDisplayValues();
  var id    = obj.id || obj.drivecar_numid || '';
  var row   = [id || _genId(), obj.driverName || obj.drivecar_name || ''];
  if (id) {
    for (var i = 0; i < data.length; i++) {
      if (data[i][0] == id) {
        sheet.getRange(i + 1, 1, 1, row.length).setValues([row]);
        return true;
      }
    }
  }
  sheet.appendRow(row);
  return true;
}

function adminDriverDelete(driverId) {
  var sheet = _getSheet(SHEET.DRIVERS);
  var data  = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == driverId) { sheet.deleteRow(i + 1); return true; }
  }
  return false;
}
