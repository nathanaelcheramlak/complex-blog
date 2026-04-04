"use client";

import { mockTags } from "@/src/lib/api/mock-data";
import { PageTransition } from "@/src/components/page-transition";
import { Badge } from "@/src/components/ui/badge";
import Link from "next/link";
import { Hash } from "lucide-react";

export default function TagsPage() {
  return (
    <PageTransition>
      <div className="container mx-auto px-4 py-12 sm:px-8 max-w-4xl">
        <header className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
            Explore by <span className="text-primary">Tags</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Find articles across various categories and topics.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {mockTags.map((tag) => (
            <Link 
              key={tag.id} 
              href={`/?tag=${tag.slug}`}
              className="group flex items-center justify-between p-6 rounded-2xl border bg-card hover:bg-accent/5 transition-all hover:shadow-md"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Hash className="h-5 w-5" />
                </div>
                <span className="text-lg font-semibold">{tag.name}</span>
              </div>
              <Badge variant="secondary" className="px-3">
                {Math.floor(Math.random() * 20) + 5} posts
              </Badge>
            </Link>
          ))}
        </div>
      </div>
    </PageTransition>
  );
}
