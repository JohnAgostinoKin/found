import { useEffect, useMemo, useState } from "react";
import { supabase } from "./supabaseClient";

const thesisChips = [
  "IRL-First Product",
  "City-By-City Density",
  "Curated Small Groups",
  "AI-Assisted Planning",
  "Venue Partnerships",
  "Membership Potential"
];

const irlCards = [
  {
    number: "1",
    title: "Match for chemistry",
    copy: "Create small groups around compatibility, energy, life stage, humor, availability, and shared context."
  },
  {
    number: "2",
    title: "Reduce planning friction",
    copy: "Suggest simple in-real-life formats, timing, locations, and context so the first plan does not die in a group chat."
  },
  {
    number: "3",
    title: "Nudge the next meetup",
    copy: "Friendship needs repetition. Found keeps the cadence moving until the group can carry itself."
  },
  {
    number: "4",
    title: "Build local density",
    copy: "A city-by-city launch model makes the experience feel alive, local, and partner-friendly from the beginning."
  }
];

const steps = [
  {
    number: "1",
    title: "Tell Found who you are",
    copy: "A short conversational onboarding learns your personality, energy, interests, schedule, and the kinds of people you usually click with."
  },
  {
    number: "2",
    title: "Found suggests your group",
    copy: "Found uses compatibility signals to create small groups with shared context, complementary personalities, and a real chance of clicking offline."
  },
  {
    number: "3",
    title: "Make the first plan",
    copy: "Found can suggest the venue, timing, format, and icebreaker context so the first hangout feels simple instead of awkward."
  },
  {
    number: "4",
    title: "Keep the cadence",
    copy: "After each meetup, Found nudges the group toward the next low-stakes plan, helping acquaintances build the repetition that friendship needs."
  },
  {
    number: "5",
    title: "The group takes over",
    copy: "As the group gets comfortable, Found becomes less central. The goal is not more app time. The goal is real people making real plans."
  }
];

const tests = [
  {
    number: "1",
    label: "Matching Quality",
    question: "Can AI create small groups that feel meaningfully compatible, not just demographically similar?"
  },
  {
    number: "2",
    label: "IRL Conversion",
    question: "Can Found reduce the awkward planning friction that usually keeps new friendships from moving offline?"
  },
  {
    number: "3",
    label: "Real-World Retention",
    question: "Can repeated, low-pressure gatherings help a group become self-sustaining without relying on the app forever?"
  }
];

const whyCards = [
  {
    accent: "violet",
    title: "AI can coordinate the messy parts",
    copy: "Matching, reminders, preferences, context, and follow-up are exactly the kinds of repeated coordination tasks AI can make easier."
  },
  {
    accent: "teal",
    title: "Remote and hybrid life changed habits",
    copy: "Fewer casual daily encounters means fewer accidental friendships. Found is built for intentional, real-world connection."
  },
  {
    accent: "bright",
    title: "Meeting through software feels normal",
    copy: "People already use apps to meet dates, colleagues, communities, and activity partners. Friendship is the next obvious use case."
  },
  {
    accent: "gold",
    title: "Low-pressure plans matter",
    copy: "The best gatherings do not need to be expensive or elaborate. Found can steer groups toward simple, repeatable ways to meet."
  }
];

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const go = (href) => {
    if (href.includes("#")) {
      const [targetPathRaw, targetHash] = href.split("#");
      const targetPath = targetPathRaw || window.location.pathname;
      const targetUrl = `${targetPath}#${targetHash}`;

      window.history.pushState({}, "", targetUrl);
      setPath(window.location.pathname);

      window.setTimeout(() => {
        document.getElementById(targetHash)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
      return;
    }

    window.history.pushState({}, "", href);
    setPath(window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return { path: path.replace(/\.html$/, ""), go };
}

function Nav({ go }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function navigate(href) {
    setMenuOpen(false);
    go(href);
  }

  return (
    <nav className="site-nav">
      <button className="brand button-reset" onClick={() => navigate("/")} aria-label="Found home">
        <img className="brand-icon" src="/found-icon.svg" alt="" aria-hidden="true" />
        <span className="brand-lockup">
          <span className="brand-word">found</span>
          <span className="brand-mobile-tagline">Find Real Life Friends</span>
        </span>
        <span className="brand-divider" aria-hidden="true" />
        <span className="brand-tagline">Find Real Life Friends</span>
      </button>

      <button
        className="hamburger-toggle button-reset"
        type="button"
        aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden="true" />
        <span aria-hidden="true" />
        <span aria-hidden="true" />
      </button>

      <div className={menuOpen ? "nav-r nav-open" : "nav-r"}>
        <button className="nav-a button-reset" onClick={() => navigate("/#irl")}>Real-life Thesis</button>
        <button className="nav-a button-reset" onClick={() => navigate("/#how")}>How it works</button>
        <button className="nav-a button-reset" onClick={() => navigate("/investors")}>Investors</button>
        <button className="nav-btn" onClick={() => navigate("/#join")}>Get early access</button>
      </div>
    </nav>
  );
}

function Footer({ go }) {
  return (
    <footer>
      <button className="flogo button-reset" onClick={() => go("/")}>found</button>
      <div className="footer-right">
        <div className="flinks">
          <button className="button-reset" onClick={() => go("/privacy")}>Privacy</button>
          <button className="button-reset" onClick={() => go("/terms")}>Terms</button>
          <button className="button-reset" onClick={() => go("/investors")}>Investors</button>
          <a href="https://www.bonzoli.com" target="_blank" rel="noopener noreferrer">Bonzoli Technology Group</a>
        </div>
        <div className="fcopy">&copy; 2026 Found | A Bonzoli Technology Group Concept. All Rights Reserved.</div>
      </div>
    </footer>
  );
}

function WaitlistForm({ compact = false }) {
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [duplicate, setDuplicate] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(false);

  async function submit() {
    if (!email || !email.includes("@")) {
      setError(true);
      window.setTimeout(() => setError(false), 1200);
      return;
    }

    if (!supabase) {
      setJoined(true);
      return;
    }

    setSubmitting(true);

    const { error: dbError } = await supabase.from("waitlist").insert({
      email,
      source: "found",
    });

    setSubmitting(false);

    if (dbError) {
      if (dbError.code === "23505") {
        setDuplicate(true);
      } else {
        setError(true);
        window.setTimeout(() => setError(false), 1200);
      }
      return;
    }

    setJoined(true);
  }

  if (joined) {
    return <div className="smsg visible">You're on the list. We'll be in touch.</div>;
  }

  if (duplicate) {
    return <div className="smsg visible">You're already on the list. We'll be in touch.</div>;
  }

  return (
    <div className={compact ? "ctaform" : "hform"}>
      <input
        className={compact ? "ctai" : "einput"}
        type="email"
        placeholder="your@email.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        style={error ? { borderColor: "var(--danger)" } : undefined}
      />
      <button className={compact ? "ctab" : "sbtn"} onClick={submit} disabled={submitting}>
        {submitting ? "Joining..." : compact ? "Reserve My Spot" : "Join The Waitlist"}
      </button>
    </div>
  );
}

function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="orb o1" />
        <div className="orb o2" />
        <div className="orb o3" />
        <div className="hero-c">
          <div className="eyebrow"><span className="edot" />AI for in-real-life (IRL) friendship</div>
          <h1>You haven't met<br />your <em>people</em> yet.</h1>
          <p className="hsub">Found is an AI-powered social concierge designed to help adults build real-world friend groups without the swiping, awkward group chats, or endless planning.</p>
          <p className="hero-line">Built for in-real-life (IRL) connection, not more screen time.</p>
          <WaitlistForm />
          <p className="proof"><strong>Launching city by city</strong> - starting with early access groups in select markets.</p>
        </div>
      </section>

      <section className="irl-stage" id="irl">
        <div className="irl-wrap">
          <div className="irl-lead">
            <div className="irl-kicker">The Real-life Thesis</div>
            <div className="irl-title">The app wins when people leave the app.</div>
            <p className="irl-copy">Found is not trying to become another feed. The goal is to turn online intent into offline repetition: small groups, simple plans, and enough structure for real friendships to form in the real world.</p>
          </div>
          <div className="irl-grid">
            {irlCards.map((card) => (
              <div className="irl-card" key={card.number}>
                <div className="big-num">{card.number}</div>
                <div className="card-title">{card.title}</div>
                <div className="card-copy">{card.copy}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="how">
        <div className="seyebrow">How it works</div>
        <h2>Your AI social concierge makes meeting <em>IRL</em> feel easier.</h2>
        <p className="ssub">Real friendship is built through repeated, low-stakes, shared experiences. Found is designed to reduce the friction that keeps those moments from happening.</p>
        <div className="steps">
          {steps.map((step) => (
            <div className="step" key={step.number}>
              <div className="sn">{step.number}</div>
              <div className="st">{step.title}</div>
              <div className="sd">{step.copy}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="tsec">
        <div className="tin">
          <div className="seyebrow">What early access will test</div>
          <h2>The first version is built around the moments that matter.</h2>
          <div className="tgrid">
            {tests.map((item) => (
              <div className="tcard" key={item.number}>
                <div className="tstars">{item.number}</div>
                <div className="tq">{item.question}</div>
                <div className="ta">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="sec" id="why">
        <div className="seyebrow">Why now</div>
        <h2>The old friendship infrastructure is fraying. Found is a new layer for real life.</h2>
        <p className="ssub">Work, school, neighborhoods, and nightlife do not automatically create durable friendships for many adults anymore. Found gives that process structure.</p>
        <div className="wgrid">
          {whyCards.map((card) => (
            <div className="wi" key={card.title}>
              <div className={`wacc ${card.accent}`} />
              <div className="wt">{card.title}</div>
              <div className="wd">{card.copy}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="thesis-band">
        <div className="plbl">Investor Thesis</div>
        <div className="prow">
          {thesisChips.map((chip) => <span className="pi" key={chip}>{chip}</span>)}
        </div>
      </section>

      <section className="ctasec" id="join">
        <div className="ctac">
          <div className="ctat">You deserve to be <em>found.</em></div>
          <p className="ctasub">We are building the first version for a small number of launch cities. Join early access and help shape how Found brings people together IRL.</p>
          <WaitlistForm compact />
        </div>
      </section>
    </>
  );
}

function PageHero({ eyebrow, title, children }) {
  return (
    <section className="subpage-hero">
      <div className="seyebrow">{eyebrow}</div>
      <h1>{title}</h1>
      <p>{children}</p>
    </section>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageHero eyebrow="Privacy" title="Privacy Policy">
        Found is in early development. This page explains the basic way we expect to handle information submitted through early access forms and investor inquiries.
      </PageHero>
      <main className="legal-wrap">
        <section className="legal-card">
          <h2>Information We Collect</h2>
          <p>When you join early access or contact us, we may collect your name, email address, city, and anything you choose to share with us.</p>
          <h3>How We Use It</h3>
          <p>We use submitted information to manage early access interest, communicate product updates, understand launch-market demand, and improve Found.</p>
          <h3>Sharing</h3>
          <p>We do not sell personal information. We may use trusted service providers for hosting, analytics, email, and form processing.</p>
        </section>
        <section className="legal-card">
          <h2>Early-stage notice</h2>
          <p>Found is an early-stage concept from Bonzoli Technology Group. Privacy practices may evolve as the product develops, and this page may be updated over time.</p>
        </section>
      </main>
    </>
  );
}

function TermsPage() {
  return (
    <>
      <PageHero eyebrow="Terms" title="Terms of Use">
        These terms cover use of the Found website and early access materials. The product is still in development and may change.
      </PageHero>
      <main className="legal-wrap">
        <section className="legal-card">
          <h2>Website Use</h2>
          <p>You may use this website to learn about Found, join early access, or contact the team. You may not misuse the site, attempt to disrupt it, or submit unlawful content.</p>
          <h3>No Guarantee of Access</h3>
          <p>Joining a waitlist or submitting interest does not guarantee access to the product, a launch city, an invitation, or any specific feature.</p>
          <h3>No Investment Offer</h3>
          <p>Information on this website is for general informational purposes only. Nothing here is an offer to sell securities or a solicitation to buy securities.</p>
        </section>
      </main>
    </>
  );
}

function InvestorsPage() {
  return (
    <>
      <PageHero eyebrow="Investors" title="Found Investor Prospectus">
        Found is a Bonzoli Technology Group concept exploring AI-assisted, in-real-life friendship infrastructure for adults.
      </PageHero>
      <main className="legal-wrap">
        <section className="legal-card">
          <h2>The Thesis</h2>
          <p>Most social products try to capture more screen time. Found is designed to create offline repetition: small groups, simple plans, and enough structure for adults to build real friendships.</p>
          <div className="mini-grid">
            <div className="mini-card"><strong>Product</strong><p>AI-powered social concierge for curated small groups and real-world meetups.</p></div>
            <div className="mini-card"><strong>Launch Model</strong><p>City-by-city density, starting with focused early access markets.</p></div>
            <div className="mini-card"><strong>Revenue Paths</strong><p>Memberships, premium matching, venue partnerships, hosted gatherings, and local discovery.</p></div>
            <div className="mini-card"><strong>Parent Company</strong><p>Developed as a concept under Bonzoli Technology Group.</p></div>
          </div>
        </section>
        <section className="legal-card">
          <h2>Important Note</h2>
          <p>This page is informational only. It is not a securities offering, investment solicitation, or financial advice. Investor materials, if prepared, should be reviewed with appropriate legal and financial advisors.</p>
        </section>
      </main>
    </>
  );
}

function NotFoundPage({ go }) {
  return (
    <main className="subpage-hero">
      <div className="seyebrow">Not found</div>
      <h1>This page is not here yet.</h1>
      <p>Head back to the Found homepage.</p>
      <button className="secondary-btn top-gap" onClick={() => go("/")}>Go home</button>
    </main>
  );
}

export default function App() {
  const { path, go } = useRoute();

  const page = useMemo(() => {
    if (path === "/" || path === "") return <HomePage />;
    if (path === "/privacy") return <PrivacyPage />;
    if (path === "/terms") return <TermsPage />;
    if (path === "/investors") return <InvestorsPage />;
    return <NotFoundPage go={go} />;
  }, [path, go]);

  useEffect(() => {
    document.title = "Found | Find Real Life Friends";
  }, []);

  return (
    <div className="page-shell">
      <Nav go={go} />
      {page}
      <Footer go={go} />
    </div>
  );
}

