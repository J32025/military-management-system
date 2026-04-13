function cardailygetData() {
  let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let sheet = ss.getSheetByName("Data_B_3")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  Logger.log(values)
  return values
}
