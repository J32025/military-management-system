/**
 * gas-bridge.js v2
 * แปลง google.script.run → fetch GET (แก้ปัญหา CORS ของ GAS redirect)
 */
(function () {
  'use strict';

  function callGAS(fnName, args, successHandler, failureHandler) {
    var gasUrl = (typeof GAS_URL !== 'undefined') ? GAS_URL : '';
    if (!gasUrl) {
      var msg = '[gas-bridge] กรุณาตั้งค่า GAS_URL ใน js/config.js';
      console.error(msg);
      if (failureHandler) failureHandler(new Error(msg));
      return;
    }

    var url = gasUrl + '?action=' + encodeURIComponent(fnName)
                     + '&params=' + encodeURIComponent(JSON.stringify(args));

    fetch(url, { redirect: 'follow' })
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (text) {
        var data;
        try { data = JSON.parse(text); } catch (e) { data = text; }
        if (data && typeof data === 'object' && data.__error) {
          console.error('[gas-bridge] GAS error:', data.__error);
          if (failureHandler) failureHandler(new Error(data.__error));
        } else {
          if (successHandler) successHandler(data !== undefined ? data : null);
        }
      })
      .catch(function (err) {
        console.error('[gas-bridge] error [' + fnName + ']:', err);
        if (failureHandler) failureHandler(err);
      });
  }

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
        var s = target._success, f = target._failure;
        return function () {
          callGAS(prop, Array.prototype.slice.call(arguments), s, f);
        };
      }
    });
  }

  window.google = window.google || {};
  window.google.script = window.google.script || {};
  window.google.script.run = createRunner();
  window.google.script.url = {
    getLocation: function (cb) {
      if (cb) cb({ href: window.location.href, hash: window.location.hash, parameter: {}, parameters: {} });
    }
  };

  /** โหลด HTML partial + execute scripts */
  window.loadHTML = function (elementId, filePath) {
    return fetch(filePath)
      .then(function (res) {
        if (!res.ok) { console.warn('[gas-bridge] โหลดไม่ได้: ' + filePath); return ''; }
        return res.text();
      })
      .then(function (html) {
        if (!html) return;
        var el = document.getElementById(elementId);
        if (!el) { console.warn('[gas-bridge] ไม่พบ #' + elementId); return; }
        var tmp = document.createElement('div');
        tmp.innerHTML = html;
        var scripts = Array.from(tmp.querySelectorAll('script'));
        scripts.forEach(function (s) { s.remove(); });
        el.innerHTML = tmp.innerHTML;
        scripts.forEach(function (old) {
          var n = document.createElement('script');
          Array.from(old.attributes).forEach(function (a) { n.setAttribute(a.name, a.value); });
          if (!old.src) n.textContent = old.textContent;
          document.body.appendChild(n);
        });
      })
      .catch(function (err) { console.warn('[gas-bridge] error loading ' + filePath, err); });
  };
})();
