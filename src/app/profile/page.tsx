"use client";

import React from "react";
import { UserCircle, Home, MapPin, MessageSquare, Heart } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const ProfilePage = () => {
  const [phone, setPhone] = useState("+91 9876543210");
  const [university, setUniversity] = useState("Sharda University");
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Sidebar Navigation */}
          <aside className="md:col-span-1">
            <nav className="space-y-4">
              <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground">
                <UserCircle className="mr-2 h-5 w-5" />
                Profile Overview
              </a>
              <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground">
                <Home className="mr-2 h-5 w-5" />
                Account Settings
              </a>
              <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground">
                <MapPin className="mr-2 h-5 w-5" />
                Activity & History
              </a>
              <a href="#" className="flex items-center py-2 px-4 rounded-md hover:bg-primary/10 hover:text-primary text-muted-foreground">
                <MessageSquare className="mr-2 h-5 w-5" />
                Reviews & Ratings
              </a>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="md:col-span-3 space-y-6 bg-gradient-to-br from-lavender-50 to-white">
            {/* User Information Section */}
            <Card className="card">
              <CardHeader className="bg-secondary/20">
                <CardTitle className="text-lg font-semibold text-foreground">User Information</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">View and manage your profile information.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={user?.photoURL || "https://github.com/shadcn.png"} alt="User Avatar" />
                    <AvatarFallback>{user?.displayName?.substring(0, 2).toUpperCase() || "CN"}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">{user?.displayName || "John Doe"}</h2>
                    <p className="text-muted-foreground">Sharda University</p>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-muted-foreground">Verified Student</span>
                      {/* Add verification badge here */}
                    </div>
                    <div className="flex space-x-4 mt-2">
                      <div>
                        <span className="font-semibold">123</span> Listings Viewed
                      </div>
                      <div>
                        <span className="font-semibold">45</span> Saved Favorites
                      </div>
                      <div>
                        <span className="font-semibold">365</span> Days as Member
                      </div>
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-muted-foreground">
                    A passionate student at Sharda University, eager to connect with fellow students and find the perfect accommodation.
                  </p>
                </div>
                <Button className="mt-4">Edit Profile</Button>
              </CardContent>
            </Card>

            {/* Personal Information Section */}
            <Card className="card">
              <CardHeader className="bg-secondary/20">
                <CardTitle className="text-lg font-semibold text-foreground">Personal Information</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Manage your contact details and personal information.</CardDescription>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div>
                  <label className="block text-muted-foreground text-sm font-bold mb-2" htmlFor="email">
                    Email
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input"
                    id="email"
                    type="email"
                    placeholder="Email"
                    value={user?.email || "john.doe@example.com"}
                    readOnly
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-sm font-bold mb-2" htmlFor="phone">
                    Phone
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input"
                    id="phone"
                    type="tel"
                    placeholder="Phone"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-muted-foreground text-sm font-bold mb-2" htmlFor="university">
                    University
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-foreground leading-tight focus:outline-none focus:shadow-outline bg-input"
                    id="university"
                    type="text"
                    placeholder="University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </div>
                <Button>Update Information</Button>
              </CardContent>
            </Card>

            {/* Preferences Section */}
            <Card className="card">
              <CardHeader className="bg-secondary/20">
                <CardTitle className="text-lg font-semibold text-foreground">Preferences</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">Set your housing and roommate preferences.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Preferences Form */}
              </CardContent>
            </Card>

            {/* Activity Dashboard Section */}
            <Card className="card">
              <CardHeader className="bg-secondary/20">
                <CardTitle className="text-lg font-semibold text-foreground">Activity Dashboard</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">View your recent activity.</CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                {/* Activity Dashboard Content */}
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
