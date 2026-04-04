"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { mockPosts, mockComments } from "@/src/lib/api/mock-data";
import { PageTransition } from "@/src/components/page-transition";
import { Avatar, AvatarFallback, AvatarImage } from "@/src/components/ui/avatar";
import { Badge } from "@/src/components/ui/badge";
import { Button } from "@/src/components/ui/button";
import { Calendar, Clock, MessageSquare, ThumbsUp, ArrowLeft, Share2 } from "lucide-react";
import { Separator } from "@/src/components/ui/separator";

export default function PostDetail() {
  const params = useParams();
  const id = Number(params.id);

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return mockPosts.find((p) => p.id === id);
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <div className="animate-pulse space-y-8">
          <div className="mx-auto h-8 w-64 rounded bg-muted"></div>
          <div className="mx-auto aspect-video w-full max-w-4xl rounded-2xl bg-muted"></div>
          <div className="mx-auto h-24 max-w-2xl rounded bg-muted"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Button asChild className="mt-4">
          <Link href="/">Back to Feed</Link>
        </Button>
      </div>
    );
  }

  return (
    <PageTransition>
      <article className="container mx-auto px-4 py-12 sm:px-8 max-w-4xl">
        <Button variant="ghost" asChild className="mb-8 -ml-4">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Feed
          </Link>
        </Button>

        <header className="space-y-6 mb-12">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="px-3 py-1">
                {tag.name}
              </Badge>
            ))}
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:leading-[1.1]">
            {post.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-base font-semibold">{post.author.name}</span>
                <span className="text-sm text-muted-foreground flex items-center">
                  <Calendar className="mr-1 h-3 w-3" />
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                  <span className="mx-2 text-muted-foreground/30">•</span>
                  <Clock className="mr-1 h-3 w-3" />
                  5 min read
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="rounded-full">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="relative aspect-video overflow-hidden rounded-3xl mb-12 shadow-2xl shadow-primary/10">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-zinc dark:prose-invert max-w-none mb-16 text-lg leading-relaxed">
          {post.content.split('\n').map((paragraph, i) => (
            <p key={i} className="mb-6">{paragraph}</p>
          ))}
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
          <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
        </div>

        <Separator className="mb-12" />

        <section className="mb-24">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Comments ({post.commentCount})
            </h2>
            <div className="flex items-center gap-4">
              <Button variant="ghost" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                {post.likeCount} Likes
              </Button>
            </div>
          </div>

          <div className="space-y-8">
            {mockComments.map((comment) => (
              <div key={comment.id} className="flex gap-4">
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                  <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{comment.author.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">
                    {comment.content}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 p-6 rounded-2xl bg-muted/30 border border-dashed border-muted-foreground/20 text-center">
            <p className="text-muted-foreground mb-4">Join the conversation</p>
            <Button>Post a Comment</Button>
          </div>
        </section>
      </article>
    </PageTransition>
  );
}
