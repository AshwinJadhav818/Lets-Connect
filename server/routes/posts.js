// ! Imports
import { Router } from 'express';
import Post from '../modals/Post.js';
import User from '../modals/User.js';

// ! Router Config
var router = new Router();

// ! Route
// ? Create A Post
router.post('/', async (req, res) => {
	const newPost = new Post(req.body);

	try {
		const savePost = await newPost.save();
		res.status(200).json(savePost);
	} catch (err) {
		res.status(500).json(err);
	}
});

// ? Update A Post
router.put('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.userId === req.body.userId) {
			await post.updateOne({ $set: req.body });
			res.status(200).json('Your post has been updated!');
		} else {
			res.status(403).json('You can only update your post!');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// ? Delete A Post
router.delete('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (post.userId === req.body.userId) {
			await post.deleteOne();
			res.status(200).json('Your post has been deleted!');
		} else {
			res.status(403).json('You can only delete your post!');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// ? Like / Dislike A Post
router.put('/:id/like', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);

		if (!post.likes.includes(req.params.userId)) {
			await post.updateOne({ $push: { likes: req.body.userId } });
			res.status(200).json('The post has been liked!');
		} else {
			await post.updateOne({ $pull: { likes: req.body.userId } });
			res.status(200).json('The post has been disliked!');
		}
	} catch (err) {
		res.status(500).json(err);
	}
});

// ? Get A Post
router.get('/:id', async (req, res) => {
	try {
		const post = await Post.findById(req.params.id);
		res.status(200).json(post);
	} catch (err) {
		res.status(500).json(err);
	}
});

// ? Get Timeline Posts
router.get('/timeline/all', async (req, res) => {
	try {
		const currentUser = await User.findById(req.body.userId);
		const userPosts = await Post.find({ userId: currentUser._id });
		const friendPosts = await Promise.all(
			currentUser.followings.map((friendId) => {
				return Post.find({ userId: friendId });
			})
		);
		res.json(userPosts.concat(...friendPosts));
	} catch (err) {
		res.status(500).json(err);
	}
});

// ! Export router
export default router;
