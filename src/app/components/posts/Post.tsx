"use client";

import axios from "axios";
import React from "react";

const Post = (post: { title: string; description: string; id: string }) => {
  return (
    <div className="rounded-lg border-2 border-white px-6 py-2">
      <div>{post.title}</div>
      <div>{post.description}</div>
    </div>
  );
};

export default Post;
