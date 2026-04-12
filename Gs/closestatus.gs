

function getdata_pproveeditcar(){
  let ss1 = SpreadsheetApp.getActive()
  let x = ss1.getSheetByName("ชื่อคนขับรถ").getDataRange().getDisplayValues().slice(1)
  Logger.log(x)
}

//**เพิ่มข้อมูล */
function approveeditcareditcaraddRecord(obj) {
  var ss = SpreadsheetApp.getActive().getSheetByName('Data_B_4')
  var approveeditcardata1 = ss.getDataRange().getDisplayValues()

  let id = approveeditcardata1.map(r => r[0])



  var index = id.indexOf(obj.numid_approveeditcar)



  ss.getRange(index + 1, 3).setValue(obj.name_approveeditcar)
  ss.getRange(index + 1, 5).setValue(obj.dep_approveeditcar)
  ss.getRange(index + 1, 6).setValue(obj.leader_approveeditcar)
  ss.getRange(index + 1, 7).setValue(obj.loca_approveeditcar)
  ss.getRange(index + 1, 8).setValue(obj.startDate_approveeditcar)
  ss.getRange(index + 1, 9).setValue(obj.startTime_approveeditcar)
  ss.getRange(index + 1, 10).setValue(obj.endDate_approveeditcar)
  ss.getRange(index + 1, 11).setValue(obj.endTime_approveeditcar)
  ss.getRange(index + 1, 12).setValue(obj.place_approveeditcar) 
  ss.getRange(index + 1, 13).setValue(obj.other_approveeditcar)
  ss.getRange(index + 1, 18).setValue(obj.preapporved_approveeditcar)
  ss.getRange(index + 1, 22).setValue(obj.apporve_approve1)
  ss.getRange(index + 1, 23).setValue(new Date())
  ss.getRange(index + 1, 24).setValue(obj.valuepreapporved_approveeditcar)

  // บันทึกข้อมูลลงใน editlog
  var editLogSheet = SpreadsheetApp.getActive().getSheetByName('editlog');
  var lastRow = editLogSheet.getLastRow() + 1;

  // กำหนดค่าใน editlog
  editLogSheet.getRange(index + 1, 3).setValue(obj.name_approveeditcar)
  editLogSheet.getRange(index + 1, 5).setValue(obj.dep_approveeditcar)
  editLogSheet.getRange(index + 1, 6).setValue(obj.leader_approveeditcar)
  editLogSheet.getRange(index + 1, 7).setValue(obj.loca_approveeditcar)
  editLogSheet.getRange(index + 1, 8).setValue(obj.startDate_approveeditcar)
  editLogSheet.getRange(index + 1, 9).setValue(obj.startTime_approveeditcar)
  editLogSheet.getRange(index + 1, 10).setValue(obj.endDate_approveeditcar)
  editLogSheet.getRange(index + 1, 11).setValue(obj.endTime_approveeditcar)
  editLogSheet.getRange(index + 1, 12).setValue(obj.place_approveeditcar) 
  editLogSheet.getRange(index + 1, 13).setValue(obj.other_approveeditcar)
  editLogSheet.getRange(index + 1, 18).setValue(obj.preapporved_approveeditcar)
  editLogSheet.getRange(index + 1, 22).setValue(obj.apporve_approve1)
  editLogSheet.getRange(index + 1, 23).setValue(new Date())
  editLogSheet.getRange(index + 1, 24).setValue(obj.valuepreapporved_approveeditcar)

return true;

}


function approveeditcargetdata() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_4")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}

function approveeditcardelData(record) {
  let ss = SpreadsheetApp.getActive().getSheetByName("Data2")
  var data = ss.getDataRange().getDisplayValues();
  let id = data.map(r => r[0])
  var index = id.indexOf(record)
  ss.deleteRow(index + 1)
}



function drivecar_approveeditcarrgetDropdownOptions() {
    var drivecar_approveeditcarrsheet = SpreadsheetApp.getActive();
    var drivecar_approveeditcarrdata = drivecar_approveeditcarrsheet.getSheetByName('ประเภท').getRange('B2:B').getValues();
    var drivecar_approveeditcarroptions = [];
 
 // ให้แถวด้านบนของชีตมีค่าว่าง
    drivecar_approveeditcarroptions.push(""); 

    for (var i = 0; i < drivecar_approveeditcarrdata.length; i++) {
        // กรองแถวที่มีข้อมูลไม่ว่างใน Google Sheets
        if (drivecar_approveeditcarrdata[i][0] !== "") {
            drivecar_approveeditcarroptions.push(drivecar_approveeditcarrdata[i][0]);
        }
    }

    return drivecar_approveeditcarroptions;
}









