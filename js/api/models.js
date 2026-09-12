//Auto-generated! Do not edit.

/**
 * @typedef {Object} LoginResponse
 * @property {string} [name]
 * @property {number} id_user
 */

/**
 * @typedef {Object} WinerySearchResultDTO
 * @property {LocationDTO} [location]
 * @property {number} [ratingForSimilarUsers]
 * @property {number} userRating
 */

/**
 * @typedef {Object} WineDetailDTO
 * @property {ProductDTO} [product]
 * @property {number} [rating]
 * @property {Array<number>} id_flavors
 */

/**
 * @typedef {Object} ProductDTO
 * @property {number} rating
 * @property {number} approved
 * @property {number} [body]
 * @property {string} [product_name]
 * @property {number} id_company
 * @property {import('./enums').WineColorEnum} [wine_color]
 * @property {number} [abv]
 * @property {number} [residual_sugar]
 * @property {number} id_product
 * @property {number} [ph]
 * @property {string} [description]
 */

/**
 * @typedef {Object} LocationDTO
 * @property {string} [state]
 * @property {number} rating
 * @property {number} id_company
 * @property {string} [loc_name]
 * @property {string} [loc_type]
 * @property {number} id_location
 * @property {string} [address2]
 * @property {string} [city]
 * @property {number} [lat]
 * @property {string} [address1]
 * @property {number} [lng]
 * @property {number} [zip]
 * @property {string} [photo]
 * @property {number} [userRating]
 */

export {};
