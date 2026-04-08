(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))o(e);new MutationObserver(e=>{for(const t of e)if(t.type==="childList")for(const i of t.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&o(i)}).observe(document,{childList:!0,subtree:!0});function n(e){const t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?t.credentials="include":e.crossOrigin==="anonymous"?t.credentials="omit":t.credentials="same-origin",t}function o(e){if(e.ep)return;e.ep=!0;const t=n(e);fetch(e.href,t)}})();const s=document.querySelector("#app");s&&(s.innerHTML=`
    <div style="max-width: 600px; margin: 0 auto; background: white; padding: 2rem; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h1 style="font-size: 2rem; font-weight: bold; margin-bottom: 1rem;">Hello from website.ts! 🎉</h1>
      <p style="font-size: 1.1rem; line-height: 1.5;">
        This TypeScript file is now connected to an HTML page and compiled via Vite.
      </p>
      <ul style="margin-top: 1rem; line-height: 1.6; padding-left: 1.5rem;">
        <li>Edit <code>website.ts</code> to see your changes instantly when running locally.</li>
        <li>Your repository is set up with <code>gh-pages</code> to easily publish this site.</li>
      </ul>
    </div>
  `);
