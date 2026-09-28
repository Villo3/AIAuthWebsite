"use client";

import { useRef, useState } from "react";
import {
  motion, AnimatePresence, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from "framer-motion";
import {
  ArrowDownRight, ArrowRight, Asterisk, Braces, Check, CheckCircle2,
  ChevronDown, CircleDollarSign, Clock3, Cloud, Copy, Eye,
  Fingerprint, History, Menu, Network, Search,
  ServerCog, SlidersHorizontal, X, XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const checks = [
  ["IDENTITY", "verified"],
  ["TASK MATCH", "valid"],
  ["POLICY", "refund > $250"],
  ["SEQUENCE RISK", "low"],
];

const contextScenarios = [
  {
    id: "routine", label: "Routine order", supplier: "Approved · 3 years", amount: "$12,400",
    bank: "Unchanged", task: "Exact match", decision: "ALLOW", tone: "allow",
  },
  {
    id: "new", label: "New supplier", supplier: "Created today", amount: "$28,000",
    bank: "Added 14m ago", task: "Exact match", decision: "REQUIRE APPROVAL", tone: "approval",
  },
  {
    id: "critical", label: "High-value change", supplier: "Created today", amount: "$728,000",
    bank: "Changed 2m ago", task: "Partial mismatch", decision: "DENY", tone: "deny",
  },
];

const policyInputs = [
  "new destination", "unusual timing", "credential changes", "task deviation",
  "external prompt influence", "behavior anomaly",
];

const auditEvents = [
  ["13:42:17", "Task received", "AccountsPayable-17", "—"],
  ["13:42:20", "Salesforce customer read", "ALLOW", "allow"],
  ["13:42:22", "Stripe payment read", "ALLOW", "allow"],
  ["13:42:26", "Refund requested", "APPROVAL REQUIRED", "approval"],
  ["13:44:03", "Approved by manager", "Dana Liu", "human"],
  ["13:44:04", "Refund executed", "ALLOW", "allow"],
];

const productAppUrl = process.env.NEXT_PUBLIC_APP_URL || "#developers";

function Mark() {
  return <span className="brand-mark" aria-hidden="true"><span /><span /></span>;
}

function BoundarySplash() {
  const container = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });
  const leftX = useTransform(scrollYProgress, [0, .18, .9], ["0%", "0%", "-108%"]);
  const rightX = useTransform(scrollYProgress, [0, .18, .9], ["0%", "0%", "108%"]);
  const copyY = useTransform(scrollYProgress, [0, .5], [0, -38]);
  useMotionValueEvent(scrollYProgress, "change", setProgress);

  const copyOpacity = progress <= .16 ? 1 : Math.max(0, 1 - ((progress - .16) / .34));
  return (
    <section
      ref={container}
      className={`boundary-splash${reduceMotion ? " boundary-splash-reduced" : ""}`}
      aria-labelledby="boundary-splash-title"
    >
      <div className="boundary-splash-stage">
        <div className="splash-reveal" aria-hidden="true">
          <div className="splash-reveal-grid" />
        </div>

        <motion.svg
          className="splash-curtain splash-curtain-left"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={reduceMotion ? undefined : { x: leftX }}
        >
          <path d="M0 0H905C960 76 930 162 978 242C1018 311 921 400 970 493C1009 568 925 660 974 749C1007 810 932 908 958 1000H0Z" />
        </motion.svg>
        <motion.svg
          className="splash-curtain splash-curtain-right"
          viewBox="0 0 1000 1000"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={reduceMotion ? undefined : { x: rightX }}
        >
          <path d="M1000 0H95C40 76 70 162 22 242C-18 311 79 400 30 493C-9 568 75 660 26 749C-7 810 68 908 42 1000H1000Z" />
        </motion.svg>

        <div className="splash-seam" aria-hidden="true" style={reduceMotion ? undefined : { opacity: copyOpacity }}><span /></div>
        <motion.div
          className="splash-copy"
          style={reduceMotion ? undefined : { opacity: copyOpacity, y: copyY }}
        >
          <div className="splash-kicker mono"><Mark /> BOUNDARY / RUNTIME AUTHORIZATION</div>
          <h1 id="boundary-splash-title">Protect your<br /><em>boundary.</em></h1>
          <p>Autonomous software moves fast. Control stays ahead.</p>
        </motion.div>
        <motion.div className="splash-scroll-cue mono" style={reduceMotion ? undefined : { opacity: copyOpacity }}>
          <span>SCROLL TO OPEN</span><i aria-hidden="true" />
        </motion.div>
        <div className="splash-corner splash-corner-left mono">RUNTIME / 001</div>
      </div>
    </section>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Boundary home"><Mark /><span>BOUNDARY</span></a>
      <nav className="desktop-nav" aria-label="Main navigation">
        <a href="#product">Product</a><a href="#developers">Developers</a><a href="#security">Security</a>
      </nav>
      <div className="nav-actions">
        <a className="sign-in" href={productAppUrl}>Sign in</a>
        <Button asChild className="header-cta"><a href="#access">Request access <ArrowDownRight size={15} /></a></Button>
        <button className="mobile-menu" aria-label={open ? "Close navigation" : "Open navigation"} aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X size={19} /> : <Menu size={19} />}</button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <a href="#product" onClick={() => setOpen(false)}>Product <ArrowRight /></a>
            <a href="#developers" onClick={() => setOpen(false)}>Developers <ArrowRight /></a>
            <a href="#security" onClick={() => setOpen(false)}>Security <ArrowRight /></a>
            <a href="#access" onClick={() => setOpen(false)}>Request access <ArrowRight /></a>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

function SectionIntro({ index, label, title, copy, light = false }: { index: string; label: string; title: React.ReactNode; copy?: string; light?: boolean }) {
  return (
    <div className={`section-intro ${light ? "light" : ""}`}>
      <div className="eyebrow"><span>{index}</span> {label}</div>
      <h2>{title}</h2>
      {copy && <p>{copy}</p>}
    </div>
  );
}

function DecisionBadge({ type, children }: { type: string; children: React.ReactNode }) {
  return <span className={`decision-badge ${type}`}><span />{children}</span>;
}

function RuntimePanel() {
  return (
    <motion.div className="runtime-shell" initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7, delay: .15, ease: [.2, .8, .2, 1] }}>
      <div className="runtime-topline"><div className="live-label"><span /> LIVE EVALUATION</div><span className="mono dim">evt_07F4A91</span></div>
      <div className="request-grid">
        <div><span>AGENT</span><strong>RefundAgent-14</strong></div>
        <div><span>OBJECTIVE</span><strong>Resolve duplicate charge</strong></div>
        <div><span>REQUEST</span><strong className="mono accent">stripe.refunds.create</strong></div>
        <div><span>AMOUNT</span><strong>$1,184.23 <small>USD</small></strong></div>
      </div>
      <div className="evaluation">
        <div className="eval-head"><span>EVALUATION TRACE</span><span>34 ms</span></div>
        <div className="eval-list">
          {checks.map(([label, value], index) => (
            <motion.div className="eval-row" key={label} initial={{ opacity: .25 }} animate={{ opacity: 1 }} transition={{ delay: .65 + index * .28, duration: .3 }}>
              <span className="eval-index">0{index + 1}</span><span className="eval-label">{label}</span><span className="eval-rule" /><span className="eval-value"><Check size={13} /> {value}</span>
            </motion.div>
          ))}
        </div>
      </div>
      <motion.div className="decision-bar" initial={{ clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 1.85, duration: .65, ease: [.2, .8, .2, 1] }}>
        <div><span>FINAL DECISION</span><strong>REQUIRE APPROVAL</strong></div><div className="decision-code mono">POL-REFUND-04 <ArrowRight size={15} /></div>
      </motion.div>
    </motion.div>
  );
}

function CoreIdea() {
  const [active, setActive] = useState(1);
  const scenario = contextScenarios[active];
  return (
    <section className="core-section ruled" id="product">
      <div className="core-copy">
        <SectionIntro index="02" label="THE MODEL" title={<>Permissions are static.<br /><em>Agent behavior is not.</em></>} copy="Access lists know what an identity can usually reach. Boundary evaluates whether this exact action should happen now." />
        <blockquote>Identity establishes the actor.<br />Runtime authorization governs the act.</blockquote>
      </div>
      <div className="comparison-lab">
        <div className="comparison-title"><span>AUTHORIZATION MODEL</span><span className="mono">context / 03</span></div>
        <div className="traditional-row">
          <span className="number">A</span><div><small>TRADITIONAL AUTHORIZATION</small><strong>ProcurementAgent</strong></div><div><small>PERMISSION</small><strong className="mono">purchase_orders.create</strong></div><DecisionBadge type="allow">AUTHORIZED</DecisionBadge>
        </div>
        <div className="runtime-context">
          <div className="runtime-label"><span className="number">B</span><div><small>RUNTIME AUTHORIZATION</small><strong>{scenario.label}</strong></div></div>
          <AnimatePresence mode="wait">
            <motion.div className="context-grid" key={scenario.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: .22 }}>
              <div><small>DELEGATED TASK</small><strong>Replenish GPU inventory</strong></div><div><small>SUPPLIER</small><strong>{scenario.supplier}</strong></div><div><small>AMOUNT</small><strong>{scenario.amount}</strong></div><div><small>BANK DETAILS</small><strong>{scenario.bank}</strong></div><div><small>TASK MATCH</small><strong>{scenario.task}</strong></div><div className="context-result"><small>DECISION</small><DecisionBadge type={scenario.tone}>{scenario.decision}</DecisionBadge></div>
            </motion.div>
          </AnimatePresence>
          <div className="scenario-switcher" role="group" aria-label="Authorization scenarios">
            {contextScenarios.map((item, index) => <button key={item.id} className={active === index ? "active" : ""} onClick={() => setActive(index)}><span>0{index + 1}</span>{item.label}</button>)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SystemMap() {
  const factors = [
    [Fingerprint, "identity"], [Asterisk, "delegated task"], [Braces, "deterministic policy"],
    [Eye, "context"], [History, "action history"], [Network, "behavioral risk"], [CircleDollarSign, "transaction constraints"],
  ] as const;
  return (
    <section className="system-section">
      <SectionIntro index="03" label="CONTROL PLANE" title={<>One decision plane.<br />Every system boundary.</>} copy="Intercept actions before execution. Apply the same control model across agents, tools, and enterprise systems." />
      <div className="system-map">
        <div className="map-lane left-lane"><div className="map-node source"><small>01 / ORIGIN</small><strong>USER / SYSTEM</strong></div><div className="flow-segment"><motion.span animate={{ y: [0, 54] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }} /></div><div className="map-node agent"><small>02 / ACTOR</small><strong>Autonomous agent</strong><span className="mono">agt_894f</span></div><div className="flow-segment"><motion.span animate={{ y: [0, 54] }} transition={{ duration: 1.8, repeat: Infinity, ease: "linear", delay: .5 }} /></div><div className="map-node action"><small>03 / INTENT</small><strong>Proposed action</strong><span className="mono">payments.create</span></div></div>
        <div className="control-plane">
          <div className="plane-head"><div><ServerCog size={19} /><span>RUNTIME CONTROL PLANE</span></div><span className="mono">evaluation / 42ms</span></div>
          <div className="factor-stack">{factors.map(([Icon, label], i) => <motion.div key={label} initial={{ opacity: .45 }} whileInView={{ opacity: 1 }} transition={{ delay: i * .08 }} viewport={{ once: true }}><span>0{i + 1}</span><Icon size={15} /><strong>{label}</strong><span className="factor-line" /><Check size={13} /></motion.div>)}</div>
          <div className="outcome-rail"><div className="allow"><CheckCircle2 /><span>ALLOW</span></div><div className="approval"><Clock3 /><span>APPROVAL</span></div><div className="deny"><XCircle /><span>DENY</span></div></div>
        </div>
        <div className="map-lane target-lane"><div className="target-caption">05 / TARGET SYSTEM</div>{["Stripe", "Salesforce", "GitHub", "AWS", "Snowflake", "SAP", "Database", "API"].map((item, i) => <div className="target-chip" key={item}><span>{String(i + 1).padStart(2, "0")}</span>{item}</div>)}</div>
      </div>
    </section>
  );
}

function SequenceSecurity() {
  const events = [
    ["12:40:02", "READ", "vendor", "ALLOW"], ["12:40:06", "CHANGE", "payout destination", "ALLOW"],
    ["12:40:10", "CREATE", "invoice — $162,400", "ALLOW"], ["12:40:13", "SEND", "payment", "DENY"],
  ];
  return (
    <section className="sequence-section" id="security">
      <div className="sequence-intro"><SectionIntro light index="04" label="SEQUENCE INTELLIGENCE" title={<>Individually safe.<br /><em>Collectively dangerous.</em></>} copy="Most authorization systems evaluate API calls independently. Boundary reads the whole execution chain." /></div>
      <div className="sequence-console">
        <div className="chain-meta"><span>ACTION CHAIN</span><span className="mono">chain_7D2C · LIVE</span></div>
        <div className="event-timeline">
          {events.map(([time, verb, subject, result], i) => <div className={`event ${result === "DENY" ? "blocked" : ""}`} key={time}><time>{time}</time><div className="timeline-mark"><span>{i + 1}</span></div><div className="event-action"><strong>{verb}</strong><span>{subject}</span></div><DecisionBadge type={result === "DENY" ? "deny" : "allow"}>{result}</DecisionBadge></div>)}
        </div>
        <motion.div className="detection" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .7 }}><div className="detection-label"><span /> DETECTED PATTERN</div><strong>Vendor payout destination changed during the same execution chain.</strong><div className="detection-rule mono">SEQ-TRANSFER-009 / confidence 0.96</div></motion.div>
      </div>
    </section>
  );
}

function Purpose() {
  return (
    <section className="purpose-section ruled">
      <SectionIntro index="05" label="PURPOSE BINDING" title={<>Permission follows<br /><em>the task.</em></>} copy="Authority stays attached to the delegated objective—not just the agent identity or API scope." />
      <div className="purpose-diagram">
        <div className="task-card"><div className="card-kicker"><Asterisk size={14} /> DELEGATED OBJECTIVE</div><strong>Refund duplicate charge<br />for INV-28912</strong><div className="task-agent"><span>AGENT</span><b>RefundAgent-14</b></div></div>
        <div className="branch-rail"><span /><span /><span /></div>
        <div className="purpose-branches">
          <div className="purpose-case correct"><div className="case-count">MATCH / 01</div><div><small>ACTION</small><strong>Refund $74.20</strong></div><div><small>RESOURCE</small><strong className="mono">INV-28912</strong></div><DecisionBadge type="allow">ALLOW</DecisionBadge></div>
          <div className="purpose-case wrong"><div className="case-count">MISMATCH / 02</div><div><small>ACTION</small><strong>Refund $74.20</strong></div><div><small>RESOURCE</small><strong className="mono">INV-91831</strong></div><DecisionBadge type="deny">DENY</DecisionBadge></div>
        </div>
        <div className="purpose-proof"><span>Same agent.</span><span>Same API.</span><span>Same permission.</span><strong>Different purpose.</strong></div>
      </div>
    </section>
  );
}

function PolicyLayers() {
  return (
    <section className="policy-section">
      <div className="policy-copy"><SectionIntro index="06" label="POLICY PRECEDENCE" title={<>AI can increase caution.<br /><em>It cannot override policy.</em></>} copy="Contextual intelligence can escalate a decision. Deterministic company rules remain immutable." /><div className="policy-principle"><SlidersHorizontal size={17} /><p>Models interpret context. <strong>Policy sets the ceiling.</strong></p></div></div>
      <div className="policy-stack">
        <div className="hard-policy"><div className="locked-label"><span>IMMUTABLE</span><span className="mono">priority 0</span></div><div className="hard-grid"><div><small>HARD POLICY</small><strong>Transfers &gt; $100,000</strong></div><ArrowRight /><div><small>REQUIRED CONTROL</small><strong>CFO approval</strong></div></div><div className="policy-hash mono">sha256 / a4e9…19f2 · signed by secops</div></div>
        <div className="context-layer"><div className="context-head"><span>CONTEXTUAL RISK</span><span className="mono">model / observe-only</span></div><div className="input-cloud">{policyInputs.map((item, i) => <span key={item}><b>0{i + 1}</b>{item}</span>)}</div></div>
        <div className="policy-result"><div><small>BASE POLICY</small><DecisionBadge type="allow">ALLOW</DecisionBadge></div><span className="plus">+</span><div><small>CONTEXT</small><strong className="risk-high">HIGH RISK · 78</strong></div><ArrowRight className="result-arrow" /><div><small>FINAL</small><DecisionBadge type="approval">REQUIRE APPROVAL</DecisionBadge></div></div>
      </div>
    </section>
  );
}

function ApprovalExperience() {
  const [decision, setDecision] = useState<"idle" | "approved" | "denied">("idle");
  return (
    <section className="approval-section">
      <div className="approval-copy"><SectionIntro index="07" label="HUMAN CHECKPOINT" title={<>The right context.<br />At the moment of decision.</>} copy="Give operators the full execution history and policy reason—without asking them to reconstruct the risk." /><div className="operator-note"><span>Designed for</span><strong>Finance · Security · Operations</strong></div></div>
      <div className="approval-window">
        <div className="window-bar"><div><span /><span /><span /></div><span className="mono">approval / apr_8F92A</span><button aria-label="More approval options">•••</button></div>
        <div className="approval-alert"><div className="approval-icon"><Clock3 /></div><div><small>AUTHORIZATION REQUIRED</small><strong>Transfer $48,220.00</strong><p>A policy condition requires a human decision before execution.</p></div><span className="expires">EXPIRES 09:42</span></div>
        <div className="approval-details"><div><small>AGENT</small><strong>AccountsPayable-17</strong></div><div><small>RECIPIENT</small><strong>TriStar Components</strong></div><div><small>REASON</small><strong>Invoice INV-92017</strong></div><div><small>TRIGGERED POLICY</small><strong>New payout account + amount &gt; $25,000</strong></div></div>
        <div className="previous-actions"><div className="previous-head"><span>PREVIOUS ACTIONS</span><span>SAME EXECUTION</span></div>{["Opened vendor record", "Changed payout account", "Created invoice INV-92017"].map((item, i) => <div key={item}><span className="mono">{`14:32:${12 + i * 4}`}</span><i>{i + 1}</i><strong>{item}</strong><DecisionBadge type="allow">ALLOW</DecisionBadge></div>)}</div>
        <div className="approval-actions">
          {decision === "idle" ? <><Button variant="outline" className="deny-button" onClick={() => setDecision("denied")}><X size={15} /> Deny</Button><Button className="approve-button" onClick={() => setDecision("approved")}><Check size={15} /> Approve once</Button></> : <motion.div className={`resolved ${decision}`} initial={{ opacity: 0, scale: .98 }} animate={{ opacity: 1, scale: 1 }}>{decision === "approved" ? <CheckCircle2 /> : <XCircle />} Decision recorded: {decision.toUpperCase()} <button onClick={() => setDecision("idle")}>Reset demo</button></motion.div>}
        </div>
      </div>
    </section>
  );
}

function DeveloperExperience() {
  return (
    <section className="developer-section" id="developers">
      <div className="dev-intro"><SectionIntro light index="08" label="DEVELOPER EXPERIENCE" title={<>One decision<br /><em>endpoint.</em></>} copy="Place a single authorization call in front of consequential operations. Boundary returns a decision your system can enforce." /><div className="protocols">{["REST", "MCP", "GraphQL", "gRPC", "webhooks"].map(x => <span key={x}>{x}</span>)}</div></div>
      <div className="code-workbench">
        <Tabs defaultValue="request" className="code-tabs">
          <div className="code-toolbar"><TabsList variant="line"><TabsTrigger value="request">authorize.ts</TabsTrigger><TabsTrigger value="response">response.json</TabsTrigger></TabsList><button aria-label="Copy code"><Copy size={14} /> Copy</button></div>
          <TabsContent value="request"><pre><code><span className="c-purple">const</span> decision = <span className="c-purple">await</span> control.<span className="c-blue">authorize</span>({`{`}<br /><span>  agent: </span><b>&quot;refund-agent-14&quot;</b>,<br /><span>  principal: </span><b>&quot;user_8821&quot;</b>,<br /><span>  objective: </span><b>&quot;resolve-ticket-39182&quot;</b>,<br /><span>  action: </span><b>&quot;stripe.refunds.create&quot;</b>,<br /><span>  resource: </span><b>&quot;payment_9281&quot;</b>,<br /><span>  context: {`{`}</span><br /><span>    amount: </span><i>1184.23</i>,<br /><span>    currency: </span><b>&quot;USD&quot;</b><br /><span>  {`}`}</span><br />{`}`})</code></pre></TabsContent>
          <TabsContent value="response"><pre><code>{`{`}<br /><span>  &quot;decision&quot;: </span><b>&quot;REQUIRE_APPROVAL&quot;</b>,<br /><span>  &quot;policy&quot;: </span><b>&quot;refund-limit&quot;</b>,<br /><span>  &quot;risk&quot;: </span><i>78</i>,<br /><span>  &quot;evaluation_ms&quot;: </span><i>34</i><br />{`}`}</code></pre></TabsContent>
        </Tabs>
        <div className="integration-flow"><div><Braces /><span>SDK</span></div><span className="api-line"><motion.i animate={{ x: [0, 82] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }} /></span><div className="control-node"><ServerCog /><span>CONTROL PLANE</span></div><span className="api-line"><motion.i animate={{ x: [0, 82] }} transition={{ duration: 1.6, repeat: Infinity, ease: "linear", delay: .55 }} /></span><div><Cloud /><span>API</span></div></div>
      </div>
    </section>
  );
}

function IdentityStack() {
  return (
    <section className="identity-section">
      <SectionIntro index="09" label="INFRASTRUCTURE FIT" title={<>Works with the identity stack<br /><em>you already have.</em></>} copy="Boundary complements identity providers and existing RBAC. It does not replace them." />
      <div className="identity-diagram">
        <div className="provider-field"><div className="field-label">IDENTITY PROVIDERS</div>{["Microsoft Entra", "Okta", "Auth0", "WorkOS", "AWS IAM", "Existing RBAC"].map((x, i) => <div key={x}><span>{String(i + 1).padStart(2, "0")}</span>{x}<Check size={13} /></div>)}</div>
        <div className="distinction"><div className="identity-side"><Fingerprint /><small>IDENTITY PROVIDER</small><strong>Who is acting?</strong><span>Authentication + broad access</span></div><div className="versus">+</div><div className="boundary-side"><Mark /><small>BOUNDARY</small><strong>Should this action execute?</strong><span>Purpose + context + sequence</span></div></div>
      </div>
    </section>
  );
}

function AuditRecorder() {
  const [query, setQuery] = useState("");
  const filtered = auditEvents.filter(row => row.join(" ").toLowerCase().includes(query.toLowerCase()));
  return (
    <section className="audit-section">
      <div className="audit-head"><SectionIntro index="10" label="FLIGHT RECORDER" title={<>Every decision.<br />Every reason.</>} copy="Reconstruct the full story across principals, agents, actions, resources, policy checks, approvals, and outcomes." /><div className="audit-meta"><span><b>365d</b> default retention</span><span><b>JSON</b> export</span><span><b>SIEM</b> streaming</span></div></div>
      <div className="audit-console">
        <div className="audit-toolbar"><label><Search size={15} /><input aria-label="Search audit events" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search events..." /></label><div className="filter-row">{["agent", "principal", "action", "decision", "resource", "risk"].map(x => <button key={x}>{x}<ChevronDown size={12} /></button>)}</div></div>
        <div className="audit-table"><div className="audit-table-head"><span>TIME</span><span>EVENT</span><span>DECISION / ACTOR</span><span>TRACE</span></div>{filtered.map(([time, event, actor, type], i) => <div className="audit-row" key={time + event}><time>{time}</time><div className="audit-event"><span className={`audit-dot ${type}`} /><strong>{event}</strong></div><div>{type === "allow" ? <DecisionBadge type="allow">{actor}</DecisionBadge> : type === "approval" ? <DecisionBadge type="approval">{actor}</DecisionBadge> : type === "human" ? <span className="human-actor">{actor}</span> : <span>{actor}</span>}</div><span className="mono trace">{`tr_0${i + 41}c`}</span></div>)}{filtered.length === 0 && <div className="audit-empty">No events match “{query}”.</div>}</div>
      </div>
    </section>
  );
}

function FinalCTA() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [deliveryMessage, setDeliveryMessage] = useState("");

  async function requestAccess(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    const fields = new FormData(event.currentTarget);
    if (fields.get("consent") !== "on") {
      setError("Please accept the consent statement so we can reply to your request.");
      return;
    }
    setSubmitting(true);
    setError("");
    setDeliveryMessage("");
    try {
      const response = await fetch("/api/access-requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: fields.get("email"),
          company: fields.get("company") || undefined,
          useCase: fields.get("useCase") || undefined,
          consent: true,
          source: fields.get("source") || "website",
          website: fields.get("website"),
        }),
      });
      const result = await response.json() as { error?: string; delivery?: "email" | "webhook"; mailtoUrl?: string };
      if (!response.ok) throw new Error(result.error || "We could not save your request. Please try again.");
      if (result.delivery === "email" && result.mailtoUrl) {
        window.location.href = result.mailtoUrl;
        setDeliveryMessage("Your email app should open with a prefilled request. Send that message to finish.");
      } else {
        setSubmitted(true);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "We could not save your request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }
  return (
    <section className="final-cta" id="access">
      <div className="cta-mark"><Mark /></div>
      <h2>Let agents act.<br /><em>Keep control.</em></h2>
      <p>Build autonomous systems your company can actually trust.</p>
      {submitted ? <motion.div className="access-success" role="status" aria-live="polite" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}><CheckCircle2 /> Thanks — we received your request and will reply within 2 business days.</motion.div> : <><form className="access-form access-form-extended" noValidate onSubmit={requestAccess}><label><span>WORK EMAIL</span><input name="email" required type="email" autoComplete="email" maxLength={254} placeholder="you@company.com" /></label><label><span>COMPANY (OPTIONAL)</span><input name="company" type="text" autoComplete="organization" maxLength={120} placeholder="Example Co" /></label><label><span>USE CASE (OPTIONAL)</span><input name="useCase" type="text" maxLength={1000} placeholder="What should agents be allowed to do?" /></label><label><span>HOW DID YOU HEAR ABOUT US?</span><select name="source" defaultValue="website"><option value="website">Website</option><option value="referral">Referral</option><option value="event">Event</option><option value="outbound">Outbound</option></select></label><label className="access-consent"><input name="consent" type="checkbox" required aria-describedby="consent-note" /><span id="consent-note">I agree Boundary may use my contact details to reply to this request. See <a href="/privacy">Privacy</a>.</span></label><div className="access-honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div><Button type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Request access"} <ArrowRight size={16} /></Button></form>{deliveryMessage && <p className="access-info" role="status">{deliveryMessage}</p>}{error && <p className="access-error" role="alert">{error}</p>}</>}
      <a className="talk-link" href="mailto:hello@boundary.dev">Talk to us <ArrowDownRight size={14} /></a>
    </section>
  );
}

function Footer() {
  return <footer><a className="brand" href="#top"><Mark /><span>BOUNDARY</span></a><div className="footer-links"><a href="#product">Product</a><a href="#developers">Developers</a><a href="#security">Security</a><a href="mailto:hello@boundary.dev">Company</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a></div><div className="footer-note"><span /> SYSTEMS OPERATIONAL <b>© 2026</b></div></footer>;
}

export default function Home() {
  return (
    <main id="top">
      <BoundarySplash />
      <Header />
      <section className="hero">
        <div className="hero-copy"><div className="eyebrow"><span>01</span> RUNTIME AUTHORIZATION</div><motion.h1 initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .65, ease: [.2, .8, .2, 1] }}>Authorize every<br /><em>agent action.</em></motion.h1><p>Runtime control for autonomous software. Define hard boundaries, evaluate actions in context, and require approval before risky operations execute.</p><div className="hero-actions"><Button asChild className="primary-cta"><a href="#access">Request access <ArrowDownRight size={16} /></a></Button><a className="text-link" href="#product">See how it works <ArrowRight size={15} /></a></div><div className="hero-note"><span /> Policy enforced before execution</div></div>
        <div className="hero-visual"><div className="plot-label top">PROPOSED ACTION</div><RuntimePanel /><div className="plot-label bottom">CONTROL PLANE / US-WEST-2</div></div>
      </section>
      <CoreIdea /><SystemMap /><SequenceSecurity /><Purpose /><PolicyLayers /><ApprovalExperience /><DeveloperExperience /><IdentityStack /><AuditRecorder /><FinalCTA /><Footer />
    </main>
  );
}
