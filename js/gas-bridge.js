/**
 * gas-bridge.js
 * ==========================================
 * ไลบรารีแปลง google.script.run ให้ใช้ fetch()
 * เพื่อให้เรียก Google Apps Script Web App ได้จาก static hosting (GitHub Pages)
 *
 * วิธีตั้งค่า:
 *  1. Deploy Google Apps Script เป็น Web App
 *     - Execute as: Me
 *     - Who has access: Anyone
 *  2. คัดลอก Web App URL ไปใส่ใน js/config.js
 * ==========================================
 */

(function () {
  'use strict';

  /**
   * สร้าง runner object ที่จำลอง google.script.run API
   */
  function createRunner(opts) {
    opts = opts || {};

    var runner = {
      _success: opts._success || null,
      _failure: opts._failure || null,

      withSuccessHandler: function (fn) {
        return createRunner({ _success: fn, _failure: runner._failure });
      },

      withFailureHandler: function (fn) {
        return createRunner({ _success: runner._success, _failure: fn });
      }
    };

    return new Proxy(runner, {
      get: function (target, prop) {
        if (prop in target) return target[prop];
        if (typeof prop === 'symbol') return undefined;

        var successHandler = target._success;
        var failureHandler = target._failure;

        return function () {
          var args = Array.prototype.slice.call(arguments);
          var gasUrl = (typeof GAS_URL !== 'undefined') ? GAS_URL : '';

          if (!gasUrl) {
            var msg = '[gas-bridge] GAS_URL ยังไม่ได้ตั้งค่า กรุณาตั้งค่าใน js/config.js';
            console.error(msg);
            if (failureHandler) failureHandler(new Error(msg));
            return;
          }

          var params = new URLSearchParams();
          params.append('action', prop);
          params.append('params', JSON.stringify(args));

          fetch(gasUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: params.toString(),
            redirect: 'follow'
          })
            .then(function (response) {
              if (!response.ok) throw new Error('HTTP ' + response.status);
              return response.text();
            })
            .then(function (text) {
              var data;
              try {
                data = JSON.parse(text);
              } catch (e) {
                data = text;
              }
              if (data && typeof data === 'object' && data.__error) {
                console.error('[gas-bridge] Server error:', data.__error);
                if (failureHandler) failureHandler(new Error(data.__error));
              } else {
                if (successHandler) successHandler(data !== undefined ? data : null);
              }
            })
            .catch(function (err) {
              console.error('[gas-bridge] Network error [' + prop + ']:', err);
              if (failureHandler) failureHandler(err);
            });
        };
      }
    });
  }

  // Mount google.script namespace
  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = createRunner();
  window.google.script.url = {
    getLocation: function (callback) {
      if (callback) callback({
        href: window.location.href,
        hash: window.location.hash,
        parameter: {},
        parameters: {}
      });
    }
  };

  /**
   * โหลดไฟล์ HTML แบบ partial เข้า element ที่กำหนด
   * และ execute <script> tags ที่อยู่ภายในด้วย
   *
   * @param {string} elementId - id ของ element ที่จะใส่ HTML เข้าไป
   * @param {string} filePath  - path ของไฟล์ HTML ที่จะโหลด
   * @returns {Promise}
   */
  window.loadHTML = function (elementId, filePath) {
    return fetch(filePath)
      .then(function (response) {
        if (!response.ok) {
          console.warn('[gas-bridge] ไม่สามารถโหลด: ' + filePath + ' (HTTP ' + response.status + ')');
          return '';
        }
        return response.text();
      })
      .then(function (html) {
        if (!html) return;
        var container = document.getElementById(elementId);
        if (!container) {
          console.warn('[gas-bridge] ไม่พบ element #' + elementId);
          return;
        }

        // แยก <script> tags ออกก่อน inject HTML
        var temp = document.createElement('div');
        temp.innerHTML = html;
        var scripts = Array.from(temp.querySelectorAll('script'));
        scripts.forEach(function (s) { s.remove(); });

        container.innerHTML = temp.innerHTML;

        // Re-execute scripts
        scripts.forEach(function (oldScript) {
          var newScript = document.createElement('script');
          Array.from(oldScript.attributes).forEach(function (attr) {
            newScript.setAttribute(attr.name, attr.value);
          });
          if (!oldScript.src) {
            newScript.textContent = oldScript.textContent;
          }
          document.body.appendChild(newScript);
        });
      })
      .catch(function (err) {
        console.warn('[gas-bridge] Error loading ' + filePath + ':', err);
      });
  };

})();
