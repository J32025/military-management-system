function preapprovegetdata() {
  let preapprovess = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let preapprovesheet = preapprovess.getSheetByName("รออนุมัติ")
  let preapproverange = preapprovesheet.getDataRange()
  let preapprovevalues = preapproverange.getDisplayValues()

  //Logger.log(preapprovevalues)
  return preapprovevalues
}

//ค้นหาข้อมูล
function searchPreapprove(obj) {
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('รออนุมัติ');
  var data = ss.getDataRange().getDisplayValues();
  var output1 = data.filter(r => r[13] == obj.searchname_preapprove);
  return output1;
}