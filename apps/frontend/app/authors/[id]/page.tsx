"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { mockUser, mockPosts } from "@/src/lib/api/mock-data";
import { PostCard } from "@/src/components/post-card";
import { PageTransition } from "@/src/components/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Button } from "@/src/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/src/components/ui/card";
import { FileText, Heart, Mail, Share2 } from "lucide-react";

export default function AuthorProfilePage() {
  const params = useParams();
  const id = Number(params.id);

  const { data: author, isLoading: isAuthorLoading } = useQuery({
    queryKey: ["author", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      // In a real app, we'd fetch the author by ID. For now, we use mockUser if ID matches.
      return id === 1 ? mockUser : {
        ...mockUser,
        id,
        name: "Jane Smith",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        bio: "Senior Technical Writer and Full-stack Developer. Exploring the depths of web architecture.",
      };
    },
  });

  const { data: authorPosts = [], isLoading: isPostsLoading } = useQuery({
    queryKey: ["author-posts", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      return mockPosts.filter(p => p.author.id === id);
    },
    enabled: !!author,
  });

  if (isAuthorLoading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-32 w-32 rounded-full bg-muted"></div>
          <div className="h-8 w-48 bg-muted rounded"></div>
          <div className="h-4 w-64 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Author not found</h1>
      </div>
    );
  }

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 sm:px-8 max-w-6xl">
        <div className="flex flex-col md:flex-row gap-8 items-start mb-16">
          <Avatar className="h-32 w-32 border-4 border-background shadow-xl">
            <AvatarImage src={author.avatar} alt={author.name} />
            <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold">{author.name}</h1>
                <p className="text-muted-foreground">Author & Contributor</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="gap-2">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                <Button variant="outline" size="icon" className="rounded-full h-9 w-9">
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <p className="text-lg max-w-2xl leading-relaxed">
              {author.bio}
            </p>
            <div className="flex gap-6 text-sm">
              <span className="flex items-center gap-1 font-medium">
                <FileText className="h-4 w-4 text-muted-foreground" />
                {authorPosts.length} Posts
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Heart className="h-4 w-4 text-muted-foreground" />
                Member since {new Date(author.createdAt).getFullYear()}
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-bold">Published Articles</h2>
            <div className="h-px flex-1 bg-border"></div>
          </div>
          
          {isPostsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map(i => (
                <div key={i} className="space-y-4">
                  <div className="aspect-video bg-muted rounded-2xl animate-pulse"></div>
                  <div className="h-6 w-3/4 bg-muted rounded animate-pulse"></div>
                  <div className="h-4 w-1/2 bg-muted rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          ) : authorPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {authorPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed py-12 text-center">
              <CardHeader>
                <CardTitle>No posts published yet</CardTitle>
                <CardDescription>
                  This author hasn't shared any articles yet.
                </CardDescription>
              </CardHeader>
            </Card>
          )}
        </div>
      </div>
    </PageTransition>
  );
}
