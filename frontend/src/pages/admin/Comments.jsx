import React, { useEffect, useState } from "react";
import { useAppContext } from "../../context/AppContext";
import CommentTableItem from "./CommentTableItem";
import toast from "react-hot-toast";

const Comments = () => {
  const { axios } = useAppContext();
  const [comments, setComments] = useState([]);

  const fetchComments = async () => {
    try {
      const { data } = await axios.get("/api/admin/comments");
      
      if (data.success) {
        setComments(data.comments);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Fetch comments error:", error);
      toast.error(error.response?.data?.message || "Failed to fetch comments");
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  return (
    <div className="flex-1 pt-5 sm:pt-12 sm:pl-16 bg-blue-50/50">
      <div className="flex justify-between items-center max-w-3xl">
        <h1>Comments</h1>
      </div>

      <div className="relative h-4/5 max-w-3xl overflow-x-auto mt-4 bg-white shadow rounded-lg scrollbar-hide">
        <table className="w-full text-sm text-gray-700">
          <thead className="text-shadow-2xs text-gray-900 text-left uppercase">
            <tr>
              <th scope="col" className="px-6 py-3">
                Blog Title & Comment
              </th>
              <th scope="col" className="px-6 py-3 max-sm:hidden">
                Date
              </th>
              <th scope="col" className="px-6 py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {comments.map((comment, index) => (
              <CommentTableItem
                key={comment._id}
                comment={comment}
                index={index + 1}
                fetchComments={fetchComments}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
