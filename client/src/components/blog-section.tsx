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
  Business: "bg-amber-50 text-amber-600 border-amber-200",
  Development: "bg-blue-50 text-blue-600 border-blue-200",
  "E-commerce": "bg-indigo-50 text-indigo-600 border-indigo-200",
};

export default function BlogSection() {
  return (
    <section id="blog" className="py-12 sm:py-16 section-darker relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
            Insights & <span className="tech-title">Articles</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto px-2">
            Sharing knowledge and insights from years of building web solutions for businesses
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
          {articles.map((article) => (
            <div
              key={article.id}
              className="glass-card p-5 sm:p-6 group cursor-pointer"
              data-testid={`article-${article.id}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-xs px-2.5 py-0.5 rounded-full border ${categoryColors[article.category]}`}>
                  {article.category}
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-800 mb-2 group-hover:text-blue-600 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                {article.excerpt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-slate-400 text-xs">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {article.date}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {article.readTime}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
