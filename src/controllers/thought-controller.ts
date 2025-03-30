import { Request, Response } from 'express';
import { Thought, User } from '../models/index.js'

//get all thoughts
export const getThoughts =  async (_req: Request, res: Response) => {
    try {
        const dbThoughtData = await Thought.find()
        .sort({ createdAt: -1 });

        return res.json (dbThoughtData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

//get single thought by ID
export const getSingleThought = async (req: Request, res: Response) => {
    try {
        const dbThoughtData = await Thought.findOne({ _id: req.params.thoughtId });

        if (!dbThoughtData) {
            return res.status(404).json({ message: 'No thoughts with this ID' });
        }

        return res.json(dbThoughtData);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

//create thought 
export const createThought = async (req: Request, res: Response) => {
    try {
        const dbThoughtData = await Thought.create(req.body);

        const dbUserData = await User.findOneAndUpdate(
            { _id: req.body.userId },
            { $push: { thoughts: dbThoughtData._id }},
            { new: true }
        );

        if (!dbUserData) {
            return res.status(404).json({ message: 'Thought created but could not find user with this ID'});
        }

        return res.json({ message: 'Thought successfully created!' });
    } catch (err) {
        console.log(err);
        return res.status(500).json(err);
    }
}

//update thought
export const updateThought = async (req: Request, res: Response) => {

}

//delete thought 
export const deleteThought = async (req: Request, res: Response) => {

}

//add reaction to thought 
export const addReaction = async (req: Request, res: Response) => {

}

//remove reaction from thought
export const removeReaction = async (req: Request, res: Response) => {

}