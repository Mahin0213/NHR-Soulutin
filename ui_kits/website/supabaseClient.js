/* Supabase client for the public forms.

   No authentication: visitors submit anonymously. The database allows the
   anon role to INSERT into enquiries and demo_bookings and nothing else —
   it cannot read a single row back, so one visitor cannot see another's
   submission. Sessions are not persisted because nobody signs in.

   Config comes from supabase-config.js, generated from .env. When it is
   absent the forms fall back to browser storage, as the prototype did. */
window.NHRSupabase = (function () {
  var CDN = 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.117.0/dist/umd/supabase.js';
  var pending = null;

  function config() { return window.NHR_SUPABASE || {}; }
  function enabled() { var c = config(); return Boolean(c.url && c.key); }

  function client() {
    if (pending) return pending;
    pending = new Promise(function (resolve, reject) {
      var c = config();
      if (!enabled()) { reject(new Error('Supabase is not configured')); return; }
      if (window.supabase && window.supabase.createClient) { resolve(make(c)); return; }
      var tag = document.createElement('script');
      tag.src = CDN;
      tag.async = true;
      tag.onload = function () {
        if (window.supabase && window.supabase.createClient) resolve(make(c));
        else reject(new Error('Supabase library loaded but createClient is missing'));
      };
      tag.onerror = function () { reject(new Error('Could not load the Supabase library')); };
      document.head.appendChild(tag);
    });
    return pending;
  }

  function make(c) {
    return window.supabase.createClient(c.url, c.key, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  }

  function insert(table, row) {
    return client().then(function (db) {
      return db.from(table).insert(row).then(function (res) {
        if (res.error) throw new Error(res.error.message || 'The database rejected the submission');
        return true;
      });
    });
  }

  return {
    enabled: enabled,
    submitEnquiry: function (row) { return insert('enquiries', row); },
    submitDemoBooking: function (row) { return insert('demo_bookings', row); }
  };
})();
