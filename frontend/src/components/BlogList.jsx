import React, { useState } from "react";
import { motion } from "motion/react";
import BlogCard from "./BlogCard";
import { useAppContext } from "../context/AppContext";

const BlogList = () => {
  const blogCategories = [
    "All",
    "Technology",
    "Startup",
    "Finance",
    "Lifestyle",
    "Other",
  ];
  const [menu, setMenu] = useState("All");

  const { blogs, input } = useAppContext();

  const filteredBlogs = () => {
    if (input === "") {
      return blogs;
    }
    return blogs.filter(
      (blog) =>
        blog.title.toLowerCase().includes(input.toLowerCase()) ||
        blog.category.toLowerCase().includes(input.toLowerCase())
    );
  };

  return (
    <div>
      <div className="flex justify-center gap-4 sm:gap-8 my-10 relative">
        {blogCategories.map((item) => {
          const isActive = menu === item;

          return (
            <div key={item} className="relative">
              <button
                onClick={() => setMenu(item)}
                className={`cursor-pointer ${
                  isActive ? "text-white px-4 pt-0.5" : "text-gray-500"
                }`}
              >
                {item}
                {isActive && (
                  <motion.div
                    layoutId="underline"
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute left-0 right-0 top-0 h-7 -z-1 bg-primary rounded-full"
                  ></motion.div>
                )}
              </button>
            </div>
          );
        })}
      </div>

      
      {filteredBlogs().filter((blog) => (menu === "All" ? true : blog.category === menu)).length === 0 ? (
        <div className="text-center text-lg font-semibold text-gray-500 my-20">
          Blogs are loading...
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8 mb-24 sm:mx-16 xl:mx-40">
          {filteredBlogs()
            .filter((blog) => (menu === "All" ? true : blog.category === menu))
            .map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
        </div>
      )}
    </div>
  );
};

export default BlogList;
