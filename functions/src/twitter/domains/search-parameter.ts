/**
 * Define available parameter for the Search Api.
 */
export class SearchParameter {

    constructor(public q?: string,
                public count: number = 50,
                public result_type: string = 'recent') {
    }

}