if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,r)=>{const l=e||("document"in self?document.currentScript.src:"")||location.href;if(s[l])return;let o={};const a=e=>i(e,l),c={module:{uri:l},exports:o,require:a};s[l]=Promise.all(n.map((e=>c[e]||a(e)))).then((e=>(r(...e),o)))}}define(["./workbox-13d12fd3"],(function(e){"use strict";self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"assets/AboutView-C68NRXZc.js",revision:null},{url:"assets/APIView-DdUddx1s.js",revision:null},{url:"assets/ContactPicker-CODiTwZr.js",revision:null},{url:"assets/FileSystem-0BMmwZrK.css",revision:null},{url:"assets/FileSystem-B0ngS6F_.js",revision:null},{url:"assets/IButton-D5FQXHef.js",revision:null},{url:"assets/index-B2W7Qx22.css",revision:null},{url:"assets/index-Cl5dxKTN.js",revision:null},{url:"assets/MediaCapture-Du8vA0pq.js",revision:null},{url:"assets/MediaCapture-YS8Z2k5P.css",revision:null},{url:"assets/WebShare-ZMUGPFbY.js",revision:null},{url:"favicons/favicon-16x16.png",revision:"fe50382ec935a46f3ac1f8689a5c9941"},{url:"favicons/favicon-32x32.png",revision:"cf9a913f74ff5a33cf70a3d740b8a64b"},{url:"favicons/icon_x192.png",revision:"314f9404b3ab8e6364e9bb3b2c8387e5"},{url:"favicons/icon_x512.png",revision:"4ac642101ea7ab2980011bdb2cb7e097"},{url:"favicons/narrow.webp",revision:"a7262cc7899bfac66de83e73968304e8"},{url:"favicons/wide.webp",revision:"4640c6f7539f127180eb73d23da83c12"},{url:"fonts/Blackcraft.woff2",revision:"2f006bc27c89a1a863ab1c81391faa16"},{url:"index.html",revision:"5b09ab6b9dc8999d07a8016945c4fd6a"},{url:"registerSW.js",revision:"c5db33792472e42cf4199535a0ed74df"},{url:"robots.txt",revision:"f77c87f977e0fcce05a6df46c885a129"},{url:"manifest.webmanifest",revision:"34cc512a3bbcaab6aca8c839a9b88f9b"}],{}),e.registerRoute(new e.NavigationRoute(e.createHandlerBoundToURL("index.html")))}));