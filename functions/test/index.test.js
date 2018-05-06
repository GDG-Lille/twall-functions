const test = require('firebase-functions-test')();
test.mockConfig({
    twitter: {
        consumer: {
            secret: 'SuperSecret',
            key: 'SuperKey'
        }
    },
    default: {
        'get-tweets-for-hashtag': {
            hashtag: '#DevFestLille',
            count: 50
        }
    }
});

// Testing callable functions is not yet supported ...
// https://firebase.google.com/docs/functions/unit-testing#testing_http_functions