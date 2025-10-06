
import React, { useState, useEffect } from "react";
import { BlogPost } from "@/api/entities";
import { User } from "@/api/entities";
import { Link, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Clock, Tag, Calendar, User as UserIcon, Trash2, AlertTriangle, Edit } from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SocialShare from "../components/blog/SocialShare";

export default function Post() {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  const urlParams = new URLSearchParams(window.location.search);
  const postId = urlParams.get('id');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const posts = await BlogPost.filter({ id: postId });
        if (posts.length > 0) {
          setPost(posts[0]);
        }

        // Load current user
        try {
          const user = await User.me();
          setCurrentUser(user);
        } catch (error) {
          setCurrentUser(null);
        }
      } catch (error) {
        console.error("Error loading post:", error);
      }
      setIsLoading(false);
    };

    if (postId) {
      loadData();
    }
  }, [postId]);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await BlogPost.delete(post.id);
      navigate(createPageUrl("Blog"));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
    setIsDeleting(false);
  };

  const isAdmin = currentUser?.role === 'admin';
  const adminViewMode = JSON.parse(localStorage.getItem('adminViewMode') || 'true');
  const showAdminFeatures = isAdmin && adminViewMode;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="space-y-4">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Post not found</h1>
          <p className="text-gray-600 mb-6">The post you're looking for doesn't exist.</p>
          <Button
            onClick={() => navigate(createPageUrl("Blog"))}
            variant="outline"
            className="rounded-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-8">
            <Button
              onClick={() => navigate(createPageUrl("Blog"))}
              variant="ghost"
              className="rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>

            <div className="flex items-center space-x-3">
              <SocialShare title={post?.title} url={window.location.href} />
              
              {showAdminFeatures && (
                <>
                  <Link to={createPageUrl(`EditPost?id=${post.id}`)}>
                    <Button
                      variant="outline"
                      className="rounded-full hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Post
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="rounded-full border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="flex items-center gap-2">
                          <AlertTriangle className="w-5 h-5 text-red-500" />
                          Delete Post
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete "{post.title}"? This action cannot be undone and the post will be permanently removed.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDelete}
                          disabled={isDeleting}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          {isDeleting ? "Deleting..." : "Delete Post"}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </div>

          {post.featured_image_url && (
            <div className="mb-10 -mx-6 md:mx-0">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className={`w-full ${
                  !post.content || post.content.trim() === '' 
                    ? 'object-contain max-h-[80vh] md:rounded-2xl' 
                    : 'object-cover md:rounded-2xl'
                }`}
                style={
                  !post.content || post.content.trim() === '' 
                    ? {} 
                    : { aspectRatio: '1028 / 628' }
                }
              />
            </div>
          )}

          <header className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light text-gray-900 tracking-tight mb-6 leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 border-b border-gray-200 pb-6">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <time>{format(new Date(post.created_date), "MMMM d, yyyy")}</time>
              </div>
              
              {post.reading_time && post.reading_time > 0 && (
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}

              <div className="flex items-center space-x-2">
                <UserIcon className="w-4 h-4" />
                <span>by Ryan Kolean</span>
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4" />
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag, index) => (
                      <span 
                        key={index}
                        className="text-xs bg-gray-100 px-3 py-1 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </header>

          {post.content && post.content.trim() !== '' && (
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="prose prose-lg prose-gray max-w-none prose-headings:font-semibold prose-headings:text-gray-900 prose-p:text-gray-700 prose-p:leading-relaxed prose-a:text-gray-900 prose-a:underline prose-strong:text-gray-900 prose-code:text-gray-900 prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-blockquote:border-gray-300 prose-blockquote:text-gray-700 prose-ul:text-gray-700 prose-ol:text-gray-700 prose-li:text-gray-700"
            >
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-3xl font-semibold text-gray-900 mt-8 mb-4 leading-tight">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-2xl font-semibold text-gray-900 mt-8 mb-4 leading-tight">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3 leading-tight">{children}</h3>
                  ),
                  h4: ({ children }) => (
                    <h4 className="text-lg font-semibold text-gray-900 mt-6 mb-3 leading-tight">{children}</h4>
                  ),
                  p: ({ children }) => (
                    <p className="text-gray-700 leading-relaxed mb-6 text-lg">{children}</p>
                  ),
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      className="text-gray-900 underline hover:text-gray-600 transition-colors"
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      {children}
                    </a>
                  ),
                  ul: ({ children }) => (
                    <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-gray-700 leading-relaxed text-lg">{children}</li>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-gray-300 pl-6 my-6 italic text-gray-700 bg-gray-50 py-4 rounded-r-lg">
                      {children}
                    </blockquote>
                  ),
                  code: ({ inline, className, children }) => {
                    if (inline) {
                      return (
                        <code className="bg-gray-100 text-gray-900 px-2 py-1 rounded text-sm font-mono">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <div className="my-6">
                        <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                          <code className={className}>{children}</code>
                        </pre>
                      </div>
                    );
                  },
                  pre: ({ children }) => children,
                  strong: ({ children }) => (
                    <strong className="font-semibold text-gray-900">{children}</strong>
                  ),
                  em: ({ children }) => (
                    <em className="italic text-gray-700">{children}</em>
                  ),
                  hr: () => (
                    <hr className="border-gray-300 my-8" />
                  ),
                  img: ({ src, alt }) => (
                    <div className="my-8">
                      <img 
                        src={src} 
                        alt={alt} 
                        className="w-full rounded-lg shadow-sm" 
                      />
                      {alt && (
                        <p className="text-center text-sm text-gray-500 mt-2 italic">{alt}</p>
                      )}
                    </div>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border border-gray-200 rounded-lg">
                        {children}
                      </table>
                    </div>
                  ),
                  thead: ({ children }) => (
                    <thead className="bg-gray-50">{children}</thead>
                  ),
                  tbody: ({ children }) => (
                    <tbody className="divide-y divide-gray-200">{children}</tbody>
                  ),
                  tr: ({ children }) => (
                    <tr className="hover:bg-gray-50">{children}</tr>
                  ),
                  th: ({ children }) => (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {children}
                    </td>
                  ),
                }}
              >
                {post.content}
              </ReactMarkdown>
            </motion.article>
          )}

          <motion.footer
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 pt-8 border-t border-gray-200"
          >
            <div className="flex items-center justify-between mb-6">
              <p className="text-gray-600 font-light">
                Thank you for reading.
              </p>
              <SocialShare title={post?.title} url={window.location.href} />
            </div>
            <div className="text-center">
              <Button
                onClick={() => navigate(createPageUrl("Blog"))}
                variant="outline"
                className="rounded-full"
              >
                Read More Posts
              </Button>
            </div>
          </motion.footer>
        </motion.div>
      </div>
    </div>
  );
}
