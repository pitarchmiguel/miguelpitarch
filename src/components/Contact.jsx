import { useState } from 'react'

const BUDGETS = ['< £3k', '£3–6k', '£6–12k', '£12k+', 'not sure yet']

export default function Contact() {
  const [budget, setBudget] = useState('')
  const [sent, setSent] = useState(false)

  const onSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <section className="footer-cta" id="contact">
      <div className="wrap">
        <h2 className="big display reveal">Let's make <span className="italic">something</span> good.</h2>

        <div className="contact-grid reveal">
          <div className="contact-left">
            <h3>Tell me about the <em>page you need.</em></h3>
            <p>A few sentences is plenty. I reply within one working day, usually sooner, with a link to book a short call if it looks like a fit.</p>
            <div className="meta-row">
              <div><span className="mono-label">Email</span><a href="mailto:hello@miguelpitarch.com">hello@miguelpitarch.com</a></div>
              <div><span className="mono-label">Slots</span><span>2 open · June 2026</span></div>
              <div><span className="mono-label">Reply</span><span>Within 1 working day</span></div>
            </div>
          </div>

          {!sent ? (
            <form className="contact" onSubmit={onSubmit}>
              <div className="field">
                <label>Your name <span className="num">01 / 04</span></label>
                <input type="text" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="field">
                <label>Email <span className="num">02 / 04</span></label>
                <input type="email" name="email" placeholder="jane@company.com" required />
              </div>
              <div className="field">
                <label>Tell me about the project <span className="num">03 / 04</span></label>
                <textarea name="project" placeholder="A single-page shop for my coffee brand — launching in July, aiming for £15k/mo in subscriptions." required></textarea>
              </div>
              <div className="field">
                <label>Rough budget <span className="num">04 / 04</span></label>
                <div className="budget-chips">
                  {BUDGETS.map((b) => (
                    <button
                      type="button"
                      className={'budget-chip' + (budget === b ? ' on' : '')}
                      key={b}
                      onClick={() => setBudget(b)}
                    >
                      {b}
                    </button>
                  ))}
                </div>
                <input type="hidden" name="budget" value={budget} readOnly />
              </div>

              <div className="submit-row">
                <span className="hint">No attachments needed · replies from me, not a bot</span>
                <button type="submit" className="btn btn-primary">Send enquiry <span className="arrow">→</span></button>
              </div>
            </form>
          ) : (
            <div className="form-success show">Thanks — <em>message received.</em> I'll reply by end of day tomorrow.</div>
          )}
        </div>

        <div className="footer-row" style={{ marginTop: '80px' }}>
          <div className="footer-col">
            <h4>Studio</h4>
            <p className="small">An independent practice based in Manchester, working with businesses, founders and operators — mostly remote, occasionally on a train.</p>
          </div>
          <div className="footer-col">
            <h4>Elsewhere</h4>
            <a href="#">Read.cv</a>
            <a href="#">LinkedIn</a>
            <a href="#">Are.na</a>
            <a href="#">Instagram</a>
          </div>
          <div className="footer-col">
            <h4>Availability</h4>
            <p className="small" style={{ color: 'var(--ink)' }}>Booking from <span style={{ color: 'var(--accent)' }}>●</span> June 2026.</p>
            <p className="small">Two slots per quarter.<br />Usually booked a month ahead.</p>
          </div>
        </div>

        <div className="footer-bottom">
          <div>© MMXXVI — Atelier Studio</div>
          <div>All rights, <span style={{ fontStyle: 'italic', fontFamily: 'var(--font-display)', textTransform: 'none', letterSpacing: 0 }}>reserved</span></div>
        </div>
      </div>
    </section>
  )
}
