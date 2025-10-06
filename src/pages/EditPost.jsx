import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import PostEditor from "../components/blog/PostEditor";

export default function EditPost() {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  useEffect(() => {
    const checkUserAndLoadPost = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        if (user.role !== 'admin') {
          navigate(createPageUrl("Blog"), { replace: true });
          return;
        }

        if (postId) {
          const posts = await BlogPost.filter({ id: postId });
          if (posts.length > 0) {
            setPost(posts[0]);
          } else {
            // Post not found, redirect
            navigate(createPageUrl("Blog"), { replace: true });
            return;
          }
        } else {
          // No post ID, redirect
          navigate(createPageUrl("Blog"), { replace: true });
          return;
        }
      } catch (error) {
        // User not authenticated, redirect
        navigate(createPageUrl("Blog"), { replace: true });
        return;
      }
      setIsCheckingAuth(false);
    };

    checkUserAndLoadPost();
  }, [navigate, postId]);

  const handleSave = async (postData) => {
    if (!currentUser || currentUser.role !== 'admin' || !post) {
      navigate(createPageUrl("Blog"));
      return;
    }

    setIsLoading(true);
    try {
      await BlogPost.update(post.id, postData);
      navigate(createPageUrl(`Post?id=${post.id}`));
    } catch (error) {
      console.error("Error updating post:", error);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    if (post) {
      navigate(createPageUrl(`Post?id=${post.id}`));
    } else {
      navigate(createPageUrl("Blog"));
    }
  };

  if (isCheckingAuth || !post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading editor...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-light text-gray-900 tracking-tight">
            Editing
            <span className="block text-4xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Project
            </span>
          </h1>
          <p className="text-gray-600 font-light mt-2">
            Refine your story.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PostEditor
            post={post}
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}