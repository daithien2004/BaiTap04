import {
  getCommentsService,
  addCommentService,
  deleteCommentService,
  updateCommentService,
} from '../services/conmmentService.js';

// Lấy danh sách bình luận theo productId
export const getComments = async (req, res) => {
  try {
    const { productId } = req.params;
    const comments = await getCommentsService(productId);

    return res.json({ EC: 0, EM: 'OK', data: comments });
  } catch (error) {
    return res.status(500).json({ EC: -1, EM: error.message });
  }
};

// Thêm bình luận mới
export const addComment = async (req, res) => {
  try {
    const { productId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id; // nếu bạn có middleware auth

    if (!content || !content.trim()) {
      return res
        .status(400)
        .json({ EC: 1, EM: 'Nội dung bình luận không được để trống' });
    }

    const newComment = await addCommentService(productId, userId, content);
    return res
      .status(201)
      .json({ EC: 0, EM: 'Thêm bình luận thành công', data: newComment });
  } catch (error) {
    return res.status(500).json({ EC: -1, EM: error.message });
  }
};

// Xóa bình luận
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const userId = req.user?._id;

    const result = await deleteCommentService(commentId, userId);
    const status = result.EC === 0 ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    return res.status(500).json({ EC: -1, EM: error.message });
  }
};

// Cập nhật bình luận
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content } = req.body;
    const userId = req.user?._id;

    const result = await updateCommentService(commentId, userId, content);
    const status = result.EC === 0 ? 200 : 400;
    return res.status(status).json(result);
  } catch (error) {
    return res.status(500).json({ EC: -1, EM: error.message });
  }
};
