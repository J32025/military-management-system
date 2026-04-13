// Personnel.gs — กำลังพล data

function personnelGetSummary() {
  var sheet = _getSheet(SHEET.HOUSING_REQ);
  if (!sheet) return {};
  var data = sheet.getDataRange().getDisplayValues();
  var result = { total: 0, officer: 0, nco: 0, civilServant: 0, other: 0 };
  for (var i = 1; i < data.length; i++) {
    var status = data[i][data[i].length - 1] || '';
    result.total++;
    if (status.indexOf('สัญญาบัตร') !== -1) result.officer++;
    else if (status.indexOf('ประทวน') !== -1) result.nco++;
    else if (status.indexOf('พนักงาน') !== -1) result.civilServant++;
    else result.other++;
  }
  return result;
}

function personnelGetRawList() {
  var sheet = _getSheet(SHEET.PERSONNEL);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function personnelGetChartData() {
  var sheet = _getSheet(SHEET.PERSONNEL_REPORT);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}
