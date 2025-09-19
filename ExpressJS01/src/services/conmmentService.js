import Comment from '../models/comment.js';

// Lấy danh sách bình luận theo productId
export const getCommentsService = async (productId) => {
  const comments = await Comment.find({ productId })
    .populate('userId', 'name avatar') // lấy tên + avatar của user
    .sort({ createdAt: -1 })
    .lean();
  return comments.map((c) => ({
    ...c,
    user: c.userId, // đổi tên userId -> user
    userId: undefined, // xoá bớt cho sạch JSON
  }));
};

// Thêm bình luận
export const addCommentService = async (productId, userId, content) => {
  let newComment = await Comment.create({ productId, userId, content });
  newComment = await newComment.populate('userId', 'name avatar');

  // transform: userId -> user
  return {
    _id: newComment._id,
    content: newComment.content,
    createdAt: newComment.createdAt,
    product: newComment.productId,
    user: newComment.userId, // rename
  };
};

// Xóa bình luận
export const deleteCommentService = async (commentId, userId) => {
  const comment = await Comment.findById(commentId);
  if (!comment) return { EC: 1, EM: 'Không tìm thấy bình luận' };

  // chỉ cho phép chủ bình luận hoặc admin xóa
  if (comment.userId.toString() !== userId.toString()) {
    return { EC: 1, EM: 'Không có quyền xóa bình luận này' };
  }

  await comment.deleteOne();

  return { EC: 0, EM: 'Xóa bình luận thành công' };
};

// Cập nhật bình luận
export const updateCommentService = async (commentId, userId, content) => {
  const comment = await Comment.findById(commentId);
  if (!comment) return { EC: 1, EM: 'Không tìm thấy bình luận' };

  if (comment.userId.toString() !== userId.toString()) {
    return { EC: 1, EM: 'Không có quyền sửa bình luận này' };
  }

  comment.content = content;
  await comment.save();

  return { EC: 0, EM: 'Cập nhật bình luận thành công', data: comment };
};
