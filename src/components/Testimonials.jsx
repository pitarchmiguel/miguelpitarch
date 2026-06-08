export default function Testimonials() {
  return (
    <section className="page" id="testimonials">
      <div className="wrap">
        <div className="section-head">
          <div className="label">§ 04 — Kind words</div>
          <h2 className="display reveal">What clients <span className="italic">say,</span> quietly.</h2>
        </div>

        <div className="testimonials">
          <div className="quote featured reveal">
            <div className="mark">“</div>
            <p className="body">Our new landing page paid for itself in nine days. It's the first time an agency has felt like an extension of our own team — <em>calm, thoughtful, and genuinely interested in the outcome.</em></p>
            <div className="meta">
              <div className="avatar" data-initials="MH"></div>
              <div>
                <div className="name">Marta Herrera</div>
                <div className="role">Founder · Pelago Coffee Co.</div>
              </div>
            </div>
          </div>

          <div className="quote reveal" data-d="1">
            <div className="mark">“</div>
            <p className="body">Shipped in twelve days, to the hour. I've worked with five agencies; none of them felt this <em>quiet</em> to collaborate with.</p>
            <div className="meta">
              <div className="avatar" data-initials="JO"></div>
              <div>
                <div className="name">Jonas Oberg</div>
                <div className="role">CEO · Northbound Labs</div>
              </div>
            </div>
          </div>

          <div className="quote reveal" data-d="2">
            <div className="mark">“</div>
            <p className="body">The copy questions were sharper than the design ones — and the design was excellent. <em>Rare combination.</em></p>
            <div className="meta">
              <div className="avatar" data-initials="AK"></div>
              <div>
                <div className="name">Aoife Keane</div>
                <div className="role">Head of Growth · Ferment</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
