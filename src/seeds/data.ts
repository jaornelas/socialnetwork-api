import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index.js';

dotenv.config();

const users = [
    {
        username: 'pink_panther',
        email: 'pinky@panther.com',
    },
    {
        username: 'vegeta',
        email: 'vegeta@supersaiyans.com',
    },
    {
        username: 'flyingFish',
        email: 'flyingFish@reels.com',
    },
    {
        username: 'stephenkingfan',
        email: 'theshining@kingfans.com',
    },
];

const thoughts = [
    {
        thoughtText: 'I really hope I pull of this robbery',
        username: 'pink_panther',
        reactions: [
            {
                reactionBody: 'How much are you going for?!',
                username: 'vegeta',
            },
            {
                reactionBody: 'This sounds like a great idea for a book!',
                username: 'stephenkingfan',
            },
        ],
    },
    {
        thoughtText: 'That dang Kakarot is always getting in my way',
        username: 'vegeta',
        reactions: [
            {
                reactionBody: 'ummm... ok',
                username: 'flyingFish',
            },
        ],
    },
    {
        thoughtText: 'Swimming is such a good way to excercise your whole body',
        username: 'flyingFish',
        reactions: [
            {
                reactionBody: 'I could not agree more',
                username: 'vegeta',
            }
        ]
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialnetwork', {
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });

        console.log('🌱 Connected to DB');

        // Clear existing data
        await User.deleteMany();
        await Thought.deleteMany();

        // Create users
        const [pinky, vegeta, flyingfish, stephenking] = await User.insertMany(users);

        // Add some friendships
        await User.findByIdAndUpdate(pinky._id, {
            $addToSet: { friends: [vegeta._id, stephenking._id, flyingfish] }
        });

        await User.findByIdAndUpdate(vegeta._id, {
            $addToSet: { friends: [pinky._id, flyingfish._id] }
        });

        await User.findByIdAndUpdate(stephenking._id, {
            $addToSet: { friends: [vegeta._id] }
        });

        // Create thoughts and attach to users
        for (const thoughtData of thoughts) {
            const createdThought = await Thought.create(thoughtData);

            // Add thought to the user who wrote it
            await User.findOneAndUpdate(
                { username: thoughtData.username },
                { $push: { thoughts: createdThought._id } }
            );
        }

        console.log('✅ Seed data added!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error seeding data:', err);
        process.exit(1);
    }
};

export default seedData;