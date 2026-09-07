/**
 * Shared helpers for tracking and locating the user's current winery.
 * Backed by localStorage and mock data for now.
 */
import { mockWineries } from "./mockData.js";

const LAST_WINERY_KEY = "wineui.lastWineryId";

/**
 * Marks a winery as the one the user last checked in to.
 * @param {import('./mockData').mockWineries[number]} winery
 */
export function checkIn(winery) {
	localStorage.setItem(LAST_WINERY_KEY, String(winery.id_location));
}

/**
 * @returns {import('./mockData').mockWineries[number]|undefined}
 */
export function getLastWinery() {
	const lastId = Number(localStorage.getItem(LAST_WINERY_KEY));
	return mockWineries.find((winery) => winery.id_location === lastId);
}

/**
 * Haversine distance between two lat/lng points, in kilometers.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 */
function distanceKm(lat1, lng1, lat2, lng2) {
	const toRad = (deg) => (deg * Math.PI) / 180;
	const earthRadiusKm = 6371;
	const dLat = toRad(lat2 - lat1);
	const dLng = toRad(lng2 - lng1);
	const a =
		Math.sin(dLat / 2) ** 2 + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
	return earthRadiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * @param {number} lat
 * @param {number} lng
 * @returns {import('./mockData').mockWineries[number]}
 */
export function findNearestWinery(lat, lng) {
	// TODO: replace with RemoteWineryServlet.findClosestWinery() once the backend is wired up.
	return mockWineries.reduce((closest, winery) =>
		distanceKm(lat, lng, winery.lat, winery.lng) < distanceKm(lat, lng, closest.lat, closest.lng) ? winery : closest
	);
}
