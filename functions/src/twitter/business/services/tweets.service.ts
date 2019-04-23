import axios, {AxiosInstance} from 'axios';
import * as admin from 'firebase-admin';
import authentificationService from './authentification.service';

class TweetsService {

    private httpClient: AxiosInstance;

    private db: FirebaseFirestore.Firestore;
    private collection: FirebaseFirestore.CollectionReference;

    constructor() {
        this.httpClient = axios.create({
            baseURL: 'https://api.twitter.com/1.1'
        });

        this.db = admin.firestore();
        this.collection = this.db.collection('tweets');
    }

    public async findAllByCriteria(criteria: string): Promise<Array<any>> {
        const bearerToken = await authentificationService.getBearerToken();

        criteria.replace('@', 'from:');

        return this.httpClient
            .get(`/search/tweets.json?q=${criteria}`,
                {
                    headers: {
                        'Authorization': `Bearer ${bearerToken.access_token}`
                    }
                })
            .then(response => response.data.statuses);
    }

    public async findAllFromTwitterAndSaveThemLocally(editionId: string, criteria: string): Promise<any> {
        const tweetsFromTwitter = await this.findAllByCriteria(criteria);
        const batch = this.db.batch();

        tweetsFromTwitter.forEach(tweet => {
            batch.set(
                this.collection.doc(),
                {
                    text: tweet.text,
                    createdAt: new Date(tweet.created_at),
                    nbOfRetweets: tweet.retweet_count,
                    nbOfLikes: tweet.favorite_count,
                    user: {
                        fullName: tweet.user.name,
                        login: tweet.user.screen_name,
                        profileImageURL: tweet.user.profile_image_url_https
                    }
                });
        });

        return batch.commit();
    }

}

export default new TweetsService();
