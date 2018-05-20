import {Tweople} from '../domains/tweople';

/**
 * Manage the conversion between a user from Twitter API and a {@link Tweople}.
 */
class UserToTweopleConverter {

    /**
     * Converts a user from Twitter API into a {@link Tweople}.
     * @param {any} user
     * @returns {Tweople}
     */
    public convert(user: any): Tweople {
        const tweople = new Tweople();
        tweople.id_str = user.id_str;
        tweople.name = user.name;
        tweople.profile_image_url_https = user.profile_image_url_https;
        tweople.screen_name = user.screen_name;

        return tweople;
    }

}

export default new UserToTweopleConverter();