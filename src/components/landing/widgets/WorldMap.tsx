"use client";

import { useEffect, useRef } from "react";
import type { Map as LeafletMap } from "leaflet";
import { maps } from "@/content/landing-content";
import { PIZZA_MAP_LOCATIONS } from "@/lib/pizza-map-data";

const STATUS_LABELS: Record<string, string> = {
  active: "Active",
  progress: "In Progress",
  planned: "Planned",
};

function markerIconHtml(status: string) {
  const configs: Record<string, { color: string; icon: string }> = {
    active: { color: "#4CAF50", icon: "🍕" },
    progress: { color: "#ff9800", icon: "🔧" },
    planned: { color: "#757575", icon: "📍" },
  };
  const config = configs[status] ?? configs.planned;
  return `<div class="marker-pin" style="background-color:${config.color}">
    <span class="marker-icon">${config.icon}</span>
  </div>`;
}

function popupHtml(loc: (typeof PIZZA_MAP_LOCATIONS)[0]) {
  const established = loc.established
    ? `<p class="established">Est. ${new Date(loc.established).toLocaleDateString()}</p>`
    : "";
  return `
    <div class="map-popup">
      <h3>${loc.name}</h3>
      <p class="location-city">${loc.city}, ${loc.country}</p>
      <div class="status-badge status-${loc.status}">${STATUS_LABELS[loc.status] ?? loc.status}</div>
      <div class="location-stats">
        <div class="stat"><strong>${loc.meals_served}</strong><span>Meals Served</span></div>
        <div class="stat"><strong>${loc.partners}</strong><span>Partners</span></div>
      </div>
      <p class="location-description">${loc.description}</p>
      ${established}
      <a href="mailto:${loc.contact}" class="contact-link">Contact</a>
    </div>
  `;
}

export function WorldMap() {
  const mapRef = useRef<LeafletMap | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let map: LeafletMap | null = null;

    const init = async () => {
      const L = (await import("leaflet")).default;

      if (cancelled || !containerRef.current || mapRef.current) return;

      map = L.map(containerRef.current, {
        zoomControl: true,
        scrollWheelZoom: true,
      }).setView([39.5, -85], 4);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "© OpenStreetMap contributors | SlicePay",
        maxZoom: 18,
      }).addTo(map);

      PIZZA_MAP_LOCATIONS.forEach((loc) => {
        const icon = L.divIcon({
          className: "custom-marker",
          html: markerIconHtml(loc.status),
          iconSize: [30, 30],
          iconAnchor: [15, 30],
          popupAnchor: [0, -30],
        });
        L.marker([loc.lat, loc.lng], { icon })
          .addTo(map!)
          .bindPopup(popupHtml(loc), { maxWidth: 300, className: "pizza-popup" });
      });

      mapRef.current = map;

      requestAnimationFrame(() => {
        map?.invalidateSize();
      });
      setTimeout(() => map?.invalidateSize(), 200);
      setTimeout(() => map?.invalidateSize(), 800);
    };

    init().catch((err) => console.warn("Map init failed:", err));

    return () => {
      cancelled = true;
      if (map) {
        map.remove();
        mapRef.current = null;
      }
      const el = containerRef.current;
      if (el) delete (el as HTMLElement & { _leaflet_id?: number })._leaflet_id;
    };
  }, []);

  return (
    <section
      className="section maps-section"
      id="maps"
      style={{ background: "var(--bg-2)", borderTop: "1px solid var(--line)" }}
    >
      <div className="wrap">
        <div className="section-num">06 · {maps.subtitle}</div>
        <h2
          className="title"
          style={{ fontFamily: "var(--display)", fontSize: "clamp(44px,7vw,72px)" }}
        >
          {maps.title}
        </h2>
        <p
          className="serif"
          style={{
            fontStyle: "italic",
            color: "var(--bone-dim)",
            maxWidth: 720,
            margin: "16px 0 0",
          }}
        >
          {maps.text}
        </p>
        <div className="map-container">
          <div
            ref={containerRef}
            id="world-map"
            style={{
              height: 500,
              width: "100%",
              borderRadius: 15,
              overflow: "hidden",
              position: "relative",
              zIndex: 1,
            }}
          />
        </div>
        <div className="map-stats">
          {maps.stats.map((stat) => (
            <div key={stat.id} className="stat-item">
              <h3 style={{ fontFamily: "var(--mono)", fontSize: 11, color: "var(--bone-soft)" }}>
                {stat.label}
              </h3>
              <p className="stat-number" id={stat.id}>
                ...
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
