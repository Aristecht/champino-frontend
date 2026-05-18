import { Button } from "@/components/common/ui/Button";
import {
  ArrowRight,
  BellDot,
  BriefcaseBusiness,
  CalendarRange,
  ChartColumnBig,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  Handshake,
  LayoutDashboard,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Target,
  UsersRound,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const heroMetrics = [
  { label: "MRR growth", value: "+18.4%", note: "vs last month" },
  { label: "Qualified leads", value: "148", note: "32 from automations" },
  { label: "Success rate", value: "92%", note: "renewals on track" },
];

const commandCenter = [
  {
    icon: LayoutDashboard,
    title: "Executive overview",
    description:
      "Track revenue, pipeline health, customer risk, and team utilisation in one glance.",
  },
  {
    icon: Handshake,
    title: "Sales pipeline",
    description:
      "Move deals from discovery to signature with clear owners, next steps, and confidence scores.",
  },
  {
    icon: MessageSquareText,
    title: "Client timeline",
    description:
      "Keep notes, meetings, support escalations, and stakeholder updates connected to every account.",
  },
];

const pipelineStages = [
  { label: "Discovery", deals: 12, amount: "$128K", tint: "from-sky-400/30" },
  { label: "Proposal", deals: 8, amount: "$214K", tint: "from-cyan-400/30" },
  { label: "Negotiation", deals: 5, amount: "$156K", tint: "from-blue-500/30" },
  {
    label: "Closed won",
    deals: 9,
    amount: "$342K",
    tint: "from-indigo-500/30",
  },
];

const workstreams = [
  {
    title: "Lead capture",
    stat: "1.4 min",
    description: "Average time from inbound form to routed owner.",
  },
  {
    title: "Customer onboarding",
    stat: "87%",
    description:
      "Completion rate across legal, billing, and kickoff milestones.",
  },
  {
    title: "Renewal watch",
    stat: "14 days",
    description:
      "Average time before risk alerts trigger the success playbook.",
  },
];

const tasks = [
  "Confirm procurement checklist with Horizon Logistics",
  "Send Q2 expansion proposal to Salta Holding",
  "Review churn warning alerts for accounts below health score 70",
];

const teamPulse = [
  {
    name: "Aruzhan",
    role: "Account executive",
    focus: "3 proposals due today",
  },
  { name: "Daniyar", role: "Customer success", focus: "2 onboarding calls" },
  { name: "Madina", role: "Operations manager", focus: "Automation QA review" },
];

const dealSpotlight = [
  {
    account: "Atlas Freight",
    owner: "Madina",
    value: "$48K ARR",
    status: "Needs finance approval",
  },
  {
    account: "Nomad Telecom",
    owner: "Aruzhan",
    value: "$81K ARR",
    status: "Proposal accepted",
  },
  {
    account: "Seven Oil Service",
    owner: "Daniyar",
    value: "$29K ARR",
    status: "Kickoff scheduled",
  },
];

const activityFeed = [
  "Automation assigned 6 new leads to B2B queue",
  "Client health score dropped for Keruen Retail",
  "Invoice reminder sequence sent to 14 overdue accounts",
  "Dashboard benchmark updated after weekly sync",
];

function SectionLabel({
  icon: Icon,
  eyebrow,
  title,
  description,
}: {
  icon: LucideIcon;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <span className="text-primary border-primary/15 bg-primary/8 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.24em] uppercase">
        <Icon className="h-3.5 w-3.5" />
        {eyebrow}
      </span>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">
          {title}
        </h2>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6 sm:text-base">
          {description}
        </p>
      </div>
    </div>
  );
}

export function HomePageClient() {
  return (
    <div className="crm-shell relative overflow-hidden">
      <div className="crm-orb pointer-events-none absolute top-0 left-0 h-80 w-80 -translate-x-1/3 -translate-y-1/4" />
      <div className="crm-orb pointer-events-none absolute right-0 bottom-24 h-96 w-96 translate-x-1/4 opacity-70" />

      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
        <section className="crm-panel relative overflow-hidden p-6 sm:p-8">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/80 to-transparent" />
          <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr] lg:items-end">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/70 px-3 py-1 text-xs font-medium text-sky-900 shadow-sm shadow-sky-500/10 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-cyan-500" />
                Qadam CRM • one-page command center
              </div>

              <div className="space-y-4">
                <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl">
                  Modern CRM workspace designed for ambitious revenue teams.
                </h1>
                <p className="text-muted-foreground max-w-2xl text-base leading-7 sm:text-lg">
                  A polished blue and cyan interface that keeps sales, customer
                  success, analytics, and automations visible on a single
                  executive page.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Button size="lg" className="min-w-40">
                  Launch workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="lg" className="min-w-40">
                  View live pipeline
                </Button>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {heroMetrics.map((metric) => (
                <div
                  key={metric.label}
                  className="rounded-3xl border border-white/70 bg-white/80 p-4 shadow-lg shadow-sky-500/5 backdrop-blur"
                >
                  <p className="text-muted-foreground text-xs font-medium tracking-[0.2em] uppercase">
                    {metric.label}
                  </p>
                  <p className="mt-3 text-3xl font-semibold tracking-tight">
                    {metric.value}
                  </p>
                  <p className="text-muted-foreground mt-1 text-sm">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="crm-panel p-6 sm:p-7">
            <SectionLabel
              icon={BriefcaseBusiness}
              eyebrow="Command center"
              title="Every core CRM component is surfaced on one page."
              description="This layout brings the highest-value modules together so leadership and operators can move from insight to action without context switching."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {commandCenter.map(({ icon: Icon, title, description }) => (
                <article
                  key={title}
                  className="rounded-3xl border border-sky-100/80 bg-gradient-to-br from-white to-sky-50/80 p-5 shadow-sm shadow-sky-500/5"
                >
                  <div className="bg-primary/10 text-primary inline-flex rounded-2xl p-3">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          <aside className="crm-panel p-6 sm:p-7">
            <SectionLabel
              icon={ShieldCheck}
              eyebrow="Governance"
              title="Operational guardrails built in."
              description="Role-aware approvals, automation checkpoints, and SLA monitoring stay visible to the entire team."
            />

            <div className="mt-6 space-y-4">
              {workstreams.map((item) => (
                <div
                  key={item.title}
                  className="rounded-3xl border border-sky-100/70 bg-white/85 p-4"
                >
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium">{item.title}</p>
                    <span className="text-primary text-sm font-semibold">
                      {item.stat}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-2 text-sm leading-6">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="crm-panel p-6 sm:p-7">
            <SectionLabel
              icon={ChartColumnBig}
              eyebrow="Revenue flow"
              title="Pipeline health with immediate visual priorities."
              description="A board-style summary keeps the sales team aligned on where to focus next."
            />

            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {pipelineStages.map((stage) => (
                <div
                  key={stage.label}
                  className="relative overflow-hidden rounded-3xl border border-sky-100/70 bg-white/85 p-5"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-24 bg-gradient-to-b ${stage.tint} to-transparent`}
                  />
                  <p className="relative text-sm font-medium">{stage.label}</p>
                  <p className="relative mt-6 text-3xl font-semibold tracking-tight">
                    {stage.deals}
                  </p>
                  <p className="text-muted-foreground relative text-sm">
                    active deals
                  </p>
                  <div className="relative mt-6 inline-flex rounded-full border border-cyan-200/80 bg-cyan-50 px-3 py-1 text-sm font-medium text-sky-900">
                    {stage.amount}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            <div className="crm-panel p-6 sm:p-7">
              <SectionLabel
                icon={Target}
                eyebrow="Top priorities"
                title="Today’s focus list"
                description="Actionable next steps keep the team moving toward close, onboarding, and retention outcomes."
              />

              <div className="mt-6 space-y-3">
                {tasks.map((task) => (
                  <div
                    key={task}
                    className="flex items-start gap-3 rounded-2xl border border-sky-100/70 bg-white/85 px-4 py-3"
                  >
                    <CheckCircle2 className="text-primary mt-0.5 h-5 w-5 shrink-0" />
                    <p className="text-sm leading-6">{task}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="crm-panel p-6 sm:p-7">
              <SectionLabel
                icon={CalendarRange}
                eyebrow="Coordination"
                title="Team pulse"
                description="Shared visibility across revenue, onboarding, and operations reduces handoff friction."
              />

              <div className="mt-6 space-y-3">
                {teamPulse.map((member) => (
                  <div
                    key={member.name}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-sky-100/70 bg-white/85 px-4 py-3"
                  >
                    <div>
                      <p className="font-medium">{member.name}</p>
                      <p className="text-muted-foreground text-sm">
                        {member.role}
                      </p>
                    </div>
                    <p className="text-right text-sm font-medium text-sky-950">
                      {member.focus}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="grid gap-4 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="crm-panel p-6 sm:p-7">
            <SectionLabel
              icon={CircleDollarSign}
              eyebrow="Deal desk"
              title="Active opportunities at a glance."
              description="Important accounts, owners, and blockers stay visible so nothing stalls between meetings."
            />

            <div className="mt-6 space-y-3">
              {dealSpotlight.map((deal) => (
                <div
                  key={deal.account}
                  className="rounded-3xl border border-sky-100/70 bg-white/90 p-4"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-lg font-semibold">{deal.account}</p>
                      <p className="text-muted-foreground text-sm">
                        Owner: {deal.owner}
                      </p>
                    </div>
                    <span className="rounded-full border border-sky-200/80 bg-sky-50 px-3 py-1 text-sm font-medium text-sky-900">
                      {deal.value}
                    </span>
                  </div>
                  <p className="text-muted-foreground mt-3 text-sm">
                    {deal.status}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="crm-panel p-6 sm:p-7">
            <SectionLabel
              icon={BellDot}
              eyebrow="Live activity"
              title="Signals, alerts, and customer touchpoints."
              description="The single-page feed keeps leaders informed about what changed and what needs attention right now."
            />

            <div className="mt-6 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="rounded-[2rem] border border-sky-100/70 bg-gradient-to-br from-sky-950 via-sky-900 to-cyan-700 p-5 text-white shadow-xl shadow-cyan-950/20">
                <p className="text-xs font-medium tracking-[0.24em] text-cyan-100/80 uppercase">
                  Customer health
                </p>
                <p className="mt-4 text-5xl font-semibold">84</p>
                <p className="mt-2 text-sm text-cyan-100/80">
                  Composite score based on usage, sentiment, and billing risk.
                </p>
                <div className="mt-6 flex items-center gap-3 text-sm text-cyan-50">
                  <UsersRound className="h-4 w-4" />
                  23 accounts expanding this quarter
                </div>
              </div>

              <div className="space-y-3">
                {activityFeed.map((activity) => (
                  <div
                    key={activity}
                    className="flex items-start gap-3 rounded-2xl border border-sky-100/70 bg-white/90 px-4 py-3"
                  >
                    <Clock3 className="text-primary mt-0.5 h-4 w-4 shrink-0" />
                    <p className="text-sm leading-6">{activity}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
