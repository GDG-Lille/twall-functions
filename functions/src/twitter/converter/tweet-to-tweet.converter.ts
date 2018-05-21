import {Tweet} from '../domains/tweet';
import userToTweopleConverter from './user-to-tweople.converter';

/**
 * Manage the conversion between a tweet from Twitter API and a {@link Tweet}.
 */
class TweetToTweetConverter {

    /**
     * Converts a tweet from Twitter API into a {@link Winner}.
     * @param {any} tweet
     * @returns {Tweet}
     */
    public convert(tweet: any): Tweet {
        const tweetConverted = new Tweet();
        tweetConverted.id_str = tweet.id_str;
        tweetConverted.text = tweet.text;
        tweetConverted.created_at = tweet.created_at;
        tweetConverted.retweet_count = tweet.retweet_count;
        tweetConverted.favorite_count = tweet.favorite_count;

        tweet.entities.hashtags.forEach(hashtag => tweetConverted.entities.hashtags.push(hashtag.text));
        tweet.entities.user_mentions.forEach(userMention => tweetConverted.entities.user_mentions.push(userMention.screen_name));

        tweetConverted.user = userToTweopleConverter.convert(tweet.user);

        return tweetConverted;
    }

}

export default new TweetToTweetConverter();