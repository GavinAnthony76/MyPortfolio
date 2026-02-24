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
  'Received': 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  'In Review': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'Proposal Sent': 'text-purple-400 bg-purple-500/10 border-purple-500/20',
  'Follow Up': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'In Development': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'Completed': 'text-green-400 bg-green-500/10 border-green-500/20',
  'Closed': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  'Archived': 'text-slate-400 bg-slate-500/10 border-slate-500/20',
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
    <section id="project-status" className="py-16 sm:py-20 md:py-28 section-darker relative">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">
            Project <span className="tech-title">Status</span>
          </h2>
          <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto">
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
              className="bg-slate-800/50 border-slate-700 text-white placeholder:text-slate-600 text-base"
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
            <div className="flex items-center gap-3 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${statusColors[result.status] || 'text-slate-400 bg-slate-500/10 border-slate-500/20'}`}>
                <StatusIcon className="w-4 h-4" />
                <span className="font-semibold text-sm">{result.status}</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Project Type</p>
                  <p className="text-white font-medium">{projectTypeLabels[result.projectType] || result.projectType}</p>
                </div>
                <div className="p-4 rounded-lg bg-slate-800/30 border border-slate-700/50">
                  <p className="text-xs text-slate-500 mb-1 uppercase tracking-wider">Submitted</p>
                  <p className="text-white font-medium">{new Date(result.submittedAt).toLocaleDateString()}</p>
                </div>
              </div>

              <p className="text-sm text-slate-500">
                Questions about your project? Contact us at{" "}
                <a href="mailto:projects@gavineanthony.com" className="text-cyan-400 hover:text-cyan-300 transition-colors">
                  projects@gavineanthony.com
                </a>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
