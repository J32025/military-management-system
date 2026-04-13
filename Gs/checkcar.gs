function checkcargetdata() {
  let checkcarss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let checkcarsheet = checkcarss.getSheetByName("Data_B_2")
  let checkcarrange = checkcarsheet.getDataRange()
  let checkcarvalues = checkcarrange.getDisplayValues()

  Logger.log(checkcarvalues)
  return checkcarvalues
}