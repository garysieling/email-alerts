import {isEligible} from './util/schedule';

const testDay = new Date(Date.parse("August 21, 2017"));
const lastSent = new Date(Date.parse("August 7, 2017"));
const lastEligible = new Date(Date.parse("August 7, 2017"));

console.log(isEligible(testDay, lastSent, lastEligible));