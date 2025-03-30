import { Reqest, Response } from 'express';
import { Thought, User } from '../models/index.js'

//get all thoughts
export default getThoughts =  async (_req: Request, res: Response) => {
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
export const getSingleThought = async (_req: Request, res: Response) => {

}

//create thought 
export const createThought = async (_req: Request, res: Response) => {

}

//update thought
export const updateThought = async (_req: Request, res: Response) => {

}

//delete thought 
export const deleteThought = async (_req: Request, res: Response) => {

}

//add reaction to thought 
export const addReaction = async (_req: Request, res: Response) => {

}

//remove reaction from thought
export const removeReaction = async (_req: Request, res: Response) => {

}