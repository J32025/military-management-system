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
    'authenticateUser'                      : authenticateUser,
    'loginCheckip'                          : loginCheckip,
    'resetPassword'                         : resetPassword,
    // System
    'getURL'                                : getURL,
    'countPage'                             : countPage,
    'getSetting'                            : getSetting,
    'updateSetting'                         : updateSetting,
    // Dashboard
    'getSummary'                            : getSummary,
    'getData_ChartBar'                      : getData_ChartBar,
    'getChartData'                          : getChartData,
    'getChartDataPersonnel'                 : getChartDataPersonnel,
    'getDataFromSheet'                      : getDataFromSheet,
    // Booking
    'bookaddRecord'                         : bookaddRecord,
    '_getDropdownOptions'                   : _getDropdownOptions,
    'getDataSheet1'                         : getDataSheet1,
    'getDatahistory'                        : getDatahistory,
    // Approval
    'approveaddRecord'                      : approveaddRecord,
    'approvegetdata'                        : approvegetdata,
    'approvegetdata2'                       : approvegetdata2,
    'approvedelData'                        : approvedelData,
    'drive_approvegetDropdownOptions'       : drive_approvegetDropdownOptions,
    'drivecar_approvergetDropdownOptions'   : drivecar_approvergetDropdownOptions,
    // Pre-approve
    'preapprovegetdata'                     : preapprovegetdata,
    'preapprovegetdata2'                    : approvegetdata2,
    'searchPreapprove'                      : searchPreapprove,
    // Cancel
    'cancelRecord'                          : cancelRecord,
    'cancelRecorduser'                      : cancelRecorduser,
    'cancelgetdata'                         : cancelgetdata,
    'cancelcar_searchData'                  : cancelcar_searchData,
    // Close status
    'approveeditcareditcaraddRecord'        : approveeditcareditcaraddRecord,
    'approveeditcargetdata'                 : approveeditcargetdata,
    'approveeditcardelData'                 : approveeditcardelData,
    'drivecar_approveeditcarrgetDropdownOptions' : drivecar_approveeditcarrgetDropdownOptions,
    'getdata_pproveeditcar'                 : getdata_pproveeditcar,
    // Car status
    'checkcarstatusgetdata'                 : checkcarstatusgetdata,
    'cardailygetData'                       : cardailygetData,
    'totalgetData'                          : totalgetData,
    'checkcargetdata'                       : checkcargetdata,
    // Mileage
    'mileinaddRecord'                       : mileinaddRecord,
    'mileingetdata'                         : mileingetdata,
    'milein_searchData'                     : milein_searchData,
    'mileoutaddRecord'                      : mileoutaddRecord,
    'mileoutgetdata'                        : mileoutgetdata,
    'mileout_searchData'                    : mileout_searchData,
    // Personnel
    'getPersonData'                         : getPersonData,
    'getPersonData_2'                       : getPersonData_2,
    'schedule'                              : saveFile,
    // Search
    'searchnameData'                        : searchnameData,
    'searchapproveeditcareditcaraddRecord'  : searchapproveeditcareditcaraddRecord,
    // Requirment (housing)
    'requirmentGetData'                     : requirmentGetData,
    'requirment_rentGetData'                : requirment_rentGetData,
    'requirment_s_nGetData'                 : requirment_s_nGetData,
    'fetchDataByRoom'                       : fetchDataByRoom,
    'fetchDataByrequir'                     : fetchDataByrequir,
    'fetchDataByrequir_rent'                : fetchDataByrequir_rent,
    'fetchDataByrequir_s_n'                 : fetchDataByrequir_s_n,
    // Add car & department
    'user_getdata'                          : user_getdata,
    'user_Save'                             : user_Save,
    'user_delData'                          : user_delData,
    'car_getdata'                           : car_getdata,
    'car_getDropdownOptions'                : car_getdata,
    'car_Save'                              : car_Save,
    'drivecar_getdata'                      : drivecar_getdata,
    'drivecar_Save'                         : drivecar_Save,
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
