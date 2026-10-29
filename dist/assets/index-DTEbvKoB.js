(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e=new Intl.NumberFormat(`es-AR`),t=new Intl.NumberFormat(`es-AR`,{style:`currency`,currency:`ARS`,maximumFractionDigits:0});function n(t){return e.format(Number(t)||0)}function r(e){return t.format(Number(e)||0)}function i(e){return e.stock<=0?`Sin stock`:e.stock<=e.minStock?`Stock bajo`:`En stock`}function a(e){return String(e??``).replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#39;`)}function o(e){return typeof window>`u`?null:new URLSearchParams(window.location.search).get(e)}function s(e,t=`CD Norte`){let n=e.split(/\r?\n/).map(e=>e.trim()).filter(Boolean);if(n.length<=1)return[];let r=n[0].includes(`;`)?`;`:`,`;return n.slice(1).map((e,n)=>{let i=e.split(r).map(e=>e.trim());return{name:i[0]||`Artículo importado ${n+1}`,subtitle:i[1]||`Importado por lote CSV`,sku:(i[2]||`IMP-${100+n}`).toUpperCase(),category:i[3]||`Ferretería`,stock:Number(i[4])||0,minStock:Number(i[5])||10,unit:i[6]||`unid.`,cost:Number(i[7])||0,price:Number(i[8])||0,location:i[9]||`Depósito Central · Pasillo A-1`,branch:i[10]||t,icon:`wrench`}})}var c={layoutDashboard:`<rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/>`,package:`<path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>`,arrowLeftRight:`<path d="M8 3 4 7l4 4"/><path d="M4 7h16"/><path d="m16 21 4-4-4-4"/><path d="M20 17H4"/>`,tags:`<path d="m15 5 6.3 6.3a2.4 2.4 0 0 1 0 3.4L17 19"/><path d="M9.586 5.586A2 2 0 0 0 8.172 5H3a1 1 0 0 0-1 1v5.172a2 2 0 0 0 .586 1.414L8.29 18.29a2.426 2.426 0 0 0 3.42 0l3.58-3.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="6.5" cy="9.5" r=".5" fill="currentColor"/>`,boxes:`<path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>`,truck:`<path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/>`,barChart3:`<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>`,settings:`<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>`,sun:`<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>`,moon:`<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>`,circleHelp:`<circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/>`,chevronRight:`<path d="m9 18 6-6-6-6"/>`,chevronUp:`<path d="m18 15-6-6-6 6"/>`,chevronDown:`<path d="m6 9 6 6 6-6"/>`,userCheck:`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><polyline points="16 11 18 13 22 9"/>`,logOut:`<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/>`,panelLeftClose:`<rect width="18" height="18" x="3" y="3" rx="2"/><path d="M9 3v18"/><path d="m16 15-3-3 3-3"/>`,menu:`<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>`,building2:`<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z"/><path d="M6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2"/><path d="M18 9h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-2"/><path d="M10 6h4"/><path d="M10 10h4"/><path d="M10 14h4"/><path d="M10 18h4"/>`,check:`<path d="M20 6 9 17l-5-5"/>`,mapPin:`<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>`,search:`<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>`,bell:`<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>`,plus:`<path d="M5 12h14"/><path d="M12 5v14"/>`,upload:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>`,download:`<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>`,save:`<path d="M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/><path d="M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7"/><path d="M7 3v4a1 1 0 0 0 1 1h7"/>`,x:`<path d="M18 6 6 18"/><path d="m6 6 12 12"/>`,trash2:`<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/><line x1="10" x2="10" y1="11" y2="17"/><line x1="14" x2="14" y1="11" y2="17"/>`,ellipsis:`<circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>`,wrench:`<path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>`,cable:`<path d="M17 21v-2a1 1 0 0 1-1-1v-1a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v1a1 1 0 0 1-1 1"/><path d="M19 15V6.5a1 1 0 0 0-7 0v11a1 1 0 0 1-7 0V9"/><path d="M21 21v-2h-4"/><path d="M3 5h4V3"/><path d="M7 5a1 1 0 0 1 1 1v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a1 1 0 0 1 1-1V3"/>`,paint:`<path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/>`,headphones:`<path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"/>`,shirt:`<path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/>`,spray:`<path d="M3 3h.01"/><path d="M7 5h.01"/><path d="M11 7h.01"/><path d="M3 7h.01"/><path d="M7 9h.01"/><path d="M3 11h.01"/><rect width="4" height="4" x="15" y="5"/><path d="m19 9 2 2v10c0 .6-.4 1-1 1h-6c-.6 0-1-.4-1-1V11l2-2"/><path d="m13 14 8-2"/><path d="m13 19 8-2"/>`,coffee:`<path d="M10 2v2"/><path d="M14 2v2"/><path d="M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1"/><path d="M6 2v2"/>`,lamp:`<path d="M8 2h8l4 10H4L8 2Z"/><path d="M12 12v6"/><path d="M8 22v-2c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2H8Z"/>`,disc:`<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="2"/>`,triangleAlert:`<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4"/><path d="M12 17h.01"/>`,circleDollarSign:`<circle cx="12" cy="12" r="10"/><path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/><path d="M12 18V6"/>`,arrowDownLeft:`<path d="M17 7 7 17"/><path d="M17 17H7V7"/>`,arrowUpRight:`<path d="M7 7h10v10"/><path d="M7 17 17 7"/>`,arrowRight:`<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>`,arrowDown:`<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>`,arrowUp:`<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>`,activity:`<path d="M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2"/>`,filter:`<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>`,rotateCcw:`<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>`,sparkles:`<path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/><path d="M20 3v4"/><path d="M22 5h-4"/>`,fileSpreadsheet:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 13h2"/><path d="M14 13h2"/><path d="M8 17h2"/><path d="M14 17h2"/>`,checkCircle2:`<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>`,packageCheck:`<path d="m16 16 2 2 4-4"/><path d="M21 10V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l2-1.14"/><path d="m7.5 4.27 9 5.15"/><polyline points="3.29 7 12 12 20.71 7"/><line x1="12" x2="12" y1="22" y2="12"/>`,trendingUp:`<polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/>`,shieldCheck:`<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>`,fingerprint:`<path d="M12 10a2 2 0 0 0-2 2c0 1.02-.1 2.51-.26 4"/><path d="M14 13.12c0 2.38 0 6.38-1 8.88"/><path d="M17.29 21.02c.12-.6.43-2.3.5-3.02"/><path d="M2 12a10 10 0 0 1 18-6"/><path d="M2 16h.01"/><path d="M21.8 16c.2-2 .131-5.354 0-6"/><path d="M5 19.5C5.5 18 6 15 6 12a6 6 0 0 1 .34-2"/><path d="M8.65 22c.21-.66.45-1.32.57-2"/><path d="M9 6.8a6 6 0 0 1 9 5.2v2"/>`,fileCheck2:`<path d="M4 22h14a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v4"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="m3 15 2 2 4-4"/>`,clock3:`<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16.5 12"/>`,phone:`<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>`,mail:`<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>`,cpu:`<rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>`,zap:`<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>`,fileBarChart2:`<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M8 18v-1"/><path d="M12 18v-6"/><path d="M16 18v-3"/>`,arrowDownToLine:`<path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/>`,slidersHorizontal:`<line x1="21" x2="14" y1="4" y2="4"/><line x1="10" x2="3" y1="4" y2="4"/><line x1="21" x2="12" y1="12" y2="12"/><line x1="8" x2="3" y1="12" y2="12"/><line x1="21" x2="16" y1="20" y2="20"/><line x1="12" x2="3" y1="20" y2="20"/><line x1="14" x2="14" y1="2" y2="6"/><line x1="8" x2="8" y1="10" y2="14"/><line x1="16" x2="16" y1="18" y2="22"/>`,users:`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>`,lockKeyhole:`<circle cx="12" cy="16" r="1"/><rect x="3" y="10" width="18" height="12" rx="2"/><path d="M7 10V7a5 5 0 0 1 10 0v3"/>`,userCog:`<circle cx="18" cy="15" r="3"/><circle cx="9" cy="7" r="4"/><path d="M10 15H6a4 4 0 0 0-4 4v2"/><path d="m21.7 16.4-.9-.3"/><path d="m15.2 13.9-.9-.3"/><path d="m16.6 18.7.3-.9"/><path d="m19.1 12.2.3-.9"/><path d="m19.6 18.7-.4-1"/><path d="m16.8 12.3-.4-1"/><path d="m14.3 16.6 1-.4"/><path d="m20.7 13.8 1-.4"/>`,userRoundX:`<path d="M2 21a8 8 0 0 1 11.873-7"/><circle cx="10" cy="8" r="5"/><path d="m17 17 5 5"/><path d="m22 17-5 5"/>`,userRoundCheck:`<path d="M2 21a8 8 0 0 1 13.292-6"/><circle cx="10" cy="8" r="5"/><path d="m16 19 2 2 4-4"/>`,keyRound:`<path d="M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z"/><circle cx="16.5" cy="7.5" r=".5" fill="currentColor"/>`,eye:`<path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0"/><circle cx="12" cy="12" r="3"/>`,eyeOff:`<path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49"/><path d="M14.084 14.158a3 3 0 0 1-4.242-4.242"/><path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143"/><path d="m2 2 20 20"/>`,userPlus:`<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" x2="19" y1="8" y2="14"/><line x1="22" x2="16" y1="11" y2="11"/>`};function l(e,t=18){return e===`googleLogo`?`<svg width="${t}" height="${t}" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82Z"/>
      <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24Z"/>
      <path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09Z"/>
      <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96Z"/>
    </svg>`:`<svg width="${t}" height="${t}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${c[e]||c.package}</svg>`}function u(e){let{bulkImportState:t,categories:n,branches:i}=e,{activeTab:o,rows:s,csvPreview:c,fileName:u}=t,d=i.filter(e=>e.id!==`all`),f=s.filter(e=>e.name.trim()!==``&&e.sku.trim()!==``),p=f.reduce((e,t)=>e+(Number(t.stock)||0),0),m=f.reduce((e,t)=>e+(Number(t.stock)||0)*(Number(t.cost)||0),0),h=o===`table`?`<div class="bulk-summary-strip">
          <div class="bulk-stat">
            <span class="bulk-stat-label">Filas válidas</span>
            <strong class="tabular">${f.length} de ${s.length}</strong>
          </div>
          <div class="bulk-stat">
            <span class="bulk-stat-label">Unidades totales a ingresar</span>
            <strong class="tabular">${p} u.</strong>
          </div>
          <div class="bulk-stat">
            <span class="bulk-stat-label">Valorización de costo</span>
            <strong class="tabular">${r(m)}</strong>
          </div>
          <div class="bulk-stat-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-action="bulk-add-row">
              ${l(`plus`,14)} Agregar fila
            </button>
            <button type="button" class="btn btn-ghost btn-sm" data-action="bulk-add-three-rows">
              ${l(`sparkles`,14)} +3 filas rápidas
            </button>
          </div>
        </div>

        <div class="bulk-grid-wrapper">
          <table class="bulk-form-table">
            <thead>
              <tr>
                <th style="width: 36px;">#</th>
                <th style="min-width: 190px;">Nombre del Producto *</th>
                <th style="width: 115px;">Código SKU *</th>
                <th style="width: 140px;">Categoría</th>
                <th style="width: 145px;">Sede / Sucursal</th>
                <th style="width: 82px;">Stock</th>
                <th style="width: 82px;">Mín.</th>
                <th style="width: 105px;">Costo ($)</th>
                <th style="width: 105px;">Precio ($)</th>
                <th style="min-width: 155px;">Ubicación física</th>
                <th style="width: 44px;"></th>
              </tr>
            </thead>
            <tbody>
              ${s.map((e,t)=>`<tr>
                    <td class="bulk-row-idx tabular">${t+1}</td>
                    <td>
                      <input
                        class="bulk-cell-input"
                        type="text"
                        value="${a(e.name)}"
                        placeholder="Ej. Llave Térmica 2x25A"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="name"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input mono"
                        type="text"
                        value="${a(e.sku)}"
                        placeholder="ELE-0100"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="sku"
                      />
                    </td>
                    <td>
                      <select
                        class="bulk-cell-select"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="category"
                      >
                        ${n.map(t=>`<option value="${a(t.name)}" ${e.category===t.name?`selected`:``}>${a(t.name)}</option>`).join(``)}
                      </select>
                    </td>
                    <td>
                      <select
                        class="bulk-cell-select"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="branch"
                      >
                        ${d.map(t=>`<option value="${a(t.name)}" ${e.branch===t.name?`selected`:``}>${a(t.name)}</option>`).join(``)}
                      </select>
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${a(e.stock)}"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="stock"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${a(e.minStock)}"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="minStock"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${a(e.cost)}"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="cost"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input tabular"
                        type="number"
                        min="0"
                        value="${a(e.price)}"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="price"
                      />
                    </td>
                    <td>
                      <input
                        class="bulk-cell-input"
                        type="text"
                        value="${a(e.location)}"
                        placeholder="Pasillo A-1"
                        data-bulk-row="${a(e.id)}"
                        data-bulk-field="location"
                      />
                    </td>
                    <td style="text-align: center;">
                      <button
                        type="button"
                        class="icon-btn"
                        style="width: 28px; height: 28px;"
                        data-action="bulk-remove-row"
                        data-row-id="${a(e.id)}"
                        title="Quitar fila"
                        aria-label="Quitar fila"
                      >
                        ${l(`trash2`,14)}
                      </button>
                    </td>
                  </tr>`).join(``)}
            </tbody>
          </table>
        </div>`:`<div style="display: flex; flex-direction: column; gap: 16px;">
          <div class="dropzone" data-action="trigger-csv-input">
            <div class="dropzone-icon">${l(`upload`,22)}</div>
            <div style="font-weight: 600; color: var(--text-primary); margin-bottom: 4px;">
              ${u?`Archivo cargado: ${a(u)}`:`Hacé clic para seleccionar un archivo CSV`}
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              Soporta delimitadores por coma (,) o punto y coma (;). Hasta 5.000 filas por lote.
            </div>
            <input
              id="bulk-csv-file-input"
              type="file"
              accept=".csv,text/csv"
              style="display: none;"
            />
          </div>

          <div style="display: flex; justify-content: space-between; align-items: center; background: var(--surface-subtle); padding: 12px 14px; border-radius: var(--radius-md); border: 1px solid var(--border);">
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              ¿No tenés el formato a mano? Descargá la plantilla oficial con ejemplos e importala directamente.
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-action="download-csv-template">
              ${l(`download`,14)} Descargar plantilla CSV
            </button>
          </div>

          ${c.length>0?`<div style="border: 1px solid var(--border); border-radius: var(--radius-md); overflow: hidden;">
                  <div style="padding: 10px 14px; background: var(--surface-muted); font-size: 12px; font-weight: 600; display: flex; align-items: center; gap: 6px; color: var(--success-text);">
                    ${l(`checkCircle2`,15)} ${c.length} artículos validados listos para importar
                  </div>
                  <div class="table-scroll" style="max-height: 220px;">
                    <table class="data-table">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>SKU</th>
                          <th>Sede</th>
                          <th class="align-right">Stock</th>
                          <th class="align-right">Precio</th>
                        </tr>
                      </thead>
                      <tbody>
                        ${c.map(e=>`<tr>
                              <td><strong>${a(e.name)}</strong></td>
                              <td><span class="sku-code">${a(e.sku)}</span></td>
                              <td>${a(e.branch)}</td>
                              <td class="align-right tabular">${e.stock} ${a(e.unit)}</td>
                              <td class="align-right tabular">$${e.price.toLocaleString(`es-AR`)}</td>
                            </tr>`).join(``)}
                      </tbody>
                    </table>
                  </div>
                </div>`:``}
        </div>`;return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer drawer-wide"
      role="dialog"
      aria-modal="true"
      aria-label="Carga masiva de productos"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Carga masiva de productos e inventario</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Completá la planilla interactiva en pantalla o subí un archivo CSV/Excel.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="bulk-tabs-bar">
        <button
          type="button"
          class="bulk-tab-btn ${o===`table`?`active`:``}"
          data-action="set-bulk-tab"
          data-tab="table"
        >
          ${l(`fileSpreadsheet`,15)}
          <span>Tabla / Formulario interactivo (${s.length} filas)</span>
        </button>
        <button
          type="button"
          class="bulk-tab-btn ${o===`csv`?`active`:``}"
          data-action="set-bulk-tab"
          data-tab="csv"
        >
          ${l(`upload`,15)}
          <span>Importar archivo CSV / Excel</span>
        </button>
      </div>

      <div class="drawer-body">${h}</div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        ${o===`table`?`<button
                type="button"
                class="btn btn-primary"
                data-action="submit-bulk-table"
                ${f.length===0?`disabled`:``}
              >
                ${l(`checkCircle2`,16)}
                Guardar e importar ${f.length} productos
              </button>`:`<button
                type="button"
                class="btn btn-primary"
                data-action="submit-bulk-csv"
                ${c.length===0?`disabled`:``}
              >
                ${l(`upload`,16)}
                Importar ${c.length>0?`${c.length} productos`:`lote CSV`}
              </button>`}
      </div>
    </aside>
  </div>`}function d(e){let{drawer:t}=e;return t?t===`import`?u(e):t===`product`?f(e):t===`movement`?p(e):t===`category`?m(e):t===`supplier`?h(e):t===`branches`?g(e):``:``}function f(e){let{editingProduct:t,productDraft:n,categories:r,branches:i}=e,o=i.filter(e=>e.id!==`all`);return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="${t?`Editar producto`:`Nuevo producto`}"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">
            ${t?`Editar ${a(t.sku)}`:`Dar de alta nuevo producto`}
          </div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Completá la ficha técnica, sede asignada y niveles de stock de seguridad.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label for="prd-name">Nombre del producto *</label>
          <input
            id="prd-name"
            class="input"
            value="${a(n.name)}"
            placeholder="Ej. Llave Térmica Tripolar 3x32A"
            data-draft="productDraft"
            data-field="name"
          />
        </div>

        <div class="field">
          <label for="prd-sub">Especificación / Subtítulo</label>
          <input
            id="prd-sub"
            class="input"
            value="${a(n.subtitle)}"
            placeholder="Ej. Curva C · Normalizada IRAM"
            data-draft="productDraft"
            data-field="subtitle"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-sku">Código SKU *</label>
            <input
              id="prd-sku"
              class="input"
              value="${a(n.sku)}"
              placeholder="ELE-0450"
              data-draft="productDraft"
              data-field="sku"
            />
          </div>
          <div class="field">
            <label for="prd-cat">Categoría</label>
            <select
              id="prd-cat"
              class="select"
              data-draft="productDraft"
              data-field="category"
            >
              ${r.map(e=>`<option value="${a(e.name)}" ${n.category===e.name?`selected`:``}>${a(e.name)}</option>`).join(``)}
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-stock">Stock actual</label>
            <input
              id="prd-stock"
              class="input"
              type="number"
              min="0"
              value="${a(n.stock)}"
              data-draft="productDraft"
              data-field="stock"
            />
          </div>
          <div class="field">
            <label for="prd-min">Punto de pedido (mínimo)</label>
            <input
              id="prd-min"
              class="input"
              type="number"
              min="0"
              value="${a(n.minStock)}"
              data-draft="productDraft"
              data-field="minStock"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-cost">Costo unitario (ARS)</label>
            <input
              id="prd-cost"
              class="input"
              type="number"
              min="0"
              value="${a(n.cost)}"
              data-draft="productDraft"
              data-field="cost"
            />
          </div>
          <div class="field">
            <label for="prd-price">Precio de venta (ARS)</label>
            <input
              id="prd-price"
              class="input"
              type="number"
              min="0"
              value="${a(n.price)}"
              data-draft="productDraft"
              data-field="price"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="prd-branch">Sede / Sucursal</label>
            <select
              id="prd-branch"
              class="select"
              data-draft="productDraft"
              data-field="branch"
            >
              ${o.map(e=>`<option value="${a(e.name)}" ${n.branch===e.name?`selected`:``}>${a(e.name)}</option>`).join(``)}
            </select>
          </div>
          <div class="field">
            <label for="prd-loc">Ubicación física</label>
            <input
              id="prd-loc"
              class="input"
              value="${a(n.location)}"
              data-draft="productDraft"
              data-field="location"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-product">
          ${l(`save`,15)}
          ${t?`Guardar cambios`:`Crear producto`}
        </button>
      </div>
    </aside>
  </div>`}function p(e){let{movementDraft:t,products:n}=e;return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Registrar movimiento de stock"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Registrar movimiento de stock</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Impacta automáticamente sobre las existencias del artículo seleccionado.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label>Tipo de operación</label>
          <div class="segmented" style=" display: grid; grid-template-columns: repeat(4, 1fr);">
            ${[`Ingreso`,`Egreso`,`Ajuste`,`Transferencia`].map(e=>`<button
                    type="button"
                    class="seg-btn ${t.type===e?`active`:``}"
                    data-action="set-movement-type"
                    data-mov-type="${e}"
                  >${e}</button>`).join(``)}
          </div>
        </div>

        <div class="field">
          <label for="mov-product">Producto afectado</label>
          <select
            id="mov-product"
            class="select"
            data-draft="movementDraft"
            data-field="productId"
          >
            ${n.map(e=>`<option value="${a(e.id)}" ${t.productId===e.id?`selected`:``}>${a(e.sku)} — ${a(e.name)} (Stock: ${e.stock} ${a(e.unit)})</option>`).join(``)}
          </select>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="mov-qty">Cantidad</label>
            <input
              id="mov-qty"
              class="input"
              type="number"
              value="${a(t.quantity)}"
              data-draft="movementDraft"
              data-field="quantity"
            />
          </div>
          <div class="field">
            <label for="mov-resp">Operador responsable</label>
            <input
              id="mov-resp"
              class="input"
              value="${a(t.responsible)}"
              data-draft="movementDraft"
              data-field="responsible"
            />
          </div>
        </div>

        <div class="field">
          <label for="mov-ref">Documento / Referencia</label>
          <input
            id="mov-ref"
            class="input"
            value="${a(t.reference)}"
            placeholder="Ej. OC #4418 · Remito #10902"
            data-draft="movementDraft"
            data-field="reference"
          />
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-movement">
          ${l(`save`,15)} Confirmar movimiento
        </button>
      </div>
    </aside>
  </div>`}function m(e){let{categoryDraft:t}=e;return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Nueva categoría"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div class="drawer-title">Crear categoría de inventario</div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="form-grid">
          <div class="field">
            <label for="cat-name">Nombre del rubro *</label>
            <input
              id="cat-name"
              class="input"
              value="${a(t.name)}"
              placeholder="Ej. Hidráulica y Gas"
              data-draft="categoryDraft"
              data-field="name"
            />
          </div>
          <div class="field">
            <label for="cat-code">Prefijo SKU (3 letras)</label>
            <input
              id="cat-code"
              class="input"
              maxlength="4"
              value="${a(t.code)}"
              placeholder="HID"
              data-draft="categoryDraft"
              data-field="code"
            />
          </div>
        </div>

        <div class="field">
          <label for="cat-desc">Descripción operativa</label>
          <textarea
            id="cat-desc"
            class="textarea"
            placeholder="Detalle de artículos incluidos en la categoría..."
            data-draft="categoryDraft"
            data-field="description"
          >${a(t.description)}</textarea>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="cat-margin">Margen objetivo (%)</label>
            <input
              id="cat-margin"
              class="input"
              type="number"
              value="${a(t.targetMargin)}"
              data-draft="categoryDraft"
              data-field="targetMargin"
            />
          </div>
          <div class="field">
            <label for="cat-loc">Sector de depósito</label>
            <input
              id="cat-loc"
              class="input"
              value="${a(t.location)}"
              data-draft="categoryDraft"
              data-field="location"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-category">
          ${l(`save`,15)} Guardar categoría
        </button>
      </div>
    </aside>
  </div>`}function h(e){let{supplierDraft:t,categories:n}=e;return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Homologar proveedor"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div class="drawer-title">Homologar nuevo proveedor</div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="field">
          <label for="sup-name">Razón Social *</label>
          <input
            id="sup-name"
            class="input"
            value="${a(t.name)}"
            placeholder="Ej. Metalúrgica del Oeste S.A."
            data-draft="supplierDraft"
            data-field="name"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-cuit">CUIT</label>
            <input
              id="sup-cuit"
              class="input"
              value="${a(t.cuit)}"
              data-draft="supplierDraft"
              data-field="cuit"
            />
          </div>
          <div class="field">
            <label for="sup-cat">Rubro principal</label>
            <select
              id="sup-cat"
              class="select"
              data-draft="supplierDraft"
              data-field="category"
            >
              ${n.map(e=>`<option value="${a(e.name)}" ${t.category===e.name?`selected`:``}>${a(e.name)}</option>`).join(``)}
            </select>
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-contact">Ejecutivo de cuenta</label>
            <input
              id="sup-contact"
              class="input"
              value="${a(t.contact)}"
              placeholder="Nombre y Apellido"
              data-draft="supplierDraft"
              data-field="contact"
            />
          </div>
          <div class="field">
            <label for="sup-lead">Lead time (días)</label>
            <input
              id="sup-lead"
              class="input"
              type="number"
              min="1"
              value="${a(t.leadTimeDays)}"
              data-draft="supplierDraft"
              data-field="leadTimeDays"
            />
          </div>
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="sup-email">Email de pedidos</label>
            <input
              id="sup-email"
              class="input"
              type="email"
              value="${a(t.email)}"
              data-draft="supplierDraft"
              data-field="email"
            />
          </div>
          <div class="field">
            <label for="sup-phone">Teléfono</label>
            <input
              id="sup-phone"
              class="input"
              value="${a(t.phone)}"
              data-draft="supplierDraft"
              data-field="phone"
            />
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cancelar
        </button>
        <button type="button" class="btn btn-primary" data-action="save-supplier">
          ${l(`save`,15)} Homologar proveedor
        </button>
      </div>
    </aside>
  </div>`}function g(e){let{branches:t,branchLocation:n,products:r,branchDraft:i}=e;return`<div class="drawer-backdrop" data-action="close-drawer">
    <aside
      class="drawer drawer-wide"
      role="dialog"
      aria-modal="true"
      aria-label="Sedes y Sucursales de Comercial Norte SRL"
      data-stop-propagation="true"
    >
      <div class="drawer-header">
        <div>
          <div class="drawer-title">Sedes y Sucursales — Comercial Norte SRL</div>
          <div style="font-size: 12.5px; color: var(--text-secondary); margin-top: 2px;">
            Visualizá el estado operativo de cada planta o cambiá la sede activa de trabajo.
          </div>
        </div>
        <button type="button" class="icon-btn" data-action="close-drawer" aria-label="Cerrar">
          ${l(`x`,18)}
        </button>
      </div>

      <div class="drawer-body">
        <div class="branches-modal-grid">
          ${t.map(e=>{let t=n===e.name,i=e.name===`Todas las sedes`?r.length:r.filter(t=>t.branch===e.name).length;return`<div class="branch-modal-card ${t?`selected`:``}">
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <div class="kpi-icon tone-blue" style="width: 36px; height: 36px;">
                      ${l(`building2`,18)}
                    </div>
                    <div>
                      <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">
                        ${a(e.name)}
                      </div>
                      <div style="font-size: 12px; color: var(--text-secondary);">
                        ${a(e.city)}
                      </div>
                    </div>
                  </div>
                  <span class="badge ${e.status===`Operativa`?`badge-success`:`badge-warning`}">
                    <span class="badge-dot"></span>
                    ${a(e.status)}
                  </span>
                </div>

                <div style="font-size: 12px; color: var(--text-secondary); display: flex; flex-direction: column; gap: 5px; margin: 10px 0;">
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${l(`mapPin`,13)} ${a(e.address)}
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    ${l(`userCheck`,13)} Responsable: <strong>${a(e.manager)}</strong> · ${a(e.phone)}
                  </div>
                </div>

                <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 10px; border-top: 1px solid var(--border);">
                  <div style="font-size: 12px; color: var(--text-secondary);">
                    <strong class="tabular" style="color: var(--text-primary);">${i} SKUs</strong> · Ocupación ${e.occupancy}%
                  </div>
                  <button
                    type="button"
                    class="btn btn-sm ${t?`btn-primary`:`btn-secondary`}"
                    data-action="select-branch-and-close"
                    data-branch="${a(e.name)}"
                  >
                    ${t?`${l(`checkCircle2`,14)} Sede activa`:`Cambiar a esta sede`}
                  </button>
                </div>
              </div>`}).join(``)}
        </div>

        <div class="panel" style="margin-top: 12px;">
          <div class="panel-header">
            <div>
              <div class="panel-title">Incorporar nueva Sede o Sucursal a la empresa</div>
              <div class="panel-subtitle">
                Habilitá un nuevo centro de distribución o punto de venta dentro de Comercial Norte SRL
              </div>
            </div>
          </div>
          <div class="panel-body">
            <div class="form-grid">
              <div class="field">
                <label>Nombre de la Sede *</label>
                <input
                  class="input"
                  value="${a(i.name)}"
                  placeholder="Ej. Sucursal Oeste (Morón)"
                  data-draft="branchDraft"
                  data-field="name"
                />
              </div>
              <div class="field">
                <label>Ciudad / Zona</label>
                <input
                  class="input"
                  value="${a(i.city)}"
                  placeholder="Ej. Morón, GBA Oeste"
                  data-draft="branchDraft"
                  data-field="city"
                />
              </div>
              <div class="field">
                <label>Dirección operativa</label>
                <input
                  class="input"
                  value="${a(i.address)}"
                  placeholder="Av. Rivadavia 18400"
                  data-draft="branchDraft"
                  data-field="address"
                />
              </div>
              <div class="field">
                <label>Encargado de Sede</label>
                <input
                  class="input"
                  value="${a(i.manager)}"
                  placeholder="Nombre del responsable"
                  data-draft="branchDraft"
                  data-field="manager"
                />
              </div>
            </div>
            <div style="display: flex; justify-content: flex-end; margin-top: 12px;">
              <button type="button" class="btn btn-primary btn-sm" data-action="save-branch">
                ${l(`plus`,14)} Dar de alta sucursal
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="drawer-footer">
        <button type="button" class="btn btn-secondary" data-action="close-drawer">
          Cerrar ventana
        </button>
      </div>
    </aside>
  </div>`}var _={dashboard:`Resumen general`,productos:`Catálogo de productos`,conversion:`Conversión de kits y cajas (Proveedores)`,movimientos:`Movimientos de stock`,categorias:`Categorías y ubicaciones`,proveedores:`Directorio de proveedores`,reportes:`Reportes y analítica`,configuracion:`Configuración del sistema`};function v(e){let{screen:t,globalSearch:n,branchLocation:r,branches:o,products:s,theme:c,sidebarVisible:u,branchMenuOpen:d}=e,f=s.filter(e=>i(e)!==`En stock`).length,p=o.find(e=>e.name===r)||o[0],m=d?`<div class="branch-dropdown-panel" role="listbox" aria-label="Sedes de Comercial Norte SRL">
        <div class="branch-dropdown-head">
          <div>
            <div class="branch-dropdown-title">Sedes de Comercial Norte SRL</div>
            <div class="branch-dropdown-sub">Filtrar inventario o auditar sucursal</div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            data-action="open-branches-drawer"
          >
            Ver detalle
          </button>
        </div>
        <div class="branch-dropdown-list">
          ${o.map(e=>{let t=e.name===r;return`<button
                type="button"
                class="branch-dropdown-item ${t?`active`:``}"
                data-action="select-branch"
                data-branch="${a(e.name)}"
              >
                <div class="branch-item-icon">${l(`building2`,15)}</div>
                <div class="branch-item-info">
                  <div class="branch-item-name">
                    ${a(e.name)}
                    <span class="branch-item-city">${a(e.city)}</span>
                  </div>
                  <div class="branch-item-meta">${a(e.address)} · ${e.warehouses} dep.</div>
                </div>
                <div class="branch-item-right">
                  <span class="branch-occ-pill">${e.occupancy}% ocup.</span>
                  ${t?l(`check`,15):``}
                </div>
              </button>`}).join(``)}
        </div>
        <div class="branch-dropdown-foot">
          <button
            type="button"
            class="btn btn-secondary btn-sm"
            style="width: 100%; justify-content: center;"
            data-action="open-branches-drawer"
          >
            ${l(`mapPin`,14)}
            Administrar Sedes y Sucursales (${o.length-1} activas)
          </button>
        </div>
      </div>`:``;return`<header class="topbar">
    <button
      type="button"
      class="menu-toggle-btn ${u?`active`:``}"
      aria-label="Abrir o cerrar menú de navegación"
      data-action="toggle-sidebar"
      title="${u?`Ocultar menú lateral`:`Desplegar menú de secciones`}"
    >
      ${l(`menu`,18)}
      <span class="menu-toggle-label">Menú</span>
    </button>

    <div class="breadcrumbs">
      <button
        type="button"
        class="branch-Select-trigger"
        data-action="open-branches-drawer"
        title="Ver todas las Sedes y Sucursales de Comercial Norte SRL"
      >
        ${l(`building2`,14)}
        <span>Sedes / Sucursales</span>
      </button>
      ${l(`chevronRight`,14)}
      <div class="branch-dropdown-wrap">
        <button
          type="button"
          class="branch-active-pill"
          data-action="toggle-branch-menu"
          aria-expanded="${d}"
          aria-label="Seleccionar sede o sucursal"
        >
          <span class="branch-dot"></span>
          <span>${a(r)}</span>
          <span class="branch-city-tag">${a(p.city)}</span>
        </button>
        ${m}
      </div>
      ${l(`chevronRight`,14)}
      <strong>${a(_[t]||`Dashboard`)}</strong>
    </div>

    <div class="topbar-search">
      ${l(`search`,16)}
      <input
        id="global-search-input"
        type="search"
         value="${a(n)}"
        placeholder="Buscar por nombre, código SKU o ubicación..."
        aria-label="Buscar productos por nombre o SKU"
        data-input="global-search"
      />
      <span class="kbd-hint">⌘K</span>
    </div>

    <div class="topbar-actions">
      <button
        type="button"
        class="icon-btn"
        aria-label="Cambiar entre modo claro y oscuro"
        title="${c===`dark`?`Cambiar a modo claro`:`Cambiar a modo oscuro`}"
        data-action="toggle-theme"
      >
        ${l(c===`dark`?`sun`:`moon`,18)}
      </button>

      <button
        type="button"
        class="icon-btn"
        aria-label="Ver alertas de stock crítico (${f})"
        title="${f} productos requieren reposición"
        data-action="open-alerts"
      >
        ${l(`bell`,18)}
        ${f>0?`<span class="notif-dot"></span>`:``}
      </button>

      <button
        type="button"
        class="btn btn-secondary"
        data-action="open-import-drawer"
        title="Subir productos masivamente por tabla o CSV"
      >
        ${l(`upload`,16)}
        <span>Carga masiva</span>
      </button>

      <button
        type="button"
        class="btn btn-primary"
        data-action="new-product"
      >
        ${l(`plus`,16)}
        <span>Nuevo producto</span>
      </button>
    </div>
  </header>`}function y(e){let{screen:t,products:n,movements:r,theme:o}=e,s=n.filter(e=>i(e)!==`En stock`).length,c=n.filter(e=>e.sku.startsWith(`KIT-`)).length,u=[{id:`dashboard`,label:`Dashboard`,iconName:`layoutDashboard`},{id:`productos`,label:`Productos`,iconName:`package`,badge:String(n.length),badgeTone:`neutral`},{id:`conversion`,label:`Convertir kits / cajas`,iconName:`boxes`,badge:`Proveedores`,badgeTone:`accent`},{id:`movimientos`,label:`Movimientos`,iconName:`arrowLeftRight`,badge:String(r.length),badgeTone:`neutral`},{id:`categorias`,label:`Categorías`,iconName:`tags`},{id:`proveedores`,label:`Proveedores`,iconName:`truck`},{id:`reportes`,label:`Reportes`,iconName:`barChart3`,badge:s>0?`${s} alertas`:void 0,badgeTone:`warning`}].map(e=>{let n=t===e.id;return`<button
        type="button"
        class="nav-item ${n?`active`:``}"
        data-action="nav-menu"
        data-screen="${e.id}"
        aria-current="${n?`page`:`false`}"
      >
        ${l(e.iconName,18)}
        <span>${a(e.label)}</span>
        ${e.badge?`<span class="nav-badge ${e.badgeTone?`tone-${e.badgeTone}`:``}">${a(e.badge)}</span>`:``}
      </button>`}).join(``);return`<aside class="sidebar" aria-label="Navegación principal">
    <div class="sidebar-brand">
      <div class="brand-mark" aria-hidden="true">S</div>
      <div class="brand-text">
        <div class="brand-name">Stockia</div>
        <div class="brand-sub">Comercial Norte SRL</div>
      </div>
      <button
        type="button"
        class="sidebar-close-btn"
        data-action="hide-sidebar"
        title="Ocultar menú lateral"
        aria-label="Ocultar menú lateral"
      >
        ${l(`panelLeftClose`,16)}
      </button>
    </div>

    <div class="sidebar-quick-stats">
      <div class="quick-stat-pill">
        <span class="quick-stat-dot ok"></span>
        <span>${n.length} SKUs</span>
      </div>
      <div class="quick-stat-pill">
        <span class="quick-stat-dot warn"></span>
        <span>${c} kits prov.</span>
      </div>
    </div>

    <nav class="sidebar-nav">
      <div class="nav-group-label">Operación de almacén</div>
      ${u}

      <div class="nav-group-label">Administración</div>
      <button
        type="button"
        class="nav-item ${t===`configuracion`?`active`:``}"
        data-action="nav-menu"
        data-screen="configuracion"
        aria-current="${t===`configuracion`?`page`:`false`}"
      >
        ${l(`settings`,18)}
        <span>Configuración</span>
      </button>

      <!-- Selector de Modo Claro / Oscuro debajo de Configuración -->
      <div class="sidebar-theme-box" role="group" aria-label="Selector de tema visual">
        <div class="sidebar-theme-header">
          <span class="sidebar-theme-title">
            ${l(o===`dark`?`moon`:`sun`,14)}
            Apariencia de interfaz
          </span>
          <span class="sidebar-theme-status">${o===`dark`?`Oscuro`:`Claro`}</span>
        </div>
        <div class="sidebar-theme-switch">
          <button
            type="button"
            class="theme-option-btn ${o===`light`?`active`:``}"
            data-action="set-theme"
            data-theme="light"
            aria-pressed="${o===`light`}"
          >
            ${l(`sun`,14)}
            <span>Modo claro</span>
          </button>
          <button
            type="button"
            class="theme-option-btn ${o===`dark`?`active`:``}"
            data-action="set-theme"
            data-theme="dark"
            aria-pressed="${o===`dark`}"
          >
            ${l(`moon`,14)}
            <span>Modo oscuro</span>
          </button>
        </div>
      </div>

      <button
        type="button"
        class="nav-item"
        data-action="show-help-toast"
      >
        ${l(`circleHelp`,18)}
        <span>Centro de ayuda</span>
        ${l(`chevronRight`,15)}
      </button>
    </nav>

    <div class="sidebar-footer">
      <div class="user-card">
        <div class="user-avatar" aria-hidden="true">LG</div>
        <div class="user-info">
          <div class="user-name">Lucas Gómez</div>
          <div class="user-role">
            ${l(`userCheck`,12)}
            Jefe de Depósito
          </div>
        </div>
        <button
          type="button"
          class="icon-btn"
          title="Cerrar sesión"
          aria-label="Cerrar sesión"
          data-action="logout"
        >
          ${l(`logOut`,16)}
        </button>
      </div>
    </div>
  </aside>`}var b=[{id:`all`,name:`Todas las sedes`,city:`Consolidado`,address:`Visión global de Comercial Norte SRL`,manager:`Dirección Operativa`,phone:`+54 11 5263-9000`,warehouses:4,occupancy:74,status:`Operativa`},{id:`cd-norte`,name:`CD Norte`,city:`Tigre, GBA Norte`,address:`Av. Constituyentes 4820, Parque Industrial Tigre`,manager:`Martín Pereyra`,phone:`+54 11 4736-1102`,warehouses:2,occupancy:82,status:`Operativa`},{id:`sucursal-centro`,name:`Sucursal Centro`,city:`CABA, Microcentro`,address:`Av. Belgrano 1245, CABA`,manager:`Carolina Méndez`,phone:`+54 11 4381-8890`,warehouses:1,occupancy:68,status:`Operativa`},{id:`deposito-sur`,name:`Depósito Sur`,city:`Avellaneda, GBA Sur`,address:`Camino Gral. Belgrano 2910, Avellaneda`,manager:`Diego Santillán`,phone:`+54 11 4204-5531`,warehouses:1,occupancy:61,status:`En inventario`}],x=[{id:`1`,name:`Taladro Percutor 750W`,subtitle:`Maletín + 5 mechas`,sku:`FER-0428`,category:`Ferretería`,stock:84,minStock:20,unit:`unid.`,cost:48500,price:69900,location:`Depósito Central · Pasillo A-2`,branch:`CD Norte`,updatedAt:`hace 2 h`,icon:`wrench`},{id:`2`,name:`Cable Unipolar 2.5mm (Rollo 100m)`,subtitle:`Normalizado IRAM`,sku:`ELE-1092`,category:`Electricidad`,stock:12,minStock:25,unit:`rollos`,cost:31200,price:44500,location:`Depósito Central · Pasillo B-1`,branch:`CD Norte`,updatedAt:`hace 35 min`,icon:`cable`},{id:`3`,name:`Pintura Látex Interior 20L`,subtitle:`Blanco mate lavable`,sku:`PIN-0215`,category:`Pinturería`,stock:38,minStock:15,unit:`baldes`,cost:52e3,price:78900,location:`Depósito Sur · Sector C`,branch:`Depósito Sur`,updatedAt:`ayer`,icon:`paint`},{id:`4`,name:`Casco de Seguridad Dielectrico`,subtitle:`Arnes a cremallera · Amarillo`,sku:`SEG-0084`,category:`Seguridad Ind.`,stock:0,minStock:30,unit:`unid.`,cost:8900,price:14200,location:`Depósito Central · Pasillo D-4`,branch:`Sucursal Centro`,updatedAt:`hace 3 días`,icon:`headphones`},{id:`5`,name:`Guantes de Nitrilo Pesado (Par)`,subtitle:`Talle L · Antideslizante`,sku:`SEG-0119`,category:`Seguridad Ind.`,stock:6,minStock:40,unit:`pares`,cost:2400,price:4100,location:`Depósito Central · Pasillo D-1`,branch:`Sucursal Centro`,updatedAt:`hace 5 h`,icon:`shirt`},{id:`6`,name:`Llave Térmica Bipolar 2x25A`,subtitle:`Curva C · Riel DIN`,sku:`ELE-0334`,category:`Electricidad`,stock:142,minStock:50,unit:`unid.`,cost:6800,price:10900,location:`Depósito Central · Pasillo B-3`,branch:`CD Norte`,updatedAt:`hace 1 día`,icon:`cable`},{id:`7`,name:`Sellador Poliuretánico 300ml`,subtitle:`Gris · Alta elasticidad`,sku:`CON-0512`,category:`Construcción`,stock:9,minStock:20,unit:`cart.`,cost:7500,price:11800,location:`Depósito Norte · Estante 3`,branch:`CD Norte`,updatedAt:`hace 4 h`,icon:`spray`},{id:`8`,name:`Amoladora Angular 4½" 850W`,subtitle:`11.000 RPM · Uso profesional`,sku:`FER-0811`,category:`Ferretería`,stock:29,minStock:10,unit:`unid.`,cost:42e3,price:62500,location:`Depósito Central · Pasillo A-1`,branch:`Sucursal Centro`,updatedAt:`hace 2 días`,icon:`wrench`},{id:`9`,name:`Cinta Métrica Profesional 8m`,subtitle:`Freno automático · Engomada`,sku:`FER-0190`,category:`Ferretería`,stock:64,minStock:25,unit:`unid.`,cost:5900,price:9400,location:`Depósito Central · Pasillo A-4`,branch:`Depósito Sur`,updatedAt:`hace 6 h`,icon:`coffee`},{id:`10`,name:`Reflector LED Exterior 100W`,subtitle:`IP66 · Luz fría 6500K`,sku:`ELE-0771`,category:`Electricidad`,stock:4,minStock:18,unit:`unid.`,cost:14300,price:22900,location:`Depósito Sur · Sector A`,branch:`Depósito Sur`,updatedAt:`hoy, 09:15`,icon:`lamp`},{id:`11`,name:`Disco de Corte Metal 115mm (Pack x10)`,subtitle:`Espesor 1.0mm · Acero inox`,sku:`FER-0552`,category:`Ferretería`,stock:115,minStock:30,unit:`packs`,cost:8200,price:13500,location:`Depósito Central · Pasillo A-3`,branch:`CD Norte`,updatedAt:`hace 3 días`,icon:`disc`},{id:`12`,name:`Rodillo Antigota Lana Natural 22cm`,subtitle:`Pelo corto · Epoxi y sintéticos`,sku:`PIN-0098`,category:`Pinturería`,stock:51,minStock:20,unit:`unid.`,cost:4100,price:6900,location:`Depósito Sur · Sector C`,branch:`Depósito Sur`,updatedAt:`ayer`,icon:`paint`},{id:`13`,name:`Caja Mayorista Guantes Nitrilo (x24 Pares)`,subtitle:`Bulto cerrado proveedor · Talle L`,sku:`KIT-0119`,category:`Seguridad Ind.`,stock:8,minStock:3,unit:`cajas`,cost:52e3,price:89e3,location:`Depósito Central · Pasillo D-0`,branch:`CD Norte`,updatedAt:`hace 1 h`,icon:`shirt`},{id:`14`,name:`Caja Master Llaves Térmicas 2x25A (x12 Unid.)`,subtitle:`Pack cerrado ElectroSur · Curva C`,sku:`KIT-0334`,category:`Electricidad`,stock:10,minStock:4,unit:`cajas`,cost:76e3,price:118e3,location:`Depósito Central · Pasillo B-0`,branch:`CD Norte`,updatedAt:`hace 3 h`,icon:`cable`},{id:`15`,name:`Kit Obra Soldadura + Discos Inox (Combo)`,subtitle:`Pack promocional ferretería`,sku:`KIT-0552`,category:`Ferretería`,stock:14,minStock:5,unit:`kits`,cost:38e3,price:59e3,location:`Depósito Central · Pasillo A-0`,branch:`Sucursal Centro`,updatedAt:`ayer`,icon:`disc`}],S=[{id:`KIT-R1`,name:`Desarme Caja Mayorista Guantes Nitrilo`,supplier:`SegurMax Industrial`,sourceProductId:`13`,sourceUnitLabel:`Caja cerrada (24 pares)`,targetProductId:`5`,conversionFactor:24,notes:`Abre bulto mayorista del proveedor e ingresa 24 pares individuales al stock de venta.`},{id:`KIT-R2`,name:`Apertura Caja Master Llaves Térmicas 2x25A`,supplier:`ElectroSur Mayorista`,sourceProductId:`14`,sourceUnitLabel:`Caja Master (12 unidades)`,targetProductId:`6`,conversionFactor:12,notes:`Fracciona caja master de proveedor en unidades individuales para mostrador.`},{id:`KIT-R3`,name:`Desglose Kit Obra en Packs de Discos 115mm`,supplier:`Distribuidora Andina S.A.`,sourceProductId:`15`,sourceUnitLabel:`Kit cerrado (5 packs x10)`,targetProductId:`11`,conversionFactor:5,notes:`Separa los packs de discos incluidos en el kit promocional de proveedor.`}],C=[{id:`CAT-01`,name:`Ferretería`,code:`FER`,description:`Herramientas eléctricas, manuales e insumos de corte`,targetMargin:42,location:`Depósito Central · Pasillo A`},{id:`CAT-02`,name:`Electricidad`,code:`ELE`,description:`Cables normalizados, protecciones DIN e iluminación LED`,targetMargin:38,location:`Depósito Central · Pasillo B`},{id:`CAT-03`,name:`Pinturería`,code:`PIN`,description:`Látex interior/exterior, impermeabilizantes y accesorios`,targetMargin:45,location:`Depósito Sur · Sector C`},{id:`CAT-04`,name:`Seguridad Ind.`,code:`SEG`,description:`EPP certificado: cascos, guantes, protección visual y auditiva`,targetMargin:48,location:`Depósito Central · Pasillo D`},{id:`CAT-05`,name:`Construcción`,code:`CON`,description:`Selladores, adhesivos técnicos y fijaciones químicas`,targetMargin:36,location:`Depósito Norte · Estante 3`}],w=[{id:`PRV-01`,name:`Distribuidora Andina S.A.`,cuit:`30-71239481-9`,category:`Ferretería`,contact:`Roberto Gómez`,email:`ventas@andina-ind.com.ar`,phone:`+54 11 4756-2290`,leadTimeDays:3,rating:4.8,active:!0},{id:`PRV-02`,name:`ElectroSur Mayorista`,cuit:`30-68910234-5`,category:`Electricidad`,contact:`Mariana Torres`,email:`pedidos@electrosur.com.ar`,phone:`+54 11 4308-7712`,leadTimeDays:2,rating:4.6,active:!0},{id:`PRV-03`,name:`SegurMax Industrial`,cuit:`30-70998123-1`,category:`Seguridad Ind.`,contact:`Javier Quiroga`,email:`logistica@segurmax.com.ar`,phone:`+54 11 5219-0041`,leadTimeDays:5,rating:4.2,active:!0},{id:`PRV-04`,name:`Química & Pinturas del Plata`,cuit:`33-65441209-9`,category:`Pinturería`,contact:`Lucía Fernández`,email:`comercial@qpplata.com.ar`,phone:`+54 11 4222-8910`,leadTimeDays:4,rating:4.9,active:!0}],T=[{id:`MOV-9042`,date:`18 Abr 2025 · 11:40`,type:`Ingreso`,productId:`1`,productName:`Taladro Percutor 750W`,sku:`FER-0428`,quantity:24,responsible:`M. Pereyra`,reference:`OC #4412 · Distribuidora Andina`,branch:`CD Norte`},{id:`MOV-9041`,date:`18 Abr 2025 · 10:15`,type:`Egreso`,productId:`2`,productName:`Cable Unipolar 2.5mm (Rollo 100m)`,sku:`ELE-1092`,quantity:8,responsible:`L. Gómez`,reference:`Remito #10884 · Obra San Isidro`,branch:`CD Norte`},{id:`MOV-9040`,date:`17 Abr 2025 · 17:30`,type:`Egreso`,productId:`5`,productName:`Guantes de Nitrilo Pesado (Par)`,sku:`SEG-0119`,quantity:18,responsible:`C. Ruiz`,reference:`Pedido Interno · Cuadrilla Mantenimiento`,branch:`Sucursal Centro`},{id:`MOV-9039`,date:`17 Abr 2025 · 15:05`,type:`Ajuste`,productId:`4`,productName:`Casco de Seguridad Dielectrico`,sku:`SEG-0084`,quantity:-2,responsible:`M. Pereyra`,reference:`Baja por rotura en recepción`,branch:`Sucursal Centro`},{id:`MOV-9038`,date:`17 Abr 2025 · 09:20`,type:`Ingreso`,productId:`6`,productName:`Llave Térmica Bipolar 2x25A`,sku:`ELE-0334`,quantity:60,responsible:`A. Silva`,reference:`OC #4409 · ElectroSur Mayorista`,branch:`CD Norte`},{id:`MOV-9037`,date:`16 Abr 2025 · 16:50`,type:`Egreso`,productId:`10`,productName:`Reflector LED Exterior 100W`,sku:`ELE-0771`,quantity:10,responsible:`L. Gómez`,reference:`Remito #10879 · Consorcio Libertador`,branch:`Depósito Sur`},{id:`MOV-9036`,date:`16 Abr 2025 · 14:10`,type:`Transferencia`,productId:`3`,productName:`Pintura Látex Interior 20L`,sku:`PIN-0215`,quantity:12,responsible:`C. Ruiz`,reference:`Traslado Depósito Central → Depósito Sur`,branch:`Depósito Sur`}],E=[{id:`USR-01`,name:`Lucas Gómez`,email:`lgomez@comercialnorte.com.ar`,role:`Jefe de Depósito`,branch:`CD Norte`,lastAccess:`En línea ahora`,enabled:!0},{id:`USR-02`,name:`Martín Pereyra`,email:`mpereyra@comercialnorte.com.ar`,role:`Supervisor Logístico`,branch:`CD Norte`,lastAccess:`hace 25 min`,enabled:!0},{id:`USR-03`,name:`Carolina Méndez`,email:`cmendez@comercialnorte.com.ar`,role:`Encargada de Sucursal`,branch:`Sucursal Centro`,lastAccess:`hace 2 h`,enabled:!0},{id:`USR-04`,name:`Diego Santillán`,email:`dsantillan@comercialnorte.com.ar`,role:`Auditor de Inventario`,branch:`Depósito Sur`,lastAccess:`ayer, 18:40`,enabled:!0},{id:`USR-05`,name:`Valentina Silva`,email:`vsilva@comercialnorte.com.ar`,role:`Operadora de Recepción`,branch:`CD Norte`,lastAccess:`hace 5 días`,enabled:!1}],D=[{name:`Lucas Gómez`,email:`lgomez@comercialnorte.com.ar`,role:`Jefe de Depósito · CD Norte`,initials:`LG`},{name:`Carolina Méndez`,email:`cmendez@comercialnorte.com.ar`,role:`Encargada · Sucursal Centro`,initials:`CM`},{name:`Dirección Operativa`,email:`operaciones@comercialnorte.com.ar`,role:`Administrador General · Todas las sedes`,initials:`DO`}],O={"Todas las sedes":{"30d":[{label:`Sem 1`,ingresos:72,egresos:54},{label:`Sem 2`,ingresos:58,egresos:82},{label:`Sem 3`,ingresos:94,egresos:65},{label:`Sem 4`,ingresos:81,egresos:49},{label:`Sem 5`,ingresos:66,egresos:77},{label:`Actual`,ingresos:88,egresos:61}],"90d":[{label:`Feb Q1`,ingresos:85,egresos:62},{label:`Feb Q2`,ingresos:74,egresos:79},{label:`Mar Q1`,ingresos:91,egresos:71},{label:`Mar Q2`,ingresos:63,egresos:58},{label:`Abr Q1`,ingresos:96,egresos:69},{label:`Abr Q2`,ingresos:88,egresos:61}],"12m":[{label:`Nov`,ingresos:70,egresos:60},{label:`Dic`,ingresos:98,egresos:92},{label:`Ene`,ingresos:55,egresos:48},{label:`Feb`,ingresos:79,egresos:67},{label:`Mar`,ingresos:86,egresos:74},{label:`Abr`,ingresos:88,egresos:61}]},"CD Norte":{"30d":[{label:`Sem 1`,ingresos:84,egresos:52},{label:`Sem 2`,ingresos:65,egresos:74},{label:`Sem 3`,ingresos:96,egresos:61},{label:`Sem 4`,ingresos:79,egresos:45},{label:`Sem 5`,ingresos:71,egresos:68},{label:`Actual`,ingresos:92,egresos:57}],"90d":[{label:`Feb Q1`,ingresos:88,egresos:59},{label:`Feb Q2`,ingresos:76,egresos:72},{label:`Mar Q1`,ingresos:93,egresos:66},{label:`Mar Q2`,ingresos:69,egresos:55},{label:`Abr Q1`,ingresos:95,egresos:63},{label:`Abr Q2`,ingresos:92,egresos:57}],"12m":[{label:`Nov`,ingresos:76,egresos:58},{label:`Dic`,ingresos:99,egresos:88},{label:`Ene`,ingresos:62,egresos:49},{label:`Feb`,ingresos:83,egresos:64},{label:`Mar`,ingresos:89,egresos:70},{label:`Abr`,ingresos:92,egresos:57}]},"Sucursal Centro":{"30d":[{label:`Sem 1`,ingresos:48,egresos:62},{label:`Sem 2`,ingresos:52,egresos:79},{label:`Sem 3`,ingresos:64,egresos:71},{label:`Sem 4`,ingresos:58,egresos:55},{label:`Sem 5`,ingresos:49,egresos:73},{label:`Actual`,ingresos:63,egresos:68}],"90d":[{label:`Feb Q1`,ingresos:55,egresos:64},{label:`Feb Q2`,ingresos:49,egresos:71},{label:`Mar Q1`,ingresos:61,egresos:69},{label:`Mar Q2`,ingresos:52,egresos:60},{label:`Abr Q1`,ingresos:66,egresos:72},{label:`Abr Q2`,ingresos:63,egresos:68}],"12m":[{label:`Nov`,ingresos:58,egresos:62},{label:`Dic`,ingresos:82,egresos:90},{label:`Ene`,ingresos:44,egresos:46},{label:`Feb`,ingresos:56,egresos:65},{label:`Mar`,ingresos:61,egresos:70},{label:`Abr`,ingresos:63,egresos:68}]},"Depósito Sur":{"30d":[{label:`Sem 1`,ingresos:61,egresos:44},{label:`Sem 2`,ingresos:47,egresos:58},{label:`Sem 3`,ingresos:73,egresos:49},{label:`Sem 4`,ingresos:69,egresos:41},{label:`Sem 5`,ingresos:54,egresos:63},{label:`Actual`,ingresos:75,egresos:52}],"90d":[{label:`Feb Q1`,ingresos:68,egresos:50},{label:`Feb Q2`,ingresos:61,egresos:64},{label:`Mar Q1`,ingresos:74,egresos:55},{label:`Mar Q2`,ingresos:57,egresos:48},{label:`Abr Q1`,ingresos:78,egresos:58},{label:`Abr Q2`,ingresos:75,egresos:52}],"12m":[{label:`Nov`,ingresos:60,egresos:52},{label:`Dic`,ingresos:85,egresos:79},{label:`Ene`,ingresos:48,egresos:42},{label:`Feb`,ingresos:67,egresos:58},{label:`Mar`,ingresos:72,egresos:61},{label:`Abr`,ingresos:75,egresos:52}]}},k=[`dashboard`,`productos`,`conversion`,`movimientos`,`categorias`,`proveedores`,`reportes`,`configuracion`];function A(){let e=o(`screen`);return e&&k.includes(e)?e:`dashboard`}function j(){let e=o(`theme`);return e===`dark`||e===`light`?e:window.localStorage.getItem(`stockia_theme`)===`dark`?`dark`:`light`}function M(){return o(`login`)===`1`?!1:o(`screen`)?!0:window.sessionStorage.getItem(`stockia_auth`)===`1`}function ee(){try{let e=window.localStorage.getItem(`stockia_users`);return e?JSON.parse(e):E}catch{return E}}function N(e=`CD Norte`){return[{id:`row-1`,name:`Taladro Inalámbrico 18V Brushless`,sku:`FER-0991`,category:`Ferretería`,branch:e,stock:`24`,minStock:`8`,unit:`unid.`,cost:`64000`,price:`94500`,location:`Depósito Central · Pasillo A-2`},{id:`row-2`,name:`Disyuntor Diferencial 2x40A 30mA`,sku:`ELE-0842`,category:`Electricidad`,branch:`Sucursal Centro`,stock:`36`,minStock:`12`,unit:`unid.`,cost:`19800`,price:`29900`,location:`Depósito Central · Pasillo B-2`},{id:`row-3`,name:`Membrana Líquida Poliuretánica 20L`,sku:`PIN-0410`,category:`Pinturería`,branch:`Depósito Sur`,stock:`15`,minStock:`6`,unit:`baldes`,cost:`58900`,price:`87900`,location:`Depósito Sur · Sector C`}]}var P=j();document.documentElement.dataset.theme=P;var F={authenticated:M(),screen:A(),globalSearch:``,mobileOpen:!1,sidebarVisible:o(`sidebar`)===`open`,branchLocation:o(`branch`)||`Todas las sedes`,theme:P,branchMenuOpen:!1,products:[...x],categories:[...C],suppliers:[...w],movements:[...T],branches:[...b],kitRecipes:[...S],users:ee(),loginState:{email:`lgomez@comercialnorte.com.ar`,password:`••••••••••••`,remember:!0,error:``,googlePickerOpen:!1},dashboardState:{period:`30d`,categoryFilter:`Todas`,statusFilter:`Todos`},productsViewState:{search:``,category:`Todas`,status:`Todos`,sortBy:`name`,page:1,menuRowId:null},conversionState:{selectedRecipeId:S[0]?.id||``,boxesToConvert:1,branch:`CD Norte`,responsible:`L. Gómez`,customMode:!1,customSourceId:`13`,customTargetId:`5`,customFactor:24},movementsViewState:{search:``,typeFilter:`Todos`},settingsState:{company:`Comercial Norte SRL`,cuit:`30-71458920-6`,warehouse:`Depósito Central — Av. Constituyentes 4820, Tigre`,currency:`ARS ($ Peso Argentino)`,criticalThreshold:`25`,emailAlerts:!0,dailyDigest:!0,blockNegativeStock:!0,autoSku:!0,addingUser:!1,newUserName:``,newUserEmail:``,newUserRole:`Operador de Depósito`,newUserBranch:`CD Norte`,currentPassword:``,newPassword:``,confirmPassword:``,showPasswords:!1,passwordSavedMessage:``},drawer:o(`drawer`)===`import`?`import`:null,editingProduct:null,productDraft:{name:``,subtitle:``,sku:``,category:`Ferretería`,stock:`0`,minStock:`10`,unit:`unid.`,cost:`0`,price:`0`,location:`Depósito Central · Pasillo A-1`,branch:`CD Norte`,icon:`wrench`},movementDraft:{type:`Ingreso`,productId:x[0].id,quantity:`10`,responsible:`L. Gómez`,reference:`OC #4418 · Reposición programada`},categoryDraft:{name:``,code:``,description:``,targetMargin:`40`,location:`Depósito Central · Pasillo E`},supplierDraft:{name:``,cuit:`30-71000000-1`,category:`Ferretería`,contact:``,email:``,phone:`+54 11 `,leadTimeDays:`3`},branchDraft:{name:``,city:``,address:``,manager:``,phone:`+54 11 `,warehouses:`1`},bulkImportState:{activeTab:`table`,rows:N(`CD Norte`),csvPreview:[],fileName:``},toast:null},I=new Set,L=null,R={getState(){return F},setState(e){let t=typeof e==`function`?e(F):e;if(t&&typeof t==`object`){if(Object.assign(F,t),`theme`in t&&(document.documentElement.dataset.theme=F.theme,window.localStorage.setItem(`stockia_theme`,F.theme)),`users`in t)try{window.localStorage.setItem(`stockia_users`,JSON.stringify(F.users))}catch{}I.forEach(e=>e(F))}},showToast(e){L&&window.clearTimeout(L),this.setState({toast:e}),L=window.setTimeout(()=>{this.setState({toast:null})},3200)},subscribe(e){return I.add(e),()=>I.delete(e)}};function z(e){let t=new URL(window.location.href);t.searchParams.set(`screen`,e),window.history.pushState({},``,t)}function B(e){z(e),R.setState({screen:e,mobileOpen:!1,branchMenuOpen:!1})}function te(e){z(e),R.setState({screen:e,mobileOpen:!1,sidebarVisible:!1,branchMenuOpen:!1})}function ne(){window.addEventListener(`popstate`,()=>{let e=new URLSearchParams(window.location.search).get(`screen`);e&&R.setState({screen:e})})}function V(e=`Sesión iniciada correctamente`){window.sessionStorage.setItem(`stockia_auth`,`1`),R.setState({authenticated:!0,loginState:{...R.getState().loginState,googlePickerOpen:!1,error:``}}),R.showToast(e)}function re(){window.sessionStorage.removeItem(`stockia_auth`),R.setState({authenticated:!1,mobileOpen:!1,sidebarVisible:!1,branchMenuOpen:!1}),R.showToast(`Sesión finalizada`)}function ie(e){let t=R.getState(),n=t.users.find(t=>t.id===e);if(!n)return;let r=!n.enabled,i=t.users.map(t=>t.id===e?{...t,enabled:r}:t);R.setState({users:i}),R.showToast(r?`Usuario ${n.name} habilitado para operar`:`Acceso de ${n.name} inhabilitado inmediatamente`)}function ae(e,t){let n=R.getState(),r=n.users.find(t=>t.id===e);if(!r)return;let i=n.users.map(n=>n.id===e?{...n,role:t}:n);R.setState({users:i}),R.showToast(`Rol de ${r.name} actualizado a "${t}"`)}function oe(){let e=R.getState(),t=e.settingsState;if(!t.newUserName.trim()||!t.newUserEmail.trim()){R.showToast(`Completá nombre y correo corporativo para dar de alta al usuario`);return}let n={id:`USR-0${e.users.length+1}`,name:t.newUserName.trim(),email:t.newUserEmail.trim().toLowerCase(),role:t.newUserRole,branch:t.newUserBranch,lastAccess:`Recién creado`,enabled:!0};R.setState({users:[...e.users,n],settingsState:{...t,newUserName:``,newUserEmail:``,addingUser:!1}}),R.showToast(`Usuario ${n.name} habilitado en ${n.branch}`)}function se(e){let t=[e.length>=8,/[A-Z]/.test(e),/[0-9]/.test(e),/[^A-Za-z0-9]/.test(e)].filter(Boolean).length;return{score:t,label:e?[`Sin definir`,`Débil`,`Aceptable`,`Segura`,`Muy fuerte`][t]:`Ingresá nueva clave`,color:[`var(--border-strong)`,`var(--danger)`,`var(--warning)`,`var(--info)`,`var(--success)`][t]}}function ce(){let e=R.getState().settingsState;if(!e.currentPassword.trim()){R.showToast(`Ingresá tu contraseña actual para validar tu identidad`);return}if(e.newPassword.length<8){R.showToast(`La nueva contraseña debe tener al menos 8 caracteres`);return}if(e.newPassword!==e.confirmPassword){R.showToast(`La confirmación no coincide con la nueva contraseña`);return}let t=new Date().toLocaleTimeString(`es-AR`,{hour:`2-digit`,minute:`2-digit`});R.setState({settingsState:{...e,currentPassword:``,newPassword:``,confirmPassword:``,passwordSavedMessage:`Contraseña actualizada hoy a las ${t} hs`}}),R.showToast(`Contraseña corporativa actualizada con éxito`)}function le(){let e=R.getState();R.setState({editingProduct:null,productDraft:{name:``,subtitle:``,sku:`FER-0${e.products.length+510}`,category:`Ferretería`,stock:`15`,minStock:`10`,unit:`unid.`,cost:`12500`,price:`19800`,location:`Depósito Central · Pasillo A-1`,branch:e.branchLocation===`Todas las sedes`?`CD Norte`:e.branchLocation,icon:`wrench`},drawer:`product`})}function H(e){let t=R.getState().products.find(t=>t.id===e);t&&R.setState({editingProduct:t,productDraft:{name:t.name,subtitle:t.subtitle,sku:t.sku,category:t.category,stock:String(t.stock),minStock:String(t.minStock),unit:t.unit,cost:String(t.cost),price:String(t.price),location:t.location,branch:t.branch,icon:t.icon},drawer:`product`})}function U(){let e=R.getState(),t=e.productDraft;if(!t.name.trim()){R.showToast(`Ingresá un nombre para el producto`);return}let n={id:e.editingProduct?e.editingProduct.id:String(Date.now()),name:t.name.trim(),subtitle:t.subtitle.trim()||`Especificación estándar`,sku:t.sku.trim().toUpperCase()||`GEN-0001`,category:t.category,stock:Math.max(0,Number(t.stock)||0),minStock:Math.max(0,Number(t.minStock)||0),unit:t.unit.trim()||`unid.`,cost:Math.max(0,Number(t.cost)||0),price:Math.max(0,Number(t.price)||0),location:t.location.trim()||`Depósito Central`,branch:t.branch||`CD Norte`,updatedAt:`ahora mismo`,icon:t.icon},r=e.editingProduct?e.products.map(t=>t.id===e.editingProduct.id?n:t):[n,...e.products];R.setState({products:r,drawer:null}),R.showToast(e.editingProduct?`Producto ${n.sku} actualizado`:`Producto ${n.sku} creado en ${n.branch}`)}function ue(e){let t=R.getState(),n=t.products.find(t=>t.id===e);R.setState({products:t.products.filter(t=>t.id!==e),productsViewState:{...t.productsViewState,menuRowId:null}}),n&&R.showToast(`Se eliminó "${n.name}" del catálogo`)}function de(){let e=R.getState(),t=e.movementDraft,n=e.products.find(e=>e.id===t.productId);if(!n)return;let r=Number(t.quantity)||0;if(r===0){R.showToast(`La cantidad debe ser distinta de cero`);return}let i=t.type===`Egreso`?-Math.abs(r):t.type===`Ingreso`?Math.abs(r):r,a=e.products.map(e=>e.id===n.id?{...e,stock:Math.max(0,e.stock+i),updatedAt:`ahora mismo`}:e),o={id:`MOV-${9043+e.movements.length}`,date:`Hoy · recién registrado`,type:t.type,productId:n.id,productName:n.name,sku:n.sku,quantity:Math.abs(r),responsible:t.responsible.trim()||`L. Gómez`,reference:t.reference.trim()||`Registro manual`,branch:n.branch};R.setState({products:a,movements:[o,...e.movements],drawer:null}),R.showToast(`${t.type} registrado para ${n.sku}`)}function fe(){let e=R.getState(),t=e.categoryDraft;if(!t.name.trim())return;let n={id:`CAT-0${e.categories.length+1}`,name:t.name.trim(),code:(t.code.trim()||t.name.slice(0,3)).toUpperCase(),description:t.description.trim()||`Rubro operativo de almacén`,targetMargin:Number(t.targetMargin)||40,location:t.location.trim()||`Depósito Central`};R.setState({categories:[...e.categories,n],drawer:null}),R.showToast(`Categoría "${n.name}" creada`)}function W(){let e=R.getState(),t=e.supplierDraft;if(!t.name.trim())return;let n={id:`PRV-0${e.suppliers.length+1}`,name:t.name.trim(),cuit:t.cuit.trim(),category:t.category,contact:t.contact.trim()||`Ejecutivo de Cuentas`,email:t.email.trim()||`contacto@proveedor.com.ar`,phone:t.phone.trim(),leadTimeDays:Number(t.leadTimeDays)||3,rating:4.7,active:!0};R.setState({suppliers:[n,...e.suppliers],drawer:null}),R.showToast(`Proveedor "${n.name}" homologado`)}function pe(e){let t=R.getState();R.setState({suppliers:t.suppliers.map(t=>t.id===e?{...t,active:!t.active}:t)}),R.showToast(`Estado de proveedor actualizado`)}function G(e){let t=R.getState(),n=e.map((e,t)=>({...e,id:`IMP-${Date.now()}-${t}`,updatedAt:`importado recién`}));R.setState({products:[...n,...t.products],drawer:null}),R.showToast(`${n.length} productos importados al catálogo general`)}function me(){let e=R.getState(),t=e.conversionState,n=e.kitRecipes.find(e=>e.id===t.selectedRecipeId)||e.kitRecipes[0],r=t.customMode?t.customSourceId:n?.sourceProductId,i=t.customMode?t.customTargetId:n?.targetProductId,a=Math.max(1,t.customMode?Number(t.customFactor)||1:n?.conversionFactor||1),o=Math.max(1,Number(t.boxesToConvert)||1),s=o*a,c=e.products.find(e=>e.id===r),l=e.products.find(e=>e.id===i);if(!c||!l)return;if(r===i){R.showToast(`El producto de origen (caja/kit) y el de destino (unidad) deben ser distintos`);return}if(c.stock<o){R.showToast(`Stock insuficiente de "${c.name}" (${c.stock} disp.). Se requieren ${o}.`);return}let u=e.products.map(e=>e.id===r?{...e,stock:Math.max(0,e.stock-o),updatedAt:`recién convertido`}:e.id===i?{...e,stock:e.stock+s,updatedAt:`recién ingresado por desarme`}:e),d={id:`MOV-${9044+e.movements.length}`,date:`Hoy · conversión kit`,type:`Egreso`,productId:c.id,productName:c.name,sku:c.sku,quantity:o,responsible:t.responsible,reference:`Desarme de ${o} caja(s)/kit(s) → ${s} u. de ${l.sku}`,branch:t.branch},f={id:`MOV-${9045+e.movements.length}`,date:`Hoy · conversión kit`,type:`Ingreso`,productId:l.id,productName:l.name,sku:l.sku,quantity:s,responsible:t.responsible,reference:`Ingreso fraccionado desde ${c.sku} (factor x${a})`,branch:t.branch};R.setState({products:u,movements:[f,d,...e.movements]}),R.showToast(`Conversión exitosa: -${o} ${c.unit} (${c.sku}) → +${s} ${l.unit} (${l.sku})`)}function he(){let e=R.getState(),t=e.branchDraft;if(!t.name.trim()){R.showToast(`Ingresá el nombre de la nueva sede o sucursal`);return}let n={id:`sede-${Date.now()}`,name:t.name.trim(),city:t.city.trim()||`Buenos Aires`,address:t.address.trim()||` Parque Logístico Corporativo`,manager:t.manager.trim()||`Supervisor Asignado`,phone:t.phone.trim()||`+54 11 4000-0000`,warehouses:Math.max(1,Number(t.warehouses)||1),occupancy:45,status:`Operativa`};R.setState({branches:[...e.branches,n],branchLocation:n.name,branchDraft:{name:``,city:``,address:``,manager:``,phone:`+54 11 `,warehouses:`1`}}),R.showToast(`Sucursal "${n.name}" incorporada y seleccionada`)}function ge(e){let{products:t,kitRecipes:i,suppliers:o,branches:s,conversionState:c}=e,u=s.filter(e=>e.id!==`all`),d=i.find(e=>e.id===c.selectedRecipeId)||i[0],f=c.customMode?c.customSourceId:d?.sourceProductId,p=c.customMode?c.customTargetId:d?.targetProductId,m=Math.max(1,c.customMode?Number(c.customFactor)||1:d?.conversionFactor||1),h=Math.max(1,Number(c.boxesToConvert)||1),g=t.find(e=>e.id===f),_=t.find(e=>e.id===p),v=h*m,y=g?Math.round(g.cost/m):0;return`<div class="page">
    <div class="page-header">
      <div>
        <div class="conversion-badge-top">
          ${l(`truck`,14)}
          <span>Módulo de Fraccionamiento Mayorista · Proveedores</span>
        </div>
        <h1 class="page-title">Convertir Kits o Cajas a Unidades</h1>
        <p class="page-subtitle">
          Desglosá cajas master, bultos cerrados o kits promocionales recibidos de proveedores en unidades individuales listas para venta o despacho.
        </p>
      </div>
    </div>

    <div class="conversion-layout">
      <!-- Columna Izquierda: Recetas de Proveedores -->
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Plantillas de conversión por proveedor</div>
            <div class="panel-subtitle">
              Seleccioná una relación de empaque homologada o creá una conversión libre
            </div>
          </div>
          <button
            type="button"
            class="btn btn-sm ${c.customMode?`btn-primary`:`btn-secondary`}"
            data-action="toggle-custom-conversion"
          >
            ${l(`sparkles`,14)}
            ${c.customMode?`Usando modo libre`:`Conversión libre`}
          </button>
        </div>

        <div class="panel-body" style="display: flex; flex-direction: column; gap: 12px;">
          ${i.map(e=>{let n=t.find(t=>t.id===e.sourceProductId),r=t.find(t=>t.id===e.targetProductId);return`<button
                type="button"
                class="recipe-card ${!c.customMode&&e.id===c.selectedRecipeId?`selected`:``}"
                data-action="select-kit-recipe"
                data-recipe-id="${a(e.id)}"
              >
                <div class="recipe-card-top">
                  <span class="recipe-supplier-tag">
                    ${l(`truck`,12)} ${a(e.supplier)}
                  </span>
                  <span class="recipe-factor-pill">1 caja = ${e.conversionFactor} u.</span>
                </div>
                <div class="recipe-title">${a(e.name)}</div>
                <div class="recipe-flow">
                  <div class="recipe-node">
                    <span class="sku-code">${a(n?.sku||`KIT`)}</span>
                    <span>${a(n?.name||`Caja proveedor`)}</span>
                    <strong class="tabular">Disp: ${n?.stock??0} ${a(n?.unit||`cajas`)}</strong>
                  </div>
                  ${l(`arrowRight`,16)}
                  <div class="recipe-node">
                    <span class="sku-code">${a(r?.sku||`UNI`)}</span>
                    <span>${a(r?.name||`Unidad venta`)}</span>
                    <strong class="tabular">Actual: ${r?.stock??0} ${a(r?.unit||`u.`)}</strong>
                  </div>
                </div>
                <div class="recipe-notes">${a(e.notes)}</div>
              </button>`}).join(``)}
        </div>
      </section>

      <!-- Columna Derecha: Simulador y Ejecución de Conversión -->
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Ejecutar desarme e impacto en stock</div>
            <div class="panel-subtitle">
              Se generará un movimiento de salida del bulto mayorista y un ingreso automático de unidades
            </div>
          </div>
        </div>

        <div class="panel-body" style="display: flex; flex-direction: column; gap: 16px;">
          ${c.customMode?`<div class="form-grid">
                  <div class="field">
                    <label>Producto Origen (Caja / Kit Proveedor)</label>
                    <select
                      class="select"
                      data-conversion-input="customSourceId"
                    >
                      ${t.map(e=>`<option value="${a(e.id)}" ${c.customSourceId===e.id?`selected`:``}>${a(e.sku)} · ${a(e.name)} (${e.stock} ${a(e.unit)})</option>`).join(``)}
                    </select>
                  </div>
                  <div class="field">
                    <label>Producto Destino (Unidad fraccionada)</label>
                    <select
                      class="select"
                      data-conversion-input="customTargetId"
                    >
                      ${t.map(e=>`<option value="${a(e.id)}" ${c.customTargetId===e.id?`selected`:``}>${a(e.sku)} · ${a(e.name)} (${e.stock} ${a(e.unit)})</option>`).join(``)}
                    </select>
                  </div>
                </div>`:``}

          <div class="form-grid">
            <div class="field">
              <label for="conv-qty">Cantidad de cajas / kits a abrir</label>
              <input
                id="conv-qty"
                class="input tabular"
                type="number"
                min="1"
                max="100"
                value="${h}"
                data-conversion-input="boxesToConvert"
              />
            </div>

            <div class="field">
              <label for="conv-factor">Unidades contenidas por caja (Factor)</label>
              <input
                id="conv-factor"
                class="input tabular"
                type="number"
                min="1"
                value="${m}"
                data-conversion-input="customFactor"
                ${c.customMode?``:`disabled`}
              />
            </div>
          </div>

          <div class="form-grid">
            <div class="field">
              <label for="conv-branch">Sede donde se realiza el fraccionamiento</label>
              <select
                id="conv-branch"
                class="select"
                data-conversion-input="branch"
              >
                ${u.map(e=>`<option value="${a(e.name)}" ${c.branch===e.name?`selected`:``}>${a(e.name)} — ${a(e.city)}</option>`).join(``)}
              </select>
            </div>

            <div class="field">
              <label for="conv-resp">Operador responsable</label>
              <input
                id="conv-resp"
                class="input"
                value="${a(c.responsible)}"
                data-conversion-input="responsible"
              />
            </div>
          </div>

          <!-- Previsualización del Impacto -->
          <div class="conversion-preview-box">
            <div class="conversion-preview-col">
              <span class="conversion-preview-label">Baja de Bulto Cerrado</span>
              <div class="conversion-preview-name">${a(g?.name||`—`)}</div>
              <div class="conversion-preview-math danger tabular">
                Stock: ${g?.stock??0} → ${Math.max(0,(g?.stock??0)-h)} ${a(g?.unit||``)} (-${h})
              </div>
            </div>

            <div class="conversion-preview-arrow">
              ${l(`boxes`,20)}
              <span>x${m}</span>
            </div>

            <div class="conversion-preview-col">
              <span class="conversion-preview-label">Alta de Unidades Individuales</span>
              <div class="conversion-preview-name">${a(_?.name||`—`)}</div>
              <div class="conversion-preview-math success tabular">
                Stock: ${_?.stock??0} → ${(_?.stock??0)+v} ${a(_?.unit||``)} (+${n(v)})
              </div>
            </div>
          </div>

          <div class="conversion-cost-note">
            ${l(`packageCheck`,16)}
            <span>
              Costo unitario resultante por unidad desglosada: <strong>${r(y)}</strong> (calculado sobre costo de caja ${r(g?.cost||0)}). Proveedores activos vinculados: ${o.filter(e=>e.active).length}.
            </span>
          </div>

          <button
            type="button"
            class="btn btn-primary"
            style="width: 100%; justify-content: center; height: 42px;"
            data-action="execute-kit-conversion"
          >
            ${l(`checkCircle2`,16)}
            Confirmar conversión (+${n(v)} ${a(_?.unit||`unidades`)})
          </button>
        </div>
      </section>
    </div>
  </div>`}function K({columns:e,rows:t,emptyTitle:n=`No se encontraron registros`,emptyDescription:r=`Probá ajustando los filtros activos o limpiando la búsqueda para volver a ver resultados.`,emptyActionAction:i=``,emptyActionLabel:o=`Restablecer filtros`}){return!t||t.length===0?`<div class="empty-state">
      <div class="empty-icon">${l(`packageSearch`,22)}</div>
      <div class="empty-title">${a(n)}</div>
      <p class="empty-desc">${a(r)}</p>
      ${i?`<button type="button" class="btn btn-secondary" data-action="${a(i)}">${a(o)}</button>`:``}
    </div>`:`<div class="table-scroll">
    <table class="data-table">
      <thead>
        <tr>${e.map(e=>`<th class="${e.align===`right`?`align-right`:``}">${a(e.header)}</th>`).join(``)}</tr>
      </thead>
      <tbody>${t.map(t=>`<tr>${e.map(e=>`<td class="${e.align===`right`?`align-right`:``}">${e.render(t)}</td>`).join(``)}</tr>`).join(``)}</tbody>
    </table>
  </div>`}function q({label:e,value:t,delta:n,deltaTone:r=`up`,footnote:i,iconHtml:o,tone:s=`blue`}){let c=r===`up`?`delta-up`:r===`down`?`delta-down`:`delta-warn`;return`<article class="kpi-card">
    <div class="kpi-top">
      <span class="kpi-label">${a(e)}</span>
      <div class="kpi-icon tone-${s}" aria-hidden="true">${o}</div>
    </div>
    <div class="kpi-value tabular">${a(t)}</div>
    <div class="kpi-foot">
      <span class="kpi-delta ${c}">${a(n)}</span>
      <span>${a(i)}</span>
    </div>
  </article>`}var _e={"En stock":`badge-success`,"Stock bajo":`badge-warning`,"Sin stock":`badge-danger`,Ingreso:`badge-success`,Egreso:`badge-danger`,Ajuste:`badge-warning`,Transferencia:`badge-info`};function J(e){return`<span class="badge ${_e[e]||`badge-neutral`}">
    <span class="badge-dot"></span>
    ${a(e)}
  </span>`}function Y(e){return l({wrench:`wrench`,cable:`cable`,paint:`paint`,headphones:`headphones`,shirt:`shirt`,spray:`spray`,coffee:`coffee`,lamp:`lamp`,disc:`disc`}[e]||`package`,16)}function X(e){let{products:t,movements:o,branches:s,globalSearch:c,branchLocation:u,dashboardState:d}=e,{period:f,categoryFilter:p,statusFilter:m}=d,h=u===`Todas las sedes`,g=s.filter(e=>e.id!==`all`),_=s.find(e=>e.name===u)||s[0],v=h?t:t.filter(e=>e.branch===u),y=h?o:o.filter(e=>e.branch===u),b=v.reduce((e,t)=>e+t.stock,0),x=v.reduce((e,t)=>e+t.stock*t.cost,0),S=v.filter(e=>i(e)!==`En stock`),C=v.filter(e=>e.stock===0).length,w=g.map(e=>{let n=t.filter(t=>t.branch===e.name),r=n.reduce((e,t)=>e+t.stock,0),a=n.reduce((e,t)=>e+t.stock*t.cost,0),o=n.filter(e=>i(e)!==`En stock`).length;return{...e,skuCount:n.length,units:r,value:a,alerts:o}}),T=[`Todas`,...Array.from(new Set(t.map(e=>e.category)))],E=v.filter(e=>{let t=c.trim().toLowerCase(),n=!t||e.name.toLowerCase().includes(t)||e.sku.toLowerCase().includes(t)||e.location.toLowerCase().includes(t),r=p===`Todas`||e.category===p,a=i(e);return n&&r&&(m===`Todos`||a===m)}),D=O[u]||O[`Todas las sedes`],k=D[f]||D[`30d`],A=[{key:`product`,header:`Producto`,render:e=>`<div class="product-cell">
        <div class="product-thumb">${Y(e.icon)}</div>
        <div>
          <div class="product-name">${a(e.name)}</div>
          <div class="product-sub">${a(e.subtitle)} · ${a(e.location)}</div>
        </div>
      </div>`},{key:`sku`,header:`SKU`,render:e=>`<span class="sku-code">${a(e.sku)}</span>`},{key:`branch`,header:`Sede / Sucursal`,render:e=>`<span class="branch-table-tag">
        ${l(`building2`,12)}
        ${a(e.branch)}
      </span>`},{key:`category`,header:`Categoría`,render:e=>a(e.category)},{key:`stock`,header:`Existencia`,align:`right`,render:e=>{let t=Math.min(100,Math.round(e.stock/Math.max(e.minStock*2,1)*100)),r=e.stock===0?`var(--danger)`:e.stock<=e.minStock?`var(--warning)`:`var(--success)`;return`<div class="stock-cell" style="align-items: flex-end;">
          <div class="stock-num tabular">
            ${n(e.stock)} <span style="color: var(--text-tertiary); font-weight: 400;">${a(e.unit)}</span>
          </div>
          <div class="stock-bar-track">
            <div class="stock-bar-fill" style="width: ${t}%; background: ${r};"></div>
          </div>
        </div>`}},{key:`price`,header:`Precio venta`,align:`right`,render:e=>`<span class="tabular" style="font-weight: 600;">${r(e.price)}</span>`},{key:`status`,header:`Estado`,render:e=>J(i(e))}],j=`<div class="kpi-grid">
    ${q({label:h?`Artículos consolidados (3 sedes)`:`Artículos en ${u}`,value:`${n(v.length)} SKUs`,delta:`${n(b)} u.`,deltaTone:`up`,footnote:h?`existencias sumadas en toda la empresa`:`unidades alojadas en ${u}`,iconHtml:l(`package`,18),tone:`blue`})}
    ${q({label:`Alertas de reposición`,value:`${S.length} ítems`,delta:`${C} sin stock`,deltaTone:S.length>0?`warn`:`up`,footnote:h?`en todas las sucursales`:`debajo del mínimo en ${u}`,iconHtml:l(`triangleAlert`,18),tone:`amber`})}
    ${q({label:h?`Valorización total empresa`:`Valorización ${u}`,value:r(x),delta:h?`100% global`:`${_.occupancy}% ocup.`,deltaTone:`up`,footnote:`costo promedio ponderado`,iconHtml:l(`circleDollarSign`,18),tone:`green`})}
    ${q({label:`Movimientos auditados`,value:`${y.length} reg.`,delta:h?`3 plantas`:u,deltaTone:`up`,footnote:`ingresos, egresos y desarmes`,iconHtml:l(`activity`,18),tone:`blue`})}
  </div>`,M=h?`<div class="branch-overview-grid">
        ${w.map(e=>`<article class="branch-overview-card">
              <div class="branch-overview-head">
                <div style="display: flex; align-items: center; gap: 10px;">
                  <div class="kpi-icon tone-blue" style="width: 34px; height: 34px;">
                    ${l(`building2`,17)}
                  </div>
                  <div>
                    <div class="branch-overview-title">${a(e.name)}</div>
                    <div class="branch-overview-city">${a(e.city)} · ${a(e.manager)}</div>
                  </div>
                </div>
                <span class="badge ${e.status===`Operativa`?`badge-success`:`badge-warning`}">
                  <span class="badge-dot"></span>
                  ${a(e.status)}
                </span>
              </div>

              <div class="branch-overview-metrics">
                <div>
                  <span class="lbl">Catálogo</span>
                  <strong class="tabular">${e.skuCount} SKUs (${n(e.units)} u.)</strong>
                </div>
                <div>
                  <span class="lbl">Valorización</span>
                  <strong class="tabular">${r(e.value)}</strong>
                </div>
                <div>
                  <span class="lbl">Alertas</span>
                  <strong class="tabular" style="color: ${e.alerts>0?`var(--warning-text)`:`var(--success-text)`};">${e.alerts} críticas</strong>
                </div>
              </div>

              <div class="branch-overview-foot">
                <span style="font-size: 11.5px; color: var(--text-tertiary);">
                  ${l(`mapPin`,12)} ${a(e.address)}
                </span>
                <button
                  type="button"
                  class="btn btn-secondary btn-sm"
                  data-action="select-branch"
                  data-branch="${a(e.name)}"
                >
                  Inspeccionar sede ${l(`arrowRight`,13)}
                </button>
              </div>
            </article>`).join(``)}
      </div>`:`<div class="branch-single-banner">
        <div style="display: flex; align-items: center; gap: 12px;">
          <div class="kpi-icon tone-blue">${l(`building2`,18)}</div>
          <div>
            <div style="font-weight: 700; font-size: 14px; color: var(--text-primary);">
              Estás visualizando únicamente: ${a(_.name)} (${a(_.city)})
            </div>
            <div style="font-size: 12.5px; color: var(--text-secondary);">
              Dirección: ${a(_.address)} · Encargado: <strong>${a(_.manager)}</strong> (${a(_.phone)}) · Ocupación de nave: <strong>${_.occupancy}%</strong>
            </div>
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="select-branch"
          data-branch="Todas las sedes"
        >
          ${l(`rotateCcw`,13)} Volver al resumen de todas las sedes
        </button>
      </div>`;return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">
          ${h?`Resumen General — Todas las Sedes`:`Panel Operativo — ${a(u)}`}
        </h1>
        <p class="page-subtitle">
          ${h?`Consolidado corporativo en tiempo real de Comercial Norte SRL. Usá el filtro de sucursales para inspeccionar cada sede de manera individual.`:`Vista individual filtrada para ${a(u)} (${a(_.city)}) · Responsable: ${a(_.manager)}.`}
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="nav"
          data-screen="conversion"
        >
          ${l(`boxes`,15)}
          <span>Convertir kits / cajas</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-action="open-import-drawer"
        >
          ${l(`upload`,15)}
          <span>Carga masiva</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-movement-drawer"
        >
          ${l(`arrowUpRight`,16)}
          <span>Registrar movimiento</span>
        </button>
      </div>
    </div>

    <!-- Barra de Filtro de Sedes / Sucursales -->
    <section class="branch-switcher-bar" aria-label="Filtro de visualización por sucursal">
      <div class="branch-switcher-label">
        ${l(`building2`,16)}
        <div>
          <strong>Visualización por Sede / Sucursal</strong>
          <span>Alterná entre el consolidado general de la empresa o el detalle individual de cada planta</span>
        </div>
      </div>

      <div class="branch-pills-group" role="tablist">
        ${s.map(e=>{let n=u===e.name,r=e.name===`Todas las sedes`?t.length:t.filter(t=>t.branch===e.name).length;return`<button
              type="button"
              role="tab"
              aria-selected="${n}"
              class="branch-filter-pill ${n?`active`:``}"
              data-action="select-branch"
              data-branch="${a(e.name)}"
            >
              <span>${a(e.name)}</span>
              <span class="branch-pill-count tabular">${r}</span>
            </button>`}).join(``)}
      </div>
    </section>

    ${j}
    ${M}

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">
              Flujo de inventario — ${a(u)}
            </div>
            <div class="panel-subtitle">
              Comparativa de unidades recepcionadas vs. despachadas (${h?`consolidado 3 sedes`:a(u)})
            </div>
          </div>
          <div style="display: flex; align-items: center; gap: 12px;">
            <div class="chart-legend">
              <span><i class="legend-swatch" style="background: var(--accent);"></i>Ingresos</span>
              <span><i class="legend-swatch" style="background: var(--border-strong);"></i>Egresos</span>
            </div>
            <div class="segmented" role="tablist" aria-label="Período del gráfico">
              <button
                type="button"
                class="seg-btn ${f===`30d`?`active`:``}"
                data-action="set-dashboard-period"
                data-period="30d"
              >30 días</button>
              <button
                type="button"
                class="seg-btn ${f===`90d`?`active`:``}"
                data-action="set-dashboard-period"
                data-period="90d"
              >90 días</button>
              <button
                type="button"
                class="seg-btn ${f===`12m`?`active`:``}"
                data-action="set-dashboard-period"
                data-period="12m"
              >12 meses</button>
            </div>
          </div>
        </div>
        <div class="panel-body">
          <div class="bar-chart">
            ${k.map(e=>`<div class="bar-col">
                  <div class="bar-pair">
                    <div
                      class="bar in"
                      style="height: ${e.ingresos}%;"
                      title="Ingresos: ${e.ingresos} u."
                    ></div>
                    <div
                      class="bar out"
                      style="height: ${e.egresos}%;"
                      title="Egresos: ${e.egresos} u."
                    ></div>
                  </div>
                  <span class="bar-label">${a(e.label)}</span>
                </div>`).join(``)}
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Actividad reciente</div>
            <div class="panel-subtitle">
              ${h?`Últimos movimientos en todas las sedes`:`Movimientos registrados en ${a(u)}`}
            </div>
          </div>
          <button
            type="button"
            class="btn btn-ghost btn-sm"
            data-action="nav"
            data-screen="movimientos"
          >
            Ver historial
          </button>
        </div>
        <div class="panel-body" style="padding-top: 8px; padding-bottom: 8px;">
          <div class="feed-list">
            ${y.slice(0,5).map(e=>`<div class="feed-item">
                  <div
                    class="feed-icon"
                    style="background: ${e.type===`Ingreso`?`var(--success-bg)`:`var(--surface-muted)`}; color: ${e.type===`Ingreso`?`var(--success-text)`:`var(--text-secondary)`};"
                  >
                    ${e.type===`Ingreso`?l(`arrowDownLeft`,16):l(`arrowUpRight`,16)}
                  </div>
                  <div class="feed-content">
                    <div class="feed-title">
                      ${a(e.type)} · ${a(e.productName)}
                    </div>
                    <div class="feed-meta">
                      ${a(e.reference)} · <strong>${a(e.branch)}</strong> · ${a(e.date)}
                    </div>
                  </div>
                  <div
                    class="feed-qty tabular"
                    style="color: ${e.type===`Ingreso`?`var(--success-text)`:`var(--text-primary)`};"
                  >
                    ${e.type===`Ingreso`?`+`:`-`}${Math.abs(e.quantity)}
                  </div>
                </div>`).join(``)}
          </div>
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title">
            Control de existencias (${h?`Consolidado General`:a(u)})
          </div>
          <div class="panel-subtitle">
            Mostrando ${E.length} de ${v.length} productos en ${a(u)}
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="nav"
          data-screen="productos"
        >
          Abrir catálogo completo
        </button>
      </div>

      <div class="toolbar">
        <div class="toolbar-left">
          ${l(`filter`,15)}
          <select
            class="select"
            aria-label="Filtrar por categoría"
            data-action="set-dashboard-category"
          >
            ${T.map(e=>`<option value="${a(e)}" ${p===e?`selected`:``}>${e===`Todas`?`Todas las categorías`:a(e)}</option>`).join(``)}
          </select>

          <select
            class="select"
            aria-label="Filtrar por estado de stock"
            data-action="set-dashboard-status"
          >
            <option value="Todos" ${m===`Todos`?`selected`:``}>Todos los estados</option>
            <option value="En stock" ${m===`En stock`?`selected`:``}>En stock</option>
            <option value="Stock bajo" ${m===`Stock bajo`?`selected`:``}>Stock bajo</option>
            <option value="Sin stock" ${m===`Sin stock`?`selected`:``}>Sin stock</option>
          </select>
        </div>

        <div class="toolbar-right">
          ${p!==`Todas`||m!==`Todos`||!h?`<button
                  type="button"
                  class="btn btn-ghost btn-sm"
                  data-action="reset-dashboard-filters"
                >
                  Restablecer vista general
                </button>`:``}
        </div>
      </div>

      ${K({columns:A,rows:E.slice(0,8),emptyActionAction:`reset-dashboard-filters`})}
    </section>
  </div>`}function ve(e){let{categories:t,products:i}=e,o=t.map(e=>{let t=i.filter(t=>t.category===e.name),o=t.reduce((e,t)=>e+t.stock,0),s=t.reduce((e,t)=>e+t.stock*t.cost,0);return`<article class="entity-card">
        <div class="entity-head">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="kpi-icon tone-blue">${l(`tags`,18)}</div>
            <div>
              <div class="entity-title">${a(e.name)}</div>
              <div class="entity-sub">Prefijo SKU: ${a(e.code)}</div>
            </div>
          </div>
          <span class="badge badge-info">Margen ${e.targetMargin}%</span>
        </div>

        <p style="font-size: 12.5px; color: var(--text-secondary); line-height: 1.45;">
          ${a(e.description)}
        </p>

        <div class="entity-meta">
          <div style="display: flex; align-items: center; gap: 6px;">
            ${l(`mapPin`,13)}
            <span>${a(e.location)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; padding-top: 6px; border-top: 1px solid var(--border); color: var(--text-primary); font-weight: 600;">
            <span>${t.length} productos (${n(o)} u.)</span>
            <span class="tabular">${r(s)}</span>
          </div>
        </div>
      </article>`}).join(``);return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Categorías y sectores</h1>
        <p class="page-subtitle">
          Estructura de rubros, márgenes comerciales objetivo y asignación de pasillos físicos.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-category-drawer"
        >
          ${l(`plus`,16)}
          <span>Nueva categoría</span>
        </button>
      </div>
    </div>

    <div class="cards-grid">${o}</div>
  </div>`}function ye(e){let{suppliers:t}=e,n=t.map(e=>`<article class="entity-card">
        <div class="entity-head">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div class="kpi-icon tone-green">${l(`truck`,18)}</div>
            <div>
              <div class="entity-title">${a(e.name)}</div>
              <div class="entity-sub">CUIT ${a(e.cuit)} · Rubro ${a(e.category)}</div>
            </div>
          </div>
          <button
            type="button"
            class="badge ${e.active?`badge-success`:`badge-neutral`}"
            style="cursor: pointer;"
            title="Clic para alternar estado activo"
            data-action="toggle-supplier-active"
            data-supplier-id="${a(e.id)}"
          >
            <span class="badge-dot"></span>
            ${e.active?`Activo`:`Pausado`}
          </button>
        </div>

        <div class="entity-meta">
          <div style="display: flex; align-items: center; gap: 8px;">
            ${l(`mail`,13)}
            <span>${a(e.contact)} · ${a(e.email)}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            ${l(`phone`,13)}
            <span>${a(e.phone)}</span>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 8px; border-top: 1px solid var(--border);">
            <span style="display: inline-flex; align-items: center; gap: 5px; font-weight: 600; color: var(--text-primary);">
              ${l(`clock3`,13)} Lead time: ${e.leadTimeDays} días
            </span>
            <span class="sku-code">SLA ★ ${e.rating.toFixed(1)}</span>
          </div>
        </div>
      </article>`).join(``);return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Proveedores homologados</h1>
        <p class="page-subtitle">
          Directorio de abastecimiento, tiempos de entrega promedio (Lead Time) y contactos comerciales.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-supplier-drawer"
        >
          ${l(`plus`,16)}
          <span>Nuevo proveedor</span>
        </button>
      </div>
    </div>

    <div class="cards-grid">${n}</div>
  </div>`}function be(e){let{email:t,password:n,remember:r,error:i,googlePickerOpen:o}=e.loginState,s=o?`<div class="google-account-picker" role="region" aria-label="Selector de cuentas de Google Workspace">
        <div class="google-picker-head">
          <div>
            <strong>Seleccioná una cuenta corporativa</strong>
            <small>Google Workspace</small>
          </div>
          <button
            type="button"
            class="small-icon"
            aria-label="Cerrar selector de cuentas"
            data-action="toggle-google-picker"
          >
            ${l(`x`,16)}
          </button>
        </div>
        <div class="google-picker-list">
          ${D.map(e=>`<button
                type="button"
                class="google-account-item"
                data-action="google-login-account"
                data-account-name="${a(e.name)}"
                data-account-email="${a(e.email)}"
              >
                <div class="google-account-avatar">${a(e.initials)}</div>
                <div class="google-account-info">
                  <strong>${a(e.name)}</strong>
                  <span>${a(e.email)}</span>
                  <small>${a(e.role)}</small>
                </div>
              </button>`).join(``)}
        </div>
        <div class="google-picker-foot">${l(`shieldCheck`,13)} <span>Acceso corporativo</span></div>
      </div>`:``;return`<div class="login-screen">
    <section class="login-rail">
      <div class="login-brand">
        <div class="brand-mark">
          <i></i><i></i><i></i>
        </div>
        <div class="brand-copy">
          <strong>Stockia</strong>
          <small>Gestión de Inventarios · v2.4</small>
        </div>
      </div>

      <div class="login-product">
        <div class="login-overline">
          ${l(`shieldCheck`,14)}
          Operación multi-sede en tiempo real
        </div>
        <h1>Control total de tu inventario, sin planillas dispersas.</h1>
        <p>
          Centralizá productos, lotes mayoristas de proveedores, puntos de pedido críticos y
          movimientos entre depósitos desde una única consola operativa.
        </p>

        <div class="login-metrics-strip">
          <div>
            <strong>99,4%</strong>
            <span>Exactitud de conteo físico</span>
          </div>
          <div>
            <strong>-38%</strong>
            <span>Quiebres de stock mensuales</span>
          </div>
          <div>
            <strong>3 sedes</strong>
            <span>Sincronizadas en línea</span>
          </div>
        </div>
      </div>
    </section>

    <main class="login-main">
      <form class="login-card login-form" data-form="login" novalidate>
        <div class="login-heading">
          <div class="login-lock">${l(`lockKeyhole`,18)}</div>
          <h2>Iniciar sesión en Stockia</h2>
          <p>Accedé con tu cuenta corporativa de Google Workspace o con tus credenciales de operador.</p>
        </div>

        <div class="google-auth-box">
          <button
            type="button"
            class="google-login"
            data-action="toggle-google-picker"
          >
            <span class="google-icon-wrap">${l(`googleLogo`,18)}</span>
            <span class="google-btn-copy">
              <strong>Continuar con Google Workspace</strong>
            </span>
            <span class="google-badge">SSO</span>
          </button>

          ${s}
        </div>

        <div class="login-divider"><span></span>o ingresá con correo corporativo<span></span></div>

        <label class="login-field" for="login-email">
          Correo corporativo
          <div>
          <input
            id="login-email"
            type="email"
            value="${a(t)}"
            placeholder="nombre@empresa.com.ar"
            data-login-input="email"
            required
          />
          </div>
        </label>

        <label class="login-field" for="login-password">
          Contraseña
          <div>
            <input
              id="login-password"
              type="password"
              value="${a(n)}"
              data-login-input="password"
              required
            />
          </div>
        </label>

        ${i?`<div class="login-error">${a(i)}</div>`:``}

        <div class="login-options">
          <label>
            <input
              type="checkbox"
              ${r?`checked`:``}
              data-login-checkbox="remember"
            />
            Mantener turno activo en este puesto
          </label>
          <button type="button" data-action="forgot-password-toast">¿Olvidaste tu clave?</button>
        </div>

        <button type="submit" class="button button-primary login-submit">
          Ingresar al panel operativo
          ${l(`arrowRight`,16)}
        </button>

        <div class="login-demo-note">
          <span>${l(`lockKeyhole`,13)} Conexión cifrada TLS 1.3</span>
          <span>·</span>
          <span>${l(`fingerprint`,13)} OAuth 2.0 / Google Workspace</span>
        </div>
      </form>
    </main>
  </div>`}function xe(e){let{movements:t,movementsViewState:r}=e,{search:i,typeFilter:o}=r,s=t.filter(e=>{let t=i.trim().toLowerCase(),n=!t||e.productName.toLowerCase().includes(t)||e.sku.toLowerCase().includes(t)||e.reference.toLowerCase().includes(t)||e.responsible.toLowerCase().includes(t),r=o===`Todos`||e.type===o;return n&&r}),c=t.filter(e=>e.type===`Ingreso`).reduce((e,t)=>e+t.quantity,0),u=t.filter(e=>e.type===`Egreso`).reduce((e,t)=>e+t.quantity,0);return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Historial de movimientos</h1>
        <p class="page-subtitle">
          Trazabilidad completa de recepciones de compra, despachos a obra, ajustes y transferencias.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="export-movements-toast"
        >
          ${l(`download`,15)}
          <span>Exportar bitácora</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="open-movement-drawer"
        >
          ${l(`plus`,16)}
          <span>Registrar movimiento</span>
        </button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Unidades ingresadas (mes)</span>
          <div class="kpi-icon tone-green">${l(`arrowDownLeft`,18)}</div>
        </div>
        <div class="kpi-value tabular">+${n(c)} u.</div>
        <div class="kpi-foot">Recepciones verificadas por calidad</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Unidades despachadas (mes)</span>
          <div class="kpi-icon tone-amber">${l(`arrowUpRight`,18)}</div>
        </div>
        <div class="kpi-value tabular">-${n(u)} u.</div>
        <div class="kpi-foot">Órdenes de salida y entregas</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Transferencias entre sedes</span>
          <div class="kpi-icon tone-blue">${l(`rotateCcw`,18)}</div>
        </div>
        <div class="kpi-value tabular">
          ${t.filter(e=>e.type===`Transferencia`).length} envíos
        </div>
        <div class="kpi-foot">Sin discrepancias de recepción</div>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <div style="position: relative; width: 280px;">
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); display: inline-flex;">
              ${l(`search`,15)}
            </span>
            <input
              id="movements-search-input"
              class="input"
              style="padding-left: 32px;"
              value="${a(i)}"
              placeholder="Buscar por producto, remito o responsable..."
              aria-label="Buscar movimiento"
              data-input="movements-search"
            />
          </div>

          <div class="segmented" role="tablist" aria-label="Tipo de movimiento">
            ${[`Todos`,`Ingreso`,`Egreso`,`Ajuste`,`Transferencia`].map(e=>`<button
                    type="button"
                    class="seg-btn ${o===e?`active`:``}"
                    data-action="set-movements-type"
                    data-mov-filter="${e}"
                  >${e}</button>`).join(``)}
          </div>
        </div>
      </div>

      ${K({columns:[{key:`id`,header:`Operación`,render:e=>`<span class="sku-code">${a(e.id)}</span>`},{key:`date`,header:`Fecha y hora`,render:e=>`<span style="color: var(--text-secondary); font-size: 12.5px;">${a(e.date)}</span>`},{key:`type`,header:`Tipo`,render:e=>J(e.type)},{key:`product`,header:`Artículo / SKU`,render:e=>`<div>
        <div class="product-name">${a(e.productName)}</div>
        <div class="product-sub">${a(e.sku)} · ${a(e.reference)}</div>
      </div>`},{key:`responsible`,header:`Responsable`,render:e=>a(e.responsible)},{key:`qty`,header:`Impacto`,align:`right`,render:e=>{let t=e.type===`Ingreso`||e.type===`Ajuste`&&e.quantity>0;return`<span class="tabular" style="font-weight: 700; color: ${t?`var(--success-text)`:e.type===`Transferencia`?`var(--info-text)`:`var(--danger-text)`};">
          ${t?`+`:e.type===`Egreso`?`-`:``}${n(e.quantity)} u.
        </span>`}}],rows:s,emptyActionAction:`reset-movements-filters`})}
    </section>
  </div>`}function Se(e){let{products:t,globalSearch:o,branchLocation:s,productsViewState:c}=e,u=[`Todas`,...Array.from(new Set(t.map(e=>e.category)))],d=(c.search||o).trim().toLowerCase(),f=t.filter(e=>{let t=s===`Todas las sedes`||e.branch===s,n=!d||e.name.toLowerCase().includes(d)||e.sku.toLowerCase().includes(d)||e.location.toLowerCase().includes(d),r=c.category===`Todas`||e.category===c.category,a=i(e),o=c.status===`Todos`||a===c.status;return t&&n&&r&&o}).sort((e,t)=>c.sortBy===`stock`?e.stock-t.stock:c.sortBy===`price`?t.price-e.price:e.name.localeCompare(t.name)),p=Math.max(1,Math.ceil(f.length/8)),m=Math.min(c.page,p),h=f.slice((m-1)*8,m*8),g=[{key:`product`,header:`Artículo`,render:e=>`<div class="product-cell">
        <div class="product-thumb">${Y(e.icon)}</div>
        <div>
          <div class="product-name">${a(e.name)}</div>
          <div class="product-sub">${a(e.subtitle)}</div>
        </div>
      </div>`},{key:`sku`,header:`Código SKU`,render:e=>`<span class="sku-code">${a(e.sku)}</span>`},{key:`category`,header:`Rubro / Ubicación`,render:e=>`<div>
        <div style="font-weight: 500;">${a(e.category)}</div>
        <div style="font-size: 12px; color: var(--text-tertiary);">${a(e.location)}</div>
      </div>`},{key:`stock`,header:`Stock disponible`,align:`right`,render:e=>{let t=Math.min(100,Math.round(e.stock/Math.max(e.minStock*2,1)*100)),r=e.stock===0?`var(--danger)`:e.stock<=e.minStock?`var(--warning)`:`var(--success)`;return`<div class="stock-cell" style="align-items: flex-end;">
          <div class="stock-num tabular">
            ${n(e.stock)} <span style="color: var(--text-tertiary); font-weight: 400;">/ mín. ${e.minStock} ${a(e.unit)}</span>
          </div>
          <div class="stock-bar-track">
            <div class="stock-bar-fill" style="width: ${t}%; background: ${r};"></div>
          </div>
        </div>`}},{key:`cost`,header:`Costo / Venta`,align:`right`,render:e=>`<div>
        <div class="tabular" style="font-weight: 600;">${r(e.price)}</div>
        <div class="tabular" style="font-size: 11.5px; color: var(--text-tertiary);">
          Costo: ${r(e.cost)}
        </div>
      </div>`},{key:`status`,header:`Estado`,render:e=>J(i(e))},{key:`actions`,header:``,align:`right`,render:e=>`<div class="row-actions-wrap">
        <button
          type="button"
          class="icon-btn"
          style="width: 30px; height: 30px;"
          aria-label="Acciones para ${a(e.name)}"
          data-action="toggle-product-row-menu"
          data-product-id="${a(e.id)}"
        >
          ${l(`ellipsis`,16)}
        </button>
        ${c.menuRowId===e.id?`<div class="row-menu" role="menu">
                <button
                  type="button"
                  data-action="edit-product"
                  data-product-id="${a(e.id)}"
                >
                  Editar ficha y precios
                </button>
                <button
                  type="button"
                  class="danger"
                  data-action="delete-product"
                  data-product-id="${a(e.id)}"
                >
                  Eliminar del catálogo
                </button>
              </div>`:``}
      </div>`}],_=Array.from({length:p},(e,t)=>t+1).map(e=>`<button
          type="button"
          class="page-btn ${e===m?`active`:``}"
          data-action="set-products-page"
          data-page="${e}"
        >${e}</button>`).join(``);return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Catálogo de productos</h1>
        <p class="page-subtitle">
          Administrá costos, precios de lista, ubicaciones físicas y niveles mínimos de reposición.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-secondary"
          data-action="export-products-csv"
        >
          ${l(`download`,15)}
          <span>Exportar CSV</span>
        </button>
        <button
          type="button"
          class="btn btn-secondary"
          data-action="open-import-drawer"
        >
          ${l(`upload`,15)}
          <span>Importar lote</span>
        </button>
        <button
          type="button"
          class="btn btn-primary"
          data-action="new-product"
        >
          ${l(`plus`,16)}
          <span>Agregar producto</span>
        </button>
      </div>
    </div>

    <section class="panel">
      <div class="toolbar">
        <div class="toolbar-left">
          <div style="position: relative; width: 260px;">
            <span style="position: absolute; left: 10px; top: 50%; transform: translateY(-50%); color: var(--text-tertiary); display: inline-flex;">
              ${l(`search`,15)}
            </span>
            <input
              id="products-search-input"
              class="input"
              style="padding-left: 32px;"
              value="${a(c.search)}"
              placeholder="Filtrar por nombre, SKU o pasillo..."
              aria-label="Filtrar productos"
              data-input="products-search"
            />
          </div>

          <select
            class="select"
            aria-label="Categoría"
            data-action="set-products-category"
          >
            ${u.map(e=>`<option value="${a(e)}" ${c.category===e?`selected`:``}>${e===`Todas`?`Todas las categorías`:a(e)}</option>`).join(``)}
          </select>

          <select
            class="select"
            aria-label="Estado de stock"
            data-action="set-products-status"
          >
            <option value="Todos" ${c.status===`Todos`?`selected`:``}>Todos los estados</option>
            <option value="En stock" ${c.status===`En stock`?`selected`:``}>En stock</option>
            <option value="Stock bajo" ${c.status===`Stock bajo`?`selected`:``}>Stock bajo</option>
            <option value="Sin stock" ${c.status===`Sin stock`?`selected`:``}>Sin stock</option>
          </select>
        </div>

        <div class="toolbar-right">
          <span style="font-size: 12.5px; color: var(--text-secondary);">Ordenar por:</span>
          <select
            class="select"
            aria-label="Ordenar productos"
            data-action="set-products-sort"
          >
            <option value="name" ${c.sortBy===`name`?`selected`:``}>Nombre (A-Z)</option>
            <option value="stock" ${c.sortBy===`stock`?`selected`:``}>Menor stock primero</option>
            <option value="price" ${c.sortBy===`price`?`selected`:``}>Mayor precio unitario</option>
          </select>
        </div>
      </div>

      ${K({columns:g,rows:h,emptyActionAction:`reset-products-filters`})}

      <div class="table-footer">
        <span>
          Mostrando <strong>${h.length}</strong> de <strong>${f.length}</strong> artículos
        </span>
        <div class="pagination">
          <button
            type="button"
            class="page-btn"
            data-action="set-products-page"
            data-page="${Math.max(1,m-1)}"
            ${m===1?`disabled`:``}
          >
            Anterior
          </button>
          ${_}
          <button
            type="button"
            class="page-btn"
            data-action="set-products-page"
            data-page="${Math.min(p,m+1)}"
            ${m===p?`disabled`:``}
          >
            Siguiente
          </button>
        </div>
      </div>
    </section>
  </div>`}function Ce(e){let{products:t,categories:o}=e,s=t.reduce((e,t)=>e+t.stock*t.cost,0),c=t.reduce((e,t)=>e+t.stock*t.price,0),u=c-s,d=t.filter(e=>i(e)!==`En stock`),f=o.map(e=>{let n=t.filter(t=>t.category===e.name),r=n.reduce((e,t)=>e+t.stock*t.cost,0),i=s>0?Math.round(r/s*100):0;return{name:e.name,value:r,share:i,count:n.length}});return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Reportes y analítica operativa</h1>
        <p class="page-subtitle">
          Valorización financiera del inventario, margen bruto proyectado y planilla de reposición urgente.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="export-report-toast"
        >
          ${l(`download`,15)}
          <span>Descargar informe ejecutivo</span>
        </button>
      </div>
    </div>

    <div class="kpi-grid" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Capital inmovilizado (a costo)</span>
          <div class="kpi-icon tone-blue">${l(`trendingUp`,18)}</div>
        </div>
        <div class="kpi-value tabular">${r(s)}</div>
        <div class="kpi-foot">100% auditado sobre ${t.length} SKUs</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Valor de realización (lista)</span>
          <div class="kpi-icon tone-green">${l(`trendingUp`,18)}</div>
        </div>
        <div class="kpi-value tabular">${r(c)}</div>
        <div class="kpi-foot">Margen bruto potencial: ${r(u)}</div>
      </div>

      <div class="kpi-card">
        <div class="kpi-top">
          <span class="kpi-label">Ítems en punto de pedido</span>
          <div class="kpi-icon tone-amber">${l(`triangleAlert`,18)}</div>
        </div>
        <div class="kpi-value tabular">${d.length} SKUs</div>
        <div class="kpi-foot">Requieren emisión de Orden de Compra</div>
      </div>
    </div>

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Participación del capital por rubro</div>
            <div class="panel-subtitle">Distribución porcentual del stock valorizado a costo</div>
          </div>
        </div>
        <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
          ${f.map(e=>`<div style="display: flex; flex-direction: column; gap: 6px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px;">
                  <span style="font-weight: 600;">
                    ${a(e.name)} <span style="color: var(--text-tertiary); font-weight: 400;">(${e.count} SKUs)</span>
                  </span>
                  <span class="tabular" style="font-weight: 600;">
                    ${r(e.value)} (${e.share}%)
                  </span>
                </div>
                <div class="stock-bar-track" style="width: 100%; height: 8px;">
                  <div
                    class="stock-bar-fill"
                    style="width: ${Math.max(e.share,4)}%; background: var(--accent);"
                  ></div>
                </div>
              </div>`).join(``)}
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Prioridad de compra sugerida</div>
            <div class="panel-subtitle">Artículos debajo del stock mínimo de seguridad</div>
          </div>
        </div>
        <div class="table-scroll">
          <table class="data-table">
            <thead>
              <tr>
                <th>SKU / Producto</th>
                <th class="align-right">Actual / Mín.</th>
                <th class="align-right">Sugerido OC</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              ${d.map(e=>{let t=Math.max(e.minStock*2-e.stock,e.minStock);return`<tr>
                    <td>
                      <div class="product-name">${a(e.name)}</div>
                      <div class="product-sub">${a(e.sku)}</div>
                    </td>
                    <td class="align-right tabular">${e.stock} / ${e.minStock}</td>
                    <td class="align-right tabular" style="font-weight: 700; color: var(--accent);">
                      +${n(t)} ${a(e.unit)}
                    </td>
                    <td>${J(i(e))}</td>
                  </tr>`}).join(``)}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  </div>`}function we(e){let{users:t,branches:n,settingsState:r}=e,i=n.filter(e=>e.id!==`all`),o=t.filter(e=>e.enabled).length,s=t.length-o,c=se(r.newPassword),u=r.addingUser?`<form class="user-add-inline" data-form="add-user">
        <div class="field">
          <label>Nombre y Apellido *</label>
          <input
            class="input"
            value="${a(r.newUserName)}"
            placeholder="Ej. Sofía Alarcón"
            data-setting-input="newUserName"
            required
          />
        </div>
        <div class="field">
          <label>Correo corporativo *</label>
          <input
            class="input"
            type="email"
            value="${a(r.newUserEmail)}"
            placeholder="salarcon@comercialnorte.com.ar"
            data-setting-input="newUserEmail"
            required
          />
        </div>
        <div class="field">
          <label>Rol asignado</label>
          <select class="select" data-setting-input="newUserRole">
            <option value="Jefe de Depósito" ${r.newUserRole===`Jefe de Depósito`?`selected`:``}>Jefe de Depósito</option>
            <option value="Supervisor Logístico" ${r.newUserRole===`Supervisor Logístico`?`selected`:``}>Supervisor Logístico</option>
            <option value="Encargada de Sucursal" ${r.newUserRole===`Encargada de Sucursal`?`selected`:``}>Encargada de Sucursal</option>
            <option value="Auditor de Inventario" ${r.newUserRole===`Auditor de Inventario`?`selected`:``}>Auditor de Inventario</option>
            <option value="Operador de Depósito" ${r.newUserRole===`Operador de Depósito`?`selected`:``}>Operador de Depósito</option>
          </select>
        </div>
        <div class="field">
          <label>Sede principal</label>
          <select class="select" data-setting-input="newUserBranch">
            ${i.map(e=>`<option value="${a(e.name)}" ${r.newUserBranch===e.name?`selected`:``}>${a(e.name)}</option>`).join(``)}
          </select>
        </div>
        <div class="user-add-actions">
          <button type="button" class="btn btn-secondary btn-sm" data-action="cancel-add-user">
            Cancelar
          </button>
          <button type="submit" class="btn btn-primary btn-sm">
            ${l(`checkCircle2`,14)} Habilitar usuario
          </button>
        </div>
      </form>`:``,d=t.map(e=>{let t=e.name.split(` `).map(e=>e[0]).join(``).slice(0,2);return`<div class="user-perm-row ${e.enabled?``:`is-disabled`}">
        <div class="user-perm-main">
          <div class="user-perm-avatar ${e.enabled?`active`:`disabled`}">
            ${a(t)}
          </div>
          <div>
            <div class="user-perm-name">
              ${a(e.name)}
              <span class="badge ${e.enabled?`badge-success`:`badge-danger`}">
                <span class="badge-dot"></span>
                ${e.enabled?`Habilitado`:`Inhabilitado`}
              </span>
            </div>
            <div class="user-perm-meta">
              ${a(e.email)} · <strong>${a(e.branch)}</strong> · Últ. acceso: ${a(e.lastAccess)}
            </div>
          </div>
        </div>

        <div class="user-perm-controls">
          <select
            class="select select-compact"
            data-action="change-user-role"
            data-user-id="${a(e.id)}"
            aria-label="Rol de ${a(e.name)}"
            ${e.enabled?``:`disabled`}
          >
            <option value="Jefe de Depósito" ${e.role===`Jefe de Depósito`?`selected`:``}>Jefe de Depósito</option>
            <option value="Supervisor Logístico" ${e.role===`Supervisor Logístico`?`selected`:``}>Supervisor Logístico</option>
            <option value="Encargada de Sucursal" ${e.role===`Encargada de Sucursal`?`selected`:``}>Encargada de Sucursal</option>
            <option value="Auditor de Inventario" ${e.role===`Auditor de Inventario`?`selected`:``}>Auditor de Inventario</option>
            <option value="Operadora de Recepción" ${e.role===`Operadora de Recepción`?`selected`:``}>Operadora de Recepción</option>
            <option value="Operador de Depósito" ${e.role===`Operador de Depósito`?`selected`:``}>Operador de Depósito</option>
          </select>

          <button
            type="button"
            class="btn btn-sm ${e.enabled?`btn-danger-outline`:`btn-success-outline`}"
            data-action="toggle-user-enabled"
            data-user-id="${a(e.id)}"
          >
            ${e.enabled?`${l(`userRoundX`,14)} Inhabilitar`:`${l(`userRoundCheck`,14)} Habilitar`}
          </button>
        </div>
      </div>`}).join(``),f=r.showPasswords?`text`:`password`;return`<div class="security-grid">
    <!-- Gestión de Usuarios: Habilitar / Inhabilitar -->
    <div class="panel">
      <div class="panel-header">
        <div>
          <div class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            ${l(`userCog`,17)} Control de Usuarios y Permisos de Acceso
          </div>
          <div class="panel-subtitle">
            Habilitá o inhabilitá operadores por sucursal en tiempo real (${o} habilitados · ${s} inhabilitados)
          </div>
        </div>
        <button
          type="button"
          class="btn btn-secondary btn-sm"
          data-action="toggle-add-user"
        >
          ${l(`userPlus`,14)} Nuevo usuario
        </button>
      </div>

      ${u}

      <div class="user-permissions-list">${d}</div>
    </div>

    <!-- Cambio de Contraseña y Seguridad de Cuenta -->
    <form class="panel" data-form="change-password">
      <div class="panel-header">
        <div>
          <div class="panel-title" style="display: flex; align-items: center; gap: 8px;">
            ${l(`keyRound`,17)} Cambiar Contraseña y Seguridad de Cuenta
          </div>
          <div class="panel-subtitle">
            Actualizá la clave de acceso de Lucas Gómez (lgomez@comercialnorte.com.ar)
          </div>
        </div>
        <button
          type="button"
          class="btn btn-ghost btn-sm"
          data-action="toggle-show-passwords"
        >
          ${r.showPasswords?`${l(`eyeOff`,14)} Ocultar`:`${l(`eye`,14)} Mostrar`}
        </button>
      </div>

      <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
        <div class="field">
          <label for="cfg-current-pwd">Contraseña actual *</label>
          <input
            id="cfg-current-pwd"
            class="input"
            type="${f}"
            value="${a(r.currentPassword)}"
            placeholder="Ingresá tu contraseña vigente"
            data-setting-input="currentPassword"
          />
        </div>

        <div class="form-grid">
          <div class="field">
            <label for="cfg-new-pwd">Nueva contraseña *</label>
            <input
              id="cfg-new-pwd"
              class="input"
              type="${f}"
              value="${a(r.newPassword)}"
              placeholder="Mínimo 8 caracteres"
              data-setting-input="newPassword"
            />
          </div>
          <div class="field">
            <label for="cfg-confirm-pwd">Repetir nueva contraseña *</label>
            <input
              id="cfg-confirm-pwd"
              class="input"
              type="${f}"
              value="${a(r.confirmPassword)}"
              placeholder="Confirmá la nueva clave"
              data-setting-input="confirmPassword"
            />
          </div>
        </div>

        <div class="password-strength-box">
          <div class="password-strength-top">
            <span>Nivel de seguridad de la clave</span>
            <strong style="color: ${c.color};">${c.label}</strong>
          </div>
          <div class="password-strength-bars">
            ${[1,2,3,4].map(e=>`<span
                    class="strength-bar ${c.score>=e?`filled`:``}"
                    style="${c.score>=e?`background: ${c.color};`:``}"
                  ></span>`).join(``)}
          </div>
          <div class="password-policy-hint">
            ${l(`shieldCheck`,13)} Recomendado: combinar mayúsculas, números y símbolos especiales.
          </div>
        </div>

        ${r.passwordSavedMessage?`<div class="password-saved-banner">
                ${l(`checkCircle2`,15)}
                <span>${a(r.passwordSavedMessage)}</span>
              </div>`:``}

        <div style="display: flex; justify-content: flex-end; gap: 10px; padding-top: 4px;">
          <button
            type="button"
            class="btn btn-secondary"
            data-action="clear-password-fields"
          >
            Limpiar campos
          </button>
          <button type="submit" class="btn btn-primary">
            ${l(`keyRound`,15)} Actualizar contraseña
          </button>
        </div>
      </div>
    </form>
  </div>`}function Te(e){let{settingsState:t}=e,n=[{key:`emailAlerts`,value:t.emailAlerts,title:`Alertas inmediatas por correo electrónico`,desc:`Notificar al responsable de compras cuando un SKU perfora su stock mínimo.`},{key:`dailyDigest`,value:t.dailyDigest,title:`Resumen ejecutivo diario (08:00 hs)`,desc:`Enviar reporte consolidado con variaciones de valorización y despachos.`},{key:`blockNegativeStock`,value:t.blockNegativeStock,title:`Bloquear egresos con saldo insuficiente`,desc:`Impide confirmar remitos de salida que dejen existencias en negativo.`},{key:`autoSku`,value:t.autoSku,title:`Generación asistida de códigos SKU`,desc:`Sugiere automáticamente el correlativo según el prefijo de categoría.`}];return`<div class="page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Configuración del sistema</h1>
        <p class="page-subtitle">
          Parámetros operativos del depósito, umbrales de alerta, control de usuarios y seguridad de cuenta.
        </p>
      </div>
      <div class="page-actions">
        <button
          type="button"
          class="btn btn-primary"
          data-action="save-settings"
        >
          ${l(`save`,15)}
          <span>Guardar preferencias</span>
        </button>
      </div>
    </div>

    <div class="dashboard-split">
      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Datos de la empresa y depósito principal</div>
            <div class="panel-subtitle">Información impresa en remitos internos y órdenes de compra</div>
          </div>
        </div>
        <div class="panel-body">
          <div class="form-grid">
            <div class="field">
              <label for="cfg-company">Razón social</label>
              <input
                id="cfg-company"
                class="input"
                value="${a(t.company)}"
                data-setting-input="company"
              />
            </div>
            <div class="field">
              <label for="cfg-cuit">CUIT</label>
              <input
                id="cfg-cuit"
                class="input"
                value="${a(t.cuit)}"
                data-setting-input="cuit"
              />
            </div>
            <div class="field" style="grid-column: 1 / -1;">
              <label for="cfg-warehouse">Ubicación cabecera</label>
              <input
                id="cfg-warehouse"
                class="input"
                value="${a(t.warehouse)}"
                data-setting-input="warehouse"
              />
            </div>
            <div class="field">
              <label for="cfg-currency">Moneda de valorización</label>
              <input
                id="cfg-currency"
                class="input"
                value="${a(t.currency)}"
                data-setting-input="currency"
              />
            </div>
            <div class="field">
              <label for="cfg-threshold">Colchón de seguridad sugerido (%)</label>
              <input
                id="cfg-threshold"
                class="input"
                type="number"
                value="${a(t.criticalThreshold)}"
                data-setting-input="criticalThreshold"
              />
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="panel-header">
          <div>
            <div class="panel-title">Reglas de control y notificaciones</div>
            <div class="panel-subtitle">Automatizaciones activas para el equipo de almacén</div>
          </div>
        </div>
        <div class="panel-body" style="display: flex; flex-direction: column; gap: 14px;">
          ${n.map(e=>`<label
                style="display: flex; justify-content: space-between; align-items: center; gap: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--border); cursor: pointer;"
              >
                <div>
                  <div style="font-weight: 600; font-size: 13px;">${a(e.title)}</div>
                  <div style="font-size: 12px; color: var(--text-secondary);">${a(e.desc)}</div>
                </div>
                <input
                  type="checkbox"
                  ${e.value?`checked`:``}
                  data-setting-checkbox="${e.key}"
                  style="width: 17px; height: 17px; accent-color: var(--accent);"
                />
              </label>`).join(``)}
        </div>
      </section>
    </div>

    ${we(e)}
  </div>`}var Z=document.getElementById(`root`);function Ee(e){switch(e.screen){case`dashboard`:return X(e);case`productos`:return Se(e);case`conversion`:return ge(e);case`movimientos`:return xe(e);case`categorias`:return ve(e);case`proveedores`:return ye(e);case`reportes`:return Ce(e);case`configuracion`:return Te(e);default:return X(e)}}function Q(){let e=R.getState(),t=document.activeElement,n=t?{id:t.id||null,dataInput:t.getAttribute?.(`data-input`)||null,dataSettingInput:t.getAttribute?.(`data-setting-input`)||null,dataLoginInput:t.getAttribute?.(`data-login-input`)||null,dataDraft:t.getAttribute?.(`data-draft`)||null,dataField:t.getAttribute?.(`data-field`)||null,dataBulkRow:t.getAttribute?.(`data-bulk-row`)||null,dataBulkField:t.getAttribute?.(`data-bulk-field`)||null,selectionStart:typeof t.selectionStart==`number`?t.selectionStart:null,selectionEnd:typeof t.selectionEnd==`number`?t.selectionEnd:null}:null;Z.innerHTML=e.authenticated?`
      <div class="${[`app-shell`,e.sidebarVisible?`sidebar-visible`:`sidebar-hidden`,e.mobileOpen?`mobile-open`:``].filter(Boolean).join(` `)}">
        <div
          class="sidebar-backdrop"
          data-action="hide-sidebar"
          aria-hidden="true"
        ></div>

        ${y(e)}

        <div class="main-area">
          ${v(e)}
          <main class="content-scroll">
            ${Ee(e)}
          </main>
        </div>

        ${d(e)}
        ${$(e.toast)}
      </div>
    `:`
      ${be(e)}
      ${$(e.toast)}
    `,De(n)}function $(e){return e?`<div class="toast-stack" role="status" aria-live="polite">
    <div class="toast">
      ${l(`checkCircle2`,16)}
      <span>${e}</span>
    </div>
  </div>`:``}function De(e){if(!e)return;let t=null;if(e.id?t=document.getElementById(e.id):e.dataBulkRow&&e.dataBulkField?t=document.querySelector(`[data-bulk-row="${e.dataBulkRow}"][data-bulk-field="${e.dataBulkField}"]`):e.dataDraft&&e.dataField?t=document.querySelector(`[data-draft="${e.dataDraft}"][data-field="${e.dataField}"]`):e.dataSettingInput?t=document.querySelector(`[data-setting-input="${e.dataSettingInput}"]`):e.dataLoginInput?t=document.querySelector(`[data-login-input="${e.dataLoginInput}"]`):e.dataInput&&(t=document.querySelector(`[data-input="${e.dataInput}"]`)),t&&typeof t.focus==`function`&&(t.focus(),e.selectionStart!==null&&typeof t.setSelectionRange==`function`&&t.type!==`number`&&t.type!==`email`))try{t.setSelectionRange(e.selectionStart,e.selectionEnd)}catch{}}Z.addEventListener(`click`,e=>{let t=e.target.closest(`[data-action]`);if(!t||t.dataset.action===`close-drawer`&&e.target!==t&&e.target.closest(`[data-stop-propagation="true"]`))return;let n=t.dataset.action,r=R.getState();switch(n){case`nav-menu`:{let e=t.dataset.screen;e&&te(e);break}case`nav`:{let e=t.dataset.screen;e&&B(e);break}case`toggle-sidebar`:{let e=!r.sidebarVisible;R.setState({sidebarVisible:e,mobileOpen:e});break}case`hide-sidebar`:R.setState({sidebarVisible:!1,mobileOpen:!1});break;case`set-theme`:{let e=t.dataset.theme;(e===`light`||e===`dark`)&&R.setState({theme:e});break}case`toggle-theme`:R.setState({theme:r.theme===`dark`?`light`:`dark`});break;case`toggle-branch-menu`:R.setState({branchMenuOpen:!r.branchMenuOpen});break;case`select-branch`:{let e=t.dataset.branch;e&&R.setState({branchLocation:e,branchMenuOpen:!1});break}case`select-branch-and-close`:{let e=t.dataset.branch;e&&(R.setState({branchLocation:e,drawer:null,branchMenuOpen:!1}),R.showToast(`Visualizando inventario de: ${e}`));break}case`open-branches-drawer`:R.setState({drawer:`branches`,branchMenuOpen:!1});break;case`save-branch`:he();break;case`open-alerts`:B(`reportes`),R.showToast(`Mostrando artículos con alerta de reposición`);break;case`show-help-toast`:R.showToast(`Centro de soporte: soporte@stockia.ar · Línea directa int. 402`);break;case`toggle-google-picker`:R.setState({loginState:{...r.loginState,googlePickerOpen:!r.loginState.googlePickerOpen}});break;case`google-login-account`:V(`Autenticado con Google Workspace: ${t.dataset.accountName||`Operador`} (${t.dataset.accountEmail||``})`);break;case`forgot-password-toast`:R.setState({loginState:{...r.loginState,error:`Contactá al administrador de sistemas para blanquear tu clave corporativa.`}});break;case`logout`:re();break;case`new-product`:le();break;case`edit-product`:{let e=t.dataset.productId;R.setState({productsViewState:{...r.productsViewState,menuRowId:null}}),e&&H(e);break}case`delete-product`:{let e=t.dataset.productId;e&&ue(e);break}case`toggle-product-row-menu`:{let e=t.dataset.productId,n=r.productsViewState.menuRowId;R.setState({productsViewState:{...r.productsViewState,menuRowId:n===e?null:e}});break}case`save-product`:U();break;case`open-movement-drawer`:R.setState({drawer:`movement`});break;case`set-movement-type`:{let e=t.dataset.movType;e&&R.setState({movementDraft:{...r.movementDraft,type:e}});break}case`save-movement`:de();break;case`open-category-drawer`:R.setState({drawer:`category`});break;case`save-category`:fe();break;case`open-supplier-drawer`:R.setState({drawer:`supplier`});break;case`save-supplier`:W();break;case`toggle-supplier-active`:{let e=t.dataset.supplierId;e&&pe(e);break}case`open-import-drawer`:R.setState({drawer:`import`});break;case`close-drawer`:R.setState({drawer:null});break;case`set-bulk-tab`:{let e=t.dataset.tab;(e===`table`||e===`csv`)&&R.setState({bulkImportState:{...r.bulkImportState,activeTab:e}});break}case`bulk-add-row`:{let e=r.bulkImportState.rows,t=e.length+1,n=r.branchLocation===`Todas las sedes`?`CD Norte`:r.branchLocation;R.setState({bulkImportState:{...r.bulkImportState,rows:[...e,{id:`row-${Date.now()}-${t}`,name:``,sku:`GEN-0${400+t}`,category:r.categories[0]?.name||`Ferretería`,branch:n,stock:`10`,minStock:`5`,unit:`unid.`,cost:`10000`,price:`15500`,location:`Depósito Central · Pasillo A-1`}]}});break}case`bulk-add-three-rows`:{let e=r.bulkImportState.rows,t=e.length+1,n=r.branchLocation===`Todas las sedes`?`CD Norte`:r.branchLocation,i=[0,1,2].map(e=>({id:`row-${Date.now()}-${t+e}`,name:``,sku:`GEN-0${400+t+e}`,category:r.categories[e%r.categories.length]?.name||`Ferretería`,branch:n,stock:`12`,minStock:`5`,unit:`unid.`,cost:`12000`,price:`18000`,location:`Depósito Central · Pasillo A-1`}));R.setState({bulkImportState:{...r.bulkImportState,rows:[...e,...i]}});break}case`bulk-remove-row`:{let e=t.dataset.rowId,n=r.bulkImportState.rows;if(n.length<=1)return;R.setState({bulkImportState:{...r.bulkImportState,rows:n.filter(t=>t.id!==e)}});break}case`submit-bulk-table`:{let e=r.bulkImportState.rows.filter(e=>e.name.trim()!==``&&e.sku.trim()!==``);if(e.length===0)return;G(e.map(e=>({name:e.name.trim(),subtitle:`Ingreso masivo por planilla · ${e.branch}`,sku:e.sku.trim().toUpperCase(),category:e.category,stock:Math.max(0,Number(e.stock)||0),minStock:Math.max(0,Number(e.minStock)||0),unit:e.unit||`unid.`,cost:Math.max(0,Number(e.cost)||0),price:Math.max(0,Number(e.price)||0),location:e.location.trim()||`Depósito Central`,branch:e.branch,icon:`wrench`})));break}case`trigger-csv-input`:{let e=document.getElementById(`bulk-csv-file-input`);e&&e.click();break}case`download-csv-template`:{let e=new Blob([`nombre,subtitulo,sku,categoria,stock,stock_minimo,unidad,costo,precio,ubicacion,sede
Multímetro Digital True RMS,Pantalla retroiluminada,ELE-0901,Electricidad,35,10,unid.,24500,38900,Depósito Central · Pasillo B-2,CD Norte
Botín de Seguridad Punta Acero,Talle 42 · Cuero flor,SEG-0310,Seguridad Ind.,22,12,pares,38000,59500,Depósito Central · Pasillo D-2,Sucursal Centro
Esmalte Sintético Antióxido 4L,Negro brillante,PIN-0402,Pinturería,19,8,latas,21900,33900,Depósito Sur · Sector C,Depósito Sur`],{type:`text/csv;charset=utf-8;`}),t=URL.createObjectURL(e),n=document.createElement(`a`);n.href=t,n.download=`plantilla-stockia-productos.csv`,n.click(),URL.revokeObjectURL(t);break}case`submit-bulk-csv`:r.bulkImportState.csvPreview.length>0&&G(r.bulkImportState.csvPreview);break;case`set-dashboard-period`:{let e=t.dataset.period;e&&R.setState({dashboardState:{...r.dashboardState,period:e}});break}case`reset-dashboard-filters`:R.setState({branchLocation:`Todas las sedes`,dashboardState:{...r.dashboardState,categoryFilter:`Todas`,statusFilter:`Todos`}});break;case`set-products-page`:{let e=Number(t.dataset.page)||1;R.setState({productsViewState:{...r.productsViewState,page:e}});break}case`reset-products-filters`:R.setState({productsViewState:{...r.productsViewState,search:``,category:`Todas`,status:`Todos`,page:1}});break;case`export-products-csv`:{let e=r.products.map(e=>`"${e.sku}","${e.name}","${e.category}","${e.branch}",${e.stock},${e.minStock},"${e.unit}",${e.cost},${e.price},"${e.location}"`),t=new Blob([[`SKU,Producto,Categoria,Sede,Stock,Minimo,Unidad,Costo,Precio,Ubicacion`,...e].join(`
`)],{type:`text/csv;charset=utf-8;`}),n=URL.createObjectURL(t),i=document.createElement(`a`);i.href=n,i.download=`catalogo-stockia.csv`,i.click(),URL.revokeObjectURL(n),R.showToast(`Catálogo exportado (${r.products.length} registros)`);break}case`toggle-custom-conversion`:R.setState({conversionState:{...r.conversionState,customMode:!r.conversionState.customMode}});break;case`select-kit-recipe`:{let e=t.dataset.recipeId;e&&R.setState({conversionState:{...r.conversionState,customMode:!1,selectedRecipeId:e}});break}case`execute-kit-conversion`:me();break;case`set-movements-type`:{let e=t.dataset.movFilter;e&&R.setState({movementsViewState:{...r.movementsViewState,typeFilter:e}});break}case`reset-movements-filters`:R.setState({movementsViewState:{search:``,typeFilter:`Todos`}});break;case`export-movements-toast`:R.showToast(`Reporte de movimientos exportado a CSV`);break;case`export-report-toast`:R.showToast(`Informe ejecutivo de valorización descargado`);break;case`save-settings`:R.showToast(`Preferencias del sistema guardadas correctamente`);break;case`toggle-add-user`:R.setState({settingsState:{...r.settingsState,addingUser:!r.settingsState.addingUser}});break;case`cancel-add-user`:R.setState({settingsState:{...r.settingsState,addingUser:!1}});break;case`toggle-user-enabled`:{let e=t.dataset.userId;e&&ie(e);break}case`toggle-show-passwords`:R.setState({settingsState:{...r.settingsState,showPasswords:!r.settingsState.showPasswords}});break;case`clear-password-fields`:R.setState({settingsState:{...r.settingsState,currentPassword:``,newPassword:``,confirmPassword:``}})}}),Z.addEventListener(`input`,e=>{let t=e.target,n=R.getState();if(t.dataset.input===`global-search`)R.setState({globalSearch:t.value});else if(t.dataset.input===`products-search`)R.setState({productsViewState:{...n.productsViewState,search:t.value,page:1}});else if(t.dataset.input===`movements-search`)R.setState({movementsViewState:{...n.movementsViewState,search:t.value}});else if(t.dataset.loginInput){let e=t.dataset.loginInput;R.setState({loginState:{...n.loginState,[e]:t.value,error:``}})}else if(t.dataset.draft&&t.dataset.field){let e=t.dataset.draft,r=t.dataset.field;R.setState({[e]:{...n[e],[r]:t.value}})}else if(t.dataset.bulkRow&&t.dataset.bulkField){let e=t.dataset.bulkRow,r=t.dataset.bulkField,i=n.bulkImportState.rows.map(n=>n.id===e?{...n,[r]:t.value}:n);R.setState({bulkImportState:{...n.bulkImportState,rows:i}})}else if(t.dataset.conversionInput){let e=t.dataset.conversionInput;R.setState({conversionState:{...n.conversionState,[e]:t.value}})}else if(t.dataset.settingInput){let e=t.dataset.settingInput;R.setState({settingsState:{...n.settingsState,[e]:t.value,passwordSavedMessage:e.includes(`Password`)?``:n.settingsState.passwordSavedMessage}})}}),Z.addEventListener(`change`,e=>{let t=e.target,n=R.getState();if(t.id===`bulk-csv-file-input`){let e=t.files?.[0];if(!e)return;let r=n.branchLocation===`Todas las sedes`?`CD Norte`:n.branchLocation,i=new FileReader;i.onload=()=>{let t=s(String(i.result||``),r);R.setState({bulkImportState:{...n.bulkImportState,fileName:e.name,csvPreview:t}})},i.readAsText(e)}else if(t.dataset.action===`set-dashboard-category`)R.setState({dashboardState:{...n.dashboardState,categoryFilter:t.value}});else if(t.dataset.action===`set-dashboard-status`)R.setState({dashboardState:{...n.dashboardState,statusFilter:t.value}});else if(t.dataset.action===`set-products-category`)R.setState({productsViewState:{...n.productsViewState,category:t.value,page:1}});else if(t.dataset.action===`set-products-status`)R.setState({productsViewState:{...n.productsViewState,status:t.value,page:1}});else if(t.dataset.action===`set-products-sort`)R.setState({productsViewState:{...n.productsViewState,sortBy:t.value}});else if(t.dataset.action===`change-user-role`){let e=t.dataset.userId;e&&ae(e,t.value)}else if(t.dataset.loginCheckbox===`remember`)R.setState({loginState:{...n.loginState,remember:t.checked}});else if(t.dataset.settingCheckbox){let e=t.dataset.settingCheckbox;R.setState({settingsState:{...n.settingsState,[e]:t.checked}})}}),Z.addEventListener(`submit`,e=>{e.preventDefault();let t=e.target.dataset.form,n=R.getState();if(t===`login`){let{email:e,password:t}=n.loginState;if(!e.trim()||!t.trim()){R.setState({loginState:{...n.loginState,error:`Completá tu correo corporativo y contraseña para continuar.`}});return}V(`Sesión iniciada correctamente`)}else t===`add-user`?oe():t===`change-password`&&ce()}),window.addEventListener(`keydown`,e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()===`k`){e.preventDefault();let t=document.getElementById(`global-search-input`);t&&t.focus()}if(e.key===`Escape`){let e=R.getState();(e.drawer||e.mobileOpen||e.sidebarVisible||e.branchMenuOpen)&&R.setState({drawer:null,mobileOpen:!1,sidebarVisible:!1,branchMenuOpen:!1})}}),R.subscribe(Q),ne(),Q();