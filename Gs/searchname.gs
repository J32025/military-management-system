// function searchaddRecord(obj) {
//   var search_sheet = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data2')
//   var search_data = search_sheet.getDataRange().getDisplayValues();

//   let id = search_data.map(r => r[13])

//   var bdate = obj.datein_milein.split("-")
//   var thaidatemilein = LanguageApp.translate(Utilities.formatDate(new Date(bdate[0], parseInt(bdate[1]) - 1, parseInt(bdate[2])), 'GMT+7', 'dd/MM/yyyy'), 'en', 'th').split('-').map((a, i) => { if (i != 2 || parseInt(a) > 2100) { return a }; a = parseInt(a) + 543; return a }).join(' ')

//   var index = id.indexOf(obj.numid_milein)


//   search_sheet.getRange(index + 1, 2).setValue(obj.name_milein)
//   search_sheet.getRange(index + 1, 3).setValue(obj.dep_milein)
//   search_sheet.getRange(index + 1, 4).setValue(obj.car_milein)
//   search_sheet.getRange(index + 1, 5).setValue(obj.loca_milein)
//   search_sheet.getRange(index + 1, 6).setValue(obj.startDate_milein)
//   search_sheet.getRange(index + 1, 7).setValue(obj.startTime_milein)
//   search_sheet.getRange(index + 1, 8).setValue(obj.endDate_milein)
//   search_sheet.getRange(index + 1, 9).setValue(obj.endTime_milein)
//   search_sheet.getRange(index + 1, 10).setValue(obj.drive_milein)
//   search_sheet.getRange(index + 1, 11).setValue(obj.other_milein)
//   search_sheet.getRange(index + 1, 12).setValue(obj.preapporved_milein)
//   search_sheet.getRange(index + 1, 13).setValue(obj.apporve_milein)
//   search_sheet.getRange(index + 1, 14).setValue(obj.dateout_milein)
//   search_sheet.getRange(index + 1, 15).setValue(obj.timeout_milein)
//   search_sheet.getRange(index + 1, 16).setValue(obj.mileout_milein)
//   search_sheet.getRange(index + 1, 17).setValue(thaidatemilein)
//   search_sheet.getRange(index + 1, 18).setValue(obj.timein_milein)
//   search_sheet.getRange(index + 1, 19).setValue(obj.milein_milein)
//   search_sheet.getRange(index + 1, 20).setValue(obj.driver_milein)

// sendLinemilein(obj,thaidatemilein)
//   return true;

// }

//ค้นหาข้อมูล
function searchnameData(obj) {
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('รออนุมัติ');
  var data = ss.getDataRange().getDisplayValues();
  var output = data.filter(r => r[13] == obj.searchname_name);
  return output;
}

//**เพิ่มข้อมูล */
function searchapproveeditcareditcaraddRecord(obj) {
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data2')
  var approveeditcardata2 = ss.getDataRange().getDisplayValues()

  let id = approveeditcardata2.map(r => r[0] & r[2])



  var index = id.indexOf(obj.searchnumid_approveeditcar & obj.searchname_approveeditcar)
   // document.getElementById('searchnumid_approveeditcar').value = searchname_searchpreapprove
    // document.getElementById('searchname_approveeditcar').value = ar2
    // document.getElementById('searchdep_approveeditcar').value = ar4
    // document.getElementById('searchleader_approveeditcar').value = ar5
    // document.getElementById('searchloca_approveeditcar').value = ar6
    // document.getElementById('searchstartDate_approveeditcar').value = ar7
    // document.getElementById('searchstartTime_approveeditcar').value = ar8
    // document.getElementById('searchendDate_approveeditcar').value = ar9
    // document.getElementById('searchendTime_approveeditcar').value = ar10
    // document.getElementById('searchplace_approveeditcar').value = ar11
    // document.getElementById('searchother_approveeditcar').value = ar12
    // document.getElementById('searchapporve_approve').value = ar13
    // document.getElementById('searchpreapporved_approveeditcar').value = ar13
    // document.getElementById('searchapporve_approve').value = searchvaluepreapporved_approveeditcar
    // document.getElementById('searchvaluepreapporved_approveeditcar').value = searchvaluepreapporved_approveeditcar
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
  var editLogSheet = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('editlog');
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