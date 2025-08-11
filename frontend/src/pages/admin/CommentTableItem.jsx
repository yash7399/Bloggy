import React from "react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const CommentTableItem = ({ comment, fetchComments }) => {
  const { axios } = useAppContext();
  const { blog, createdAt, _id, isApproved } = comment;
  const BlogDate = new Date(createdAt);

  const deleteComment = async () => {
    try {
      const { data } = await axios.post("/api/admin/delete-comment", { id: _id });
      
      if (data.success) {
        toast.success("Comment deleted successfully!");
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete comment");
    }
  };

  return (
    <tr className="order-y border-gray-500">
      <td className="px-6 py-4">
        <b className="font-medium text-gray-700">Blog</b> : {blog?.title || "Unknown Blog"}
        <br />
        <br />
        <b className="font-medium text-gray-700">Name</b> : {comment.name}
        <br />
        <b className="font-medium text-gray-700">Comment</b> : {comment.content}
      </td>

      <td className="px-6 py-4 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4">
        <button
          onClick={deleteComment}
          className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
        >
          Delete
        </button>
      </td>
    </tr>
  );
};

export default CommentTableItem;
