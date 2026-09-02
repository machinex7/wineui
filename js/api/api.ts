//Auto-generated! Do not edit.
import * as Enums from './enums';
import * as Models from './models';
import Remote from './Remote';

export const RemotePublicServlet = {
	getVersion: async function(): Promise<string | undefined> {
		return Remote._request('/public', 'get');
	}
};

export const RemoteSessionServlet = {
	login: async function(string: string): Promise<Models.LoginResponse | undefined> {
		return Remote._request('/session', 'post', string);
	}
};

export const RemoteWineryServlet = {
	findClosestWinery: async function(lat: number, lng: number): Promise<Models.LocationDTO | undefined> {
		return Remote._request('/winery/search/closest?lat=' + lat + '&lng=' + lng + '', 'get');
	},
	searchWineries: async function(lat: number, lng: number, name: string | undefined, range: number): Promise<Array<Models.WinerySearchResultDTO>> {
		return Remote._request('/winery/search/location?lat=' + lat + '&lng=' + lng + '&name=' + name + '&range=' + range + '', 'get');
	},
	createWinery: async function(locationDTO: Models.LocationDTO): Promise<Models.LocationDTO | undefined> {
		return Remote._request('/winery', 'put', locationDTO);
	},
	getProductsForCompany: async function(company: number): Promise<Array<Models.ProductDTO>> {
		return Remote._request('/winery/' + company + '/products', 'get');
	},
	getProductsForCompanyWithReview: async function(company: number, user: number): Promise<Array<Models.WineDetailDTO>> {
		return Remote._request('/winery/' + company + '/products/' + user + '', 'get');
	}
};

export const RemoteProductServlet = {
	upsertProduct: async function(wineDetailDTO: Models.WineDetailDTO, user: number): Promise<void> {
		return Remote._request('/product?user=' + user + '', 'put', wineDetailDTO);
	},
	rateProduct: async function(id_product: number, rating: number, id_user: number, string: string): Promise<void> {
		return Remote._request('/product/' + id_product + '?rating=' + rating + '&id_user=' + id_user + '', 'put', string);
	}
};

