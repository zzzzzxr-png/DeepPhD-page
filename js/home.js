(function () {
  var GAP = 0.04;

  function mute(el) {
    if (!el) return;
    el.muted = true;
    el.defaultMuted = true;
    el.volume = 0;
    el.setAttribute("muted", "");
    el.playsInline = true;
  }

  function playSafe(el) {
    if (!el || el.hidden || !el.getAttribute("src")) return;
    mute(el);
    var p = el.play();
    if (p && p.catch) p.catch(function () {});
  }

  function pauseEl(el) {
    if (!el) return;
    try {
      if (!el.paused) el.pause();
    } catch (e) {}
  }




  function unloadVideo(el) {
    if (!el) return;
    pauseEl(el);
    try { el.removeAttribute("src"); } catch (e) {}
    try { el.load(); } catch (e) {}
  }

  function initCompare(root) {
    var slider = root.querySelector("[data-compare]");
    if (!slider) return;

    var canvas = slider.querySelector("[data-compare-canvas]");
    var poster = slider.querySelector("[data-compare-poster]");
    var leftBar = slider.querySelector("[data-bar='left']");
    var rightBar = slider.querySelector("[data-bar='right']");
    var rawLabel = slider.querySelector(".compare-label.raw");
    var phdLabel = slider.querySelector(".compare-label.phd");
    var refLabel = slider.querySelector(".compare-label.ref");
    var titleEl = root.querySelector("[data-demo-title]");
    var linkEl = root.querySelector("[data-demo-link]");
    var linkText = root.querySelector("[data-demo-link-text]");
    var buttons = root.querySelectorAll("[data-scene]");
    var hint = slider.querySelector("[data-compare-hint]");
    if (!canvas || !buttons.length) return;

    // One decoded <video> per stack, kept in memory after blob prefetch.
    var pool = Object.create(null);
    var active = null;
    var ctx = canvas.getContext("2d");
    var hasRef = false;
    var lanes = 2;
    var left = 0.5;
    var right = 0.67;
    var bound = false;
    var hintTimer = null;
    var visible = true;
    var activeBtn = null;
    var loadToken = 0;
    var keepTimer = null;
    var expectedSrc = "";
    var drawing = false;
    var ready = false;

    function placeLabel(el, a, b) {
      if (!el) return;
      el.style.left = (((a + b) / 2) * 100).toFixed(2) + "%";
      el.style.right = "auto";
      el.style.transform = "translateX(-50%)";
    }

    function applyCuts() {
      if (leftBar) leftBar.style.left = (left * 100).toFixed(2) + "%";
      if (rightBar) rightBar.style.left = (right * 100).toFixed(2) + "%";
      placeLabel(rawLabel, 0, left);
      placeLabel(phdLabel, left, hasRef ? right : 1);
      if (hasRef) placeLabel(refLabel, right, 1);
      if (ready) drawFrame();
    }

    function setRefMode(on, label) {
      hasRef = !!on;
      lanes = hasRef ? 3 : 2;
      slider.classList.toggle("has-ref", hasRef);
      if (rightBar) rightBar.hidden = !hasRef;
      if (refLabel && label) refLabel.textContent = label;
      left = hasRef ? 0.33 : 0.5;
      right = 0.67;
      applyCuts();
    }

    function hideHint() {
      if (!hint) return;
      hint.classList.remove("is-playing");
      hint.hidden = true;
      if (hintTimer) {
        window.clearTimeout(hintTimer);
        hintTimer = null;
      }
    }

    function showHint() {
      if (!hint) return;
      if (hintTimer) {
        window.clearTimeout(hintTimer);
        hintTimer = null;
      }
      hint.hidden = false;
      hint.classList.remove("is-playing");
      void hint.offsetWidth;
      hint.classList.add("is-playing");
      hintTimer = window.setTimeout(hideHint, 3200);
    }

    function clearKeep() {
      if (keepTimer) {
        window.clearInterval(keepTimer);
        keepTimer = null;
      }
    }

    function resizeCanvas() {
      var w = Math.max(1, Math.round(slider.clientWidth));
      var h = Math.max(1, Math.round(slider.clientHeight));
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }
    }

    function drawLane(laneIndex, x0, x1) {
      if (!active) return;
      var vw = active.videoWidth;
      var vh = active.videoHeight;
      if (!vw || !vh || x1 <= x0) return;
      var panelW = vw / lanes;
      var panelH = vh;
      var cw = canvas.width;
      var ch = canvas.height;
      var scale = Math.max(cw / panelW, ch / panelH);
      var srcVisW = cw / scale;
      var srcVisH = ch / scale;
      var srcOx = (panelW - srcVisW) / 2;
      var srcOy = (panelH - srcVisH) / 2;
      var u0 = x0 / cw;
      var u1 = x1 / cw;
      var sx = panelW * laneIndex + srcOx + u0 * srcVisW;
      var sw = (u1 - u0) * srcVisW;
      var sy = srcOy;
      var sh = srcVisH;
      if (sw < 0.5) return;
      ctx.drawImage(active, sx, sy, sw, sh, x0, 0, x1 - x0, ch);
    }

    function drawFrame() {
      if (!ready || !active || active.readyState < 2) return;
      resizeCanvas();
      var cw = canvas.width;
      var mid = left * cw;
      var end = hasRef ? right * cw : cw;
      ctx.clearRect(0, 0, cw, canvas.height);
      drawLane(0, 0, mid);
      drawLane(1, mid, end);
      if (hasRef) drawLane(2, end, cw);
      slider.classList.add("is-playing");
    }

    function stopLoop() {
      drawing = false;
    }

    function startLoop() {
      if (drawing) return;
      drawing = true;
      function tick() {
        if (!drawing) return;
        if (visible && activeBtn && ready) drawFrame();
        window.requestAnimationFrame(tick);
      }
      window.requestAnimationFrame(tick);
    }

    function playActive(token) {
      if (token !== loadToken || !visible || !activeBtn || !active) return;
      if ((active.getAttribute("data-stack-src") || "") !== expectedSrc) return;
      mute(active);
      var p = active.play();
      if (p && p.catch) p.catch(function () {});
      startLoop();
      clearKeep();
      keepTimer = window.setInterval(function () {
        if (token !== loadToken || !visible || !activeBtn || !active) {
          clearKeep();
          return;
        }
        if (active.paused || active.ended || active.readyState < 2) {
          mute(active);
          var again = active.play();
          if (again && again.catch) again.catch(function () {});
        }
      }, 800);
    }

    function bindDrag() {
      if (bound) return;
      bound = true;
      var dragging = null;

      function move(clientX) {
        var box = slider.getBoundingClientRect();
        var ratio = (clientX - box.left) / box.width;
        if (dragging === "left") {
          left = Math.min(hasRef ? right - GAP : 0.98, Math.max(0.02, ratio));
        } else if (dragging === "right") {
          right = Math.min(0.98, Math.max(left + GAP, ratio));
        }
        applyCuts();
      }

      slider.addEventListener("pointerdown", function (e) {
        hideHint();
        visible = true;
        playActive(loadToken);
        var box = slider.getBoundingClientRect();
        var ratio = (e.clientX - box.left) / box.width;
        dragging = hasRef && Math.abs(ratio - right) < Math.abs(ratio - left) ? "right" : "left";
        slider.setPointerCapture(e.pointerId);
        move(e.clientX);
      });
      slider.addEventListener("pointermove", function (e) {
        if (dragging) move(e.clientX);
      });
      slider.addEventListener("pointerup", function () {
        dragging = null;
      });
    }

    function getEntry(src) {
      var entry = pool[src];
      if (entry) return entry;
      var video = document.createElement("video");
      video.className = "compare-stack";
      video.muted = true;
      video.defaultMuted = true;
      video.loop = true;
      video.playsInline = true;
      video.preload = "auto";
      video.setAttribute("muted", "");
      video.setAttribute("playsinline", "");
      video.setAttribute("aria-hidden", "true");
      video.setAttribute("data-stack-src", src);
      slider.appendChild(video);
      mute(video);
      entry = {
        src: src,
        video: video,
        blobUrl: null,
        promise: null,
        ready: false
      };
      pool[src] = entry;
      return entry;
    }

    function waitVideoReady(video) {
      return new Promise(function (resolve) {
        if (video.readyState >= 3) {
          resolve();
          return;
        }
        var done = false;
        function finish() {
          if (done) return;
          done = true;
          video.removeEventListener("canplaythrough", finish);
          video.removeEventListener("loadeddata", finish);
          video.removeEventListener("error", finish);
          resolve();
        }
        video.addEventListener("canplaythrough", finish);
        video.addEventListener("loadeddata", finish);
        video.addEventListener("error", finish);
        // Fallback if events already fired / stalled.
        window.setTimeout(finish, 12000);
      });
    }

    function loadEntry(src) {
      var entry = getEntry(src);
      if (entry.ready && entry.video.readyState >= 2) {
        return Promise.resolve(entry);
      }
      if (entry.promise) return entry.promise;

      entry.promise = fetch(src, { credentials: "same-origin", cache: "force-cache" })
        .then(function (res) {
          if (!res.ok) throw new Error("fetch failed");
          return res.blob();
        })
        .then(function (blob) {
          if (entry.blobUrl) {
            try { URL.revokeObjectURL(entry.blobUrl); } catch (e) {}
          }
          entry.blobUrl = URL.createObjectURL(blob);
          var video = entry.video;
          mute(video);
          video.setAttribute("data-stack-src", src);
          video.src = entry.blobUrl;
          try { video.load(); } catch (e) {}
          return waitVideoReady(video).then(function () {
            entry.ready = video.readyState >= 2;
            return entry;
          });
        })
        .catch(function () {
          // Network / CORS fallback: let the browser stream from the URL.
          var video = entry.video;
          mute(video);
          video.setAttribute("data-stack-src", src);
          if ((video.getAttribute("src") || "") !== src) {
            video.src = src;
            try { video.load(); } catch (e) {}
          }
          return waitVideoReady(video).then(function () {
            entry.ready = video.readyState >= 2;
            return entry;
          });
        });

      return entry.promise;
    }

    function warmAll(preferSrc) {
      var srcs = [];
      buttons.forEach(function (btn) {
        var src = btn.getAttribute("data-stack");
        if (src && srcs.indexOf(src) < 0) srcs.push(src);
      });
      if (preferSrc) {
        srcs = [preferSrc].concat(srcs.filter(function (s) { return s !== preferSrc; }));
      }

      var i = 0;
      var inflight = 0;
      var max = 2;

      function pump() {
        while (inflight < max && i < srcs.length) {
          (function (src) {
            inflight += 1;
            loadEntry(src).then(function () {
              inflight -= 1;
              pump();
            }, function () {
              inflight -= 1;
              pump();
            });
          })(srcs[i++]);
        }
      }

      pump();
    }

    function activate(btn) {
      var stackSrc = btn.getAttribute("data-stack") || "";
      if (!stackSrc) return;

      if (activeBtn === btn && expectedSrc === stackSrc && ready && active) {
        playActive(loadToken);
        return;
      }

      clearKeep();
      loadToken += 1;
      var token = loadToken;
      activeBtn = btn;
      visible = true;

      buttons.forEach(function (el) {
        el.classList.toggle("is-active", el === btn);
      });

      var withRef = btn.hasAttribute("data-ref");
      setRefMode(withRef, btn.getAttribute("data-ref-label") || "Reference");
      if (titleEl) titleEl.textContent = btn.getAttribute("data-title") || "";
      if (linkEl) linkEl.setAttribute("href", btn.getAttribute("data-href") || "#");
      if (linkText) linkText.textContent = btn.getAttribute("data-link") || "";
      if (poster) {
        var posterSrc = btn.getAttribute("data-poster") || "";
        if (posterSrc) poster.setAttribute("src", posterSrc);
      }

      // Keep showing poster until the target entry is ready — no unload of others.
      if (!(active && (active.getAttribute("data-stack-src") || "") === stackSrc && active.readyState >= 2)) {
        ready = false;
        slider.classList.remove("is-playing");
      }
      applyCuts();
      showHint();
      expectedSrc = stackSrc;

      loadEntry(stackSrc).then(function (entry) {
        if (token !== loadToken) return;
        if (!entry || !entry.video) return;

        if (active && active !== entry.video) {
          pauseEl(active);
        }
        active = entry.video;
        mute(active);

        function commit() {
          if (token !== loadToken) return;
          if (active !== entry.video) return;
          if (entry.video.readyState < 2) return;
          ready = true;
          drawFrame();
          playActive(token);
        }

        if (entry.video.readyState >= 2) {
          commit();
        } else {
          entry.video.addEventListener("loadeddata", commit, { once: true });
          entry.video.addEventListener("canplay", commit, { once: true });
        }
      });
    }

    bindDrag();
    applyCuts();
    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        activate(btn);
      });
    });

    window.addEventListener("resize", function () {
      if (ready) drawFrame();
    });

    if ("IntersectionObserver" in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            visible = true;
            if (activeBtn) playActive(loadToken);
          } else {
            visible = false;
            clearKeep();
            pauseEl(active);
            stopLoop();
          }
        });
      }, { root: null, rootMargin: "80px 0px", threshold: 0.01 });
      io.observe(slider);
    }

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        clearKeep();
        pauseEl(active);
        stopLoop();
      } else if (activeBtn) {
        visible = true;
        playActive(loadToken);
      }
    });

    var start = root.querySelector("[data-scene].is-active") || buttons[0];
    var preferSrc = start ? start.getAttribute("data-stack") || "" : "";
    // Prefetch every stack into memory (blob) as soon as the page opens.
    warmAll(preferSrc);
    if (start) activate(start);
  }

  function initGalleryPlayers() {
    document.querySelectorAll("[data-gallery-player]").forEach(function (root) {
      var video = root.querySelector("video");
      var scrub = root.querySelector("[data-scrub]");
      var knob = root.querySelector("[data-knob]");
      if (!video || !scrub || !knob) return;

      var visible = false;

      function duration() {
        var d = video.duration;
        return isFinite(d) && d > 0 ? d : 0;
      }

      function paint() {
        var d = duration();
        var r = d ? Math.min(1, Math.max(0, video.currentTime / d)) : 0;
        knob.style.left = (r * 100).toFixed(2) + "%";
      }

      function seek(clientX) {
        var box = scrub.getBoundingClientRect();
        var r = Math.min(1, Math.max(0, (clientX - box.left) / box.width));
        var d = duration();
        if (d) video.currentTime = r * d;
        paint();
      }

      var ticking = false;
      function tick() {
        paint();
        if (!video.paused && !video.ended) {
          window.requestAnimationFrame(tick);
        } else {
          ticking = false;
        }
      }

      function startTick() {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(tick);
      }

      function tryPlay() {
        if (!visible) return;
        video.muted = true;
        video.defaultMuted = true;
        video.volume = 0;
        video.setAttribute("muted", "");
        video.playsInline = true;
        var play = video.play();
        if (play && play.catch) {
          play.catch(function () {
            window.setTimeout(function () {
              if (!visible) return;
              video.muted = true;
              video.play().catch(function () {});
            }, 250);
          });
        }
      }

      var keepTimer = null;
      function clearKeep() {
        if (keepTimer) {
          window.clearInterval(keepTimer);
          keepTimer = null;
        }
      }
      function armKeep() {
        clearKeep();
        keepTimer = window.setInterval(function () {
          if (!visible) {
            clearKeep();
            return;
          }
          if (video.paused || video.ended) tryPlay();
        }, 800);
      }

      video.addEventListener("timeupdate", paint);
      video.addEventListener("loadedmetadata", paint);
      video.addEventListener("durationchange", paint);
      video.addEventListener("play", startTick);
      video.addEventListener("playing", startTick);
      video.addEventListener("canplay", tryPlay);
      video.addEventListener("canplaythrough", tryPlay);
      video.addEventListener("loadeddata", tryPlay);

      var dragging = false;
      scrub.addEventListener("pointerdown", function (e) {
        e.preventDefault();
        dragging = true;
        scrub.setPointerCapture(e.pointerId);
        seek(e.clientX);
      });
      scrub.addEventListener("pointermove", function (e) {
        if (dragging) seek(e.clientX);
      });
      scrub.addEventListener("pointerup", function () {
        dragging = false;
      });
      scrub.addEventListener("pointercancel", function () {
        dragging = false;
      });

      // Do not call video.load() on enter — that aborts autoplay and causes stalls.
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            visible = entry.isIntersecting && entry.intersectionRatio > 0;
            if (visible) {
              tryPlay();
              armKeep();
            } else {
              clearKeep();
              if (!video.paused) video.pause();
            }
          });
        }, { rootMargin: "120px 0px", threshold: [0, 0.05, 0.2] });
        io.observe(root);
        var rect = root.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight) {
          visible = true;
          tryPlay();
          armKeep();
        }
      } else {
        visible = true;
        tryPlay();
        armKeep();
      }

      paint();
    });
  }

  var demo = document.querySelector("[data-demo]");
  if (demo) initCompare(demo);
  initGalleryPlayers();

  function initSectionTabs(root) {
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-tab]"));
    var panels = Array.prototype.slice.call(root.querySelectorAll("[data-panel]"));
    if (!buttons.length || !panels.length) return;

    function show(name) {
      buttons.forEach(function (btn) {
        var on = btn.getAttribute("data-tab") === name;
        btn.classList.toggle("is-active", on);
        btn.setAttribute("aria-selected", on ? "true" : "false");
      });
      panels.forEach(function (panel) {
        var on = panel.getAttribute("data-panel") === name;
        panel.hidden = !on;
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener("click", function () {
        show(btn.getAttribute("data-tab"));
      });
    });

    var start = root.querySelector("[data-tab].is-active") || buttons[0];
    if (start) show(start.getAttribute("data-tab"));
    return { show: show, buttons: buttons, panels: panels };
  }

  var tabGroups = Array.prototype.slice.call(document.querySelectorAll("[data-section-tabs]")).map(function (tabs) {
    var section = tabs.closest(".home-section") || tabs.parentElement;
    return initSectionTabs(section);
  }).filter(Boolean);

  var hashPanelMap = {
    "noise-param-estimation": { section: "results", tab: "physical" },
    "denoising": { section: "results", tab: "denoising" },
    "app-zebrafish": { section: "applications", tab: "zebrafish" },
    "app-mouse": { section: "applications", tab: "mouse" },
    "app-spines": { section: "applications", tab: "spines" },
    "app-neutrophils": { section: "applications", tab: "neutrophils" }
  };

  function openHashPanel(hash) {
    var id = (hash || "").replace(/^#/, "");
    if (!id) return null;
    var map = hashPanelMap[id];
    if (!map) {
      var el = document.getElementById(id);
      if (!el) return null;
      var panel = el.closest("[data-panel]");
      if (!panel) return null;
      var section = panel.closest(".home-section");
      if (!section) return null;
      var group = tabGroups.find(function (g) {
        return g.panels.some(function (p) { return section.contains(p); });
      });
      if (group) group.show(panel.getAttribute("data-panel"));
      return el;
    }
    var sectionEl = document.getElementById(map.section);
    if (!sectionEl) return null;
    var group = tabGroups.find(function (g) {
      return g.panels.some(function (p) { return sectionEl.contains(p); });
    });
    if (group) group.show(map.tab);
    return document.getElementById(id);
  }

  function handleHash() {
    var target = openHashPanel(window.location.hash);
    if (target && typeof target.scrollIntoView === "function") {
      window.setTimeout(function () {
        target.scrollIntoView({ block: "start" });
      }, 0);
    }
  }

  window.addEventListener("hashchange", handleHash);
  handleHash();

  var nav = document.querySelector("[data-section-nav]");
  if (nav) {
    var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
    var ids = links.map(function (a) { return a.getAttribute("href").slice(1); });
    var sections = ids.map(function (id) { return document.getElementById(id); }).filter(Boolean);

    function setActive() {
      var current = ids[0];
      var y = window.scrollY + 120;
      sections.forEach(function (sec) {
        if (sec.offsetTop <= y) current = sec.id;
      });
      links.forEach(function (a) {
        a.classList.toggle("is-active", a.getAttribute("href") === "#" + current);
      });
    }
    window.addEventListener("scroll", setActive, { passive: true });
    setActive();
  }
})();
