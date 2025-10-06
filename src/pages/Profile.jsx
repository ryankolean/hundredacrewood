import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { UserCircle, Mail, Shield, Calendar, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";

export default function Profile() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      setIsLoading(true);
      try {
        const user = await User.me();
        setCurrentUser(user);
      } catch (error) {
        // User not authenticated, redirect to blog
        navigate(createPageUrl("Blog"), { replace: true });
        return;
      }
      setIsLoading(false);
    };

    loadUser();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-20 h-20 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center">
            <UserCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-3">Authentication Required</h1>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Please log in to view your profile.
          </p>
          <Button
            onClick={() => navigate(createPageUrl("Blog"))}
            className="bg-gray-900 hover:bg-gray-800 text-white rounded-full px-6"
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
          <Button
            onClick={() => navigate(createPageUrl("Blog"))}
            variant="ghost"
            className="mb-8 rounded-full hover:bg-gray-100"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Blog
          </Button>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-light text-gray-900 tracking-tight mb-2">
              Your Profile
            </h1>
            <p className="text-gray-600 font-light">
              Account information and preferences
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card className="elegant-shadow-lg">
              <CardHeader className="text-center pb-6">
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                  <UserCircle className="w-12 h-12 text-gray-600" />
                </div>
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {currentUser.full_name}
                </CardTitle>
                <div className="flex items-center justify-center space-x-2 mt-2">
                  {currentUser.role === 'admin' && (
                    <span className="inline-flex items-center space-x-1 text-xs bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      <Shield className="w-3 h-3" />
                      <span>Administrator</span>
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div className="grid gap-6">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Address</p>
                      <p className="text-sm text-gray-600">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Member Since</p>
                      <p className="text-sm text-gray-600">
                        {format(new Date(currentUser.created_date), "MMMM d, yyyy")}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                    <Shield className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-sm font-medium text-gray-900">Account Type</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {currentUser.role === 'admin' ? 'Administrator' : 'User'}
                      </p>
                    </div>
                  </div>
                </div>

                {currentUser.role === 'admin' && (
                  <div className="pt-6 border-t border-gray-200">
                    <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                      <div className="flex items-start space-x-3">
                        <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="text-sm font-medium text-blue-900 mb-1">
                            Administrator Access
                          </h3>
                          <p className="text-sm text-blue-700">
                            You have administrative privileges to create, edit, and delete blog posts. 
                            Use the admin view toggle in the navigation to switch between admin and user perspectives.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}