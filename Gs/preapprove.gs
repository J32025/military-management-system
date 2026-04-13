function preapprovegetdata() {
  let preapprovess = SpreadsheetApp.getActive()
  let preapprovesheet = preapprovess.getSheetByName("รออนุมัติ")
  let preapproverange = preapprovesheet.getDataRange()
  let preapprovevalues = preapproverange.getDisplayValues()

  //Logger.log(preapprovevalues)
  return preapprovevalues
}

//ค้นหาข้อมูล
function searchPreapprove(obj) {
  var ss = SpreadsheetApp.getActive().getSheetByName('รออนุมัติ');
  var data = ss.getDataRange().getDisplayValues();
  var output1 = data.filter(r => r[13] == obj.searchname_preapprove);
  return output1;
}