function mileinaddRecord(obj) {
  var mileinss = SpreadsheetApp.getActive().getSheetByName('Data')
  var mileindata = mileinss.getDataRange().getDisplayValues();

  let id = mileindata.map(r => r[0])

  var bdate = obj.datein_milein.split("-")
  var thaidatemilein = LanguageApp.translate(Utilities.formatDate(new Date(bdate[0], parseInt(bdate[1]) - 1, parseInt(bdate[2])), 'GMT+7', 'dd/MM/yyyy'), 'en', 'th').split('-').map((a, i) => { if (i != 2 || parseInt(a) > 2100) { return a }; a = parseInt(a) + 543; return a }).join(' ')

  var index = id.indexOf(obj.numid_milein)


  mileinss.getRange(index + 1, 2).setValue(obj.name_milein)
  mileinss.getRange(index + 1, 3).setValue(obj.dep_milein)
  mileinss.getRange(index + 1, 4).setValue(obj.car_milein)
  mileinss.getRange(index + 1, 5).setValue(obj.loca_milein)
  mileinss.getRange(index + 1, 6).setValue(obj.startDate_milein)
  mileinss.getRange(index + 1, 7).setValue(obj.startTime_milein)
  mileinss.getRange(index + 1, 8).setValue(obj.endDate_milein)
  mileinss.getRange(index + 1, 9).setValue(obj.endTime_milein)
  mileinss.getRange(index + 1, 10).setValue(obj.drive_milein)
  mileinss.getRange(index + 1, 11).setValue(obj.other_milein)
  mileinss.getRange(index + 1, 12).setValue(obj.preapporved_milein)
  mileinss.getRange(index + 1, 13).setValue(obj.apporve_milein)
  mileinss.getRange(index + 1, 14).setValue(obj.dateout_milein)
  mileinss.getRange(index + 1, 15).setValue(obj.timeout_milein)
  mileinss.getRange(index + 1, 16).setValue(obj.mileout_milein)
  mileinss.getRange(index + 1, 17).setValue(thaidatemilein)
  mileinss.getRange(index + 1, 18).setValue(obj.timein_milein)
  mileinss.getRange(index + 1, 19).setValue(obj.milein_milein)
  mileinss.getRange(index + 1, 20).setValue(obj.driver_milein)

sendLinemilein(obj,thaidatemilein)
  return true;

}





function mileingetdata() {
  let mileingetdatass = SpreadsheetApp.getActive()
  let mileingetdatasheet = mileingetdatass.getSheetByName("กำลังใช้งาน")
  let mileingetdatarange = mileingetdatasheet.getDataRange()
  let mileingetdatavalues = mileingetdatarange.getDisplayValues()

  Logger.log(mileingetdatavalues)
  return mileingetdatavalues
}




//ค้นหาข้อมูล
function milein_searchData(obj) {
  var ss = SpreadsheetApp.getActive().getSheetByName('กำลังใช้งาน');
  var datacarin = ss.getDataRange().getDisplayValues();
  var output = datacarin.filter(r => r[9] + r[11] == obj.searchname_in + obj.searchcar_in);
  return output;
}

