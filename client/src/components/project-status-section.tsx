import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, CheckCircle2, Clock, FileText, AlertCircle } from "lucide-react";

interface StatusResult {
  ticketNumber: string;
  status: string;
  projectType: string;
  submittedAt: string;
}

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

const statusColors: Record<string, string> = {
  'Received': 'text-blue-600 bg-blue-50 border-blue-200',
  'In Review': 'text-amber-600 bg-amber-50 border-amber-200',
  'Proposal Sent': 'text-indigo-600 bg-indigo-50 border-indigo-200',
  'Follow Up': 'text-amber-600 bg-amber-50 border-amber-200',
  'In Development': 'text-blue-600 bg-blue-50 border-blue-200',
  'Completed': 'text-emerald-600 bg-emerald-50 border-emerald-200',
  'Closed': 'text-slate-500 bg-slate-50 border-slate-200',
  'Archived': 'text-slate-500 bg-slate-50 border-slate-200',
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

export default function ProjectStatusSection() {
  const [ticketNumber, setTicketNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<StatusResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleLookup = async () => {
    if (!ticketNumber.trim()) return;

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch(`/api/project-status/${ticketNumber.trim()}`);
      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || "No project found with that ticket number. Please double-check and try again.");
      }
    } catch {
      setError("Something went wrong. Please try again or contact us directly.");
    } finally {
      setIsLoading(false);
    }
  };

  const StatusIcon = result ? (statusIcons[result.status] || Clock) : Clock;

  return (
    <section id="project-status" className="py-12 sm:py-16 section-light relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-slate-800">
            Project <span className="tech-title">Status</span>
          </h2>
          <p className="text-sm sm:text-base text-slate-500 max-w-xl mx-auto">
            Enter the ticket number you received when you submitted your project request.
          </p>
        </div>

        <div className="glass-card p-6 sm:p-8">
          <div className="flex gap-3 mb-6">
            <Input
              type="text"
              placeholder="Enter your ticket number..."
              value={ticketNumber}
              onChange={(e) => setTicketNumber(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup()}
              className="bg-white border-slate-200 text-slate-800 placeholder:text-slate-400 text-base"
              data-testid="input-ticket-number"
            />
            <Button
              onClick={handleLookup}
              disabled={!ticketNumber.trim() || isLoading}
              className="tech-button px-6 flex-shrink-0"
              data-testid="button-lookup-status"
            >
              <Search className="w-4 h-4 mr-2" />
              {isLoading ? "Checking..." : "Look Up"}
            </Button>
          </div>

          {error && (
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200 text-red-600">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusColors[result.status] || 'text-slate-500 bg-slate-50 border-slate-200'}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-semibold text-sm">{result.status}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Project Type</p>
                  <p className="text-slate-800 font-medium">{projectTypeLabels[result.projectType] || result.projectType}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                  <p className="text-xs text-slate-400 mb-1 uppercase tracking-wider">Submitted</p>
                  <p className="text-slate-800 font-medium">{new Date(result.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-sm text-slate-400">
                Questions about your project? Contact us at{" "}
                <a href="mailto:gavin@gavineanthony.com" className="text-blue-600 hover:text-blue-700 transition-colors">
                  gavin@gavineanthony.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
