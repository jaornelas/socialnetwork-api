import { Request, Response } from 'express';
import { User, Thought } from '../models/index.js';

//get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const dbUserData = await User.find()
            .select('-__v')

        return res.json(dbUserData)
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
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
            return res.status(404).json({ message: 'No user with this ID' })
        }
    }
}

//create a new user
export const createNewUser = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.create(req.body);
        return res.json(dbUserData)
    } catch (err) {
        console.log(err);
        return res.status(500).json(err)
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
            return res.status(404).json({ message: 'No users with this ID' });
        }

        return res.json(dbUserData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err)
    }
}

//delete a user
export const deleteUsers = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndDelete({ _id: req.params.userId })

        if (!dbUserData) {
            return res.status(404).json({ message: 'No users with this ID' });
        }

        await Thought.deleteMany({ _id: { $in: dbUserData.thoughts } });
        return res.json({ message: 'User and respective thoughts were deleted' });
    }

}

//add a friend to friend list
export const addFriend = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId },
            { $addToSet: { friends: req.params.friendId } },
            { new: true });

        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this ID' });
        }

        return res.json(dbUserData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

//remove friend from friend list
export const removeFriend = async (req: Request, res: Response) => {
    try {
        const dbUserData = await User.findOneAndUpdate({ _id: req.params.userId },
            { $pull: { friends: req.params.friendId } },
            { new: true });

        if (!dbUserData) {
            return res.status(404).json({ message: 'No user with this ID' });
        }

        return res.json(dbUserData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
};
