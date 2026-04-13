// Dashboard.gs — Summary stats and chart data

function dashboardGetSummary() {
  var pending  = _getSheet(SHEET.PENDING);
  var inUse    = _getSheet(SHEET.IN_USE);
  var approved = _getSheet(SHEET.APPROVED);
  var cars     = _getSheet(SHEET.CARS);

  var pendingCount  = pending  ? Math.max(0, pending.getLastRow()  - 1) : 0;
  var inUseCount    = inUse    ? Math.max(0, inUse.getLastRow()    - 1) : 0;
  var approvedCount = approved ? Math.max(0, approved.getLastRow() - 1) : 0;
  var totalCars     = cars     ? Math.max(0, cars.getLastRow()     - 1) : 0;

  return {
    pending:   pendingCount,
    approved:  approvedCount,
    inUse:     inUseCount,
    totalCars: totalCars
  };
}

function dashboardGetBarChartData() {
  var sheet = _getSheet(SHEET.CARS);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function dashboardGetLineChartData() {
  var sheet = _getSheet(SHEET.CHART);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}
