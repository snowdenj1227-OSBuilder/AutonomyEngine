// OPTIONAL: Cloudflare Worker to receive waitlist POSTs and forward via Resend
export default {
  async fetch(req, env) {
    if (req.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }
    if (req.method !== "POST") return new Response("Only POST", { status: 405, headers: corsHeaders() });

    const form = await req.formData();
    const payload = Object.fromEntries([...form.entries()].map(([k,v]) => [k, v instanceof File ? '' : v]));

    const html = `
      <h2>Early Operator Waitlist</h2>
      <pre>${escapeHtml(JSON.stringify(payload, null, 2))}</pre>
    `;

    const r = await fetch('https://api.resend.com/emails', {
      method:'POST',
      headers:{ 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type':'application/json' },
      body: JSON.stringify({
        from: 'Autonomy Engine <hello@autonomyengine.net>',
        to: ['operator@autonomyengine.net'],
        subject: 'New Waitlist Signup',
        html
      })
    });

    const ok = r.ok;
    return new Response(JSON.stringify({ ok }), { status: ok?200:500, headers: { 'Content-Type':'application/json', ...corsHeaders() }});
  }
}
function corsHeaders(){ return { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST, OPTIONS" }; }
function escapeHtml(str){ return str.replace(/[&<>"]/g, m => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[m])); }
