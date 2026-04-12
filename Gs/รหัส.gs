/**
 * รหัส.gs  —  Main entry point
 *
 * doGet ทำ 2 หน้าที่:
 *  1. ถ้ามี ?action=xxx  → API mode  (ส่ง JSON กลับ)
 *  2. ถ้าไม่มี action    → HTML mode (serve web app เดิม)
 */

function doGet(e) {
  // ── API mode ────────────────────────────────────────────
  if (e && e.parameter && e.parameter.action) {
    try {
      var action = e.parameter.action;
      var args   = JSON.parse(e.parameter.params || '[]');
      var result = _dispatch(action, args);
      return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
      Logger.log('doGet API error: ' + err);
      return ContentService
        .createTextOutput(JSON.stringify({ __error: err.toString() }))
        .setMimeType(ContentService.MimeType.JSON);
    }
  }

  // ── HTML mode ────────────────────────────────────────────
  return HtmlService.createTemplateFromFile('Admin/index').evaluate()
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('กกล.ยก.ทหาร บก.ทท.')
    .setFaviconUrl('https://img2.pic.in.th/pic/Untitled-designa64a7773ec4d81e9.png')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

/** doPost (optional — รองรับ request แบบ POST ด้วย) */
function doPost(e) {
  try {
    var action, args;
    if (e.postData && e.postData.contents) {
      var body = e.postData.contents;
      // try JSON body
      try {
        var json = JSON.parse(body);
        action = json.action;
        args   = json.params || [];
      } catch (_) {
        // fallback URL-encoded
        action = e.parameter.action;
        args   = JSON.parse(e.parameter.params || '[]');
      }
    } else {
      action = e.parameter.action;
      args   = JSON.parse(e.parameter.params || '[]');
    }
    var result = _dispatch(action, args);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    Logger.log('doPost error: ' + err);
    return ContentService
      .createTextOutput(JSON.stringify({ __error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/** Dispatch action → function */
function _dispatch(action, args) {
  var map = {
    // Auth
    'authenticateUser'    : authenticateUser,
    'loginCheckip'        : loginCheckip,
    // System
    'getURL'              : getURL,
    'countPage'           : countPage,
    'getSetting'          : getSetting,
    'updateSetting'       : updateSetting,
    'resetPassword'       : resetPassword,
    // Dashboard
    'getSummary'          : getSummary,
    'getData_ChartBar'    : getData_ChartBar,
    'getChart'            : getChart,
    // Booking
    'bookaddRecord'       : bookaddRecord,
    '_getDropdownOptions' : _getDropdownOptions,
    'getDataSheet1'       : getDataSheet1,
    'getDatahistory'      : getDatahistory,
    // Approval
    'approve'             : approve,
    'preapprove'          : preapprove,
    'cancelBook'          : cancelBook,
    // Car
    'carstatus'           : carstatus,
    'closestatus'         : closestatus,
    'cardaily'            : cardaily,
    'totalcar'            : totalcar,
    'checkcar'            : checkcar,
    // Mileage
    'milein'              : milein,
    'mileout'             : mileout,
    // Personnel
    'getPersonData'       : getPersonData,
    'searchname'          : searchname,
    'schedule'            : schedule,
    // Charts
    'getChart_2'          : getChart_2,
    'getChart_3'          : getChart_3,
    'getChart_4'          : getChart_4,
    // Misc
    'requirment'          : requirment,
    'addcaranddep'        : addcaranddep,
    'settingsystem'       : settingsystem,
  };

  if (action in map) {
    return map[action].apply(null, args);
  }
  throw new Error('Unknown action: "' + action + '"');
}

/** URL ของ Web App */
function getURL() {
  return ScriptApp.getService().getUrl();
}
