//Auto-generated! Do not edit.
import * as Enums from './enums'

export interface LoginResponse {
	name: string | undefined,
	id_user: number,
}

export interface WinerySearchResultDTO {
	location: LocationDTO | undefined,
	ratingForSimilarUsers: number | undefined,
	userRating: number,
}

export interface WineDetailDTO {
	product: ProductDTO | undefined,
	rating: number | undefined,
	id_flavors: Array<number>,
}

export interface ProductDTO {
	rating: number,
	approved: number,
	body: number | undefined,
	product_name: string | undefined,
	id_company: number,
	wine_color: Enums.WineColorEnum | undefined,
	abv: number | undefined,
	residual_sugar: number | undefined,
	id_product: number,
	ph: number | undefined,
	description: string | undefined,
}

export interface LocationDTO {
	state: string | undefined,
	rating: number,
	id_company: number,
	loc_name: string | undefined,
	loc_type: string | undefined,
	id_location: number,
	address2: string | undefined,
	city: string | undefined,
	lat: number | undefined,
	address1: string | undefined,
	lng: number | undefined,
	zip: number | undefined,
}

