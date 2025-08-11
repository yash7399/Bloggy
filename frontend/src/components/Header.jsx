import React, { useRef } from "react";
import { useAppContext } from "../context/AppContext";

const Header = () => {
  const { setInput, input } = useAppContext();
  const inputRef = useRef();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setInput(inputRef.current.value);
  };

  const onClear = () => {
    setInput("");
    inputRef.current.value = "";
  };

  return (
    <div className="mx-8 sm:mx-16 xl:mx-24 relative text-center">
      <h1 className="text-3xl sm:text-6xl font-semibold sm:leading-[4.5rem] text-gray-700">
        The Blogging Platform
      </h1>

      <form
        onSubmit={onSubmitHandler}
        className="mt-6 mx-auto border border-gray-300 bg-white rounded overflow-hidden flex justify-between max-w-lg max-sm:scale-90"
      >
        <input
          ref={inputRef}
          className="w-full pl-4 py-2 outline-none"
          type="text"
          placeholder="Search for blogs"
          required
        />

        <button
          className="bg-primary text-white px-6 py-2 m-1 rounded hover:scale-105 transition-all cursor-pointer"
          type="submit"
        >
          Search
        </button>
      </form>

      <div className="text-center pt-5">
        {input && (
          <button
            onClick={onClear}
            className="border font-light text-xs py-1 px-3 rounded-sm shadow cursor-pointer"
          >
            Clear Search
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
