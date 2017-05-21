import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';

export const Tweets = new Mongo.Collection('tweets')

export const getCount = () => {
	return Tweets.count()
}