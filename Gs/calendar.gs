function getDataFromSheet() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('calendar');
  var data = sheet.getDataRange().getDisplayValues();
  var jsonData = [];

  for (var i = 1; i < data.length; i++) {
    var event = {
      title: data[i][0],
      start: data[i][1],
      starttime: data[i][2], 
      end: data[i][3],
      endtime: data[i][4],
      namebook: data[i][5],
      loca: data[i][6],
      drivestatus: data[i][7],
      other: data[i][8],
      status: data[i][9],
      approve: data[i][10]
    
      
    };
    jsonData.push(event);
  }

  return JSON.stringify(jsonData);
}
