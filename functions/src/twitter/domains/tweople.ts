/**
 * Define a user from Twitter.
 */
export class Tweople {

    constructor(public id_str?: string,
                public name?: string,
                public description?: string,
                public profile_image_url_https?: string,
                public profile_background_image_url_https?: string,
                public screenName?: string,
                public url?: string,
                public verified?: boolean,
                public profileImage?: string) {
    }

}