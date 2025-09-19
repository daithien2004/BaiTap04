import { useEffect, useState } from 'react';
import { List, Input, Button, message, Popconfirm } from 'antd';
import {
  getCommentsApi,
  addCommentApi,
  deleteCommentApi,
  updateCommentApi,
} from '../util/api';

const { TextArea } = Input;

interface CommentSectionProps {
  productId: string;
  onCommentAdded?: () => void; // callback để ProductDetail cập nhật stats
  onCommentDeleted?: () => void; // callback để ProductDetail cập nhật stats
}

const CommentSection = ({
  productId,
  onCommentAdded,
  onCommentDeleted,
}: CommentSectionProps) => {
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');

  useEffect(() => {
    if (!productId) return;
    getCommentsApi(productId)
      .then((res) => {
        if (res?.EC === 0) setComments(res.data || []);
      })
      .catch(() => {});
  }, [productId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;
    setLoading(true);
    try {
      const res = await addCommentApi(productId, { content: newComment });
      if (res?.EC === 0) {
        setComments([res.data, ...comments]); // thêm mới vào đầu danh sách
        setNewComment('');
        onCommentAdded?.();
      } else {
        message.error(res?.EM || 'Không thể thêm bình luận');
      }
    } catch (err) {
      console.error(err);
      message.error('Lỗi khi thêm bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    try {
      const res = await deleteCommentApi(productId, commentId);
      if (res?.EC === 0) {
        setComments(comments.filter((c) => c._id !== commentId));
        onCommentDeleted?.();
        message.success('Đã xóa bình luận');
      } else {
        message.error(res?.EM || 'Không thể xóa');
      }
    } catch (err) {
      message.error('Lỗi khi xóa bình luận');
    }
  };

  const handleEdit = (comment: any) => {
    setEditingId(comment._id);
    setEditingContent(comment.content);
  };

  const handleUpdate = async (commentId: string) => {
    try {
      const res = await updateCommentApi(productId, commentId, {
        content: editingContent,
      });
      if (res?.EC === 0) {
        setComments(
          comments.map((c) =>
            c._id === commentId ? { ...c, content: editingContent } : c
          )
        );
        message.success('Đã cập nhật bình luận');
        setEditingId(null);
        setEditingContent('');
      } else {
        message.error(res?.EM || 'Không thể cập nhật');
      }
    } catch (err) {
      message.error('Lỗi khi cập nhật');
    }
  };

  return (
    <div style={{ marginTop: 24 }}>
      <h3>Bình luận</h3>
      <div style={{ marginBottom: 12 }}>
        <TextArea
          rows={3}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Viết bình luận..."
        />
        <Button
          type="primary"
          onClick={handleAddComment}
          loading={loading}
          style={{ marginTop: 8 }}
        >
          Gửi
        </Button>
      </div>
      <List
        dataSource={comments}
        renderItem={(c) => (
          <List.Item
            actions={[
              <a key="edit" onClick={() => handleEdit(c)}>
                Sửa
              </a>,
              <Popconfirm
                key="delete"
                title="Bạn có chắc muốn xóa?"
                onConfirm={() => handleDelete(c._id)}
              >
                <a>Xóa</a>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={c.user?.name || 'Người dùng'}
              description={
                editingId === c._id ? (
                  <div>
                    <TextArea
                      rows={2}
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                    />
                    <Button
                      type="primary"
                      size="small"
                      onClick={() => handleUpdate(c._id)}
                      style={{ marginTop: 4, marginRight: 4 }}
                    >
                      Lưu
                    </Button>
                    <Button
                      size="small"
                      onClick={() => setEditingId(null)}
                      style={{ marginTop: 4 }}
                    >
                      Hủy
                    </Button>
                  </div>
                ) : (
                  c.content
                )
              }
            />
          </List.Item>
        )}
      />
    </div>
  );
};

export default CommentSection;
