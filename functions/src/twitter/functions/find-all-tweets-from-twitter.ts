import * as functions from 'firebase-functions';

import tweetsService from '../business/services/tweets.service';

const packageInfos = require('../../../package.json');

export default async (data, context) => {
    if (data === undefined || data === null) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'You must provide an edition\'s ID and a search criteria.');
    }

    const editionId = data.editionId;
    const criteria = data.criteria;

    if (editionId === undefined) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'You must provide an edition\'s ID.');
    }

    if (criteria === undefined) {
        throw new functions.https.HttpsError(
            'invalid-argument',
            'You must provide a search criteria.');
    }

    try {
        await tweetsService.findAllFromTwitterAndSaveThemLocally(editionId, criteria);
        return {status: 'OK'};
    } catch (error) {
        throw new functions.https.HttpsError(
            'internal',
            `Failed to find and save tweets from Twitter. Please open an issue at ${packageInfos.bugs.url}.`);
    }
};
