//Auto-generated! Do not edit.
import Remote from './Remote';

export const RemotePublicServlet = {
	/**
	 * @returns {Promise<string|undefined>}
	 */
	getVersion: async function() {
		return Remote._request('/public', 'get');
	}
};

export const RemoteSessionServlet = {
	/**
	 * @param {string} string
	 * @returns {Promise<import('./models').LoginResponse|undefined>}
	 */
	login: async function(string) {
		return Remote._request('/session', 'post', string);
	}
};

export const RemoteWineryServlet = {
	/**
	 * @param {number} lat
	 * @param {number} lng
	 * @returns {Promise<import('./models').LocationDTO|undefined>}
	 */
	findClosestWinery: async function(lat, lng) {
		return Remote._request('/winery/search/closest?lat=' + lat + '&lng=' + lng + '', 'get');
	},
	/**
	 * @param {number} lat
	 * @param {number} lng
	 * @param {string|undefined} name
	 * @param {number} range
	 * @returns {Promise<Array<import('./models').WinerySearchResultDTO>>}
	 */
	searchWineries: async function(lat, lng, name, range) {
		return Remote._request('/winery/search/location?lat=' + lat + '&lng=' + lng + '&name=' + name + '&range=' + range + '', 'get');
	},
	/**
	 * @param {import('./models').LocationDTO} locationDTO
	 * @returns {Promise<import('./models').LocationDTO|undefined>}
	 */
	createWinery: async function(locationDTO) {
		return Remote._request('/winery', 'put', locationDTO);
	},
	/**
	 * @param {number} company
	 * @returns {Promise<Array<import('./models').ProductDTO>>}
	 */
	getProductsForCompany: async function(company) {
		return Remote._request('/winery/' + company + '/products', 'get');
	},
	/**
	 * @param {number} company
	 * @param {number} user
	 * @returns {Promise<Array<import('./models').WineDetailDTO>>}
	 */
	getProductsForCompanyWithReview: async function(company, user) {
		return Remote._request('/winery/' + company + '/products/' + user + '', 'get');
	}
};

export const RemoteProductServlet = {
	/**
	 * @param {import('./models').WineDetailDTO} wineDetailDTO
	 * @param {number} user
	 * @returns {Promise<void>}
	 */
	upsertProduct: async function(wineDetailDTO, user) {
		return Remote._request('/product?user=' + user + '', 'put', wineDetailDTO);
	},
	/**
	 * @param {number} id_product
	 * @param {number} rating
	 * @param {number} id_user
	 * @param {string} string
	 * @returns {Promise<void>}
	 */
	rateProduct: async function(id_product, rating, id_user, string) {
		return Remote._request('/product/' + id_product + '?rating=' + rating + '&id_user=' + id_user + '', 'put', string);
	}
};
