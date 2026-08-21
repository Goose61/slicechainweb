export type PizzaMapLocation = {
  id: number;
  name: string;
  city: string;
  country: string;
  state?: string;
  lat: number;
  lng: number;
  status: "active" | "progress" | "planned";
  meals_served: number;
  partners: number;
  description: string;
  contact: string;
  established?: string;
};

export const PIZZA_MAP_LOCATIONS: PizzaMapLocation[] = [
  {
    id: 1,
    name: "Tastee Pizza",
    city: "Hawthorne",
    country: "USA",
    state: "NJ",
    lat: 40.9495,
    lng: -74.1535,
    status: "active",
    meals_served: 2800,
    partners: 5,
    description: "Family-owned pizzeria serving the Hawthorne community since 1982",
    contact: "tastee@pizzacommunity.org",
    established: "2023-10-15",
  },
  {
    id: 2,
    name: "ROCK N GRILL",
    city: "Glen Rock",
    country: "USA",
    state: "NJ",
    lat: 40.9629,
    lng: -74.1329,
    status: "active",
    meals_served: 3200,
    partners: 8,
    description: "Local favorite serving Glen Rock and surrounding areas",
    contact: "rockngrill@pizzacommunity.org",
    established: "2023-11-20",
  },
  {
    id: 3,
    name: "Uncle Louie's",
    city: "Franklin Lakes",
    country: "USA",
    state: "NJ",
    lat: 41.0168,
    lng: -74.2057,
    status: "active",
    meals_served: 2400,
    partners: 6,
    description: "Community-focused pizzeria in Franklin Lakes",
    contact: "unclelouies@pizzacommunity.org",
    established: "2023-09-10",
  },
  {
    id: 4,
    name: "Haledon Pizza",
    city: "Haledon",
    country: "USA",
    state: "NJ",
    lat: 40.9354,
    lng: -74.1863,
    status: "active",
    meals_served: 1900,
    partners: 4,
    description: "Serving the Haledon community with fresh pizza daily",
    contact: "haledon@pizzacommunity.org",
    established: "2023-08-25",
  },
  {
    id: 5,
    name: "JJ's Pizza",
    city: "Wyandotte",
    country: "USA",
    state: "MI",
    lat: 42.2142,
    lng: -83.1499,
    status: "active",
    meals_served: 3600,
    partners: 9,
    description: "Michigan's favorite since 1974, serving Wyandotte and beyond",
    contact: "jjs@pizzacommunity.org",
    established: "2023-12-05",
  },
  {
    id: 6,
    name: "Coastal Smash",
    city: "Bradenton",
    country: "USA",
    state: "FL",
    lat: 27.4989,
    lng: -82.5748,
    status: "active",
    meals_served: 4100,
    partners: 12,
    description: "Florida's coastal pizza destination in Bradenton",
    contact: "coastalsmash@pizzacommunity.org",
    established: "2023-07-15",
  },
  {
    id: 7,
    name: "Domino's Pizza",
    city: "Chicago",
    country: "USA",
    state: "IL",
    lat: 41.8781,
    lng: -87.6298,
    status: "active",
    meals_served: 5200,
    partners: 15,
    description: "Chicago's premier Domino's location serving the downtown area",
    contact: "chicago@pizzacommunity.org",
    established: "2023-06-20",
  },
];

export const ACTIVE_PARTNER_COUNT = 11;

export function getMapStats(locations = PIZZA_MAP_LOCATIONS) {
  return {
    totalLocations: locations.length,
    activePartners: ACTIVE_PARTNER_COUNT,
  };
}

export type LandingStatsDisplay = {
  totalTransactions: number;
  activePartners: number;
  totalLocations?: number;
};

export function updateLandingStatsOnPage(stats: LandingStatsDisplay) {
  if (typeof document === "undefined") return;

  const totalLocations = stats.totalLocations ?? PIZZA_MAP_LOCATIONS.length;
  const txCount = stats.totalTransactions;
  const partners = stats.activePartners;

  const setText = (id: string, text: string) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };
  const setHtml = (id: string, html: string) => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  };

  setText("total-locations", String(totalLocations));
  setText("total-transactions", txCount.toLocaleString());
  setText("total-partners", String(partners));
  setHtml("crew-stat-locations", `<em>${totalLocations}</em>`);
  setHtml("crew-stat-transactions", `<em>${txCount.toLocaleString()}</em>`);
  setHtml("crew-stat-partners", `<em>${partners}</em>`);
}

/** @deprecated Use updateLandingStatsOnPage */
export const updateMapStatsOnPage = updateLandingStatsOnPage;
