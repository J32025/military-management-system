function bookaddRecord(
  search_name_value, rank3_value, name_name_value, address_name_value, leader_1_value,
  dropdown_value, startDate_book_value, endDate_book_value, etc_value, name_value, loca_book_value, other_book_value, name_book_value, dropdown_dep_value, uuid
) {
  const ss = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g").getSheetByName('Data2');
  const bookdata = ss.getDataRange().getDisplayValues();

  // ตรวจสอบว่าวันที่ไม่มีการจองซ้ำกัน
  const duplicateList = [];
  for (let i = 1; i < bookdata.length; i++) {
    const checkdateTimestart = bookdata[i][15];
    const checkdateTimeend = bookdata[i][16];

    if ((search_name_value + startDate_book_value >= checkdateTimestart && search_name_value + startDate_book_value <= checkdateTimeend) ||
      (search_name_value + endDate_book_value >= checkdateTimestart && search_name_value + endDate_book_value <= checkdateTimeend) ||
      (search_name_value + startDate_book_value <= checkdateTimestart && search_name_value + endDate_book_value >= checkdateTimeend)) {
      duplicateList.push({
        // id: bookdata[i][0],
        // search_name2: bookdata[i][1],
        // rank3: bookdata[i][2],
        // name_name: bookdata[i][3],
        // address_name: bookdata[i][4],
        // dropdown: bookdata[i][5],
        dropdown: bookdata[i][6],
        thaistartDate: bookdata[i][7],
        thaiendDate: bookdata[i][8],
        // loca_book: bookdata[i][9],
        // other_book: bookdata[i][10],
        loca_book: bookdata[i][11],
        // dropdown_dep: bookdata[i][12],
        // file_book: bookdata[i][13],
      });
    }
  }

  // ถ้ามีรายการที่ซ้ำกันส่งค่าไปหน้าindexแจ้งเตือนในsweetalert
  if (duplicateList.length > 0) {
    return { success: false, duplicateList };
  }

  var bdate = startDate_book_value.split("-")
  var thaistartDate = LanguageApp.translate(Utilities.formatDate(new Date(bdate[0], parseInt(bdate[1]) - 1, parseInt(bdate[2])), 'GMT+7', 'dd/MM/yyyy'), 'en', 'th').split('-').map((a, i) => { if (i != 2 || parseInt(a) > 2100) { return a }; a = parseInt(a) + 543; return a }).join(' ')

  var bdate1 = endDate_book_value.split("-")
  var thaiendDate = LanguageApp.translate(Utilities.formatDate(new Date(bdate1[0], parseInt(bdate1[1]) - 1, parseInt(bdate1[2])), 'GMT+7', 'dd/MM/yyyy'), 'en', 'th').split('-').map((a, i) => { if (i != 2 || parseInt(a) > 2100) { return a }; a = parseInt(a) + 543; return a }).join(' ')
  // บันทึกข้อมูลลงชีต
  ss.appendRow([
    uuid,
    search_name_value,
    rank3_value,
    name_name_value,
    address_name_value,
    leader_1_value,
    dropdown_value,
    thaistartDate,
    thaiendDate,
    etc_value,
    name_value,
    loca_book_value,
    other_book_value,
    // rank_book_value,
    name_book_value,
    dropdown_dep_value,
    search_name_value + startDate_book_value,
    search_name_value + endDate_book_value,
    "รออนุมัติ",
    new Date()
  ]);

  return true;
}


function _getDropdownOptions() {
  var _sheet = SpreadsheetApp.openById("1GBErFuQsyRWSAlRacTfnmnUrftwRxC_4Zk_hWbHSF5g");
  var _data = _sheet.getSheetByName('ประเภท').getRange('B2:B').getValues();
  var options = [];

  // ให้แถวด้านบนของชีตมีค่าว่าง
  options.push("");

  for (var i = 0; i < _data.length; i++) {
    // กรองแถวที่มีข้อมูลไม่ว่างใน Google Sheets
    if (_data[i][0] !== "") {
      options.push(_data[i][0]);
    }
  }

  return options;
}

//ฟังชั่นดึงข้อมูลขึ้นมาโชว์
function getDataSheet1() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("Base");
  var data = sheet.getDataRange().getDisplayValues()
  data.shift()
  // Logger.log(data)
  return data
}