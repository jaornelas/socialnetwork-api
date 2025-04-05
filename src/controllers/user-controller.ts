import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

//get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const dbUserData = await User.find()
            .select('-__v')

        res.json(dbUserData)
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//get single user by ID
export const getUserByID = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOne({ _id: req.params.userId })
            .select('-__v')
            .populate('friends')
            .populate('thoughts');

        if (!dbUserData) {
            res.status(404).json({ message: 'No user with this ID' })
        }
        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//create a new user
export const createNewUser = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.create(req.body);
        res.json(dbUserData)
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

//update a user
export const updateUser = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndUpdate(
            { _id: req.params.userId },
            { $set: req.body },
            {
                runValidators: true,
                new: true,
            }
        );

        if (!dbUserData) {
            res.status(404).json({ message: 'No users with this ID' });
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err)
    }
}

//delete a user
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId })

        if (!dbUserData) {
            res.status(404).json({ message: 'No users with this ID' });
        }

        if (dbUserData) {
            await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        }
        res.json({ message: 'User and respective thoughts were deleted' });
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }

}

//add a friend to friend list
export const addFriend = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true });

        if (!dbUserData) {
            res.status(404).json({ message: 'No user with this ID' });
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
}

//remove friend from friend list
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true });

        if (!dbUserData) {
            res.status(404).json({ message: 'No user with this ID' });
        }

        res.json(dbUserData);
    } catch (err) {
        console.log(err);
        res.status(500).json(err);
    }
};
