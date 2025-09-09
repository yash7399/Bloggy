import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Moment from "moment";
import ReactMarkdown from "react-markdown";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";
import { assets } from "../assets/assets";


const Blog = () => {
  const { id } = useParams();

  const { axios } = useAppContext();

  const [data, setData] = useState(null);
  const [comments, setComments] = useState([]);
  const [name, setName] = useState("");
  const [content, setContent] = useState("");

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`);
      data.success ? setData(data.blog) : toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch blog");
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await axios.post("/api/blog/comments", { blogId: id });

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

  const addComment = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !content.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const { data } = await axios.post("/api/blog/addComment", {
        blog: id,
        name: name.trim(),
        content: content.trim()
      });

      if (data.success) {
        toast.success("Comment added successfully!");
        setName("");
        setContent("");
        // Refresh comments
        fetchComments();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Comment error:", error);
      toast.error(error.response?.data?.message || "Failed to add comment");
    }
  };

  useEffect(() => {
    fetchBlogData();
    fetchComments();
  }, []);

  return data ? (
    <div className="relative">
      <img
        src={assets.gradientBackground}
        className="absolute -top-50 -z-1 opacity-50"
      />

      <Navbar />

      <div className="text-center mt-20 text-gray-600">
        <p className="text-primary py-4 font-medium">
          Published on {Moment(data.createdAt).format("MMMM Do YYYY")}
        </p>

        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          {data.title}
        </h1>

        <h2 className="my-5 max-w-lg truncate mx-auto">{data.subTitle}</h2>

        <p className="inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary">
          {data.user?.name || 'Unknown Author'}
        </p>
      </div>

      <div className="mx-5 max-w-5xl md:mx-auto my-10 mt-6">
        <img src={data.image} className="rounded-3xl mb-5" />

        <div className="rich-text max-w-3xl mx-auto prose prose-lg max-w-none prose-headings:text-gray-800 prose-p:text-gray-600 prose-strong:text-gray-800 prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded">
          {data.description ? (
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-bold mb-4" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-semibold mb-3 mt-6" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-semibold mb-2 mt-4" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 space-y-1" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 space-y-1" {...props} />,
                li: ({node, ...props}) => <li className="ml-4" {...props} />,
                strong: ({node, ...props}) => <strong className="font-semibold" {...props} />,
                em: ({node, ...props}) => <em className="italic" {...props} />,
                code: ({node, ...props}) => <code className="bg-gray-100 px-1 py-0.5 rounded text-sm font-mono" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-primary pl-4 italic text-gray-600 my-4" {...props} />,
              }}
            >
              {data.description}
            </ReactMarkdown>
          ) : (
            <p className="text-gray-500 italic">No content available.</p>
          )}
        </div>
      </div>

      {/* Comment Section */}
      <div className="mt-14 mb-10 max-w-3xl mx-auto">
        <p className="font-semibold mb-4">Comments ({comments.length})</p>

        <div className="flex flex-col gap-4">
          {comments.map((item, index) => (
            <div
              key={index}
              className="relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600"
            >
              <div className="flex items-center gap-2 mb-2">
                <p className="font-medium">{item.name}</p>
              </div>
              <p className="text-sm max-w-md">{item.content}</p>
              <div className="absolute right-4 bottom-3 flex items-center gap-2 text-xs">
                {Moment(item.createdAt).fromNow()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="max-w-3xl mx-auto">
        <p className="font-semibold mb-4">Add Your Comment</p>
        <form
          onSubmit={addComment}
          className="flex flex-col items-start gap-4 max-w-lg"
        >
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Name"
            required
            className="w-full p-2 border border-gray-300 rounded outline-none"
          />

          <textarea
            onChange={(e) => setContent(e.target.value)}
            value={content}
            className="w-full p-2 border border-gray-300 rounded outline-none h-48"
            placeholder="Comment"
          ></textarea>

          <button
            type="submit"
            className="bg-primary text-white rounded p-2 px-8 hover:scale-105 transition-all cursor-pointer"
          >
            Submit
          </button>
        </form>
      </div>

      <Footer />
    </div>
  ) : (
    <>
      <Navbar />
      <img
        src={assets.gradientBackground}
        className="absolute -top-50 -z-1 opacity-50"
      />
      <div className="text-center mt-20 text-gray-600">
        <h1 className="text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800">
          Loading.. Please wait
        </h1>
      </div>
    </>
  );
};

export default Blog;
