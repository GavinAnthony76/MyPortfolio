import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  insertProjectRequestSchema,
  type InsertProjectRequest,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
import { Copy, Check, Search, AlertCircle, Clock, FileText, CheckCircle2 } from "lucide-react";
import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import ScrollReveal from "@/components/scroll-reveal";

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

const statusIcons: Record<string, typeof CheckCircle2> = {
  'Received': Clock,
  'In Review': FileText,
  'Proposal Sent': FileText,
  'Follow Up': Clock,
  'In Development': Clock,
  'Completed': CheckCircle2,
  'Closed': AlertCircle,
  'Archived': AlertCircle,
};

const projectTypeLabels: Record<string, string> = {
  'basic': 'Basic Website',
  'premium': 'Premium Package',
  'custom': 'Custom Package',
  'prototyping': 'Rapid Prototyping',
  'ecommerce': 'E-Commerce Store',
  'saas': 'SaaS Application',
  'marketing': 'Marketing Site',
  'internal': 'Internal Tool',
  'other': 'Custom Project',
};

interface StatusResult {
  ticketNumber: string;
  status: string;
  projectType: string;
  submittedAt: string;
}

const inputClass = "bg-transparent border-white/10 text-white placeholder:text-white/20 focus:border-white/30 rounded-none text-sm";
const labelClass = "editorial-label text-white/40";

export default function Contact() {
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [ticketNumber, setTicketNumber] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const [lookupTicket, setLookupTicket] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupResult, setLookupResult] = useState<StatusResult | null>(null);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoaded(true), 200);
    return () => clearTimeout(timer);
  }, []);

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
      setTicketNumber(data.ticketNumber);
      toast({
        title: "Request submitted",
        description: "Save your ticket number to track your project.",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Please try again.",
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

  const handleLookup = async () => {
    if (!lookupTicket.trim()) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupResult(null);
    try {
      const response = await fetch(`/api/project-status/${lookupTicket.trim()}`);
      const data = await response.json();
      if (data.success) {
        setLookupResult(data);
      } else {
        setLookupError(data.error || "No project found with that ticket number.");
      }
    } catch {
      setLookupError("Something went wrong. Please try again.");
    } finally {
      setLookupLoading(false);
    }
  };

  const StatusIcon = lookupResult ? (statusIcons[lookupResult.status] || Clock) : Clock;

  return (
    <div className="min-h-screen bg-black">
      <Navigation />

      <div className="px-6 sm:px-10 pt-28 pb-20">
        <div
          className={`transition-all ${
            loaded ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{
            transitionDuration: "var(--duration-reveal)",
            transitionTimingFunction: "var(--ease-out-expo)",
          }}
        >
          <h1 className="project-title text-white text-3xl sm:text-4xl lg:text-5xl mb-4">
            Contact
          </h1>
          <p className="text-white/40 text-sm mb-16 max-w-md leading-relaxed">
            Share your vision. I'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24">
          <div>
            <ScrollReveal>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-project-request">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>First Name *</FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
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
                          <FormLabel className={labelClass}>Last Name *</FormLabel>
                          <FormControl>
                            <Input {...field} className={inputClass} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" {...field} className={inputClass} />
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
                          <FormLabel className={labelClass}>Company</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} className={inputClass} />
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
                        <FormLabel className={labelClass}>Project Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className={inputClass}>
                              <SelectValue placeholder="Select type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-neutral-900 border-white/10">
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value} className="text-white/80 focus:bg-white/5 focus:text-white">
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budgetRange"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className={labelClass}>Budget</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value || ""}>
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Select range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-900 border-white/10">
                              {budgetRanges.map((b) => (
                                <SelectItem key={b.value} value={b.value} className="text-white/80 focus:bg-white/5 focus:text-white">
                                  {b.label}
                                </SelectItem>
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
                          <FormLabel className={labelClass}>Timeline *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className={inputClass}>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-neutral-900 border-white/10">
                              {timelines.map((t) => (
                                <SelectItem key={t.value} value={t.value} className="text-white/80 focus:bg-white/5 focus:text-white">
                                  {t.label}
                                </SelectItem>
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
                        <FormLabel className={labelClass}>Description *</FormLabel>
                        <FormControl>
                          <Textarea {...field} className={`${inputClass} min-h-[120px]`} />
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
                        <FormLabel className={labelClass}>Reference URL</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value || ""} className={inputClass} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <button
                    type="submit"
                    disabled={submitMutation.isPending}
                    className="w-full py-4 bg-white text-black text-[10px] tracking-[0.2em] uppercase font-light hover:bg-white/90 transition-colors disabled:opacity-50"
                  >
                    {submitMutation.isPending ? "Sending..." : "Submit Request"}
                  </button>
                </form>
              </Form>
            </ScrollReveal>

            {ticketNumber && (
              <div className="mt-8 p-6 border border-white/10">
                <p className="editorial-label text-white/60 mb-2">Request Submitted</p>
                <p className="text-white/40 text-xs mb-4">
                  Save your ticket number to check status:
                </p>
                <div className="flex items-center gap-3 p-3 bg-white/5 border border-white/10">
                  <code className="text-white/80 text-sm font-mono flex-1 break-all">{ticketNumber}</code>
                  <button onClick={copyTicket} className="text-white/40 hover:text-white transition-colors flex-shrink-0">
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <ScrollReveal delay={1}>
              <div className="mb-16">
                <p className="editorial-label mb-6">Project Status</p>
                <div className="flex gap-3 mb-6">
                  <Input
                    type="text"
                    placeholder="Enter ticket number..."
                    value={lookupTicket}
                    onChange={(e) => setLookupTicket(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleLookup()}
                    className={inputClass}
                    data-testid="input-ticket-number"
                  />
                  <button
                    onClick={handleLookup}
                    disabled={!lookupTicket.trim() || lookupLoading}
                    className="px-6 bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-colors text-[10px] tracking-[0.15em] uppercase disabled:opacity-30 flex-shrink-0 flex items-center gap-2"
                    data-testid="button-lookup-status"
                  >
                    <Search className="w-3 h-3" />
                    {lookupLoading ? "..." : "Look Up"}
                  </button>
                </div>

                {lookupError && (
                  <div className="flex items-center gap-3 p-4 border border-white/10 text-white/50 text-xs">
                    <AlertCircle className="w-4 h-4 flex-shrink-0" />
                    <p>{lookupError}</p>
                  </div>
                )}

                {lookupResult && (
                  <div className="space-y-4 p-6 border border-white/10">
                    <div className="flex items-center gap-2">
                      <StatusIcon className="w-3 h-3 text-white/60" />
                      <span className="text-white/80 text-xs tracking-wider uppercase">{lookupResult.status}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="editorial-label mb-1">Project Type</p>
                        <p className="text-white/60 text-xs">{projectTypeLabels[lookupResult.projectType] || lookupResult.projectType}</p>
                      </div>
                      <div>
                        <p className="editorial-label mb-1">Submitted</p>
                        <p className="text-white/60 text-xs">{new Date(lookupResult.submittedAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollReveal>

            <ScrollReveal delay={2}>
              <div className="space-y-8 border-t border-white/5 pt-8">
                <div>
                  <p className="editorial-label mb-2">Email</p>
                  <a href="mailto:gavin@gavineanthony.com" className="editorial-link text-white/60 hover:text-white">
                    gavin@gavineanthony.com
                  </a>
                </div>
                <div>
                  <p className="editorial-label mb-2">Location</p>
                  <p className="text-white/40 text-xs">Austin, TX</p>
                </div>
                <div>
                  <p className="editorial-label mb-2">Response Time</p>
                  <p className="text-white/40 text-xs">Within 24 hours</p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
