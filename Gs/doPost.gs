/**
 * doPost.gs
 * ==========================================
 * HTTP endpoint สำหรับ GitHub Pages Static Site
 * รับ POST request จาก gas-bridge.js แล้ว dispatch ไปยัง function ที่ถูกต้อง
 *
 * วิธี Deploy:
 *  1. เปิด Google Apps Script ของโปรเจกต์นี้
 *  2. Deploy > New deployment > Web app
 *  3. Execute as: Me
 *  4. Who has access: Anyone
 *  5. คัดลอก URL ไปใส่ใน js/config.js
 * ==========================================
 */

function doPost(e) {
  try {
    var action, args;

    // รองรับทั้ง JSON body และ URL-encoded form
    if (e.postData && e.postData.contents) {
      try {
        var body = JSON.parse(e.postData.contents);
        action = body.action;
        args = body.params || [];
      } catch (ex) {
        action = e.parameter.action;
        args = JSON.parse(e.parameter.params || '[]');
      }
    } else {
      action = e.parameter.action;
      args = JSON.parse(e.parameter.params || '[]');
    }

    var result = _dispatch(action, args);

    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    Logger.log('doPost error: ' + err.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ __error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  try {
    var action = e.parameter.action;
    var args = JSON.parse(e.parameter.params || '[]');
    var result = _dispatch(action, args);
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ __error: err.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Dispatch action ไปยัง function ที่ถูกต้อง
 * เพิ่ม function ใหม่ที่ต้องการ expose ในตาราง actions ด้านล่าง
 */
function _dispatch(action, args) {
  var actions = {
    // Auth
    'authenticateUser'       : authenticateUser,
    'loginCheckip'           : loginCheckip,

    // System
    'getURL'                 : getURL,
    'countPage'              : countPage,
    'getSetting'             : getSetting,
    'updateSetting'          : updateSetting,
    'resetPassword'          : resetPassword,

    // Dashboard
    'getSummary'             : getSummary,
    'getData_ChartBar'       : getData_ChartBar,
    'getChart'               : getChart,

    // Booking
    'bookaddRecord'          : bookaddRecord,
    '_getDropdownOptions'    : _getDropdownOptions,
    'getDataSheet1'          : getDataSheet1,
    'getDatahistory'         : getDatahistory,

    // Approval
    'approve'                : approve,
    'preapprove'             : preapprove,
    'cancelBook'             : cancelBook,

    // Car status
    'carstatus'              : carstatus,
    'closestatus'            : closestatus,
    'cardaily'               : cardaily,
    'totalcar'               : totalcar,
    'checkcar'               : checkcar,

    // Mileage
    'milein'                 : milein,
    'mileout'                : mileout,

    // Personnel
    'getPersonData'          : getPersonData,
    'searchname'             : searchname,
    'schedule'               : schedule,

    // Chart data
    'getChart_2'             : getChart_2,
    'getChart_3'             : getChart_3,
    'getChart_4'             : getChart_4,

    // Requirement
    'requirment'             : requirment,
    'addcaranddep'           : addcaranddep,
    'settingsystem'          : settingsystem,
  };

  if (action in actions) {
    return actions[action].apply(null, args);
  } else {
    throw new Error('Unknown action: "' + action + '"');
  }
}

/**
 * Helper: ดึง URL ของ Web App (สำหรับ compatibility กับ getURL() เดิม)
 */
function getURL() {
  return ScriptApp.getService().getUrl();
}
