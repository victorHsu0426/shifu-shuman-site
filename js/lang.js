(function () {
  var KEY = "shuman-script", converted = false, saved = [];
  function eachText(fn) {
    var w = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    var n;
    while ((n = w.nextNode())) {
      if (!n.nodeValue || !n.nodeValue.trim()) continue;
      var p = n.parentNode;
      if (!p || /^(SCRIPT|STYLE|TEXTAREA|NOSCRIPT)$/.test(p.tagName)) continue;
      fn(n);
    }
  }
  function setBtn(t) {
    var b = document.getElementById("lang-toggle");
    if (b) b.textContent = t;
  }
  function toCN(conv) {
    eachText(function (n) {
      saved.push([n, n.nodeValue]);
      try { n.nodeValue = conv(n.nodeValue); } catch (e) {}
    });
    converted = true;
    setBtn("繁");
    try { localStorage.setItem(KEY, "cn"); } catch (e) {}
  }
  function toTW() {
    for (var i = 0; i < saved.length; i++) {
      try { saved[i][0].nodeValue = saved[i][1]; } catch (e) {}
    }
    saved = [];
    converted = false;
    setBtn("簡");
    try { localStorage.setItem(KEY, "tw"); } catch (e) {}
  }
  function convertNow() {
    if (!window.OpenCC || !OpenCC.Converter) return false;
    try {
      var c = OpenCC.Converter({ from: "tw", to: "cn" });
      toCN(function (s) { return c(s); });
      return true;
    } catch (e) { return false; }
  }
  document.addEventListener("click", function (e) {
    if (e.target && e.target.id === "lang-toggle") {
      if (converted) { toTW(); } else { convertNow(); }
    }
  });
  try {
    if (localStorage.getItem(KEY) === "cn") {
      var tries = 0;
      var iv = setInterval(function () {
        tries++;
        if (converted || tries > 20) { clearInterval(iv); return; }
        if (window.OpenCC && OpenCC.Converter) { clearInterval(iv); convertNow(); }
      }, 300);
    }
  } catch (e) {}
})();
