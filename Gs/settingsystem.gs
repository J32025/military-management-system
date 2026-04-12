// ฟังก์ชั่นอัพเดทการตั้งค่าTokenใน Google Sheet
 var sheet = SpreadsheetApp.getActive().getSheetByName('setting');
function updateToken(obj) {
  var row = sheet.getRange("A2"); // ปรับช่วงตามโครงสร้างข้อมูล
  var setValueto = [
    obj.token,
  ];
  row.setValues([setValueto]);
}

var showset = SpreadsheetApp.getActive().getSheetByName("setting")
var showpublicize = showset.getRange('D2').getDisplayValue()
var showdevname= showset.getRange('E2').getDisplayValue()
var showporganization = showset.getRange('F2').getDisplayValue()



// ฟังก์ชั่นดึงการตั้งค่าจาก Google ชีต
function getSetting() {
  var data = sheet.getRange("A2:F2").getDisplayValues()[0]; // ปรับช่วงตามโครงสร้างข้อมูล
  var showtoken = {
    token: data[0],
    token2: data[1],
    idfolderimag:data[2],
    publicize:data[3],
    devname:data[4],
    organization:data[5]
  };
  return showtoken;
}

//เมื่อมีการส่งค่ามาจากjavaScrpt
function updateSetting(obj) {
  sheet.getRange('A2').setValue(obj.token);
  sheet.getRange('B2').setValue(obj.token2);
  sheet.getRange('C2').setValue(obj.idfolderimag);
  sheet.getRange('D2').setValue(obj.publicize);
  sheet.getRange('E2').setValue(obj.devname);
  sheet.getRange('F2').setValue(obj.organization);
  
}