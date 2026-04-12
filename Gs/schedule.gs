function saveFile(obj) {
  let folder = DriveApp.getFolderById('1_t2OPFVQSTtFF9cbGtinU1BK8XwvLF_m');
  var blob = Utilities.newBlob(obj.bytes, obj.mimeType, obj.filename);
  var fileUrl = folder.createFile(blob).getUrl();

  // Get the active spreadsheet and sheet
  let ss = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('ตารางเวร');

  // Append a new row with the fname, email, and file URL
  ss.appendRow([new Date,  fileUrl ]);

  var token = "fPKsF5gV1Dk5HTvkk99UCIdEDYy6bYorGOFoyQPQgOc";
  var message = 'มีผู้อัพโหลดไฟล์ตารางเวรประจำเดือน'
  +"\n"
  message += fileUrl

  var options = {
      "method": "post",
      "headers": {
        "Authorization": "Bearer " + token
      },
      "payload": {
        "message": message
      }
    };
  UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);

  return 'อัปโหลดไฟล์เรียบร้อย';
}