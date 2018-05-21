/**
 * Define a user from Twitter.
 */
export class Tweople {

    constructor(public id_str?: string,
                public name?: string,
                public profile_image_url_https?: string,
                public screen_name?: string) {
    }

}