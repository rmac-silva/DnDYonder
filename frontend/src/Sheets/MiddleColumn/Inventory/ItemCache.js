const CACHE = new Map();
let _readyPromise = null;

async function init() {
  if (_readyPromise) return _readyPromise;
  _readyPromise = (async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/info/equipment`);
    if (!res.ok) {
      const err = await res.json().catch(() => ({ detail: 'Unknown' }));
      throw new Error(`HTTP ${res.status} - ${err.detail}`);
    }
    const items = await res.json(); // expect array of { name, content }
    
    CACHE.clear();
    items.equipment.forEach(item => {
      if (!item || !item.name) return;
       item.content.type = item.type || "unknown";
      CACHE.set(String(item.name).toLowerCase(), item.content);
    });
    return items;
  })();
  return _readyPromise;
}

function getAll() {
  return Array.from(CACHE.values());
}

function getAllNames() {
  return Array.from(CACHE.keys());
}

// synchronous lookup (may be undefined if not loaded yet)
function getItem(name) {
  if (!name) return undefined;
  return CACHE.get(String(name).toLowerCase());
}

// async lookup (ensures init completed)
async function getItemAsync(name) {
  await init();
  return getItem(name);
}

// optional: convenience to wait until ready
function ready() {
  return init();
}

const _listeners = new Set();
function subscribeItemCache(fn) { _listeners.add(fn); return () => _listeners.delete(fn); }
function notifyItemCache() { _listeners.forEach(fn => { try { fn(); } catch (e) { console.error(e); } }); }

async function ForceCacheRefresh() {
  // clear ready promise so init will re-fetch
  _readyPromise = null;
  try {
    // wait for init() to finish repopulating CACHE, then notify subscribers
    await init();
    notifyItemCache();
  } catch (err) {
    console.error("ForceCacheRefresh error:", err);
    // still notify so subscribers can at least try to react
    notifyItemCache();
  }
}

function GetItemNamesOfType(type) {
  const names = [];
  for (const [name, content] of CACHE.entries()) {
    //console.log("Checking item:", name, "of type:", content.type);
    if (content.type && content.type.toLowerCase() === type.toLowerCase()) {
      //console.log("Found item of type", type, ":", name);
      names.push(name);
    }
  }
  return names;
}

function GetItemsOfType(type) {
  const items = [];
  for (const [name, content] of CACHE.entries()) {
    if (content.type && content.type.toLowerCase() === type.toLowerCase()) {
      items.push({ name, content });
    }
  }
  return items;
}

export { init, ready, getAll, getItem, getItemAsync, ForceCacheRefresh, GetItemsOfType, getAllNames,subscribeItemCache, GetItemNamesOfType };
export default { init, ready, getAll, getItem, getItemAsync, ForceCacheRefresh, GetItemsOfType, getAllNames,subscribeItemCache,GetItemNamesOfType };