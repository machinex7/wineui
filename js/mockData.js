/**
 * Hardcoded test data standing in for the backend API for now.
 * Shapes follow the DTOs in js/api/models.js.
 */

/** Test credentials accepted by the mock login. */
export const MOCK_CREDENTIALS = {
	username: "testuser",
	password: "wine123",
};

/** @type {import('./api/models').LoginResponse} */
export const mockLoginResponse = {
	id_user: 1,
	name: "Alex Rivera",
};

/**
 * @type {Array<import('./api/models').LocationDTO & {rating: number}>}
 * None of these have a `photo` path yet - once the backend fills in
 * LocationDTO.photo, the winery detail page will pick it up automatically.
 */
export const mockWineries = [
	{
		id_location: 101,
		id_company: 11,
		loc_name: "Rolling Hills Vineyard",
		loc_type: "Winery",
		city: "Napa",
		state: "CA",
		address1: "1200 Vine Row",
		lat: 38.2975,
		lng: -122.2869,
		rating: 4.5,
		userRating: 4.5,
	},
	{
		id_location: 102,
		id_company: 12,
		loc_name: "Stone Ridge Cellars",
		loc_type: "Winery",
		city: "Walla Walla",
		state: "WA",
		address1: "88 Basalt Ln",
		lat: 46.0646,
		lng: -118.343,
		rating: 4,
		userRating: 4,
	},
	{
		id_location: 103,
		id_company: 13,
		loc_name: "Whispering Oak Estate",
		loc_type: "Vineyard",
		city: "Willamette Valley",
		state: "OR",
		address1: "42 Fern Rd",
		lat: 45.2712,
		lng: -123.1265,
		rating: 3.5,
	},
	{
		id_location: 104,
		id_company: 14,
		loc_name: "Sunset Terrace Winery",
		loc_type: "Winery",
		city: "Paso Robles",
		state: "CA",
		address1: "500 Ridgeline Dr",
		lat: 35.6369,
		lng: -120.6545,
		rating: 5,
		userRating: 5,
	},
];

/** @type {Array<{id_location: number, winery: string, location: string, rating: number, ratedOn: string}>} */
export const mockRecentWineryRatings = [
	{ id_location: 101, winery: "Rolling Hills Vineyard", location: "Napa, CA", rating: 4.5, ratedOn: "2026-08-30" },
	{ id_location: 104, winery: "Sunset Terrace Winery", location: "Paso Robles, CA", rating: 5, ratedOn: "2026-08-22" },
	{ id_location: 102, winery: "Stone Ridge Cellars", location: "Walla Walla, WA", rating: 4, ratedOn: "2026-08-14" },
];

/**
 * Wines belonging to each winery, keyed by id_company. `rating` on the outer
 * object is the current user's own rating for that wine and is only present
 * once they've rated it; `product.rating` is the wine's overall/community
 * rating, shown as a fallback when the user hasn't rated it yet.
 * @type {Record<number, Array<import('./api/models').WineDetailDTO>>}
 */
export const mockWineryWines = {
	11: [
		{
			product: {
				id_product: 201,
				id_company: 11,
				product_name: "Estate Cabernet Sauvignon",
				wine_color: "Red",
				abv: 14.2,
				residual_sugar: 2.1,
				description: "Bold notes of blackberry, cedar, and a lingering oak finish.",
				rating: 4.5,
				approved: 1,
			},
			rating: 5,
		},
		{
			product: {
				id_product: 205,
				id_company: 11,
				product_name: "Sauvignon Blanc",
				wine_color: "White",
				abv: 12.8,
				residual_sugar: 1.4,
				description: "Bright grapefruit and fresh-cut grass with a clean, dry finish.",
				rating: 4,
				approved: 1,
			},
		},
	],
	12: [
		{
			product: {
				id_product: 203,
				id_company: 12,
				product_name: "Blush Rosé",
				wine_color: "Rose",
				abv: 12.1,
				residual_sugar: 5.6,
				description: "Light strawberry and citrus with a dry, refreshing finish.",
				rating: 3.5,
				approved: 1,
			},
			rating: 3.5,
		},
		{
			product: {
				id_product: 206,
				id_company: 12,
				product_name: "Barrel Reserve Merlot",
				wine_color: "Red",
				abv: 13.9,
				residual_sugar: 2.8,
				description: "Soft plum and chocolate notes with a smooth, velvety body.",
				rating: 4.2,
				approved: 1,
			},
		},
	],
	13: [
		{
			product: {
				id_product: 204,
				id_company: 13,
				product_name: "Late Harvest Riesling",
				wine_color: "Dessert",
				abv: 10.5,
				residual_sugar: 9.8,
				description: "Honeyed apricot and peach with a silky, sweet finish.",
				rating: 4.5,
				approved: 1,
			},
			rating: 4.5,
		},
		{
			product: {
				id_product: 207,
				id_company: 13,
				product_name: "Willamette Pinot Noir",
				wine_color: "Red",
				abv: 13.2,
				residual_sugar: 1.9,
				description: "Delicate red cherry and earth with silky tannins.",
				rating: 4,
				approved: 1,
			},
		},
	],
	14: [
		{
			product: {
				id_product: 202,
				id_company: 14,
				product_name: "Reserve Chardonnay",
				wine_color: "White",
				abv: 13.5,
				residual_sugar: 3.4,
				description: "Crisp green apple and vanilla with a buttery mouthfeel.",
				rating: 4,
				approved: 1,
			},
			rating: 4,
		},
		{
			product: {
				id_product: 208,
				id_company: 14,
				product_name: "Estate Zinfandel",
				wine_color: "Red",
				abv: 14.6,
				residual_sugar: 3.1,
				description: "Jammy blackberry and pepper spice with a warm finish.",
				rating: 4.3,
				approved: 1,
			},
		},
	],
};

/** @type {Array<{product: import('./api/models').ProductDTO, rating: number, winery: string, ratedOn: string}>} */
export const mockRecentWineRatings = [
	{
		product: {
			id_product: 201,
			id_company: 11,
			product_name: "Estate Cabernet Sauvignon",
			wine_color: "Red",
			abv: 14.2,
			residual_sugar: 2.1,
			description: "Bold notes of blackberry, cedar, and a lingering oak finish.",
			rating: 4.5,
			approved: 1,
		},
		rating: 5,
		winery: "Rolling Hills Vineyard",
		ratedOn: "2026-09-02",
	},
	{
		product: {
			id_product: 202,
			id_company: 14,
			product_name: "Reserve Chardonnay",
			wine_color: "White",
			abv: 13.5,
			residual_sugar: 3.4,
			description: "Crisp green apple and vanilla with a buttery mouthfeel.",
			rating: 4,
			approved: 1,
		},
		rating: 4,
		winery: "Sunset Terrace Winery",
		ratedOn: "2026-08-27",
	},
	{
		product: {
			id_product: 203,
			id_company: 12,
			product_name: "Blush Rosé",
			wine_color: "Rose",
			abv: 12.1,
			residual_sugar: 5.6,
			description: "Light strawberry and citrus with a dry, refreshing finish.",
			rating: 3.5,
			approved: 1,
		},
		rating: 3.5,
		winery: "Stone Ridge Cellars",
		ratedOn: "2026-08-19",
	},
	{
		product: {
			id_product: 204,
			id_company: 13,
			product_name: "Late Harvest Riesling",
			wine_color: "Dessert",
			abv: 10.5,
			residual_sugar: 9.8,
			description: "Honeyed apricot and peach with a silky, sweet finish.",
			rating: 4.5,
			approved: 1,
		},
		rating: 4.5,
		winery: "Whispering Oak Estate",
		ratedOn: "2026-08-11",
	},
];
