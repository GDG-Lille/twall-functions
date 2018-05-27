import * as cors from 'cors';

import * as functions from 'firebase-functions';
import tweetsService from './twitter/services/tweets.service';

/**
 * Retrieve a list of {@link Tweet} with a specific hashtag.
 * @type {HttpsFunction}
 */
export const getTodaysTweetsForHashtag = functions.https.onRequest((req, res) => {
    cors({origin: functions.config().cors.origin.split(',')})(req, res, () => {
        const hashtag = req.query.hashtag;
        const count = req.query.count;

        if (hashtag === undefined || count === undefined) {
            res.sendStatus(400);
        }

        tweetsService.getTodaysTweetsForHashtag(hashtag, count)
            .then(
                tweets => res.send(tweets),
                err => res.status(500).send(err));
    });
});

/**
 * Compute a list of today's {@link Metric} hour by hour for a specific hashtag.
 * @type {HttpsFunction}
 */
export const getTodaysMetricsForHashtag = functions.https.onRequest((req, res) => {
    cors({origin: functions.config().cors.origin.split(',')})(req, res, () => {
        const hashtag = req.query.hashtag;

        if (hashtag === undefined) {
            res.sendStatus(400);
        }

        tweetsService.getTodaysMetricsForHashtag(hashtag)
            .then(
                metrics => res.send(metrics),
                err => res.status(500).send(err));
    });
});