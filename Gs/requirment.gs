function requirmentGetData() {
  let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let sheet = ss.getSheetByName("Data_B_Requir")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}

function requirment_rentGetData() {
  let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let sheet = ss.getSheetByName("Data_B_Requir_rent")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}

function requirment_s_nGetData() {
  let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
  let sheet = ss.getSheetByName("Data_น_พัก_ป")
  let range = sheet.getDataRange()
  let values = range.getDisplayValues()

  // Logger.log(values)
  return values
}


function fetchDataByRoom(roomNumber) {
    let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
    let sheet = ss.getSheetByName("Data_B_1")
    const data = sheet.getDataRange().getValues();
    const result = data.filter(row => row[1] === roomNumber); // ค้นหาข้อมูลตามคอลัมน์ห้อง (คอลัมน์ 1)
    return result;
}

function fetchDataByrequir(roomNumber) {
    let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
    let sheet = ss.getSheetByName("Data_B_Requir")
    const data = sheet.getDataRange().getValues();
    const result = data.filter(row => row[1] === roomNumber); // ค้นหาข้อมูลตามคอลัมน์ห้อง (คอลัมน์ 1)
    return result;
}

function fetchDataByrequir_rent(roomNumber) {
    let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
    let sheet = ss.getSheetByName("Data_B_Requir")
    const data = sheet.getDataRange().getValues();
    const result = data.filter(row => row[2] === roomNumber); // ค้นหาข้อมูลตามคอลัมน์ห้อง (คอลัมน์ 1)
    return result;
}

function fetchDataByrequir_s_n(roomNumber) {
    let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
    let sheet = ss.getSheetByName("Data_B_Requir")
    const data = sheet.getDataRange().getValues();
    const result = data.filter(row => row[1] === roomNumber); // ค้นหาข้อมูลตามคอลัมน์ห้อง (คอลัมน์ 1)
    return result;
}

function requirment_s_nGetData(roomNumber) {
    let ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g")
    let sheet = ss.getSheetByName("Data_น_พัก_ป")
    const data = sheet.getDataRange().getValues();
    const result = data.filter(row => row[1] === roomNumber); // ค้นหาข้อมูลตามคอลัมน์ห้อง (คอลัมน์ 1)
    return result;
}