import React, { useState } from "react";
import MDEditor from "@uiw/react-md-editor";
import { assets, blogCategories } from "../../assets/assets";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const AddBlog = () => {
  const { axios } = useAppContext();
  const navigate = useNavigate();
  const [isAdding, setIsAdding] = useState(false);

  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [description, setDescription] = useState(""); // Markdown text
  const [category, setCategory] = useState("Startup");
  const [isPublished, setIsPublished] = useState(false);

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();
      setIsAdding(true);

      if (!image) {
        toast.error("Please select an image");
        setIsAdding(false);
        return;
      }

      if (
        !title.trim() ||
        !subTitle.trim() ||
        !description.trim() ||
        !category ||
        category === "All"
      ) {
        toast.error("Please fill in all required fields");
        setIsAdding(false);
        return;
      }

      const formData = new FormData();
      formData.append("image", image);
      formData.append(
        "blog",
        JSON.stringify({
          title: title.trim(),
          subTitle: subTitle.trim(),
          description: description.trim(),
          category,
          isPublished,
        })
      );

      const { data } = await axios.post("/api/blog/add", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (data.success) {
        toast.success("Blog added successfully!");
        // Reset form
        setTitle("");
        setSubTitle("");
        setDescription("");
        setCategory("Startup");
        setIsPublished(false);
        setImage(null);
        // Navigate to blog list after successful creation
        setTimeout(() => {
          navigate("/admin/listBlog");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Add blog error:", error);
      toast.error(error.response?.data?.message || "Failed to add blog");
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex-1 bg-blue-50/50 text-gray-600 h-full overflow-scroll"
    >
      <div className="bg-white w-full max-w-3xl p-4 md:p-10 sm:m-10 shadow rounded">
        <p>Upload Thumbnail</p>
        <label htmlFor="image" className="cursor-pointer">
          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-primary transition-colors">
            {!image ? (
              <div className="text-center">
                <img
                  src={assets.upload_area}
                  className="h-16 mx-auto mb-2"
                  alt="upload"
                />
                <p className="text-sm text-gray-500">Click to upload image</p>
              </div>
            ) : (
              <div className="text-center">
                <img
                  src={URL.createObjectURL(image)}
                  className="h-16 mx-auto mb-2 rounded"
                  alt="thumbnail"
                />
                <p className="text-sm text-green-600">
                  Image selected: {image.name}
                </p>
              </div>
            )}
          </div>
          <input
            onChange={(e) => setImage(e.target.files[0])}
            type="file"
            id="image"
            hidden
            accept="image/*"
            required
          />
        </label>

        <p className="mt-4">Blog Title</p>
        <input
          type="text"
          placeholder="Type Here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setTitle(e.target.value)}
          value={title}
        />

        <p className="mt-4">Subtitle</p>
        <input
          type="text"
          placeholder="Type Here"
          required
          className="w-full max-w-lg mt-2 p-2 border border-gray-300 outline-none rounded"
          onChange={(e) => setSubTitle(e.target.value)}
          value={subTitle}
        />

        <p className="mt-4">Blog Description (Markdown)</p>
        <div className="mt-2 max-w-lg">
          <MDEditor
            value={description}
            onChange={setDescription}
            height={300}
            data-color-mode="light"
          />
        </div>

        <p className="mt-4">Blog Category</p>
        <select
          onChange={(e) => setCategory(e.target.value)}
          value={category}
          name="category"
          className="mt-2 px-3 py-2 border text-gray-500 border-gray-300 outline-none rounded"
        >
          {blogCategories.map((item, index) => {
            return (
              <option key={index} value={item}>
                {item}
              </option>
            );
          })}
        </select>

        <div className="flex gap-2 mt-4">
          <p>Publish Now</p>
          <input
            type="checkbox"
            checked={isPublished}
            onChange={(e) => setIsPublished(e.target.checked)}
            className="scale-125 cursor-pointer"
          />
        </div>

        <button
          disabled={isAdding}
          type="submit"
          className={`mt-8 w-40 px-6 py-2 rounded transition-colors ${
            isAdding
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-primary hover:bg-blue-700"
          } text-white`}
        >
          {isAdding ? "Adding..." : "Add Blog"}
        </button>
      </div>
    </form>
  );
};

export default AddBlog;
