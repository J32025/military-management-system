//**เพิ่มข้อมูลadmin */
  function cancelRecord(obj){
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data')
  var canceldata = ss.getDataRange().getDisplayValues(); 

  let id = canceldata.map(r=>r[0])


var index = id.indexOf(obj.numid_cancel)

ss.getRange(index+1,2).setValue(obj.name_cancel)
ss.getRange(index+1,3).setValue(obj.dep_cancel)
ss.getRange(index+1,4).setValue(obj.car_cancel)
ss.getRange(index+1,5).setValue(obj.loca_cancel)
ss.getRange(index+1,6).setValue(obj.startDate_cancel)
ss.getRange(index+1,7).setValue(obj.startTime_cancel)
ss.getRange(index+1,8).setValue(obj.endDate_cancel)
ss.getRange(index+1,9).setValue(obj.endTime_cancel)
ss.getRange(index+1,10).setValue(obj.drive_cancel)
ss.getRange(index+1,11).setValue(obj.other_cancel)
ss.getRange(index+1,12).setValue(obj.preapporved_cancel)
ss.getRange(index+1,13).setValue(obj.namecancel_car)
ss.getRange(index+1,14).setValue("'")
ss.getRange(index+1,15).setValue("'")

sendLineNotifycancel(obj)
 return true;

}
  
//**เพิ่มข้อมูลuser */
  function cancelRecorduser(obj){
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data')
  var canceldatauser = ss.getDataRange().getDisplayValues(); 

  let id = canceldatauser.map(r=>r[0])


var index = id.indexOf(obj.numid_canceluser)

ss.getRange(index+1,2).setValue(obj.name_canceluser)
ss.getRange(index+1,3).setValue(obj.dep_canceluser)
ss.getRange(index+1,4).setValue(obj.car_canceluser)
ss.getRange(index+1,5).setValue(obj.loca_canceluser)
ss.getRange(index+1,6).setValue(obj.startDate_canceluser)
ss.getRange(index+1,7).setValue(obj.startTime_canceluser)
ss.getRange(index+1,8).setValue(obj.endDate_canceluser)
ss.getRange(index+1,9).setValue(obj.endTime_canceluser)
ss.getRange(index+1,10).setValue(obj.drive_canceluser)
ss.getRange(index+1,11).setValue(obj.other_canceluser)
ss.getRange(index+1,12).setValue(obj.preapporved_canceluser)
ss.getRange(index+1,13).setValue(obj.driver_canceluser)
ss.getRange(index+1,14).setValue("")
ss.getRange(index+1,15).setValue("")

sendLineNotifycanceluser(obj)
 return true;

}



function cancelgetdata() {
  let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let sheet = ss.getSheetByName("อนุมัติ")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  Logger.log(values)
  return values
}



//ค้นหาข้อมูลเพื่อยกเลิก
function cancelcar_searchData(obj) {
  var ss_carcancel = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('รวมภารกิจ');
  var datacar_cancel = ss_carcancel.getDataRange().getDisplayValues();
  var output1 = datacar_cancel.filter(r => r[1] + r[11] == obj.searchname_cancel + obj.searchcar_cancel);
  return output1;
}

