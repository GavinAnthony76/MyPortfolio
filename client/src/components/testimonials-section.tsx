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
    <section id="testimonials" className="py-12 sm:py-16 section-light relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
            Client <span className="tech-title">Testimonials</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto px-2">
            Hear from the businesses and organizations I've helped bring their digital vision to life
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {allTestimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="glass-card p-5 sm:p-6 relative"
              data-testid={`testimonial-${testimonial.id}`}
            >
              <Quote className="absolute top-5 right-5 w-7 h-7 text-blue-200" />
              
              <div className="flex gap-1 mb-3">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 mb-4 leading-relaxed text-sm italic">
                "{testimonial.content}"
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-xs">
                    {testimonial.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <p className="text-slate-800 font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-slate-400 text-xs">{testimonial.role}{testimonial.company ? `, ${testimonial.company}` : ''}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          {!showForm ? (
            <Button
              onClick={() => setShowForm(true)}
              className="glass-button text-blue-600 border-blue-200 hover:bg-blue-50"
              variant="outline"
              data-testid="button-leave-testimonial"
            >
              <Send className="w-4 h-4 mr-2" />
              Leave a Testimonial
            </Button>
          ) : (
            <div className="max-w-xl mx-auto glass-card p-6 sm:p-8 text-left">
              <h3 className="text-xl font-bold text-slate-800 mb-6">Share Your Experience</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">Your Name *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                      data-testid="input-testimonial-name"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-slate-500 mb-1 block">Your Role *</label>
                    <Input
                      value={formData.role}
                      onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                      placeholder="Business Owner"
                      className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                      data-testid="input-testimonial-role"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Company (optional)</label>
                  <Input
                    value={formData.company}
                    onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                    placeholder="Your Company"
                    className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400"
                    data-testid="input-testimonial-company"
                  />
                </div>
                <div>
                  <label className="text-sm text-slate-500 mb-1 block">Rating *</label>
                  <Select value={formData.rating} onValueChange={(val) => setFormData(prev => ({ ...prev, rating: val }))}>
                    <SelectTrigger className="bg-white border-slate-200 text-slate-800" data-testid="select-testimonial-rating">
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
                  <label className="text-sm text-slate-500 mb-1 block">Your Testimonial *</label>
                  <Textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    placeholder="Share your experience working with Gavin..."
                    rows={4}
                    className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 resize-none"
                    data-testid="input-testimonial-content"
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
                    data-testid="button-submit-testimonial"
                  >
                    {submitMutation.isPending ? "Submitting..." : "Submit Testimonial"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowForm(false)}
                    className="border-slate-200 text-slate-500 hover:bg-slate-50"
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
