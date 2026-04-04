"use client";

import { useQuery } from "@tanstack/react-query";
import { mockPosts, mockTags } from "@/src/lib/api/mock-data";
import { PostCard } from "@/src/components/post-card";
import { PageTransition } from "@/src/components/page-transition";
import { Badge } from "@/src/components/ui/badge";
import { Input } from "@/src/components/ui/input";
import { Search } from "lucide-react";

export default function Home() {
  const { data: posts = [] } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPosts;
    },
  });

  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 sm:px-8">
        {/* Hero Section */}
        <section className="mb-16 space-y-4 text-center md:text-left">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Insights for the{" "}
            <span className="text-primary">Modern Developer</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-muted-foreground md:mx-0">
            A minimalist blog exploring the intersection of technology, design,
            and developer culture.
          </p>
        </section>

        {/* Filters & Search */}
        <div className="mb-12 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-wrap justify-center gap-2 md:justify-start">
            <Badge variant="default" className="cursor-pointer px-4 py-1">
              All Posts
            </Badge>
            {mockTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="outline"
                className="cursor-pointer px-4 py-1 hover:bg-secondary transition-colors"
              >
                {tag.name}
              </Badge>
            ))}
          </div>
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search articles..."
              className="pl-10 rounded-full bg-muted/50 focus-visible:ring-primary"
            />
          </div>
        </div>

        {/* Post Grid */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
