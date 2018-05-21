import {Twentities} from './twentities';
import {Tweople} from './tweople';

/**
 * Define a tweet.
 */
export class Tweet {

    constructor(public id_str?: string,
                public user?: Tweople,
                public text?: string,
                public created_at?: Date,
                public retweet_count?: number,
                public favorite_count?: number,
                public entities = new Twentities()) {
    }

}