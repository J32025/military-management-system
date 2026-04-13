//**เพิ่มข้อมูล */
function mileoutaddRecord(obj) {
  var mileoutss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data')
  var mileoutdata = mileoutss.getDataRange().getDisplayValues();

  let mileoutid = mileoutdata.map(r => r[0])



  var index = mileoutid.indexOf(obj.numid_mileout)


  mileoutss.getRange(index + 1, 2).setValue(obj.name_mileout)
  mileoutss.getRange(index + 1, 3).setValue(obj.dep_mileout)
  mileoutss.getRange(index + 1, 4).setValue(obj.car_mileout)
  mileoutss.getRange(index + 1, 5).setValue(obj.loca_mileout)
  mileoutss.getRange(index + 1, 6).setValue(obj.startDate_mileout)
  mileoutss.getRange(index + 1, 7).setValue(obj.startTime_mileout)
  mileoutss.getRange(index + 1, 8).setValue(obj.endDate_mileout)
  mileoutss.getRange(index + 1, 9).setValue(obj.endTime_mileout)
  mileoutss.getRange(index + 1, 10).setValue(obj.drive_mileout)
  mileoutss.getRange(index + 1, 11).setValue(obj.other_mileout)
  mileoutss.getRange(index + 1, 12).setValue(obj.preapporved_mileout)
  mileoutss.getRange(index + 1, 13).setValue(obj.apporve_mileout)
  mileoutss.getRange(index + 1, 16).setValue(obj.dateout_mileout)
  mileoutss.getRange(index + 1, 17).setValue(obj.timeout_mileout)
  mileoutss.getRange(index + 1, 18).setValue(obj.mileout_mileout)
  mileoutss.getRange(index + 1, 20).setValue(obj.driver_mileout)

sendLinemileout(obj)
  return true;

}





function mileoutgetdata() {
  let mileoutgetdatass = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let mileoutgetdatasheet = mileoutgetdatass.getSheetByName("อนุมัติ")
  let mileoutgetdatarange = mileoutgetdatasheet.getDataRange()
  let mileoutgetdatavalues = mileoutgetdatarange.getDisplayValues()

  Logger.log(mileoutgetdatavalues)
  return mileoutgetdatavalues
}


//ค้นหาข้อมูล
function mileout_searchData(obj) {
  var ss1 = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('อนุมัติ');
  var datacarout = ss1.getDataRange().getDisplayValues();
  var output1 = datacarout.filter(r => r[9] + r[11] == obj.searchname_out + obj.searchcar_out);
  return output1;
}

