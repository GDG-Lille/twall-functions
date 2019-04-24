import * as functions from 'firebase-functions';

import tweetsService from '../business/services/tweets.service';

export default (data, context) => {
    const params = data.params;

    if (params === undefined || data.params === null) {
        throw new functions.https.HttpsError(
            'invalid-argument', 'You must provide an edition\'s ID and a search criteria.');
    }

    const editionId = params.editionId;
    const criteria = params.criteria;

    if (editionId === undefined) {
        throw new functions.https.HttpsError(
            'invalid-argument', 'You must provide an edition\'s ID.');
    }

    if (criteria === undefined) {
        throw new functions.https.HttpsError(
            'invalid-argument', 'You must provide a search criteria.');
    }

    console.log('editionId', editionId, 'criteria', criteria);

    return tweetsService
        .findAllFromTwitterAndSaveThemLocally(editionId, criteria)
        .then(() => {
            return null;
        });
};
