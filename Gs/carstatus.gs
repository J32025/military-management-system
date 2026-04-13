// CarStatus.gs — Vehicle status, daily missions, and history

function carStatusGetAll() {
  var sheet = _getSheet(SHEET.DATA_B5);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function carDailyGetList() {
  var sheet = _getSheet(SHEET.DATA_B3);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function carTotalGetHistory() {
  var sheet = _getSheet(SHEET.ALL_HISTORY);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function carCheckGetApproved() {
  var sheet = _getSheet(SHEET.DATA_B2);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}
