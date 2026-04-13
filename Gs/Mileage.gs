// Mileage.gs — Mileage-out and mileage-in recording, retrieval, and search

// ─── Mile Out ────────────────────────────────────────────────────────────────

/**
 * Record mileage-out data. Finds the row in SHEET.BOOKING by obj.numid_mileout
 * in column A, updates mileage-out fields, and notifies via LINE.
 *
 * Expected fields in obj:
 *   numid_mileout, mileout_date, mileout_time, mileout_km,
 *   mileout_driver, mileout_note
 *
 * @param {Object} obj
 * @return {boolean}
 */
function mileOutRecord(obj) {
  var numid = obj.numid_mileout || '';
  var sheet = _getSheet(SHEET.BOOKING);
  var data  = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === numid) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 16).setValue(obj.mileout_date   || '');
      sheet.getRange(rowNum, 17).setValue(obj.mileout_time   || '');
      sheet.getRange(rowNum, 18).setValue(obj.mileout_km     || '');
      sheet.getRange(rowNum, 19).setValue(obj.mileout_driver || '');
      sheet.getRange(rowNum, 20).setValue(obj.mileout_note   || '');
      sheet.getRange(rowNum, 21).setValue('ออกรถแล้ว');

      try {
        _notifyLineMileOut(obj);
      } catch (e) {
        Logger.log('mileOutRecord notify error: ' + e);
      }
      return true;
    }
  }
  return false;
}

/**
 * Return all rows from SHEET.APPROVED (อนุมัติ) for mile-out listing.
 * @return {Array[][]}
 */
function mileOutGetList() {
  return _getSheet(SHEET.APPROVED).getDataRange().getDisplayValues();
}

/**
 * Search SHEET.APPROVED for rows where col[9]+col[11] matches
 * obj.searchname_out + obj.searchcar_out.
 *
 * @param {Object} obj  { searchname_out, searchcar_out }
 * @return {Array[][]}
 */
function mileOutSearch(obj) {
  var searchKey = (obj.searchname_out || '') + (obj.searchcar_out || '');
  var data      = _getSheet(SHEET.APPROVED).getDataRange().getDisplayValues();
  var results   = [];

  for (var i = 0; i < data.length; i++) {
    var row    = data[i];
    var rowKey = (row[9] || '') + (row[11] || '');
    if (rowKey === searchKey) {
      results.push(row);
    }
  }
  return results;
}

// ─── Mile In ─────────────────────────────────────────────────────────────────

/**
 * Record mileage-in data. Finds the row in SHEET.IN_USE by obj.numid_milein
 * in column A, updates mileage-in fields, and notifies via LINE.
 *
 * Expected fields in obj:
 *   numid_milein, milein_date, milein_time, milein_km,
 *   milein_driver, milein_note
 *
 * @param {Object} obj
 * @return {boolean}
 */
function mileInRecord(obj) {
  var numid = obj.numid_milein || '';
  var sheet = _getSheet(SHEET.IN_USE);
  var data  = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === numid) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 22).setValue(obj.milein_date   || '');
      sheet.getRange(rowNum, 23).setValue(obj.milein_time   || '');
      sheet.getRange(rowNum, 24).setValue(obj.milein_km     || '');
      sheet.getRange(rowNum, 25).setValue(obj.milein_driver || '');
      sheet.getRange(rowNum, 26).setValue(obj.milein_note   || '');
      sheet.getRange(rowNum, 27).setValue('เข้ารถแล้ว');

      try {
        _notifyLineMileIn(obj);
      } catch (e) {
        Logger.log('mileInRecord notify error: ' + e);
      }
      return true;
    }
  }
  return false;
}

/**
 * Return all rows from SHEET.IN_USE (กำลังใช้งาน).
 * @return {Array[][]}
 */
function mileInGetList() {
  return _getSheet(SHEET.IN_USE).getDataRange().getDisplayValues();
}

/**
 * Search SHEET.IN_USE for rows where col[9]+col[11] matches
 * obj.searchname_in + obj.searchcar_in.
 *
 * @param {Object} obj  { searchname_in, searchcar_in }
 * @return {Array[][]}
 */
function mileInSearch(obj) {
  var searchKey = (obj.searchname_in || '') + (obj.searchcar_in || '');
  var data      = _getSheet(SHEET.IN_USE).getDataRange().getDisplayValues();
  var results   = [];

  for (var i = 0; i < data.length; i++) {
    var row    = data[i];
    var rowKey = (row[9] || '') + (row[11] || '');
    if (rowKey === searchKey) {
      results.push(row);
    }
  }
  return results;
}
