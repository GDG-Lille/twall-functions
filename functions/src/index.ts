import * as functions from 'firebase-functions';
import findAllTweetsFromTwitter from './twitter/functions/find-all-tweets-from-twitter';

exports.findAllTweetsFromTwitter = functions.https.onCall(findAllTweetsFromTwitter);
