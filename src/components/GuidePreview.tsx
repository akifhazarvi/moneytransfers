import Link from "next/link";
import { ArrowUpRight, BookOpen, GraduationCap, Star, Globe2, Briefcase, BarChart3, Clock3 } from "lucide-react";

/** Keep the listing payload small: article HTML never crosses the client boundary. */
export interface GuideCard {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
}

export const CATEGORY_ICONS = {
  Guides: BookOpen,
  Education: GraduationCap,
  Reviews: Star,
  Corridors: Globe2,
  Business: Briefcase,
  Research: BarChart3,
};

export default function GuidePreview({ post }: { post: GuideCard }) {
  const Icon = CATEGORY_ICONS[post.category as keyof typeof CATEGORY_ICONS] ?? BookOpen;
  return (
    <Link href={`/guides/${post.slug}`} className="guide-preview group">
      <div className="guide-preview-meta">
        <span className="guide-category" data-category={post.category}>
          <Icon size={15} aria-hidden="true" />{post.category}
        </span>
        {post.readTime && <span className="inline-flex items-center gap-1.5"><Clock3 size={13} aria-hidden="true" />{post.readTime}</span>}
      </div>
      <h3>{post.title}</h3>
      <p>{post.excerpt}</p>
      <div className="guide-preview-footer">
        <span>Read {post.category === "Research" ? "the research" : "guide"}</span>
        <span className="guide-arrow"><ArrowUpRight size={18} aria-hidden="true" /></span>
      </div>
    </Link>
  );
}
