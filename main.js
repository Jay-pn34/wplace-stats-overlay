// ==UserScript==
// @name         Wplace Stats Overlay
// @namespace    https://wplace.live/
// @version      1.5.0
// @description  White overlay showing username, level, droplets, and pixels to next level
// @match        https://wplace.live/*
// @grant        none
// @author       Jay Patel
// @namespace    https://github.com/Jay-pn34
// ==/UserScript==

(() => {
    'use strict';

    /* ---------------- UI ---------------- */
    const overlay = document.createElement('div');
    overlay.id = 'wp-stats-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 12px;
        left: 2%;
        z-index: 99999;
        background: rgba(255, 255, 255, 0.96);
        color: #111;
        padding: 12px 14px;
        border-radius: 10px;
        font-family: monospace;
        font-size: 13px;
        line-height: 1.35;
        box-shadow: 0 6px 16px rgba(0,0,0,0.18);
        min-width: 200px;
        border: 1px solid rgba(0,0,0,0.1);
        font-weight: bold;
    `;

    overlay.innerHTML = `
        <div>👤 Username - <span id="wp-name">–</span></div>
        <div>⭐ Level - <span id="wp-level">–</span></div>
        <div>💧 Droplets - <span id="wp-droplets">–</span></div>
        <div>🎯 Next Level - <span id="wp-next">–</span></div>

    `;

    document.body.appendChild(overlay);

    const elName  = overlay.querySelector('#wp-name');
    const elLevel = overlay.querySelector('#wp-level');
    const elDrops = overlay.querySelector('#wp-droplets');
    const elNext  = overlay.querySelector('#wp-next');

    const nf = new Intl.NumberFormat();

    /* ---------------- Blue Marble Level Formula ---------------- */
    function levelPixels(level) {
        return Math.pow(level * Math.pow(30, 0.65), 1 / 0.65);
    }

    function nextLevelPixels(level, pixelsPainted) {
        return Math.ceil(levelPixels(level) - pixelsPainted);
    }

    /* ---------------- Fetch Hook ---------------- */
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
        const response = await originalFetch(...args);

        try {
            const clone = response.clone();
            const data = await clone.json();

            if (data && data.name && data.level != null) {
                const levelInt = Math.floor(data.level);
                const pixelsPainted = data.pixelsPainted || 0;

                const remaining = nextLevelPixels(levelInt, pixelsPainted);

                elName.textContent  = data.name;
                elLevel.textContent = levelInt;
                elDrops.textContent = nf.format(data.droplets ?? 0);
                elNext.textContent  = nf.format(remaining);
            }
        } catch {
            // ignore non-user responses
        }

        return response;
    };
})();
