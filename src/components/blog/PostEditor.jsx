
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Save, Upload } from "lucide-react";
import { UploadFile } from "@/api/integrations";

export default function PostEditor({ post, onSave, onCancel, isLoading }) {
  const [formData, setFormData] = useState({
    title: post?.title || "",
    content: post?.content || "",
    excerpt: post?.excerpt || "",
    tags: post?.tags?.join(", ") || "",
    featured_image_url: post?.featured_image_url || "",
    is_published: post?.is_published !== false,
    reading_time: post?.reading_time || 0
  });

  const [isUploading, setIsUploading] = useState(false);

  const calculateReadingTime = (content) => {
    const wordsPerMinute = 200;
    // Ensure content is a string before splitting, to avoid errors if it's null/undefined
    const wordCount = (content || "").split(/\s+/).filter(word => word.length > 0).length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const handleContentChange = (content) => {
    const readingTime = calculateReadingTime(content);
    setFormData(prev => ({
      ...prev,
      content,
      reading_time: readingTime
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { file_url } = await UploadFile({ file });
      setFormData(prev => ({
        ...prev,
        featured_image_url: file_url
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setIsUploading(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const tagsArray = formData.tags
      ? formData.tags.split(",").map(tag => tag.trim()).filter(Boolean)
      : [];
    
    onSave({
      ...formData,
      tags: tagsArray
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-3xl p-8 elegant-shadow-lg border border-gray-100">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium text-gray-900">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Enter your post title..."
              className="text-lg font-semibold border-0 border-b border-gray-200 rounded-none px-0 py-3 focus:border-gray-400 focus:ring-0 bg-transparent"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-sm font-medium text-gray-900">
              Excerpt
            </Label>
            <Textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
              placeholder="A brief summary of your post..."
              className="border-gray-200 focus:border-gray-400 focus:ring-0 rounded-xl resize-none"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-sm font-medium text-gray-900">
              Content <span className="text-xs text-gray-500">(Markdown supported, optional)</span>
            </Label>
            <Textarea
              id="content"
              value={formData.content}
              onChange={(e) => handleContentChange(e.target.value)}
              placeholder="Share your story..."
              className="min-h-[400px] border-gray-200 focus:border-gray-400 focus:ring-0 rounded-xl font-mono text-sm leading-relaxed"
            />
            {formData.reading_time > 0 && (
              <p className="text-xs text-gray-500 mt-2">
                Estimated reading time: {formData.reading_time} minutes
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="tags" className="text-sm font-medium text-gray-900">
                Tags
              </Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                placeholder="technology, design, thoughts (comma-separated)"
                className="border-gray-200 focus:border-gray-400 focus:ring-0 rounded-xl"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium text-gray-900">
                Featured Image
              </Label>
              <div className="flex gap-3">
                <Input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Label
                  htmlFor="image"
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors text-sm"
                >
                  {isUploading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  {isUploading ? "Uploading..." : "Upload Image"}
                </Label>
              </div>
              {formData.featured_image_url && (
                <img 
                  src={formData.featured_image_url} 
                  alt="Featured" 
                  className="w-full h-32 object-cover rounded-xl mt-2"
                />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-3">
              <Switch
                id="published"
                checked={formData.is_published}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_published: checked }))}
              />
              <Label htmlFor="published" className="text-sm text-gray-700">
                {formData.is_published ? "Published" : "Draft"}
              </Label>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="rounded-full px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    {post ? "Update Post" : "Publish Post"}
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
