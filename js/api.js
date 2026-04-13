/**
 * api.js
 * Promise-based API wrapper for Google Apps Script via gas-bridge.js
 */
var API = (function () {
  'use strict';

  /**
   * Core caller — wraps google.script.run (polyfilled by gas-bridge.js) in a Promise.
   * @param {string} action  - GAS function name
   * @param {Array}  params  - arguments array
   */
  function call(action, params) {
    return new Promise(function (resolve, reject) {
      try {
        google.script.run
          .withSuccessHandler(function (result) {
            if (result && result.status === 'error') {
              reject(new Error(result.message || 'GAS error'));
            } else if (result && result.status === 'success') {
              resolve(result.data !== undefined ? result.data : null);
            } else {
              resolve(result); // fallback: raw response
            }
          })
          .withFailureHandler(function (err) { reject(err); })
          [action].apply(null, params || []);
      } catch (e) {
        reject(e);
      }
    });
  }

  return {

    /* ─────────────────── Auth ─────────────────── */
    login:         function (u, p)     { return call('authenticateUser', [{username: u, password: p}]); },
    logIp:         function (u, ip, ua){ return call('loginCheckip',     [{username: u, ipAddress: ip, userAgent: ua}]); },
    resetPassword: function (u, p)     { return call('resetPassword',    [{username: u, newPassword: p}]); },

    /* ─────────────────── Settings ─────────────────── */
    getSettings:  function ()    { return call('getSetting',   []); },
    saveSettings: function (obj) { return call('updateSetting',[obj]); },
    countPage:    function ()    { return call('countPage',    []); },

    /* ─────────────────── Dashboard ─────────────────── */
    getDashboard:      function () { return call('getDashboardSummary',   []); },
    getBarChart:       function () { return call('getBarChartData',        []); },
    getLineChart:      function () { return call('getLineChartData',       []); },
    getPersonnelChart: function () { return call('getPersonnelChartData',  []); },

    /* ─────────────────── Booking ─────────────────── */
    createBooking:    function (obj) { return call('bookCreate',          [obj]); },
    getBookings:      function ()    { return call('bookGetList',          []); },
    getPendingBookings:function ()   { return call('bookGetPending',       []); },
    getBookingHistory:function ()    { return call('bookGetHistory',       []); },
    getCarDropdown:   function ()    { return call('bookGetDropdownCars',  []); },

    /* ─────────────────── Approval ─────────────────── */
    getPreApproveList:  function ()    { return call('approvalPreApproveList',  []); },
    approve:            function (obj) { return call('approvalApprove',         [obj]); },
    reject:             function (obj) { return call('approvalReject',          [obj]); },
    searchApproval:     function (obj) { return call('approvalSearch',          [obj]); },
    getApprovedList:    function ()    { return call('approvalGetApprovedList', []); },
    getApprovedList2:   function ()    { return call('approvalGetApprovedList2',[]); },
    getDriverDropdown:  function ()    { return call('approvalGetDropdownDrivers',[]); },

    /* ─────────────────── Cancel ─────────────────── */
    cancelAdmin:  function (obj) { return call('cancelByAdmin', [obj]); },
    cancelUser:   function (obj) { return call('cancelByUser',  [obj]); },
    getCancelList:function ()    { return call('cancelGetList', []); },
    searchCancel: function (obj) { return call('cancelSearch',  [obj]); },

    /* ─────────────────── Mileage ─────────────────── */
    recordMileOut: function (obj) { return call('mileOutRecord',  [obj]); },
    getMileOutList:function ()    { return call('mileOutGetList', []); },
    searchMileOut: function (obj) { return call('mileOutSearch',  [obj]); },
    recordMileIn:  function (obj) { return call('mileInRecord',   [obj]); },
    getMileInList: function ()    { return call('mileInGetList',  []); },
    searchMileIn:  function (obj) { return call('mileInSearch',   [obj]); },

    /* ─────────────────── Mission Close ─────────────────── */
    closeMission:       function (obj) { return call('missionCloseRecord', [obj]); },
    getMissionCloseList:function ()    { return call('missionCloseGetList',[]); },
    deleteMission:      function (id)  { return call('missionCloseDelete', [id]); },
    searchMission:      function (obj) { return call('missionCloseSearch', [obj]); },

    /* ─────────────────── Car Status ─────────────────── */
    getCarStatus:  function () { return call('carStatusGetAll',      []); },
    getCarDaily:   function () { return call('carDailyGetList',      []); },
    getCarHistory: function () { return call('carTotalGetHistory',   []); },
    getCarChecked: function () { return call('carCheckGetApproved',  []); },

    /* ─────────────────── Personnel ─────────────────── */
    getPersonnel:        function () { return call('personnelGetRawList', []); },
    getPersonnelSummary: function () { return call('personnelGetSummary', []); },

    /* ─────────────────── Housing ─────────────────── */
    getHousing:       function ()      { return call('housingGetList',       []); },
    getHousingRent:   function ()      { return call('housingGetRentList',   []); },
    getHousingSenior: function ()      { return call('housingGetSeniorList', []); },
    getHousingByRoom: function (room)  { return call('housingGetByRoom',     [room]); },

    /* ─────────────────── Schedule ─────────────────── */
    uploadSchedule:  function (obj) { return call('scheduleUpload',  [obj]); },
    getScheduleList: function ()    { return call('scheduleGetList', []); },

    /* ─────────────────── Admin — Users ─────────────────── */
    getUsers:   function ()    { return call('adminUserGetList', []); },
    saveUser:   function (obj) { return call('adminUserSave',    [obj]); },
    deleteUser: function (id)  { return call('adminUserDelete',  [id]); },

    /* ─────────────────── Admin — Cars ─────────────────── */
    getCars:   function ()    { return call('adminCarGetList', []); },
    saveCar:   function (obj) { return call('adminCarSave',    [obj]); },
    deleteCar: function (id)  { return call('adminCarDelete',  [id]); },

    /* ─────────────────── Admin — Drivers ─────────────────── */
    getDrivers:   function ()    { return call('adminDriverGetList', []); },
    saveDriver:   function (obj) { return call('adminDriverSave',    [obj]); },
    deleteDriver: function (id)  { return call('adminDriverDelete',  [id]); },

  };
})();
