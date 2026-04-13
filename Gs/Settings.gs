// Settings.gs — System configuration

function settingGet() {
  var data = _getSheet(SHEET.SETTING).getRange('A2:F2').getDisplayValues()[0];
  return {
    token:        data[0],
    token2:       data[1],
    folderId:     data[2],
    publicize:    data[3],
    devName:      data[4],
    organization: data[5]
  };
}

function settingUpdate(obj) {
  _getSheet(SHEET.SETTING).getRange('A2:F2').setValues([[
    obj.token        || '',
    obj.token2       || '',
    obj.folderId     || obj.idfolderimag || '',
    obj.publicize    || '',
    obj.devName      || obj.devname || '',
    obj.organization || ''
  ]]);
  return true;
}

function countPageView() {
  var sheet = _getSheet(SHEET.SUMMARY);
  if (!sheet) return 0;
  var cell = sheet.getRange('E2');
  var val = parseInt(cell.getValue()) || 0;
  cell.setValue(val + 1);
  return val + 1;
}
