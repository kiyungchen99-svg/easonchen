import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema(
  {
    bird: { type: mongoose.Schema.Types.ObjectId, ref: 'Bird', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500 },
  },
  { timestamps: true }
);

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
