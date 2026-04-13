// Schedule.gs — ตารางเวร / duty roster upload

function scheduleUpload(obj) {
  try {
    var setting  = _getSheet(SHEET.SETTING);
    var folderId = setting ? setting.getRange('C2').getDisplayValue() : '';
    var bytes    = obj.bytes || '';
    var mimeType = obj.mimeType || 'application/pdf';
    var filename = obj.filename || ('schedule_' + Utilities.formatDate(new Date(), 'GMT+7', 'yyyyMMdd_HHmmss') + '.pdf');

    var blob = Utilities.newBlob(Utilities.base64Decode(bytes), mimeType, filename);
    var file = folderId
      ? DriveApp.getFolderById(folderId).createFile(blob)
      : DriveApp.createFile(blob);
    var fileUrl = file.getUrl();

    var sheet = _getSheet(SHEET.SCHEDULE);
    if (sheet) sheet.appendRow([new Date(), fileUrl, filename]);

    _notifyLine(_getToken1(), '\n📅 มีผู้อัพโหลดตารางเวร\n' + fileUrl);
    return fileUrl;
  } catch (e) {
    throw new Error('scheduleUpload error: ' + e.message);
  }
}

function scheduleGetList() {
  var sheet = _getSheet(SHEET.SCHEDULE);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}
