import { useState } from "react";
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
import { Mail, MapPin, Clock, Send, Copy, Check } from "lucide-react";

const projectTypes = [
  { value: "ecommerce", label: "E-Commerce Store" },
  { value: "saas", label: "SaaS Application" },
  { value: "marketing", label: "Marketing Site" },
  { value: "internal", label: "Internal Tool" },
  { value: "basic", label: "Basic Website" },
  { value: "premium", label: "Premium Package (3-5 pages)" },
  { value: "custom", label: "Custom Package (10+ pages)" },
  { value: "prototyping", label: "Rapid Prototyping" },
  { value: "other", label: "Other" },
];

const budgetRanges = [
  { value: "under-1k", label: "Under $1,000" },
  { value: "1k-5k", label: "$1,000 - $5,000" },
  { value: "5k-10k", label: "$5,000 - $10,000" },
  { value: "10k-25k", label: "$10,000 - $25,000" },
  { value: "25k-plus", label: "$25,000+" },
  { value: "not-sure", label: "Not sure yet" },
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
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const form = useForm<InsertProjectRequest>({
    resolver: zodResolver(insertProjectRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectType: "",
      budgetRange: "",
      timeline: "",
      description: "",
      referenceUrl: "",
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
    onSuccess: (data) => {
      setTicketNumber(data.id);
      toast({
        title: "Project request submitted!",
        description: "Save your ticket number to check your project status anytime.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error submitting request",
        description: error instanceof Error ? error.message : "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertProjectRequest) => {
    submitMutation.mutate(data);
  };

  const copyTicket = () => {
    if (ticketNumber) {
      navigator.clipboard.writeText(ticketNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <section id="contact" data-host="contact" className="py-12 sm:py-16 section-accent relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
            Start Your <span className="tech-title">Project</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto px-2">
            Share your vision and I'll respond within 24 hours with a detailed proposal.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-10">
          <div className="space-y-5 order-2 lg:order-1">
            <div className="glass-card p-6 sm:p-8">
              <h3 className="text-2xl font-bold mb-5 text-slate-800">
                Let's <span className="gradient-text">Connect</span>
              </h3>

              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-blue-100">
                    <Mail className="text-blue-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-0.5">Email</h4>
                    <p className="text-slate-500 text-sm">gavin@gavineanthony.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-indigo-100">
                    <MapPin className="text-indigo-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-0.5">Location</h4>
                    <p className="text-slate-500 text-sm">Austin, TX</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-amber-50 rounded-lg flex items-center justify-center flex-shrink-0 border border-amber-100">
                    <Clock className="text-amber-600 w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-800 text-sm mb-0.5">Response Time</h4>
                    <p className="text-slate-500 text-sm">Within 24 hours</p>
                  </div>
                </div>
              </div>
            </div>

            {ticketNumber && (
              <div className="glass-card p-6 sm:p-8 border-emerald-200">
                <h4 className="font-bold text-emerald-600 mb-2">Request Submitted!</h4>
                <p className="text-slate-500 text-sm mb-3">
                  Save this ticket number to check your project status anytime:
                </p>
                <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <code className="text-blue-600 text-sm font-mono flex-1 break-all">{ticketNumber}</code>
                  <Button variant="ghost" size="sm" onClick={copyTicket} className="text-slate-400 hover:text-slate-700 flex-shrink-0">
                    {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
                <p className="text-xs text-slate-400 mt-2">
                  You can check your status in the "Check Project Status" section above.
                </p>
              </div>
            )}
          </div>

          <div className="glass-card p-6 sm:p-8 order-1 lg:order-2">
            <h3 className="text-xl sm:text-2xl font-bold mb-5 text-slate-800">
              <span className="gradient-text">Project Details</span>
            </h3>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="form-project-request">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600 text-sm">First Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="John" {...field} className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" />
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
                        <FormLabel className="text-slate-600 text-sm">Last Name *</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" />
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
                        <FormLabel className="text-slate-600 text-sm">Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" {...field} className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" />
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
                        <FormLabel className="text-slate-600 text-sm">Company</FormLabel>
                        <FormControl>
                          <Input placeholder="Acme Inc." {...field} value={field.value || ""} className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" />
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
                      <FormLabel className="text-slate-600 text-sm">Project Type *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-slate-200 text-slate-800">
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

                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="budgetRange"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-slate-600 text-sm">Budget Range</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-200 text-slate-800">
                              <SelectValue placeholder="Select budget range" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {budgetRanges.map((b) => (
                              <SelectItem key={b.value} value={b.value}>{b.label}</SelectItem>
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
                        <FormLabel className="text-slate-600 text-sm">Timeline *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-slate-200 text-slate-800">
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
                </div>

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 text-sm">Project Description *</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your project..." className="min-h-[100px] bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="referenceUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-slate-600 text-sm">Existing Site or Reference URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://..." {...field} value={field.value || ""} className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full tech-button py-6 text-base"
                  disabled={submitMutation.isPending}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {submitMutation.isPending ? "Sending..." : "Submit Project Request"}
                </Button>

                <p className="text-sm text-slate-400 text-center">
                  You'll receive a ticket number to track your project status.
                </p>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </section>
  );
}
