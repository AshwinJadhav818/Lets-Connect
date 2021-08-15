// ! Imports
import { Router } from 'express';
import User from '../modals/User.js';
import bcrypt from 'bcrypt';

// ! Router Config
var router = new Router();

// ! Route
// ? Update User
router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				req.body.password = await bcrypt.hash(req.body.password, salt);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
		try {
			const user = await User.findByIdAndUpdate(req.params.id, {
				$set: req.body,
			});
			res.status(200).json('Account has been updated');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You can update only your account!');
	}
});

// ? Delete A User
router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			const user = await User.findByIdAndDelete(req.params.id);
			res.status(200).json('Account has been deleted successfully');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You can delete only your account!');
	}
});

// ? Get A User
router.get('/:id', async (req, res) => {
	try {
		const user = await User.findById(req.params.id);
		const { password, updatedAt, isAdmin, ...other } = user._doc;
		res.status(200).json(other);
	} catch (err) {
		return res.status(500).json(err);
	}
});

// ? Follow A User
router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);

			if (!user.followers.includes(req.body.userId)) {
				await user.updateOne({ $push: { followers: req.body.userId } });
				await currentUser.updateOne({ $push: { followings: req.params.id } });

				res.status(200).json('User has been followed');
			} else {
				return res.status(403).json('You already follow this user');
			}
			res.status(200).json('User has been followed');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You cannot follow only yourself!');
	}
});

// ? Unfollow A User
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const user = await User.findById(req.params.id);
			const currentUser = await User.findById(req.body.userId);

			if (user.followers.includes(req.body.userId)) {
				await user.updateOne({ $pull: { followers: req.body.userId } });
				await currentUser.updateOne({ $pull: { followings: req.params.id } });

				res.status(200).json('User has been unfollowed');
			} else {
				return res.status(403).json("You already don't follow this user");
			}
			res.status(200).json('User has been unfollowed');
		} catch (err) {
			return res.status(500).json(err);
		}
	} else {
		return res.status(403).json('You cannot unfollow only yourself!');
	}
});

// ! Export router
export default router;
