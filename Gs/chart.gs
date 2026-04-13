function getData_ChartBar() {
  var ws = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ประเภท");
  var data = ws.getRange(2, 1, ws.getLastRow(), ws.getLastColumn()).getDisplayValues();

  // ใช้ filter เพื่อตัดค่าว่างออก
  var result = data.filter(function (row) {
    // กรองเฉพาะแถวที่คอลัมน์แรกและคอลัมน์ที่สองไม่เป็นค่าว่าง
    return row[1] !== "" && row[2] !== "";
  });

  //console.log(result);
  return result;
}


function countPage(){
  var ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('สรุปสถานะ')

   var pageC = ss.getRange('E2').getValue()

   pageC++;
   ss.getRange('E2').setValue(pageC)

    var data = ss.getRange('E2').getValue()
       return data
}