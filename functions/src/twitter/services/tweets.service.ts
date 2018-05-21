import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import {Twitter} from 'twitter-node-client';
import tweetToTweetConverter from '../converter/tweet-to-tweet.converter';
import {Metric} from '../domains/metric';
import {SearchParameter} from '../domains/search-parameter';
import {Serie} from '../domains/serie';
import {Tweet} from '../domains/tweet';

/**
 * Manage interactions about {@link Tweet} with Twitter platform.
 */
class TweetsService {

    private twitterClient: Twitter;
    private db: any;

    constructor() {
        this.twitterClient = new Twitter({
            consumerKey: functions.config().twitter.consumer.key,
            consumerSecret: functions.config().twitter.consumer.secret
        });
        admin.initializeApp();
        this.db = admin.database();
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
                    err => {
                        console.error(new Error(err)); // Log the true error in StackDriver
                        reject(new Error(`Error retrieving tweet(s) from query ${params.q} from the Twitter platform.`));
                    },
                    data => {
                        const tweets = JSON.parse(data).statuses.map(tweet => tweetToTweetConverter.convert(tweet));
                        this.saveAll(tweets).catch(err => console.error(new Error(err)));
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

    /**
     * Compute a list of today's {@link Metric} hour by hour for a specific hashtag.
     * @param {string} hashtag
     * @returns {Promise<Array<Metric>>}
     */
    public getTodaysMetricsForHashtag(hashtag: string): Promise<Array<Metric>> {
        return new Promise(
            (resolve: (value: Array<Metric>) => void, reject: (reason: Error) => void): void => {

                const today = new Date();
                today.setHours(0, 0, 0);

                this.db.ref('tweets')
                    .once('value', datas => {
                        const series = [];
                        const tweets = [];

                        datas.forEach(data => {
                            const tweet = data.val();
                            tweet.created_at = new Date(tweet.created_at);
                            tweets.push(tweet);
                        });

                        tweets.filter(tweet => tweet.created_at >= today) // Only tweets for todays
                            .filter(tweet => tweet.entities !== undefined && tweet.entities.hashtags !== undefined) // Only tweets with hashtags
                            .filter(tweet => tweet.entities.hashtags.find(hashtagFromEntities => hashtagFromEntities.toLowerCase() === hashtag.substring(1).toLowerCase()) !== undefined) // Only tweet with specific hashtag
                            .forEach(tweet => {
                                const hour = tweet.created_at.getHours();
                                let serieFound = series.find(serie => serie.name === hour);

                                if (serieFound === undefined) {
                                    serieFound = new Serie();
                                    serieFound.name = hour;
                                    serieFound.value = 1;
                                    series.push(serieFound);
                                } else {
                                    serieFound.value++;
                                }
                            });

                        series.sort((a, b) => a.name - b.name);

                        const metrics = [];
                        metrics.push(hashtag, series);
                        resolve(metrics);
                    });
            });
    }

    /**
     * Persist all {@link Tweet} in DB.
     * @param {Array<Tweet>} tweets
     * @returns {Promise<void>}
     */
    public saveAll(tweets: Array<Tweet>): Promise<void> {
        return new Promise(
            (resolve: (value: void) => void, reject: (reason: Error) => void): void => {

                tweets.forEach(tweet => {
                    this.db
                        .ref(`tweets/${tweet.id_str}`)
                        .set(tweet)
                        .catch(err => console.error(new Error(err)));
                });

                resolve(null);

            });
    }

}

export default new TweetsService();