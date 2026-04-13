function checkcarstatusgetdata() {
  let checkcarstatusss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let checkcarstatussheet = checkcarstatusss.getSheetByName("Data_B_5")
  let checkcarstatusrange = checkcarstatussheet.getDataRange()
  let checkcarstatusvalues = checkcarstatusrange.getDisplayValues()

  Logger.log(checkcarstatusvalues)
  return checkcarstatusvalues
}