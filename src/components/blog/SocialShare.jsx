import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Twitter, Facebook, Linkedin, Link2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function SocialShare({ title, url }) {
  const [showOptions, setShowOptions] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = url || window.location.href;
  const shareTitle = title || document.title;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy link:", error);
    }
  };

  const handleTwitterShare = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=400');
  };

  const handleFacebookShare = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=400');
  };

  const handleLinkedInShare = () => {
    const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`;
    window.open(linkedinUrl, '_blank', 'width=550,height=400');
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setShowOptions(!showOptions)}
        variant="outline"
        className="rounded-full hover:bg-gray-50 transition-colors duration-200"
      >
        <Share2 className="w-4 h-4 mr-2" />
        Share
      </Button>

      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full mb-2 right-0 bg-white rounded-xl shadow-lg border border-gray-200 p-2 min-w-48"
          >
            <div className="space-y-1">
              <button
                onClick={handleTwitterShare}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Twitter className="w-4 h-4 text-blue-400" />
                <span>Share on Twitter</span>
              </button>

              <button
                onClick={handleFacebookShare}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Facebook className="w-4 h-4 text-blue-600" />
                <span>Share on Facebook</span>
              </button>

              <button
                onClick={handleLinkedInShare}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                <Linkedin className="w-4 h-4 text-blue-700" />
                <span>Share on LinkedIn</span>
              </button>

              <hr className="my-1 border-gray-100" />

              <button
                onClick={handleCopyLink}
                className="w-full flex items-center space-x-3 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    <span className="text-green-600">Link copied!</span>
                  </>
                ) : (
                  <>
                    <Link2 className="w-4 h-4 text-gray-500" />
                    <span>Copy link</span>
                  </>
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Backdrop to close dropdown */}
      {showOptions && (
        <div
          className="fixed inset-0 z-[-1]"
          onClick={() => setShowOptions(false)}
        />
      )}
    </div>
  );
}