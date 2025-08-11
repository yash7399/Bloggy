import React, { useState } from "react";

import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import Moment from "moment";

const BlogTableItem = ({ blog, fetchBlogs, index, showAuthor = false }) => {
  const { axios } = useAppContext();
  const [isLoading, setIsLoading] = useState(false);
  const { title, subTitle, category, createdAt, isPublished, _id, user } = blog;
  const BlogDate = new Date(createdAt);

  const togglePublish = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/blog/toggle-publish", {
        id: _id,
      });

      if (data.success) {
        toast.success(
          `Blog ${isPublished ? "unpublished" : "published"} successfully!`
        );
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to update blog status"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const deleteBlog = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/blog/delete", { id: _id });

      if (data.success) {
        toast.success("Blog deleted successfully!");
        fetchBlogs();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete blog");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {index}
      </td>

      <td className="px-6 py-4">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <img
              src={blog.image}
              alt={title}
              className="h-12 w-12 rounded-lg object-cover"
              onError={(e) => {
                e.target.src = "https://via.placeholder.com/48x48?text=Blog";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {title}
            </p>
            <p className="text-sm text-gray-500 truncate">{subTitle}</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                {category}
              </span>
              <span className="text-xs text-gray-400">
                {Moment(createdAt).fromNow()}
              </span>
            </div>
          </div>
        </div>
      </td>

      {showAuthor && (
        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
          {user?.name || 'Unknown'}
        </td>
      )}

      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-sm:hidden">
        {BlogDate.toLocaleDateString()}
      </td>

      <td className="px-6 py-4 whitespace-nowrap max-sm:hidden">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            isPublished
              ? "bg-green-100 text-green-800"
              : "bg-orange-100 text-orange-800"
          }`}
        >
          {isPublished ? "Published" : "Draft"}
        </span>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
        <div className="flex items-center gap-2">
          <button
            onClick={togglePublish}
            disabled={isLoading}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md transition-colors ${
              isPublished
                ? "text-orange-700 bg-orange-100 hover:bg-orange-200"
                : "text-green-700 bg-green-100 hover:bg-green-200"
            } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
            ) : (
              <span>{isPublished ? "Unpublish" : "Publish"}</span>
            )}
          </button>

          <button
            onClick={deleteBlog}
            disabled={isLoading}
            className={`inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 transition-colors ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
            ) : (
              <span>Delete</span>
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogTableItem;
