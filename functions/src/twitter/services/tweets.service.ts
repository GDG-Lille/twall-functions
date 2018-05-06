import * as functions from 'firebase-functions';
import {Twitter} from 'twitter-node-client';
import {SearchParameter} from '../domains/search-parameter';
import {Tweet} from '../domains/tweet';

/**
 * Manage interactions about {@link Tweet} with Twitter platform.
 */
class TweetsService {

    private twitterClient: any;

    constructor() {
        this.twitterClient = new Twitter({
            consumerKey: functions.config().twitter.consumer.key,
            consumerSecret: functions.config().twitter.consumer.secret
        });
    }

    /**
     * Retrieve a list of {@link Tweet} via some {@link SearchParameter}.
     * @param {SearchParameter} params
     * @returns {Promise<Array<Tweet>>}
     */
    public getAllBySearch(params: SearchParameter): Promise<Array<Tweet>> {
        return new Promise(
            (resolve: (value: Array<Tweet>) => void, reject: (reason: Error) => void): void => {

                this.twitterClient.getSearch(
                    params,
                    (err) => {
                        console.error(new Error(err)); // Log the true error in StackDriver
                        reject(new Error(`Error retrieving tweet(s) from query ${params.q} from the Twitter platform.`));
                    },
                    (data) => {
                        const tweets = JSON.parse(data).statuses.map(tweet => <Tweet> tweet);
                        resolve(tweets);
                    });

            });
    }

    /**
     * Retrieve a list of {@link Tweet} (by default, limit to 50) via a specific hashtag.
     * @param {string} hashtag
     * @param {number} count
     * @returns {Promise<Array<Tweet>>}
     */
    public getAllForHashtag(hashtag: string, count: number = 50): Promise<Array<Tweet>> {
        const params = new SearchParameter();
        params.q = `${hashtag} -filter:retweets`;
        params.count = count;

        return this.getAllBySearch(params);
    }

}

export default new TweetsService();