function preapprovegetdata() {
  let preapprovess = SpreadsheetApp.getActive()
  let preapprovesheet = preapprovess.getSheetByName("รออนุมัติ")
  let preapproverange = preapprovesheet.getDataRange()
  let preapprovevalues = preapproverange.getDisplayValues()

  //Logger.log(preapprovevalues)
  return preapprovevalues
}

//ค้นหาข้อมูล
var ss = SpreadsheetApp.getActive().getSheetByName('รออนุมัติ')
var data = ss.getDataRange().getDisplayValues()
var id = data.map(r => r[13])

function searchPreapprove(obj) {
// กรองข้อมูลใน 'data' ตามเงื่อนไขที่ระบุ
  var output1 = data.filter(r => r[13] == obj.searchname_preapprove);

  // Logger.log(output)
  return output1;

}