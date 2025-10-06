import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import PostEditor from "../components/blog/PostEditor";

export default function Write() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkUserAccess = async () => {
      try {
        const user = await User.me();
        setCurrentUser(user);
        
        // Immediately redirect non-admin users
        if (user.role !== 'admin') {
          navigate(createPageUrl("Blog"), { replace: true });
          return;
        }
      } catch (error) {
        // User not authenticated, redirect to blog
        navigate(createPageUrl("Blog"), { replace: true });
        return;
      }
      setIsCheckingAuth(false);
    };

    checkUserAccess();
  }, [navigate]);

  const handleSave = async (postData) => {
    // Double-check admin status before allowing save
    if (!currentUser || currentUser.role !== 'admin') {
      navigate(createPageUrl("Blog"));
      return;
    }

    setIsLoading(true);
    try {
      await BlogPost.create(postData);
      navigate(createPageUrl("Blog"));
    } catch (error) {
      console.error("Error creating post:", error);
    }
    setIsLoading(false);
  };

  const handleCancel = () => {
    navigate(createPageUrl("Blog"));
  };

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying access permissions...</p>
        </div>
      </div>
    );
  }

  // This should rarely be seen due to redirects above, but serves as a fallback
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Access Restricted</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            This page is for administrators only. Regular users can browse and read all published posts.
          </p>
          <Button
            onClick={() => navigate(createPageUrl("Blog"))}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Posts
          </Button>
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
            Share Your
            <span className="block text-4xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              Project
            </span>
          </h1>
          <p className="text-gray-600 font-light mt-2">
            What have you been working on?
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <PostEditor
            onSave={handleSave}
            onCancel={handleCancel}
            isLoading={isLoading}
          />
        </motion.div>
      </div>
    </div>
  );
}