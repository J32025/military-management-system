//**เพิ่มข้อมูล */
function approveaddRecord(obj) {
  var ss = SpreadsheetApp.getActive().getSheetByName('Data2')
  var approvedata1 = ss.getDataRange().getDisplayValues()
  // var approvedata = ss.getDataRange().getDisplayValues()
 //Logger.log(data)
  let id = approvedata1.map(r => r[0])

 // ตรวจสอบว่าอนุมัติคนขับรถไม่ซ้ำกัน
  // for (var i = 1; i < approvedata.length; i++) {
  //  var checkTimestart = approvedata[i][21];
  //   var checkTimeend = approvedata[i][22];
   
    
  //    if ((obj.drive_approve+obj.startDate_approve+obj.startTime_approve >= checkTimestart && obj.drive_approve 
  //       +obj.startDate_approve+obj.startTime_approve <= checkTimeend) ||
  //       (obj.drive_approve+obj.startDate_approve+obj.endTime_approve >= checkTimestart && obj.drive_approve+obj.startDate_approve+obj.endTime_approve <= checkTimeend) ||
  //       (obj.drive_approve+obj.startDate_approve+obj.startTime_approve <= checkTimestart && obj.drive_approve+obj.startDate_approve+obj.endTime_approve >= checkTimeend)) {
  //     return false;
  //   }
  // }

  var index = id.indexOf(obj.numid_approve)



  // ss.getRange(index + 1, 3).setValue(obj.name_approve_1)
  // ss.getRange(index + 1, 5).setValue(obj.name_approve)
  // ss.getRange(index + 1, 6).setValue(obj.dep_approve)
  // ss.getRange(index + 1, 7).setValue(obj.car_approve)
  // ss.getRange(index + 1, 8).setValue(obj.loca_approve)
  // ss.getRange(index + 1, 9).setValue(obj.startDate_approve)
  // ss.getRange(index + 1, 10).setValue(obj.startTime_approve)
  // ss.getRange(index + 1, 11).setValue(obj.endDate_approve)
  // ss.getRange(index + 1, 12).setValue(obj.endTime_approve)
  // ss.getRange(index + 1, 13).setValue(obj.drive_approve)
  // if(obj.drive_approve == "ขับเอง"){
  // ss.getRange(index + 1, 10).setValue(obj.name_approve)
  // ss.getRange(index + 1, 22).setValue(obj.name_approve+obj.startDate_approve+obj.startTime_approve)
  // ss.getRange(index + 1, 23).setValue(obj.name_approve+obj.startDate_approve+obj.endTime_approve)
  // }else{
  // ss.getRange(index + 1, 10).setValue(obj.drive_approve) 
  // ss.getRange(index + 1, 22).setValue(obj.drive_approve+obj.startDate_approve+obj.startTime_approve)
  // ss.getRange(index + 1, 23).setValue(obj.drive_approve+obj.startDate_approve+obj.endTime_approve)
  // }
 
  ss.getRange(index + 1, 18).setValue(obj.preapporved_approve)
  ss.getRange(index + 1, 20).setValue(obj.apporve_approve)
  ss.getRange(index + 1, 21).setValue(new Date)
  ss.getRange(index + 1, 24).setValue(obj.other_approve)

  // sendapproveflexMessage(obj)
  sendLineNotifyapprove(obj)
  return true;

}

function requirmentGetData() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_Requir")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}

function requirment_rentGetData() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_Requir")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}

function approvegetdata() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_1")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}
function approvegetdata2() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_2")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}


function approvedelData(record) {
  let ss = SpreadsheetApp.getActive().getSheetByName("Data2")
  var data = ss.getDataRange().getDisplayValues();
  let id = data.map(r => r[0])
  var index = id.indexOf(record)
  ss.deleteRow(index + 1)
}


function drive_approvegetDropdownOptions() {
    var drive_approvesheet = SpreadsheetApp.getActive();
    var drive_approvedata = drive_approvesheet.getSheetByName('ชื่อคนขับรถ').getRange('B2:B').getValues();
    var drive_approveoptions = [];
 
 // ให้แถวด้านบนของชีตมีค่าว่าง
    drive_approveoptions.push(""); 

    for (var i = 0; i < drive_approvedata.length; i++) {
        // กรองแถวที่มีข้อมูลไม่ว่างใน Google Sheets
        if (drive_approvedata[i][0] !== "") {
            drive_approveoptions.push(drive_approvedata[i][0]);
        }
    }

    return drive_approveoptions;
}

function drivecar_approvergetDropdownOptions() {
    var drivecar_approversheet = SpreadsheetApp.getActive();
    var drivecar_approverdata = drivecar_approversheet.getSheetByName('ประเภท').getRange('B2:B').getValues();
    var drivecar_approveroptions = [];
 
 // ให้แถวด้านบนของชีตมีค่าว่าง
    drivecar_approveroptions.push(""); 

    for (var i = 0; i < drivecar_approverdata.length; i++) {
        // กรองแถวที่มีข้อมูลไม่ว่างใน Google Sheets
        if (drivecar_approverdata[i][0] !== "") {
            drivecar_approveroptions.push(drivecar_approverdata[i][0]);
        }
    }

    return drivecar_approveroptions;
}