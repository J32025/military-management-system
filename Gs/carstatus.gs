function checkcarstatusgetdata() {
  let checkcarstatusss = SpreadsheetApp.getActive()
  let checkcarstatussheet = checkcarstatusss.getSheetByName("Data_B_5")
  let checkcarstatusrange = checkcarstatussheet.getDataRange()
  let checkcarstatusvalues = checkcarstatusrange.getDisplayValues()

  Logger.log(checkcarstatusvalues)
  return checkcarstatusvalues
}