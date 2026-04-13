// Notify.gs — Line Notify helpers (internal only, not in dispatch map)

function _getToken1() {
  return _getSheet(SHEET.SETTING).getRange('A2').getDisplayValue();
}

function _getToken2() {
  return _getSheet(SHEET.SETTING).getRange('B2').getDisplayValue();
}

function _notifyLine(token, message) {
  if (!token) return;
  try {
    UrlFetchApp.fetch('https://notify-api.line.me/api/notify', {
      method: 'post',
      headers: { Authorization: 'Bearer ' + token },
      payload: { message: message },
      muteHttpExceptions: true
    });
  } catch (e) {
    Logger.log('Line Notify error: ' + e);
  }
}

function _notifyLineBookingNew(obj) {
  var msg = '\n📋 มีการจองรถใหม่'
    + '\nชื่อ: ' + (obj.name || obj.name_name || '')
    + '\nแผนก: ' + (obj.dep || obj.dep_name || '')
    + '\nรถ: ' + (obj.car || obj.car_name || '')
    + '\nจุดหมาย: ' + (obj.loca || obj.loca_name || '')
    + '\nวันที่: ' + (obj.startDate || '') + ' - ' + (obj.endDate || '')
    + '\nสถานะ: ' + (obj.preapporved || 'รออนุมัติ');
  _notifyLine(_getToken1(), msg);
}

function _notifyLineApproved(obj) {
  var msg = '\n✅ อนุมัติการจองรถ'
    + '\nชื่อ: ' + (obj.name_approve || obj.name || '')
    + '\nแผนก: ' + (obj.dep_approve || obj.dep || '')
    + '\nรถ: ' + (obj.car_approve || obj.car || '')
    + '\nจุดหมาย: ' + (obj.loca_approve || obj.loca || '')
    + '\nวันที่: ' + (obj.startDate_approve || obj.startDate || '') + ' - ' + (obj.endDate_approve || obj.endDate || '')
    + '\nผู้อนุมัติ: ' + (obj.apporve_approve || obj.approver || '');
  _notifyLine(_getToken2(), msg);
}

function _notifyLineCancel(obj) {
  var msg = '\n❌ ยกเลิกการจองรถ'
    + '\nชื่อ: ' + (obj.name_cancel || obj.name_canceluser || '')
    + '\nรถ: ' + (obj.car_cancel || obj.car_canceluser || '')
    + '\nวันที่: ' + (obj.startDate_cancel || obj.startDate_canceluser || '')
    + '\nผู้ยกเลิก: ' + (obj.namecancel_car || obj.driver_canceluser || '');
  _notifyLine(_getToken2(), msg);
}

function _notifyLineMileOut(obj) {
  var msg = '\n🚗 รถออกทำภารกิจ'
    + '\nชื่อ: ' + (obj.name_mileout || '')
    + '\nรถ: ' + (obj.car_mileout || '')
    + '\nจุดหมาย: ' + (obj.loca_mileout || '')
    + '\nเลขไมล์ออก: ' + (obj.mileout_mileout || '')
    + '\nคนขับ: ' + (obj.drive_mileout || '');
  _notifyLine(_getToken1(), msg);
}

function _notifyLineMileIn(obj) {
  var msg = '\n🏁 รถกลับเข้ามา'
    + '\nชื่อ: ' + (obj.name_milein || '')
    + '\nรถ: ' + (obj.car_milein || '')
    + '\nเลขไมล์เข้า: ' + (obj.milein_milein || '')
    + '\nเลขไมล์ออก: ' + (obj.mileout_milein || '');
  _notifyLine(_getToken1(), msg);
}
