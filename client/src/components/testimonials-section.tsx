import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    id: "1",
    name: "Marcus Johnson",
    role: "Business Owner",
    company: "Johnson's Auto Care",
    content: "Gavin built our business website from scratch and it completely transformed our online presence. We've seen a significant increase in customer inquiries since launching. His communication throughout the process was excellent.",
    rating: 5,
  },
  {
    id: "2",
    name: "Sarah Mitchell",
    role: "Event Coordinator",
    company: "Texas Showdown",
    content: "Working with Gavin on the Texas Showdown website was an incredible experience. He understood our vision for the fighting game community and delivered a site that perfectly represents our event. The registration system works flawlessly.",
    rating: 5,
  },
  {
    id: "3",
    name: "David Williams",
    role: "Restaurant Owner",
    company: "Jamaica Nyammingz",
    content: "Gavin created a beautiful website for our restaurant that really captures the spirit of Jamaican cuisine. The online ordering system has been a game-changer for our business. Highly recommend his services.",
    rating: 5,
  },
  {
    id: "4",
    name: "Pastor Robert Chen",
    role: "Ministry Leader",
    company: "Power of the Lamb",
    content: "Gavin helped us build a platform that allows us to reach our congregation online. The live streaming integration and course registration system have expanded our ministry's reach beyond what we imagined.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-16 sm:py-20 md:py-28 section-darker relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Client <span className="tech-title">Testimonials</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Hear from the businesses and organizations I've helped bring their digital vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass-card p-6 sm:p-8 relative"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <Quote className="absolute top-6 right-6 w-8 h-8 text-cyan-500/15" />
              
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-300 mb-6 leading-relaxed text-sm sm:text-base italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-slate-500 text-xs">{testimonial.role}, {testimonial.company}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
