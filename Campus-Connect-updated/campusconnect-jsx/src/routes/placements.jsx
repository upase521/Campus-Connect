import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  CalendarClock,
  Bookmark,
  Search,
  BadgeCheck,
} from "lucide-react";
import { toast } from "sonner";
import { AppShell, GlassCard } from "@/components/AppShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/placements")({
  component: PlacementsPage,
});

const tabs = ["All", "Internship", "Full-time", "Job Drive", "Applied"];

function PlacementsPage() {
  const [jobs, setJobs] = useState([]);
  const [tab, setTab] = useState("All");
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);

  const USER = "student123"; // temp user

  // 🔄 FETCH FROM BACKEND
  const fetchJobs = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/placements");
      const data = await res.json();
      setJobs(data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // 🔍 FILTER LOGIC
  const list = useMemo(() => {
    return jobs.filter((p) => {
      const q = query.toLowerCase();

      if (
        q &&
        !`${p.role} ${p.company}`.toLowerCase().includes(q)
      ) return false;

      if (tab === "Applied") {
        return p.applicants?.includes(USER);
      }

      if (tab !== "All") return p.type === tab;

      return true;
    });
  }, [jobs, tab, query]);

  // 🟢 APPLY FUNCTION
  const applyJob = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/placements/${id}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ user: USER }),
      });

      toast.success("Application sent");

      // refresh list
      fetchJobs();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppShell
      title="Placements & Internships"
      subtitle="Opportunities from the campus placement cell."
    >
      <div className="space-y-5">

        {/* TOP STATS */}
        <div className="grid gap-4 sm:grid-cols-3">
          <GlassCard>
            <Briefcase className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">{jobs.length}</p>
            <p className="text-xs text-muted-foreground">Open opportunities</p>
          </GlassCard>

          <GlassCard>
            <BadgeCheck className="size-5 text-primary" />
            <p className="mt-3 text-2xl font-bold">
              {jobs.filter(j => j.applicants?.includes(USER)).length}
            </p>
            <p className="text-xs text-muted-foreground">Applied</p>
          </GlassCard>
        </div>

        {/* SEARCH + FILTER */}
        <GlassCard className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs..."
              className="pl-9"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {tabs.map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1 rounded-full text-xs",
                  tab === t ? "bg-primary text-white" : "bg-muted"
                )}
              >
                {t}
              </button>
            ))}
          </div>
        </GlassCard>

        {/* JOB LIST */}
        <div className="grid gap-4 lg:grid-cols-2">
          {list.map((p) => {
            const applied = p.applicants?.includes(USER);

            return (
              <GlassCard key={p._id} className="flex flex-col">
                <h3 className="font-semibold">{p.role}</h3>
                <p className="text-sm text-muted-foreground">{p.company}</p>

                <div className="mt-2 flex gap-2 flex-wrap">
                  <Badge>{p.type}</Badge>
                  <Badge variant="outline">
                    <MapPin className="size-3" /> {p.location}
                  </Badge>
                </div>

                <p className="text-sm mt-2">{p.description}</p>

                <p className="text-xs mt-2">
                  Deadline: {p.deadline}
                </p>

                <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setActive(p)}
                  >
                    Details
                  </Button>

                  <Button
                    disabled={applied}
                    onClick={() => applyJob(p._id)}
                  >
                    {applied ? "Applied" : "Apply"}
                  </Button>
                </div>
              </GlassCard>
            );
          })}
        </div>

        {list.length === 0 && (
          <GlassCard>No placements available</GlassCard>
        )}

        {/* DETAILS MODAL */}
        <Dialog open={!!active} onOpenChange={() => setActive(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{active?.role}</DialogTitle>
              <DialogDescription>
                {active?.company}
              </DialogDescription>
            </DialogHeader>

            <p>{active?.description}</p>

            <DialogFooter>
              <Button
                onClick={() => {
                  applyJob(active._id);
                  setActive(null);
                }}
              >
                Apply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AppShell>
  );
}