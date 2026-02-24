import { useState, type FormEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertProjectRequestSchema,
  type InsertProjectRequest,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Mail, MapPin, Clock, Send, Calendar, Newspaper } from "lucide-react";

const projectTypes = [
  { value: "basic", label: "Basic" },
  { value: "premium", label: "Premium Package" },
  { value: "custom", label: "Custom Package" },
  { value: "prototyping", label: "Rapid Prototyping" },
  { value: "other", label: "Other" },
];

const timelines = [
  { value: "asap", label: "ASAP" },
  { value: "1-month", label: "Within 1 month" },
  { value: "2-3-months", label: "2-3 months" },
  { value: "3-6-months", label: "3-6 months" },
  { value: "6-plus-months", label: "6+ months" },
  { value: "flexible", label: "Flexible" },
];

export default function ContactSection() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");

  const form = useForm<InsertProjectRequest>({
    resolver: zodResolver(insertProjectRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectType: "",
      timeline: "",
      description: "",
      targetAudience: "",
      keyFeatures: "",
      techPreferences: "",
      designReferences: "",
      additionalInfo: "",
    },
  });

  const submitMutation = useMutation({
    mutationFn: async (data: InsertProjectRequest) => {
      const response = await apiRequest("POST", "/api/project-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project request submitted!",
        description:
          "Thank you for your interest. I'll get back to you within 24 hours.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error submitting request",
        description:
          error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProjectRequest) => {
    submitMutation.mutate(data);
  };

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (email) {
      toast({
        title: "Subscribed!",
        description: "You'll receive updates on web development tips and insights.",
      });
      setEmail("");
    }
  };

  return (
    <section id="contact" className="py-16 sm:py-20 md:py-28 section-accent relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Start Your <span className="tech-title">Project</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto px-2">
            Ready to build something amazing? Share your vision and I'll respond
            within 24 hours with a detailed proposal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-6 order-2 lg:order-1">
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-2xl font-bold mb-6 text-white">
                Let's <span className="gradient-text">Connect</span>
              </h3>

              <div className="space-y-5">
                <div className="flex items-start space-x-4" data-testid="contact-email">
                  <div className="w-11 h-11 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                    <Mail className="text-cyan-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-0.5">Email</h4>
                    <p className="text-slate-400 text-sm">projects@gavineanthony.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-location">
                  <div className="w-11 h-11 bg-purple-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-purple-500/20">
                    <MapPin className="text-purple-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-0.5">Location</h4>
                    <p className="text-slate-400 text-sm">Austin, TX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-response-time">
                  <div className="w-11 h-11 bg-amber-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-500/20">
                    <Clock className="text-amber-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-0.5">Response Time</h4>
                    <p className="text-slate-400 text-sm">Within 24 hours</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4" data-testid="contact-booking">
                  <div className="w-11 h-11 bg-green-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-green-500/20">
                    <Calendar className="text-green-400 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-white text-sm mb-0.5">Book a Consultation</h4>
                    <p className="text-slate-400 text-sm">Schedule a free 15-minute call to discuss your project</p>
                    <a 
                      href="mailto:projects@gavineanthony.com?subject=Consultation%20Request"
                      className="text-cyan-400 text-sm hover:text-cyan-300 transition-colors inline-flex items-center gap-1 mt-1"
                    >
                      Schedule Now
                    </a>
                  </div>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 bg-cyan-500/10 rounded-lg flex items-center justify-center flex-shrink-0 border border-cyan-500/20">
                  <Newspaper className="text-cyan-400 w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-white text-sm">Stay Updated</h4>
                  <p className="text-slate-500 text-xs">Get web development tips and insights</p>
                </div>
              </div>
              <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 text-sm"
                  required
                />
                <Button type="submit" className="tech-button px-4 flex-shrink-0 text-sm">
                  Subscribe
                </Button>
              </form>
            </div>
          </div>

          <div className="glass-card p-6 sm:p-8 order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-6 text-white">
              <span className="gradient-text">Project Details</span>
            </h3>

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
                data-testid="form-project-request"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 text-sm">First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-firstName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 text-sm">Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-lastName" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 text-sm">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-300 text-sm">Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} value={field.value || ""} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-company" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="projectType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-projectType">
                        <FormControl>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select project type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {projectTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="timeline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Timeline *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-timeline">
                        <FormControl>
                          <SelectTrigger className="bg-slate-800/50 border-slate-700 text-white">
                            <SelectValue placeholder="Select timeline" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timelines.map((timeline) => (
                            <SelectItem key={timeline.value} value={timeline.value}>{timeline.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Project Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your project in detail..." className="min-h-[100px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" {...field} data-testid="textarea-description" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="targetAudience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Target Audience</FormLabel>
                      <FormControl>
                        <Input placeholder="Who will be using your application?" {...field} value={field.value || ""} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-targetAudience" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="keyFeatures"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Key Features Required</FormLabel>
                      <FormControl>
                        <Textarea placeholder="List the main features you need..." className="min-h-[80px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" {...field} value={field.value || ""} data-testid="textarea-keyFeatures" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="techPreferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Technical Preferences</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Any specific technologies or integrations?" className="min-h-[60px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" {...field} value={field.value || ""} data-testid="textarea-techPreferences" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="designReferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Design References</FormLabel>
                      <FormControl>
                        <Input placeholder="Any websites or apps you like the design of?" {...field} value={field.value || ""} className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" data-testid="input-designReferences" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-300 text-sm">Additional Information</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Anything else you'd like me to know?" className="min-h-[80px] bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600" {...field} value={field.value || ""} data-testid="textarea-additionalInfo" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full tech-button py-6 text-base"
                  disabled={submitMutation.isPending}
                  data-testid="button-submit"
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitMutation.isPending ? "Sending..." : "Send Project Request"}
                </Button>

                <p className="text-sm text-slate-500 text-center">
                  I'll review your project details and get back to you within 24 hours with a detailed proposal.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
