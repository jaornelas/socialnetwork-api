import { Router } from 'express';
const router = Router();

import {
  getUsers,
  getUserByID,
  createNewUser,
  updateUser,
  deleteUser,
  addFriend,
  removeFriend,
} from '../../controllers/user-controller.js';

// /api/users
router.route('/').get(getUsers).post(createNewUser);

// /api/users/:userId
router.route('/:userId').get(getUserByID).put(updateUser).delete(deleteUser);

// /api/users/:userId/friends/:friendId
router.route('/:userId/friends/:friendId').post(addFriend).delete(removeFriend);

export { router as userRoutes };
