import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Clock, Tag } from "lucide-react";
import { format } from "date-fns";

export default function PostCard({ post }) {
  return (
    <article className="group cursor-pointer">
      <Link to={createPageUrl(`Post?id=${post.id}`)}>
        <div className="bg-white rounded-2xl p-8 elegant-shadow hover:elegant-shadow-lg transition-all duration-300 border border-gray-50 hover:border-gray-100 hover:-translate-y-1">
          {post.featured_image_url && (
            <div className="mb-6 -mx-8 -mt-8">
              <img 
                src={post.featured_image_url} 
                alt={post.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
            </div>
          )}
          
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-500">
              <time className="font-medium">
                {format(new Date(post.created_date), "MMMM d, yyyy")}
              </time>
              {post.reading_time && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{post.reading_time} min read</span>
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold text-gray-900 group-hover:text-gray-700 transition-colors duration-200 line-clamp-2 leading-tight">
              {post.title}
            </h2>

            {post.excerpt && (
              <p className="text-gray-600 text-sm line-clamp-3 leading-relaxed font-light">
                {post.excerpt}
              </p>
            )}

            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {post.tags.slice(0, 3).map((tag, index) => (
                  <span 
                    key={index}
                    className="inline-flex items-center space-x-1 text-xs text-gray-500 bg-gray-50 px-3 py-1 rounded-full"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    <span>{tag}</span>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}