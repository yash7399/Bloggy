import React, { use } from "react";
import { useNavigate } from "react-router-dom";

const BlogCard = ({ blog }) => {
  const { title, description, category, image, _id, user } = blog;
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(`/blog/${_id}`)}
      className="w-full rounded-lg overflow-hidden shadow hover:scale-105 hover:shadow-primary/25 duration-300 cursor-pointer"
    >
      <img src={image} alt="" className="aspect-video" />

      <span className="ml-5 mt-4 px-3 inline-block bg-primary/50 rounded-full text-primary text-xs border border-primary/50">
        {category}
      </span>

      <div className="p-5">
        <h5 className="mb-2 font-medium text-gray-900">{title}</h5>

        <p
          className="mb-3 text-xs text-gray-600"
          dangerouslySetInnerHTML={{ __html: description.slice(0, 80) }}
        ></p>
        
        <p className="text-xs text-gray-500">
          By {user?.name || 'Unknown Author'}
        </p>
      </div>
    </div>
  );
};

export default BlogCard;
