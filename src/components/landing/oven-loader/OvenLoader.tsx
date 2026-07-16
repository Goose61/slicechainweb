/* DO NOT MODIFY — markup copied verbatim from menos&gusto/Pizza.html lines 96–191 */

"use client";

import { useEffect } from "react";
import { brandMark } from "@/content/landing-content";
import "./oven-loader.css";
import { initOvenLoader } from "./oven-loader";

export function OvenLoader() {
  useEffect(() => {
    initOvenLoader();
  }, []);

  return (
    <div id="loader">
      <div className="oven-stage">
        <div className="oven">
          <svg viewBox="0 0 480 440" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="20" y="100" width="440" height="280" rx="18" fill="#1a0f08" stroke="#3a2210" strokeWidth="1.5" />
            <path d="M110 370 L110 210 Q110 150 200 150 L280 150 Q370 150 370 210 L370 370 Z" fill="#0a0604" stroke="#2a1508" strokeWidth="1.5" />
            <path d="M110 370 L110 210 Q110 150 200 150 L280 150 Q370 150 370 210 L370 370" fill="none" stroke="#4a2a10" strokeWidth="1" />
            <path d="M60 100 Q60 40 240 40 Q420 40 420 100" fill="#221408" stroke="#3a2210" strokeWidth="1.5" />
            <rect x="200" y="8" width="80" height="38" rx="5" fill="#1a0f08" stroke="#3a2210" strokeWidth="1.5" />
            <path className="flame f2" d="M225 8 Q222 -2 228 -10 Q234 -18 230 -26" stroke="#6a5040" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.6" />
            <path className="flame f3" d="M255 8 Q258 -3 252 -12 Q246 -20 251 -28" stroke="#6a5040" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5" />
            <rect x="108" y="148" width="264" height="224" rx="4" fill="none" stroke="#4a2a10" strokeWidth="2" />
            <ellipse cx="240" cy="368" rx="120" ry="14" fill="url(#emglow)" opacity="0.85" />
            <g id="flames">
              <path
                className="flame"
                d="M200 370 Q195 330 210 305 Q218 285 200 265 Q185 248 200 228 Q216 208 215 188 Q225 210 218 232 Q214 250 228 265 Q244 280 242 300 Q240 318 255 300 Q268 280 260 258 Q252 236 264 218 Q272 240 268 265 Q264 285 278 270 Q295 250 285 225 Q298 248 290 275 Q284 295 295 310 Q308 325 300 345 Q292 362 280 370Z"
                fill="url(#flameMain)"
                opacity="0.9"
              />
              <path
                className="flame f2"
                d="M145 370 Q138 345 150 328 Q158 314 148 298 Q140 284 152 268 Q161 254 158 238 Q167 256 163 275 Q160 288 170 278 Q182 265 177 246 Q188 265 183 285 Q178 302 190 315 Q200 328 193 345 Q187 360 180 370Z"
                fill="url(#flameL)"
                opacity="0.75"
              />
              <path
                className="flame f3"
                d="M300 370 Q294 350 305 333 Q313 318 304 305 Q296 292 307 278 Q318 264 314 248 Q325 266 320 282 Q316 296 326 285 Q338 272 333 252 Q344 270 339 290 Q334 308 346 320 Q356 333 349 353 Q343 368 335 370Z"
                fill="url(#flameR)"
                opacity="0.75"
              />
            </g>
            <circle className="ember" cx="210" cy="360" r="2.5" fill="#f97316" style={{ ["--dx" as string]: "-15px" }} />
            <circle className="ember e2" cx="240" cy="355" r="2" fill="#fbbf24" style={{ ["--dx" as string]: "10px" }} />
            <circle className="ember e3" cx="270" cy="362" r="3" fill="#f97316" style={{ ["--dx" as string]: "20px" }} />
            <circle className="ember" cx="225" cy="350" r="1.5" fill="#fcd34d" style={{ ["--dx" as string]: "-8px" }} />
            <circle className="ember e2" cx="258" cy="345" r="2" fill="#fb923c" style={{ ["--dx" as string]: "18px" }} />
            <text x="240" y="80" textAnchor="middle" fontFamily="serif" fontStyle="italic" fontSize="28" letterSpacing="8" fill="#4a2a10">
              PIZZA
            </text>
            <circle cx="50" cy="280" r="18" fill="#150d07" stroke="#3a2210" strokeWidth="1.5" />
            <circle cx="50" cy="280" r="8" fill="#3a2210" />
            <line x1="50" y1="272" x2="50" y2="265" stroke="#4a2a10" strokeWidth="2" strokeLinecap="round" />
            <circle cx="430" cy="280" r="18" fill="#150d07" stroke="#3a2210" strokeWidth="1.5" />
            <circle cx="430" cy="280" r="8" fill="#3a2210" />
            <line x1="430" y1="272" x2="436" y2="267" stroke="#4a2a10" strokeWidth="2" strokeLinecap="round" />
            <rect x="160" y="396" width="40" height="6" rx="3" fill="#3a2210" />
            <rect x="220" y="396" width="40" height="6" rx="3" fill="#3a2210" />
            <rect x="280" y="396" width="40" height="6" rx="3" fill="#3a2210" />
            <defs>
              <radialGradient id="emglow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f97316" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="flameMain" x1="240" y1="188" x2="240" y2="370" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fef3c7" />
                <stop offset="20%" stopColor="#fcd34d" />
                <stop offset="45%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id="flameL" x1="165" y1="238" x2="165" y2="370" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="40%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
              <linearGradient id="flameR" x1="320" y1="248" x2="320" y2="370" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#fcd34d" />
                <stop offset="40%" stopColor="#f97316" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="oven-bottom">
          <span className="big">Loading</span>
          {brandMark}
        </div>

        <div className="oven-progress">
          <div className="bar">
            <span id="prog-bar"></span>
          </div>
          <div className="pct" id="prog-pct">
            0%
          </div>
        </div>
      </div>
    </div>
  );
}
