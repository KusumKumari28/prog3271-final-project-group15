import Post from "../models/Post";

export const createPostService = async (
  title: string,
  content: string,
  userId: string
) => {
  const post = new Post({
    title,
    content,
    author: userId,
  });

  await post.save();
  return post;
};