import { Link, createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: LandingPage,
})

function LandingPage() {
  return (
    <main className="landing-page">
      <section className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">Pet feeds, less beige</p>
          <h1>Turn the daily folklore of your pets into posts people actually want to read.</h1>
          <p className="hero-text">
            CafeZoe starts with a pet roster and a tiny prompt. The generation layer will turn quirks, memories,
            and photos into warm social captions, blog drafts, and visual briefs.
          </p>
          <div className="hero-actions">
            <Link to="/app" className="button primary">
              Open the studio
            </Link>
            <Link to="/login" search={{ redirect: undefined }} className="button ghost">
              Sign in
            </Link>
          </div>
        </div>
        <div className="hero-card" aria-label="CafeZoe content sample">
          <div className="receipt-top">today at the counter</div>
          <h2>Zoe inspected the sunbeam and found it acceptable.</h2>
          <p>
            Suggested caption: “Quality control has arrived. The cafe opens only after Zoe confirms the light,
            the vibes, and the emotional integrity of the floor.”
          </p>
          <div className="stamp-row">
            <span>social post</span>
            <span>blog draft</span>
            <span>image brief</span>
          </div>
        </div>
      </section>
    </main>
  )
}
