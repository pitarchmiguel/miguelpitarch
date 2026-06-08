export default function Hero() {
  return (
    <header className="hero">
      <div className="wrap">
        <div className="hero-tag">
          <span className="mono">Est. MMXXIII</span>
          <span className="l">An independent studio crafting websites for businesses that care about detail.</span>
        </div>

        <div className="hero-grid">
          <h1 className="display">
            <span className="line" data-d="1"><span>Landing pages,</span></span>
            <span className="line" data-d="2"><span><span className="italic">obsessively</span> <span className="ink-soft">crafted.</span></span></span>
          </h1>

          <div className="hero-bottom">
            <div>
              <p className="hero-desc reveal" data-d="2">
                I design and build <strong>high-conversion landing pages</strong> for small businesses, indie founders and studios — pages that feel considered, load in a blink, and actually move the needle.
              </p>
              <div className="hero-cta-row reveal" data-d="3">
                <a href="#contact" className="btn btn-primary">
                  Book a project <span className="arrow">→</span>
                </a>
                <a href="#work" className="btn btn-ghost">View recent work</a>
              </div>
            </div>

            <div className="hero-meta reveal" data-d="3">
              <div className="hero-stats">
                <div className="stat">
                  <div className="num">48<em>.</em></div>
                  <div className="lbl">Projects shipped</div>
                </div>
                <div className="stat">
                  <div className="num">2<em>×</em></div>
                  <div className="lbl">Avg. lift in signups</div>
                </div>
                <div className="stat">
                  <div className="num">14<em>d</em></div>
                  <div className="lbl">Typical turnaround</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
