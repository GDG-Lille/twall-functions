import axios, {AxiosInstance} from 'axios';
import * as admin from 'firebase-admin';
import authentificationService from './authentification.service';

class TweetsService {

    private httpClient: AxiosInstance;

    private db: FirebaseFirestore.Firestore;
    private collection: FirebaseFirestore.CollectionReference;

    constructor() {
        admin.initializeApp();

        this.httpClient = axios.create({
            baseURL: 'https://api.twitter.com/1.1'
        });

        this.db = admin.firestore();
        this.collection = this.db.collection('tweets');
    }

    public async findAllByCriteria(criteria: string): Promise<Array<any>> {
        console.log(
            'Finding tweets from Twitter on criteria %s ...',
            criteria);

        let bearerToken = null;

        try {
            bearerToken = await authentificationService.findBearerToken();
        } catch (error) {
            throw error;
        }

        const encodedCriteria = encodeURIComponent(criteria);

        try {
            const response = await this.httpClient
                .get(`/search/tweets.json?q=${encodedCriteria} -filter:retweets`,
                    {
                        headers: {
                            'Authorization': `Bearer ${bearerToken.access_token}`
                        }
                    });
            return response.data.statuses;
        } catch (error) {
            const technicalError = new Error(`Failed to find tweets from Twitter on criteria ${criteria}.`);
            console.error(technicalError, error);
            throw technicalError;
        }
    }

    public async findAllFromTwitterAndSaveThemLocally(editionId: string, criteria: string): Promise<any> {
        console.log(
            'Finding and saving tweets from Twitter for editionId %s on criteria %s ...',
            editionId,
            criteria);

        let tweetsFromTwitter = [];

        try {
            tweetsFromTwitter = await this.findAllByCriteria(criteria);
        } catch (error) {
            throw error;
        }

        const batch = this.db.batch();

        tweetsFromTwitter.forEach(tweet => {
            batch.set(
                this.collection.doc(tweet.id_str),
                {
                    text: tweet.text,
                    createdAt: new Date(tweet.created_at),
                    nbOfRetweets: tweet.retweet_count,
                    nbOfLikes: tweet.favorite_count,
                    user: {
                        fullName: tweet.user.name,
                        login: tweet.user.screen_name,
                        profileImageURL: tweet.user.profile_image_url_https
                    },
                    edition: editionId,
                    criteria: criteria
                });
        });

        try {
            return await batch.commit();
        } catch (error) {
            const technicalError = new Error(`Failed to find and save tweets from Twitter for editionId ${editionId} on criteria ${criteria}.`);
            console.error(technicalError, error);
            throw technicalError;
        }
    }

}

export default new TweetsService();
