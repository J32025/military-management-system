// Approval.gs — Pre-approve list, approve, reject, search, and driver dropdown

/**
 * Return all rows from the pending (รออนุมัติ) sheet.
 * @return {Array[][]}
 */
function approvalPreApproveList() {
  return _getSheet(SHEET.PENDING).getDataRange().getDisplayValues();
}

/**
 * Approve a booking. Finds the record by obj.numid_approve in column A of
 * SHEET.PENDING; updates all booking fields and clears cols 14–15. If not
 * found in PENDING, falls back to DATA_B1.
 *
 * Expected fields in obj:
 *   numid_approve, name, dep, car, loca, startDate, startTime,
 *   endDate, endTime, drive, other, preapporved, namecancel_car
 *
 * @param {Object} obj
 * @return {boolean}
 */
function approvalApprove(obj) {
  var numid = obj.numid_approve || '';

  // Helper: update a row in a given sheet
  function _updateApprovalRow(sheet) {
    var data = sheet.getDataRange().getDisplayValues();
    for (var i = 1; i < data.length; i++) {
      if (data[i][0] === numid) {
        var rowNum = i + 1;
        // Columns 1–13 (1-indexed: 2–14)
        sheet.getRange(rowNum, 2).setValue(obj.name          || '');
        sheet.getRange(rowNum, 3).setValue(obj.dep           || '');
        sheet.getRange(rowNum, 4).setValue(obj.car           || '');
        sheet.getRange(rowNum, 5).setValue(obj.loca          || '');
        sheet.getRange(rowNum, 6).setValue(obj.startDate     || '');
        sheet.getRange(rowNum, 7).setValue(obj.startTime     || '');
        sheet.getRange(rowNum, 8).setValue(obj.endDate       || '');
        sheet.getRange(rowNum, 9).setValue(obj.endTime       || '');
        sheet.getRange(rowNum, 10).setValue(obj.drive        || '');
        sheet.getRange(rowNum, 11).setValue(obj.other        || '');
        sheet.getRange(rowNum, 12).setValue(obj.preapporved  || '');
        sheet.getRange(rowNum, 13).setValue(obj.namecancel_car || '');
        // Clear columns 14 and 15
        sheet.getRange(rowNum, 14).setValue('');
        sheet.getRange(rowNum, 15).setValue('');
        return true;
      }
    }
    return false;
  }

  var pendingSheet = _getSheet(SHEET.PENDING);
  var updated = _updateApprovalRow(pendingSheet);

  if (!updated) {
    var datab1Sheet = _getSheet(SHEET.DATA_B1);
    if (datab1Sheet) {
      updated = _updateApprovalRow(datab1Sheet);
    }
  }

  if (updated) {
    try {
      _notifyLineApproved(obj);
    } catch (e) {
      Logger.log('approvalApprove notify error: ' + e);
    }
  }

  return updated;
}

/**
 * Reject a booking request. Finds the record by obj.numid_reject in
 * SHEET.PENDING and marks col 12 (index 11) as 'ไม่อนุมัติ'.
 *
 * @param {Object} obj  { numid_reject, reason }
 * @return {boolean}
 */
function approvalReject(obj) {
  var numid  = obj.numid_reject || '';
  var reason = obj.reason       || 'ไม่อนุมัติ';

  var sheet = _getSheet(SHEET.PENDING);
  var data  = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][0] === numid) {
      var rowNum = i + 1;
      sheet.getRange(rowNum, 12).setValue('ไม่อนุมัติ');
      sheet.getRange(rowNum, 13).setValue(reason);
      return true;
    }
  }
  return false;
}

/**
 * Search SHEET.PENDING by matching column index 13 (col 14, 0-indexed = 13)
 * against obj.searchname_preapprove.
 *
 * @param {Object} obj  { searchname_preapprove }
 * @return {Array[][]}
 */
function approvalSearch(obj) {
  var keyword = obj.searchname_preapprove || '';
  var data    = _getSheet(SHEET.PENDING).getDataRange().getDisplayValues();
  var results = [];

  for (var i = 0; i < data.length; i++) {
    var row = data[i];
    if (row[13] && row[13].toString().indexOf(keyword) !== -1) {
      results.push(row);
    }
  }
  return results;
}

/**
 * Return all rows from Data_B_1 (approved list, page 1).
 * @return {Array[][]}
 */
function approvalGetApprovedList() {
  return _getSheet(SHEET.DATA_B1).getDataRange().getDisplayValues();
}

/**
 * Return all rows from Data_B_2 (approved list, page 2).
 * @return {Array[][]}
 */
function approvalGetApprovedList2() {
  return _getSheet(SHEET.DATA_B2).getDataRange().getDisplayValues();
}

/**
 * Return all display values from the driver dropdown sheet (ชื่อคนขับรถ).
 * @return {Array[][]}
 */
function approvalGetDropdownDrivers() {
  return _getSheet(SHEET.DRIVERS).getDataRange().getDisplayValues();
}
