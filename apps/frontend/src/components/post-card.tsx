import Link from "next/link";
import Image from "next/image";
import { Post } from "@/src/types";
import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Calendar, MessageSquare, ThumbsUp } from "lucide-react";

export function PostCard({ post }: { post: Post }) {
  return (
    <Card className="group overflow-hidden border-none bg-transparent transition-all hover:bg-accent/5">
      <Link href={`/posts/${post.id}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-video overflow-hidden rounded-2xl">
            {post.coverImage ? (
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4 p-4 pt-6">
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <Badge key={tag.id} variant="secondary" className="font-medium">
                {tag.name}
              </Badge>
            ))}
          </div>
          <h3 className="text-2xl font-bold leading-tight tracking-tight transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          <p className="line-clamp-2 text-muted-foreground">{post.excerpt}</p>
        </CardContent>
      </Link>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <Link
          href={`/authors/${post.author.id}`}
          className="flex items-center space-x-3 transition-colors hover:text-primary group/author"
        >
          <Avatar className="h-8 w-8 transition-transform group-hover/author:scale-105">
            <AvatarImage src={post.author.avatar} alt={post.author.name} />
            <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-sm font-medium leading-none">
              {post.author.name}
            </span>
            <span className="text-xs text-muted-foreground flex items-center mt-1">
              <Calendar className="mr-1 h-3 w-3" />
              {new Date(post.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </span>
          </div>
        </Link>
        <div className="flex items-center space-x-4 text-muted-foreground">
          <div className="flex items-center text-xs">
            <ThumbsUp className="mr-1 h-3 w-3" />
            {post.likeCount}
          </div>
          <div className="flex items-center text-xs">
            <MessageSquare className="mr-1 h-3 w-3" />
            {post.commentCount}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
