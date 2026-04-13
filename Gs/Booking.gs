// Booking.gs — Vehicle booking creation and list retrieval

/**
 * Create a new booking record and notify the approver via LINE.
 *
 * @param {Object} params
 *   { numid, name, dep, car, loca, startDate, startTime,
 *     endDate, endTime, drive, other, preapporved }
 * @return {boolean}
 */
function bookCreate(params) {
  var sheet = _getSheet(SHEET.BOOKING);

  var timestamp   = new Date();
  var numid       = params.numid       || '';
  var name        = params.name        || '';
  var dep         = params.dep         || '';
  var car         = params.car         || '';
  var loca        = params.loca        || '';
  var startDate   = params.startDate   || '';
  var startTime   = params.startTime   || '';
  var endDate     = params.endDate     || '';
  var endTime     = params.endTime     || '';
  var drive       = params.drive       || '';
  var other       = params.other       || '';
  var preapporved = params.preapporved || '';

  sheet.appendRow([
    timestamp,
    numid,
    name,
    dep,
    car,
    loca,
    startDate,
    startTime,
    endDate,
    endTime,
    drive,
    other,
    preapporved,
  ]);

  // Notify approver
  try {
    _notifyLineBookingNew(params);
  } catch (e) {
    Logger.log('bookCreate notify error: ' + e);
  }

  return true;
}

/**
 * Return all rows from the main booking sheet (Data).
 * @return {Array[][]}
 */
function bookGetList() {
  return _getSheet(SHEET.BOOKING).getDataRange().getDisplayValues();
}

/**
 * Return all rows from the pending approval sheet (รออนุมัติ).
 * @return {Array[][]}
 */
function bookGetPending() {
  return _getSheet(SHEET.PENDING).getDataRange().getDisplayValues();
}

/**
 * Return all rows from the mission history sheet (รวมภารกิจ).
 * @return {Array[][]}
 */
function bookGetHistory() {
  return _getSheet(SHEET.HISTORY).getDataRange().getDisplayValues();
}

/**
 * Return all display values from the car-type dropdown sheet (ประเภท).
 * @return {Array[][]}
 */
function bookGetDropdownCars() {
  return _getSheet(SHEET.CARS).getDataRange().getDisplayValues();
}
