function cardailygetData() {
  let ss = SpreadsheetApp.getActive()
  let sheet = ss.getSheetByName("Data_B_3")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  Logger.log(values)
  return values
}
