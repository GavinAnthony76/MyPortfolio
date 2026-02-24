import { Button } from "@/components/ui/button";
import { Calendar, Clock, ArrowRight } from "lucide-react";

const articles = [
  {
    id: "1",
    title: "Why Every Local Business Needs a Professional Website in 2026",
    excerpt: "In today's digital landscape, your website is often the first impression customers have of your business. Learn why investing in a professional web presence is essential for growth.",
    date: "Feb 15, 2026",
    readTime: "5 min read",
    category: "Business",
  },
  {
    id: "2",
    title: "React vs. Next.js: Choosing the Right Framework for Your Project",
    excerpt: "Understanding the differences between React and Next.js can help you make better decisions for your web development project. Here's a practical comparison.",
    date: "Feb 8, 2026",
    readTime: "7 min read",
    category: "Development",
  },
  {
    id: "3",
    title: "5 Essential Features Every E-commerce Website Needs",
    excerpt: "From secure payment processing to mobile-responsive design, these features are must-haves for any online store looking to convert visitors into customers.",
    date: "Jan 28, 2026",
    readTime: "4 min read",
    category: "E-commerce",
  },
];

const categoryColors: Record<string, string> = {
  Business: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Development: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  "E-commerce": "bg-purple-500/10 text-purple-400 border-purple-500/20",
};

export default function BlogSection() {
  return (
    <section id="blog" className="py-16 sm:py-20 md:py-28 section-darker relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Insights & <span className="tech-title">Articles</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Sharing knowledge and insights from years of building web solutions for businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {articles.map((article) => (
            <div
              key={article.id}
              className="glass-card p-6 sm:p-8 group cursor-pointer"
              data-testid={`article-${article.id}`}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-xs px-3 py-1 rounded-full border ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white mb-3 group-hover:text-cyan-400 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-slate-400 text-sm mb-5 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-slate-500 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
