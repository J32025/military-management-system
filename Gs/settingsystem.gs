// ฟังก์ชั่นอัพเดทการตั้งค่าTokenใน Google Sheet
function updateToken(obj) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('setting');
  var row = sheet.getRange("A2");
  var setValueto = [obj.token];
  row.setValues([setValueto]);
}



// ฟังก์ชั่นดึงการตั้งค่าจาก Google ชีต
function getSetting() {
  var sheet = SpreadsheetApp.getActive().getSheetByName('setting');
  var data = sheet.getRange("A2:F2").getDisplayValues()[0];
  return {
    token: data[0],
    token2: data[1],
    idfolderimag: data[2],
    publicize: data[3],
    devname: data[4],
    organization: data[5]
  };
}

//เมื่อมีการส่งค่ามาจากjavaScrpt
function updateSetting(obj) {
  var sheet = SpreadsheetApp.getActive().getSheetByName('setting');
  sheet.getRange('A2').setValue(obj.token);
  sheet.getRange('B2').setValue(obj.token2);
  sheet.getRange('C2').setValue(obj.idfolderimag);
  sheet.getRange('D2').setValue(obj.publicize);
  sheet.getRange('E2').setValue(obj.devname);
  sheet.getRange('F2').setValue(obj.organization);
}