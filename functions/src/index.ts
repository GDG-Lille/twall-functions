import * as functions from 'firebase-functions';
import tweetsService from './twitter/services/tweets.service';

/**
 * Retrieve a list of {@link Tweet} with a specific hashtag.
 * @type {HttpsFunction}
 */
export const getTweetsForHashtag = functions.https.onRequest((req, res) => {
    const hashtag = req.query.hashtag || functions.config().default['get-tweets-for-hashtag'].hashtag;
    const count = req.query.count || functions.config().default['get-tweets-for-hashtag'].count;

    tweetsService.getAllForHashtag(hashtag, count)
        .then(
            tweets => res.send(tweets),
            err => res.status(500).send(err));
});