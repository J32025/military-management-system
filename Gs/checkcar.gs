function checkcargetdata() {
  let checkcarss = SpreadsheetApp.getActive()
  let checkcarsheet = checkcarss.getSheetByName("Data_B_2")
  let checkcarrange = checkcarsheet.getDataRange()
  let checkcarvalues = checkcarrange.getDisplayValues()

  Logger.log(checkcarvalues)
  return checkcarvalues
}