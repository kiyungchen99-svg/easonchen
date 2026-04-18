import Comment from '../models/Comment.js';

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ bird: req.params.birdId })
      .populate('user', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      bird: req.params.birdId,
      user: req.user._id,
      content: req.body.content,
    });
    await comment.populate('user', 'username avatar');
    res.status(201).json(comment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: '找不到留言' });

    const isOwner = comment.user.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== 'admin') {
      return res.status(403).json({ message: '無權限刪除此留言' });
    }

    await comment.deleteOne();
    res.json({ message: '刪除成功' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
