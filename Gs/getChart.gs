// function getChartData() {
//   const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ZZZZ");

//   const dataRanges = [
//     {range: 'ZZZZ!A2:B12', key:'Pormodtanoy1'},
//     {range: 'ZZZZ!D2:G12', key:'Pormodtanoy2'},
//     {range: 'ZZZZ!I2:J12', key:'Pormodtanoy3'},
//     {range: 'ZZZZ!A16:B26', key:'Pormodtanoy4'},
//     {range: 'ZZZZ!D16:E26', key:'Pormodtanoy5'}
//   ];

//   let data_66 = [];

//   dataRanges.forEach(function(rangeObj){
//     let rangeData = sheet.getRange(rangeObj.range).getValues();
//     data_66.push({key: rangeObj.key, values: rangeData});
//   });

//   // console.log(JSON.stringify(data_66, null, 2)); // แสดงข้อมูลในรูปแบบ JSON ที่อ่านง่าย

//   return data_66;
// }

function getChartData() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("ZZZZ");
  const data = sheet.getDataRange().getValues();

  // แยกข้อมูลออกเป็น labels และ data
  const labels = data.slice(1).map(row => row[0]); // เริ่มที่แถวที่ 1 เพื่อข้ามหัวเรื่อง
  const values = data.slice(1).map(row => row[1]); // เริ่มที่แถวที่ 1 เพื่อข้ามหัวเรื่อง

  return {
    labels: labels,
    data: values
  };
}

