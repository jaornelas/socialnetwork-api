import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Thought } from '../models/index.js';

dotenv.config();

const users = [
    {
        username: 'allison_apple',
        email: 'alice@example.com',
    },
    {
        username: 'batman',
        email: 'batman@example.com',
    },
    {
        username: 'cheech&chong',
        email: 'cheech&chong@example.com',
    },
];

const thoughts = [
    {
        thoughtText: 'Really enjoying this social media site!',
        username: 'allison_apple',
        reactions: [
            {
                reactionBody: 'Yes, queen!',
                username: 'batman',
            },
            {
                reactionBody: 'Love that for you!',
                username: 'cheech&chong',
            },
        ],
    },
    {
        thoughtText: 'I ♥️ neighborhood watch',
        username: 'batman',
        reactions: [
            {
                reactionBody: 'ummm... ok',
                username: 'cheech&chong',
            },
        ],
    },
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/socialDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('🌱 Connected to DB');

        // Clear existing data
        await User.deleteMany();
        await Thought.deleteMany();

        // Create users
        const [allison, batman, cheech] = await User.insertMany(users);
        // Add some friendships
        await User.findByIdAndUpdate(allison._id, {
            $addToSet: { friends: [batman._id, cheech._id] }
        });

        await User.findByIdAndUpdate(batman._id, {
            $addToSet: { friends: [allison._id] }
        });

        await User.findByIdAndUpdate(cheech._id, {
            $addToSet: { friends: [allison._id] }
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