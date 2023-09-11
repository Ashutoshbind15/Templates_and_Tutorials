"use client";

import React, { useState } from "react";
import Button from "../UI/Button";
import axios from "axios";

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await axios.post("http://localhost:3000/api/posts", {
      title,
      content: description,
    });
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="flex flex-col mb-4">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-black"
        />
      </div>
      <div className="flex flex-col mb-4">
        <label htmlFor="description">Description</label>
        <input
          type="text"
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="text-black"
        />
      </div>

      <Button type="submit">Submit</Button>
    </form>
  );
};

export default PostForm;
