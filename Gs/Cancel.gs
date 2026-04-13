// Cancel.gs — Booking cancellation by admin or user, list, and search

/**
 * Cancel a booking by admin. Finds the row in SHEET.BOOKING by obj.numid_cancel
 * in column A (index 0), updates all relevant fields, sends a LINE notification,
 * and returns true.
 *
 * @param {Object} obj
 *   { numid_cancel, name, dep, car, loca, startDate, startTime,
 *     endDate, endTime, drive, other, preapporved, namecancel_car,
 *     reason_cancel }
 * @return {boolean}
 */
function cancelByAdmin(obj) {
  var numid  = obj.numid_cancel || '';
  var sheet  = _getSheet(SHEET.BOOKING);
  var data   = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === numid) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 2).setValue(obj.name           || '');
      sheet.getRange(rowNum, 3).setValue(obj.dep            || '');
      sheet.getRange(rowNum, 4).setValue(obj.car            || '');
      sheet.getRange(rowNum, 5).setValue(obj.loca           || '');
      sheet.getRange(rowNum, 6).setValue(obj.startDate      || '');
      sheet.getRange(rowNum, 7).setValue(obj.startTime      || '');
      sheet.getRange(rowNum, 8).setValue(obj.endDate        || '');
      sheet.getRange(rowNum, 9).setValue(obj.endTime        || '');
      sheet.getRange(rowNum, 10).setValue(obj.drive         || '');
      sheet.getRange(rowNum, 11).setValue(obj.other         || '');
      sheet.getRange(rowNum, 12).setValue(obj.preapporved   || '');
      sheet.getRange(rowNum, 13).setValue(obj.namecancel_car || '');
      sheet.getRange(rowNum, 14).setValue(obj.reason_cancel || '');
      sheet.getRange(rowNum, 15).setValue('ยกเลิก');

      try {
        _notifyLineCancel(obj);
      } catch (e) {
        Logger.log('cancelByAdmin notify error: ' + e);
      }
      return true;
    }
  }
  return false;
}

/**
 * Cancel a booking by the requesting user. Finds the row in SHEET.BOOKING by
 * obj.numid_canceluser in column A, updates status fields.
 *
 * @param {Object} obj
 *   { numid_canceluser, reason_cancel }
 * @return {boolean}
 */
function cancelByUser(obj) {
  var numid  = obj.numid_canceluser || '';
  var sheet  = _getSheet(SHEET.BOOKING);
  var data   = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === numid) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 14).setValue(obj.reason_cancel || '');
      sheet.getRange(rowNum, 15).setValue('ยกเลิกโดยผู้จอง');

      try {
        _notifyLineCancel(obj);
      } catch (e) {
        Logger.log('cancelByUser notify error: ' + e);
      }
      return true;
    }
  }
  return false;
}

/**
 * Return all rows from SHEET.APPROVED (อนุมัติ).
 * @return {Array[][]}
 */
function cancelGetList() {
  return _getSheet(SHEET.APPROVED).getDataRange().getDisplayValues();
}

/**
 * Search SHEET.HISTORY for rows where col[1]+col[11] matches
 * obj.searchname_cancel + obj.searchcar_cancel.
 *
 * @param {Object} obj  { searchname_cancel, searchcar_cancel }
 * @return {Array[][]}
 */
function cancelSearch(obj) {
  var searchKey = (obj.searchname_cancel || '') + (obj.searchcar_cancel || '');
  var data      = _getSheet(SHEET.HISTORY).getDataRange().getDisplayValues();
  var results   = [];

  for (var i = 0; i < data.length; i++) {
    var row     = data[i];
    var rowKey  = (row[1] || '') + (row[11] || '');
    if (rowKey === searchKey) {
      results.push(row);
    }
  }
  return results;
}
