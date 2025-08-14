import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProjectRequestSchema, type InsertProjectRequest } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import waitingResponseImage from "@assets/generated_images/Personal_App_Interface_86e55c39.png";

const projectTypes = [
  { value: 'fullstack', label: 'Full-Stack Development' },
  { value: 'prototype', label: 'Rapid Prototype/POC' },
  { value: 'pwa', label: 'Progressive Web Applications' },
  { value: 'landing', label: 'Landing Pages' },
  { value: 'static', label: 'Static Web Page Development' },
  { value: 'integration', label: 'API Integration' },
  { value: 'other', label: 'Other' },
];

const budgetRanges = [
  { value: 'under-5k', label: 'Under $5,000' },
  { value: '5k-10k', label: '$5,000 - $10,000' },
  { value: '10k-25k', label: '$10,000 - $25,000' },
  { value: '25k-50k', label: '$25,000 - $50,000' },
  { value: '50k-plus', label: '$50,000+' },
  { value: 'discuss', label: "Let's discuss" },
];

const timelines = [
  { value: 'asap', label: 'ASAP' },
  { value: '1-month', label: 'Within 1 month' },
  { value: '2-3-months', label: '2-3 months' },
  { value: '3-6-months', label: '3-6 months' },
  { value: '6-plus-months', label: '6+ months' },
  { value: 'flexible', label: 'Flexible' },
];

export default function ContactSection() {
  const { toast } = useToast();
  
  const form = useForm<InsertProjectRequest>({
    resolver: zodResolver(insertProjectRequestSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      company: "",
      projectType: "",
      budget: "",
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
      const response = await apiRequest('POST', '/api/project-requests', data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Project request submitted!",
        description: "Thank you for your interest. I'll get back to you within 24 hours.",
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

  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Start Your <span className="tech-title">Project</span>
          </h2>
          <p className="text-lg text-slate-700 max-w-2xl mx-auto">
            Ready to build something amazing with AI-powered development? Share your vision and I'll respond within 24 hours.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-8">
              Let's <span className="gradient-text">Connect</span>
            </h3>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4" data-testid="contact-email">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Email</h4>
                  <p className="text-slate-600">guidato.llc@gmail.com</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-phone">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-green-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Phone</h4>
                  <p className="text-slate-600">+1 (254) 300-8158</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-location">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-purple-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Location</h4>
                  <p className="text-slate-600">Austin, TX</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4" data-testid="contact-response-time">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Clock className="text-orange-600 text-xl" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-800 mb-1">Response Time</h4>
                  <p className="text-slate-600">Within 24 hours</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <img 
                src={waitingResponseImage} 
                alt="Client waiting for developer response" 
                className="rounded-xl shadow-lg w-full h-auto"
                data-testid="img-waiting-response"
              />
            </div>
          </div>

          {/* Project Request Form */}
          <div className="glass-card p-8">
            <h3 className="text-2xl font-bold mb-6">
              <span className="gradient-text">Project Details</span>
            </h3>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-project-request">
                  {/* Basic Info */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John" {...field} data-testid="input-firstName" />
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
                          <FormLabel>Last Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Doe" {...field} data-testid="input-lastName" />
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
                          <FormLabel>Email *</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} data-testid="input-email" />
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
                          <FormLabel>Company</FormLabel>
                          <FormControl>
                            <Input placeholder="Acme Inc." {...field} data-testid="input-company" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Type */}
                  <FormField
                    control={form.control}
                    name="projectType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Type *</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-projectType">
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select project type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {projectTypes.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Budget and Timeline */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="budget"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Budget Range *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-budget">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select budget range" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {budgetRanges.map((budget) => (
                                <SelectItem key={budget.value} value={budget.value}>
                                  {budget.label}
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
                          <FormLabel>Timeline *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value} data-testid="select-timeline">
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select timeline" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timelines.map((timeline) => (
                                <SelectItem key={timeline.value} value={timeline.value}>
                                  {timeline.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Project Description */}
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Project Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Describe your project in detail. What are you looking to build? What problem does it solve?"
                            className="min-h-[100px]"
                            {...field}
                            data-testid="textarea-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Target Audience */}
                  <FormField
                    control={form.control}
                    name="targetAudience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Audience</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Who will be using your application? (e.g., small businesses, consumers, enterprise)"
                            {...field}
                            data-testid="input-targetAudience"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Key Features */}
                  <FormField
                    control={form.control}
                    name="keyFeatures"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Key Features Required</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="List the main features you need (e.g., user authentication, payment processing, real-time chat)"
                            className="min-h-[80px]"
                            {...field}
                            data-testid="textarea-keyFeatures"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Technical Requirements */}
                  <FormField
                    control={form.control}
                    name="techPreferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Technical Preferences</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any specific technologies, frameworks, or integrations you prefer?"
                            className="min-h-[60px]"
                            {...field}
                            data-testid="textarea-techPreferences"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Design Inspiration */}
                  <FormField
                    control={form.control}
                    name="designReferences"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Design References</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Any websites or apps you like the design of? (URLs or descriptions)"
                            {...field}
                            data-testid="input-designReferences"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Additional Information */}
                  <FormField
                    control={form.control}
                    name="additionalInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Additional Information</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Anything else you'd like me to know about your project?"
                            className="min-h-[80px]"
                            {...field}
                            data-testid="textarea-additionalInfo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
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
