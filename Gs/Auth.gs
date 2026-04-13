// Auth.gs — Authentication, password reset, and IP logging

/**
 * Generate a random short ID for new user records.
 * @return {string}
 */
function _genId() {
  return 'U' + new Date().getTime().toString(36).toUpperCase() + Math.random().toString(36).substr(2, 4).toUpperCase();
}

/**
 * Authenticate a user by username + password.
 * Priority:
 *   1. VIP sheet
 *   2. Users sheet (local DB)
 *   3. External RTAF API — auto-creates local record on first login
 *
 * @param {Object} params  { username, password }
 * @return {Array|null}    2-D array row on success, null on failure
 */
function authenticateUser(params) {
  var username = params.username || '';
  var password = params.password || '';

  if (!username || !password) return null;

  // ── 1. Check VIP sheet ───────────────────────────────────────────────────
  var vipSheet = _getSheet(SHEET.VIP);
  if (vipSheet) {
    var vipData = vipSheet.getDataRange().getDisplayValues();
    for (var v = 1; v < vipData.length; v++) {
      var vRow = vipData[v];
      // col 0=id, 1=username, 2=password, 3=role, 4=fullname, 5=dept, 6=position
      if (vRow[1] === username && vRow[2] === password) {
        return { id: vRow[0], username: vRow[1], role: vRow[3] || ROLE.VIP, fullname: vRow[4], dept: vRow[5], pic: vRow[6] };
      }
    }
  }

  // ── 2. Check Users sheet ─────────────────────────────────────────────────
  var usersSheet = _getSheet(SHEET.USERS);
  if (usersSheet) {
    var userData = usersSheet.getDataRange().getDisplayValues();
    for (var u = 1; u < userData.length; u++) {
      var uRow = userData[u];
      // col 0=id, 1=username, 2=password, 3=role, 4=fullname, 5=dept, 6=pic
      if (uRow[1] === username && uRow[2] === password) {
        return { id: uRow[0], username: uRow[1], role: uRow[3] || ROLE.USER, fullname: uRow[4], dept: uRow[5], pic: uRow[6] };
      }
    }
  }

  // ── 3. External RTAF API ─────────────────────────────────────────────────
  try {
    var apiResponse = UrlFetchApp.fetch('https://api-pft.rtaf.mi.th/api-auth-token/', {
      method: 'post',
      contentType: 'application/json',
      payload: JSON.stringify({ username: username, password: password }),
      muteHttpExceptions: true,
    });

    if (apiResponse.getResponseCode() === 200) {
      // API login succeeded — ensure user exists locally
      var usersSheetForAppend = _getSheet(SHEET.USERS);
      var allUsers = usersSheetForAppend.getDataRange().getDisplayValues();
      var existingRow = null;
      for (var eu = 1; eu < allUsers.length; eu++) {
        if (allUsers[eu][1] === username) {
          existingRow = allUsers[eu];
          break;
        }
      }

      if (!existingRow) {
        // Create new local record
        var newId = _genId();
        var newRow = [newId, username, password, ROLE.USER, username, '', ''];
        usersSheetForAppend.appendRow(newRow);
        existingRow = newRow;
      }

      return { id: existingRow[0], username: existingRow[1], role: existingRow[3] || ROLE.USER, fullname: existingRow[4], dept: existingRow[5], pic: existingRow[6] };
    }
  } catch (apiErr) {
    Logger.log('RTAF API error: ' + apiErr);
  }

  return null;
}

/**
 * Reset a user's password in the Users sheet.
 * @param {Object} params  { username, newPassword }
 * @return {boolean}
 */
function resetPassword(params) {
  var username    = params.username    || '';
  var newPassword = params.newPassword || '';

  if (!username || !newPassword) return false;

  var sheet = _getSheet(SHEET.USERS);
  var data  = sheet.getDataRange().getDisplayValues();

  for (var i = 1; i < data.length; i++) {
    if (data[i][1] === username) {
      // col 2 = password (row index is 1-based)
      sheet.getRange(i + 1, 3).setValue(newPassword);
      return true;
    }
  }
  return false;
}

/**
 * Log an IP / user-agent for a username, and return login context.
 * Also appends to SHEET.LOGIP for audit trail.
 *
 * @param {Object} params  { username, ipAddress, userAgent }
 * @return {Object}        { logged: true, timestamp }
 */
function loginCheckip(params) {
  var username  = params.username  || '';
  var ipAddress = params.ipAddress || '';
  var userAgent = params.userAgent || '';

  var timestamp = new Date();

  try {
    var logSheet = _getSheet(SHEET.LOGIP);
    if (logSheet) {
      logSheet.appendRow([timestamp, username, ipAddress, userAgent]);
    }
  } catch (e) {
    Logger.log('loginCheckip log error: ' + e);
  }

  return { logged: true, timestamp: timestamp.toISOString() };
}
