// Housing.gs — ที่พัก / อาคารสวัสดิการ

function housingGetList() {
  var sheet = _getSheet(SHEET.HOUSING);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function housingGetRentList() {
  var sheet = _getSheet(SHEET.HOUSING_RENT);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function housingGetSeniorList() {
  var sheet = _getSheet(SHEET.HOUSING_SENIOR);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function housingGetByRoom(roomNumber) {
  var sheet = _getSheet(SHEET.DATA_B1);
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  return data.filter(function(r) { return r[1] == roomNumber; });
}

function housingGetDetailByRequest(requestId) {
  var sheet = _getSheet(SHEET.HOUSING);
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  return data.filter(function(r) { return r[1] == requestId; });
}

function housingGetRentDetail(rentId) {
  var sheet = _getSheet(SHEET.HOUSING_RENT);
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  return data.filter(function(r) { return r[2] == rentId; });
}

function housingGetSeniorDetail(snId) {
  var sheet = _getSheet(SHEET.HOUSING_SENIOR);
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  return data.filter(function(r) { return r[1] == snId; });
}
