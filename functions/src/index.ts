import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';
import findAllTweetsFromTwitter from './twitter/functions/find-all-tweets-from-twitter';

admin.initializeApp();

exports.findAllTweetsFromTwitter = functions.https.onCall(findAllTweetsFromTwitter);
