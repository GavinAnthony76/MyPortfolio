import { type FormEvent, useState } from "react";
import { Star, Quote, Send } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import type { Testimonial } from "@shared/schema";

const hardcodedTestimonials = [
  {
    id: "hc-1",
    name: "Marcus Johnson",
    role: "Business Owner",
    company: "Johnson's Auto Care",
    content: "Gavin built our business website from scratch and it completely transformed our online presence. We've seen a significant increase in customer inquiries since launching. His communication throughout the process was excellent.",
    rating: 5,
  },
  {
    id: "hc-2",
    name: "Sarah Mitchell",
    role: "Event Coordinator",
    company: "Texas Showdown",
    content: "Working with Gavin on the Texas Showdown website was an incredible experience. He understood our vision for the fighting game community and delivered a site that perfectly represents our event. The registration system works flawlessly.",
    rating: 5,
  },
  {
    id: "hc-3",
    name: "David Williams",
    role: "Restaurant Owner",
    company: "Jamaica Nyammingz",
    content: "Gavin created a beautiful website for our restaurant that really captures the spirit of Jamaican cuisine. The online ordering system has been a game-changer for our business. Highly recommend his services.",
    rating: 5,
  },
  {
    id: "hc-4",
    name: "Pastor Robert Chen",
    role: "Ministry Leader",
    company: "Power of the Lamb",
    content: "Gavin helped us build a platform that allows us to reach our congregation online. The live streaming integration and course registration system have expanded our ministry's reach beyond what we imagined.",
    rating: 5,
  },
];

export default function TestimonialsSection() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: "5",
  });

  const { data: dbTestimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ['/api/testimonials'],
  });

  const submitMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      await apiRequest('POST', '/api/testimonials', {
        ...data,
        rating: parseInt(data.rating),
      });
    },
    onSuccess: () => {
      toast({
        title: "Thank you!",
        description: "Your testimonial has been submitted and will appear after review.",
      });
      setFormData({ name: "", role: "", company: "", content: "", rating: "5" });
      setShowForm(false);
      queryClient.invalidateQueries({ queryKey: ['/api/testimonials'] });
    },
    onError: () => {
      toast({
        title: "Submission failed",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.role.trim() || !formData.content.trim()) {
      toast({ title: "Missing fields", description: "Please fill in your name, role, and testimonial.", variant: "destructive" });
      return;
    }
    submitMutation.mutate(formData);
  };

  const allTestimonials = [
    ...hardcodedTestimonials,
    ...dbTestimonials.map(t => ({
      id: t.id,
      name: t.name,
      role: t.role,
      company: t.company || "",
      content: t.content,
      rating: t.rating,
    })),
  ];

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
          {allTestimonials.map((testimonial) => (
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
                  <p className="text-slate-500 text-xs">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="glass-button text-cyan-300 border-cyan-500/30 hover:bg-cyan-500/10"
              variant="outline"
              data-testid="button-leave-testimonial"
            >
              <Send className="w-4 h-4 mr-2" />
              Leave a Testimonial
            </Button>
          ) : (
            <div className="max-w-xl mx-auto glass-card p-6 sm:p-8 text-left">
              <h3 className="text-xl font-bold text-white mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Your Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      data-testid="input-testimonial-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-400 mb-1 block">Your Role *</label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Business Owner"
                      className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                      data-testid="input-testimonial-role"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Company (optional)</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your Company"
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500"
                    data-testid="input-testimonial-company"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Rating *</label>
                  <Select value={formData.rating} onValueChange={(val) => setFormData(prev => ({ ...prev, rating: val }))}>
                    <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white" data-testid="select-testimonial-rating">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 Stars - Excellent</SelectItem>
                      <SelectItem value="4">4 Stars - Great</SelectItem>
                      <SelectItem value="3">3 Stars - Good</SelectItem>
                      <SelectItem value="2">2 Stars - Fair</SelectItem>
                      <SelectItem value="1">1 Star - Poor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm text-slate-400 mb-1 block">Your Testimonial *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience working with Gavin..."
                    rows={4}
                    className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-500 resize-none"
                    data-testid="input-testimonial-content"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white"
                    data-testid="button-submit-testimonial"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Testimonial"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-600 text-slate-400 hover:bg-slate-800"
                    data-testid="button-cancel-testimonial"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
