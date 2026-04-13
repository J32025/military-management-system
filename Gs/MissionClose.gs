// MissionClose.gs — Mission close-out (ปิดภารกิจ)

function missionCloseGetList() {
  var sheet = _getSheet(SHEET.DATA_B4);
  if (!sheet) return [];
  return sheet.getDataRange().getDisplayValues();
}

function missionCloseSearch(obj) {
  var sheet = _getSheet(SHEET.PENDING);
  if (!sheet) return [];
  var data = sheet.getDataRange().getDisplayValues();
  var term = (obj && (obj.searchname_name || obj.searchname_approveeditcar || ''));
  if (!term) return data;
  return data.filter(function(r) {
    return r[13] == term || r[0] == term || (r[2] && r[2].indexOf(term) !== -1);
  });
}

function missionCloseRecord(obj) {
  var sheet = _getSheet(SHEET.DATA_B4);
  if (!sheet) return false;
  var data = sheet.getDataRange().getDisplayValues();
  var id = obj.searchnumid_approveeditcar || obj.numid || obj.uuid || '';
  var idx = -1;
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == id) { idx = i; break; }
  }

  var row = [
    id,
    obj.name_approveeditcar    || '',
    obj.dep_approveeditcar     || '',
    obj.leader_approveeditcar  || '',
    obj.loca_approveeditcar    || '',
    obj.startDate_approveeditcar || '',
    obj.startTime_approveeditcar || '',
    obj.endDate_approveeditcar  || '',
    obj.endTime_approveeditcar  || '',
    obj.place_approveeditcar   || '',
    obj.other_approveeditcar   || '',
    obj.preapporved_approveeditcar || '',
    obj.apporve_approve1       || '',
    new Date(),
    obj.valuepreapporved_approveeditcar || ''
  ];

  if (idx !== -1) {
    sheet.getRange(idx + 1, 1, 1, row.length).setValues([row]);
  } else {
    sheet.appendRow(row);
  }

  // Mirror to editlog
  var editlog = _getSheet(SHEET.EDITLOG);
  if (editlog) editlog.appendRow(row);

  return true;
}

function missionCloseDelete(record) {
  var sheet = _getSheet(SHEET.DATA2);
  if (!sheet) return false;
  var data = sheet.getDataRange().getDisplayValues();
  for (var i = 0; i < data.length; i++) {
    if (data[i][0] == record) {
      sheet.deleteRow(i + 1);
      return true;
    }
  }
  return false;
}
