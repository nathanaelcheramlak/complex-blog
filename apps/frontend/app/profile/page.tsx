"use client";

import { useQuery } from "@tanstack/react-query";
import { mockUser, mockPosts } from "@/src/lib/api/mock-data";
import { PostCard } from "@/src/components/post-card";
import { PageTransition } from "@/src/components/page-transition";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/src/components/ui/tabs";
import { Settings, FileText, Heart } from "lucide-react";

export default function ProfilePage() {
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockUser;
    },
  });

  const { data: myPosts = [] } = useQuery({
    queryKey: ["my-posts"],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockPosts.filter((p) => p.author.id === user?.id);
    },
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 sm:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{user.name}</h1>
                <p className="text-muted-foreground">{user.email}</p>
              </div>
              <Button variant="outline" className="gap-2">
                <Settings className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
            <p className="text-lg max-w-2xl leading-relaxed">{user.bio}</p>
            <div className="flex gap-6 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {myPosts.length} Posts
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Heart className="h-4 w-4 text-muted-foreground" />
                124 Likes received
              </span>
            </div>
          </div>
        </div>

        <Tabs defaultValue="posts" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
            <TabsTrigger value="posts">My Posts</TabsTrigger>
            <TabsTrigger value="settings">Account Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="space-y-8">
            {myPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {myPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>
            ) : (
              <Card className="border-dashed py-12 text-center">
                <CardHeader>
                  <CardTitle>No posts yet</CardTitle>
                  <CardDescription>
                    You haven&apos;t written any articles yet. Share your
                    thoughts with the world!
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button>Create your first post</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your personal information and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h3 className="font-semibold mb-1">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">
                      Receive updates about your posts and comments.
                    </p>
                  </div>
                  <div className="p-4 rounded-lg border bg-muted/30">
                    <h3 className="font-semibold mb-1">Public Profile</h3>
                    <p className="text-sm text-muted-foreground">
                      Control what information is visible to others.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageTransition>
  );
}
