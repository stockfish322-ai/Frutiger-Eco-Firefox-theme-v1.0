// Clock + date
const clock = document.getElementById("clock");
const dateEl = document.getElementById("date");
function tick() {
  const now = new Date();
  clock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  dateEl.textContent = now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" });
}
tick();
setInterval(tick, 1000);

// Floating bubbles: a handful of cheap elements (transform/opacity animations only)
const bubbles = document.getElementById("bubbles");
const BUBBLE_COUNT = 16;
let bubblesOn = true;
try { bubblesOn = localStorage.getItem("eco-bubbles") !== "0"; } catch (e) {}
const bubblesBtn = document.getElementById("bubblesToggle");

function renderBubbles() {
  bubbles.textContent = "";
  if (!bubblesOn) return;                      // off = no elements at all, zero cost
  const frag = document.createDocumentFragment();
  for (let i = 0; i < BUBBLE_COUNT; i++) {
    const b = document.createElement("span");
    const size = 16 + Math.random() * 48;
    b.className = "bubble";
    b.style.cssText =
      `width:${size}px;height:${size}px;left:${2 + Math.random() * 94}%;` +
      `animation-duration:${14 + Math.random() * 14}s;animation-delay:${-Math.random() * 28}s;` +
      `--rise:${50 + Math.random() * 55};`;
    const inner = document.createElement("span");
    inner.className = "b";
    inner.style.cssText =
      `--drift:${8 + Math.random() * 26}px;` +
      `animation-duration:${4 + Math.random() * 4}s;animation-delay:${-Math.random() * 6}s;`;
    b.appendChild(inner);
    frag.appendChild(b);
  }
  bubbles.appendChild(frag);
}
function showBubblesSwitch() { bubblesBtn.setAttribute("aria-checked", String(bubblesOn)); }
bubblesBtn.addEventListener("click", () => {
  bubblesOn = !bubblesOn;
  try { localStorage.setItem("eco-bubbles", bubblesOn ? "1" : "0"); } catch (e) {}
  showBubblesSwitch();
  renderBubbles();
});
// don't animate while the tab is hidden
document.addEventListener("visibilitychange", () => bubbles.classList.toggle("paused", document.hidden));
showBubblesSwitch();
renderBubbles();

// Water touch ripple on every press
const layer = document.getElementById("ripples");
// Water drop sound (synthesised, no audio file needed)
let audio = null, master = null, muted = false;
try { muted = localStorage.getItem("eco-muted") === "1"; } catch (e) {}

function bloop(t, f0, f1, peak, dur) {
  const o = audio.createOscillator(), g = audio.createGain();
  o.type = "sine";
  o.frequency.setValueAtTime(f0, t);
  o.frequency.exponentialRampToValueAtTime(f1, t + dur * 0.45);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(peak, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(master);
  o.start(t);
  o.stop(t + dur + 0.05);
}

function playDrop() {
  if (muted) return;
  if (!audio) {
    audio = new (window.AudioContext || window.webkitAudioContext)();
    master = audio.createGain();
    master.gain.value = 0.5;
    master.connect(audio.destination);
  }
  if (audio.state === "suspended") audio.resume();
  const t = audio.currentTime;
  const r = 0.9 + Math.random() * 0.25;           // slight pitch variety
  bloop(t, 340 * r, 980 * r, 0.32, 0.24);         // the "bloop"
  bloop(t + 0.09, 230 * r, 560 * r, 0.16, 0.34);  // softer echo from the rings
  // tiny splash of filtered noise
  const len = Math.floor(audio.sampleRate * 0.09);
  const buf = audio.createBuffer(1, len, audio.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const n = audio.createBufferSource(), f = audio.createBiquadFilter(), g = audio.createGain();
  n.buffer = buf;
  f.type = "bandpass"; f.frequency.value = 2400; f.Q.value = 0.9;
  g.gain.value = 0.12;
  n.connect(f).connect(g).connect(master);
  n.start(t);
}

// Mute button
const muteBtn = document.getElementById("mute");
function showMute() {
  muteBtn.textContent = muted ? "\u{1F507}" : "\u{1F50A}";
  muteBtn.setAttribute("aria-label", muted ? "Unmute water sound" : "Mute water sound");
}
muteBtn.addEventListener("pointerdown", (e) => e.stopPropagation());
muteBtn.addEventListener("click", () => {
  muted = !muted;
  try { localStorage.setItem("eco-muted", muted ? "1" : "0"); } catch (e) {}
  showMute();
});
showMute();

// Bubbles that appear where you press, float up and pop
const reduceMotion = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
function spawnBubbles(x, y) {
  if (reduceMotion || layer.querySelectorAll(".pop").length > 30) return;   // keep it light
  const n = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < n; i++) {
    const b = document.createElement("span");
    const size = 10 + Math.random() * 26;
    b.className = "pop";
    b.style.cssText =
      `left:${x - size / 2 + (Math.random() - 0.5) * 36}px;top:${y - size / 2 + (Math.random() - 0.5) * 24}px;` +
      `width:${size}px;height:${size}px;` +
      `--dx:${(Math.random() - 0.5) * 90}px;--dy:${-(110 + Math.random() * 170)}px;` +
      `--dur:${1.4 + Math.random() * 1}s;--delay:${Math.random() * 0.22}s;`;
    b.addEventListener("animationend", () => b.remove());
    layer.appendChild(b);
  }
}

function ripple(x, y) {
  if (!waterOn) return;
  playDrop();
  spawnBubbles(x, y);
  const parts = ["ring", "ring r2", "ring r3", "drop"].map((cls) => {
    const el = document.createElement("span");
    el.className = cls;
    el.style.left = x + "px";
    el.style.top = y + "px";
    layer.appendChild(el);
    return el;
  });
  setTimeout(() => parts.forEach((p) => p.remove()), 1800);
}
document.addEventListener("pointerdown", (e) => ripple(e.clientX, e.clientY));

// Let the ripple play before leaving for a quick-launch site
document.getElementById("launch").addEventListener("click", (e) => {
  const a = e.target.closest(".tile");
  if (!a || !waterOn || e.ctrlKey || e.metaKey || e.shiftKey || e.button !== 0) return;
  e.preventDefault();
  if (e.detail === 0) ripple(innerWidth / 2, innerHeight / 2); // keyboard activation
  setTimeout(() => (location.href = a.href), 350);
});

// ---------- Settings: change the wallpaper ----------
const gear = document.getElementById("gear");
const panel = document.getElementById("panel");
const fileInput = document.getElementById("file");
const note = document.getElementById("note");
let wallpaperURL = null;

function setPanel(open) {
  panel.hidden = !open;
  gear.setAttribute("aria-expanded", String(open));
}
gear.addEventListener("click", () => setPanel(panel.hidden));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setPanel(false); });
document.addEventListener("click", (e) => {
  if (!panel.hidden && !panel.contains(e.target) && !gear.contains(e.target)) setPanel(false);
});

function openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open("eco-home", 1);
    r.onupgradeneeded = () => r.result.createObjectStore("kv");
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function dbDo(mode, fn) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const q = fn(db.transaction("kv", mode).objectStore("kv"));
    q.onsuccess = () => res(q.result);
    q.onerror = () => rej(q.error);
  });
}

function showWallpaper(blob) {
  if (wallpaperURL) URL.revokeObjectURL(wallpaperURL);
  if (!blob) {
    wallpaperURL = null;
    document.body.style.backgroundImage = "";
    document.body.style.backgroundPosition = "";
    return;
  }
  wallpaperURL = URL.createObjectURL(blob);
  document.body.style.backgroundImage = `url("${wallpaperURL}")`;
  document.body.style.backgroundPosition = "center";
}

// Shrink big photos so they stay fast and fit in storage
async function shrink(file) {
  const bmp = await createImageBitmap(file);
  const s = Math.min(1, 2200 / Math.max(bmp.width, bmp.height));
  const c = document.createElement("canvas");
  c.width = Math.round(bmp.width * s);
  c.height = Math.round(bmp.height * s);
  const g = c.getContext("2d");
  g.fillStyle = "#fff";
  g.fillRect(0, 0, c.width, c.height);
  g.drawImage(bmp, 0, 0, c.width, c.height);
  return new Promise((res) => c.toBlob(res, "image/jpeg", 0.88));
}

document.getElementById("pick").addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", async () => {
  const file = fileInput.files[0];
  fileInput.value = "";
  if (!file) return;
  note.textContent = "Loading...";
  let blob;
  try {
    blob = await shrink(file);
  } catch (e) {
    note.textContent = "That file couldn't be read as an image.";
    return;
  }
  showWallpaper(blob);
  try {
    await dbDo("readwrite", (s) => s.put(blob, "wallpaper"));
    note.textContent = "Wallpaper changed and saved.";
  } catch (e) {
    note.textContent = "Wallpaper changed, but it couldn't be saved for next time.";
  }
});

document.getElementById("reset").addEventListener("click", async () => {
  showWallpaper(null);
  try { await dbDo("readwrite", (s) => s.delete("wallpaper")); } catch (e) {}
  note.textContent = "Default wallpaper restored.";
});

dbDo("readonly", (s) => s.get("wallpaper")).then((b) => b && showWallpaper(b)).catch(() => {});

// ---------- Settings: water touch effect on/off (on by default) ----------
let waterOn = true;
try { waterOn = localStorage.getItem("eco-water") !== "0"; } catch (e) {}
const waterBtn = document.getElementById("water");
function showWater() { waterBtn.setAttribute("aria-checked", String(waterOn)); }
waterBtn.addEventListener("click", () => {
  waterOn = !waterOn;
  try { localStorage.setItem("eco-water", waterOn ? "1" : "0"); } catch (e) {}
  showWater();
  if (waterOn) {
    const r = waterBtn.getBoundingClientRect();
    ripple(r.left + r.width / 2, r.top + r.height / 2); // little preview when turned on
  }
});
showWater();

// ---------- Settings: add your own quick launch links ----------
const launch = document.getElementById("launch");
const linkForm = document.getElementById("linkForm");
const linkUrl = document.getElementById("linkUrl");
const linkName = document.getElementById("linkName");
const myLinks = document.getElementById("myLinks");
const linkNote = document.getElementById("linkNote");
const MAX_LINKS = 8;

function isWebUrl(text) {
  try { const u = new URL(text); return u.protocol === "http:" || u.protocol === "https:"; }
  catch (e) { return false; }
}

let links = [];
try { links = JSON.parse(localStorage.getItem("eco-links") || "[]"); } catch (e) { links = []; }
if (!Array.isArray(links)) links = [];
links = links
  .filter((l) => l && typeof l.url === "string" && isWebUrl(l.url))
  .map((l) => ({ url: l.url, name: String(l.name || "").slice(0, 20) }))
  .slice(0, MAX_LINKS);

function saveLinks() {
  try { localStorage.setItem("eco-links", JSON.stringify(links)); return true; }
  catch (e) { return false; }
}

// Accepts "example.com" or a full link; only http/https are allowed
function normalizeUrl(text) {
  let t = text.trim();
  if (!t || /\s/.test(t)) return null;
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(t)) t = "https://" + t;
  let u;
  try { u = new URL(t); } catch (e) { return null; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return null;
  if (!u.hostname.includes(".") && u.hostname !== "localhost") return null;
  return u;
}

function prettyName(host) {
  const first = host.replace(/^www\./, "").split(".")[0];
  return first.charAt(0).toUpperCase() + first.slice(1);
}

function colourClass(host) {
  let h = 0;
  for (const ch of host) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return "c" + (h % 6);
}

function renderLinks() {
  launch.querySelectorAll(".tile.custom").forEach((n) => n.remove());
  myLinks.textContent = "";
  links.forEach((l, i) => {
    const host = new URL(l.url).hostname.replace(/^www\./, "");
    const name = l.name || prettyName(host);

    const a = document.createElement("a");
    a.className = "tile custom";
    a.href = l.url;
    const orb = document.createElement("span");
    orb.className = "orb " + colourClass(host);
    const letter = document.createElement("span");
    letter.className = "letter";
    letter.textContent = name.charAt(0).toUpperCase();
    orb.appendChild(letter);
    if (iconsOn && canFetchIcon(host)) {
      const img = document.createElement("img");
      img.className = "favicon";
      img.alt = "";
      img.decoding = "async";
      img.referrerPolicy = "no-referrer";
      img.addEventListener("load", () => orb.classList.add("has-icon"));
      img.addEventListener("error", () => img.remove());   // keep the letter if it fails
      img.src = "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(host) + "&sz=128";
      orb.appendChild(img);
    }
    const label = document.createElement("span");
    label.className = "name";
    label.textContent = name;
    a.append(orb, label);
    launch.appendChild(a);

    const li = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = name + " \u2013 " + host;
    const x = document.createElement("button");
    x.type = "button";
    x.className = "x";
    x.textContent = "\u00d7";
    x.setAttribute("aria-label", "Remove " + name);
    x.addEventListener("click", () => {
      links.splice(i, 1);
      saveLinks();
      renderLinks();
      linkNote.textContent = name + " removed.";
    });
    li.append(text, x);
    myLinks.appendChild(li);
  });
  launch.classList.toggle("many", launch.children.length > 4);
}

linkForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (links.length >= MAX_LINKS) {
    linkNote.textContent = "You can add up to " + MAX_LINKS + " links. Remove one first.";
    return;
  }
  const u = normalizeUrl(linkUrl.value);
  if (!u) {
    linkNote.textContent = "That doesn't look like a web link. Try something like example.com";
    return;
  }
  if (links.some((l) => l.url === u.href)) {
    linkNote.textContent = "That link is already on your homepage.";
    return;
  }
  const name = (linkName.value.trim() || prettyName(u.hostname)).slice(0, 20);
  links.push({ url: u.href, name });
  const saved = saveLinks();
  renderLinks();
  linkForm.reset();
  linkNote.textContent = saved ? name + " added." : name + " added, but it couldn't be saved for next time.";
});

// Website icons on/off (on by default) - never sent for local or private addresses
let iconsOn = true;
try { iconsOn = localStorage.getItem("eco-icons") !== "0"; } catch (e) {}
const iconsBtn = document.getElementById("icons");
function showIcons() { iconsBtn.setAttribute("aria-checked", String(iconsOn)); }
function canFetchIcon(host) {
  if (!host.includes(".") || host.includes(":")) return false;          // localhost, IPv6
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) return false;               // IPv4
  return !/\.(local|lan|internal|home\.arpa|localhost)$/i.test(host);
}
iconsBtn.addEventListener("click", () => {
  iconsOn = !iconsOn;
  try { localStorage.setItem("eco-icons", iconsOn ? "1" : "0"); } catch (e) {}
  showIcons();
  renderLinks();
});
showIcons();

renderLinks();
