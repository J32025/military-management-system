// รหัส.gs — Main entry point: spreadsheet cache, routing, and full dispatch map

var _cachedSS = null;

/**
 * Returns a cached reference to the spreadsheet.
 */
function _getSS() {
  if (!_cachedSS) {
    _cachedSS = SpreadsheetApp.openById(SS_ID);
  }
  return _cachedSS;
}

/**
 * Returns a sheet by name from the cached spreadsheet.
 * @param {string} name
 * @return {GoogleAppsScript.Spreadsheet.Sheet}
 */
function _getSheet(name) {
  return _getSS().getSheetByName(name);
}

/**
 * Returns the deployed Web App URL.
 */
function getURL() {
  return ScriptApp.getService().getUrl();
}

// ─── HTTP Entry Points ───────────────────────────────────────────────────────

function doGet(e) {
  return _handleRequest(e);
}

function doPost(e) {
  return _handleRequest(e);
}

// ─── Request Handler ─────────────────────────────────────────────────────────

function _handleRequest(e) {
  try {
    var params = {};
    var action = '';

    // Support both GET query params and POST JSON body
    if (e && e.postData && e.postData.contents) {
      try {
        params = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        params = (e && e.parameter) ? e.parameter : {};
      }
    } else if (e && e.parameter) {
      params = e.parameter;
      // Support legacy ?params= JSON array format
      if (e.parameter.params) {
        try {
          var legacyArgs = JSON.parse(e.parameter.params);
          if (Array.isArray(legacyArgs) && legacyArgs.length > 0) {
            params = legacyArgs[0];
          }
        } catch (_) {}
      }
    }

    // Action can be in params.action or e.parameter.action
    action = params.action || (e && e.parameter && e.parameter.action) || '';

    var result = _dispatch(action, params);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: result }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message, stack: err.stack }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ─── Dispatch Map ─────────────────────────────────────────────────────────────

function _dispatch(action, args) {
  var map = {
    // Utility
    'getURL':                                       getURL,
    'countPage':                                    countPageView,

    // Auth
    'authenticateUser':                             authenticateUser,
    'loginCheckip':                                 loginCheckip,
    'resetPassword':                                resetPassword,

    // Settings
    'getSetting':                                   settingGet,
    'updateSetting':                                settingUpdate,

    // Dashboard
    'getDashboardSummary':                          dashboardGetSummary,
    'getBarChartData':                              dashboardGetBarChartData,
    'getData_ChartBar':                             dashboardGetBarChartData,
    'getSummary':                                   dashboardGetSummary,
    'getLineChartData':                             dashboardGetLineChartData,
    'getChartData':                                 dashboardGetLineChartData,
    'getChart':                                     dashboardGetLineChartData,

    // Personnel chart
    'getPersonnelChartData':                        personnelGetChartData,
    'getChartDataPersonnel':                        personnelGetChartData,
    'getDataFromSheet':                             personnelGetRawList,

    // Booking
    'bookCreate':                                   bookCreate,
    'bookaddRecord':                                bookCreate,
    'bookGetList':                                  bookGetList,
    'bookGetPending':                               bookGetPending,
    'bookGetHistory':                               bookGetHistory,
    'getDatahistory':                               bookGetHistory,
    'bookGetDropdownCars':                          bookGetDropdownCars,
    '_getDropdownOptions':                          bookGetDropdownCars,
    'getDataSheet1':                                bookGetPending,

    // Approval / Pre-approve
    'approvalPreApproveList':                       approvalPreApproveList,
    'preapprovegetdata':                            approvalPreApproveList,
    'approvalApprove':                              approvalApprove,
    'approveaddRecord':                             approvalApprove,
    'approvalReject':                               approvalReject,
    'approvalSearch':                               approvalSearch,
    'searchPreapprove':                             approvalSearch,
    'approvalGetApprovedList':                      approvalGetApprovedList,
    'approvegetdata':                               approvalGetApprovedList,
    'approvalGetApprovedList2':                     approvalGetApprovedList2,
    'approvegetdata2':                              approvalGetApprovedList2,
    'approvalGetDropdownDrivers':                   approvalGetDropdownDrivers,
    'drive_approvegetDropdownOptions':              approvalGetDropdownDrivers,
    'drivecar_approvergetDropdownOptions':          approvalGetDropdownDrivers,

    // Cancel
    'cancelByAdmin':                                cancelByAdmin,
    'cancelRecord':                                 cancelByAdmin,
    'cancelByUser':                                 cancelByUser,
    'cancelRecorduser':                             cancelByUser,
    'cancelGetList':                                cancelGetList,
    'cancelgetdata':                                cancelGetList,
    'cancelSearch':                                 cancelSearch,
    'cancelcar_searchData':                         cancelSearch,

    // Mile Out
    'mileOutRecord':                                mileOutRecord,
    'mileoutaddRecord':                             mileOutRecord,
    'mileOutGetList':                               mileOutGetList,
    'mileoutgetdata':                               mileOutGetList,
    'mileOutSearch':                                mileOutSearch,
    'mileout_searchData':                           mileOutSearch,

    // Mile In
    'mileInRecord':                                 mileInRecord,
    'mileinaddRecord':                              mileInRecord,
    'mileInGetList':                                mileInGetList,
    'mileingetdata':                                mileInGetList,
    'mileInSearch':                                 mileInSearch,
    'milein_searchData':                            mileInSearch,

    // Mission Close
    'missionCloseRecord':                           missionCloseRecord,
    'approveeditcareditcaraddRecord':               missionCloseRecord,
    'searchapproveeditcareditcaraddRecord':         missionCloseRecord,
    'missionCloseGetList':                          missionCloseGetList,
    'approveeditcargetdata':                        missionCloseGetList,
    'getdata_pproveeditcar':                        missionCloseGetList,
    'missionCloseDelete':                           missionCloseDelete,
    'approveeditcardelData':                        missionCloseDelete,
    'missionCloseSearch':                           missionCloseSearch,
    'searchnameData':                               missionCloseSearch,
    'drivecar_approveeditcarrgetDropdownOptions':   approvalGetDropdownDrivers,

    // Car Status
    'carStatusGetAll':                              carStatusGetAll,
    'checkcarstatusgetdata':                        carStatusGetAll,
    'carDailyGetList':                              carDailyGetList,
    'cardailygetData':                              carDailyGetList,
    'carTotalGetHistory':                           carTotalGetHistory,
    'totalgetData':                                 carTotalGetHistory,
    'carCheckGetApproved':                          carCheckGetApproved,
    'checkcargetdata':                              carCheckGetApproved,

    // Personnel
    'personnelGetSummary':                          personnelGetSummary,
    'getPersonData':                                personnelGetRawList,
    'getPersonData_2':                              personnelGetSummary,
    'personnelGetRawList':                          personnelGetRawList,

    // Housing
    'housingGetList':                               housingGetList,
    'requirmentGetData':                            housingGetList,
    'housingGetRentList':                           housingGetRentList,
    'requirment_rentGetData':                       housingGetRentList,
    'housingGetSeniorList':                         housingGetSeniorList,
    'requirment_s_nGetData':                        housingGetSeniorList,
    'housingGetByRoom':                             housingGetByRoom,
    'fetchDataByRoom':                              housingGetByRoom,
    'fetchDataByrequir':                            housingGetDetailByRequest,
    'fetchDataByrequir_rent':                       housingGetRentDetail,
    'fetchDataByrequir_s_n':                        housingGetSeniorDetail,

    // Schedule
    'scheduleUpload':                               scheduleUpload,
    'saveFile':                                     scheduleUpload,
    'scheduleGetList':                              scheduleGetList,

    // Admin — Users
    'adminUserGetList':                             adminUserGetList,
    'user_getdata':                                 adminUserGetList,
    'adminUserSave':                                adminUserSave,
    'user_Save':                                    adminUserSave,
    'adminUserDelete':                              adminUserDelete,
    'user_delData':                                 adminUserDelete,

    // Admin — Cars
    'adminCarGetList':                              adminCarGetList,
    'car_getdata':                                  adminCarGetList,
    'car_getDropdownOptions':                       adminCarGetList,
    'adminCarSave':                                 adminCarSave,
    'car_Save':                                     adminCarSave,
    'adminCarDelete':                               adminCarDelete,

    // Admin — Drivers
    'adminDriverGetList':                           adminDriverGetList,
    'drivecar_getdata':                             adminDriverGetList,
    'adminDriverSave':                              adminDriverSave,
    'drivecar_Save':                                adminDriverSave,
    'adminDriverDelete':                            adminDriverDelete,
  };

  if (!action) {
    throw new Error('No action specified');
  }

  var fn = map[action];
  if (!fn) {
    throw new Error('Unknown action: ' + action);
  }

  return fn(args);
}
