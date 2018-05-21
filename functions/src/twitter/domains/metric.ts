import {Serie} from './serie';

/**
 * Define a metric.
 */
export class Metric {

    constructor(public name?: string,
                public series?: Array<Serie>) {
    }

}