import { useState } from 'react'

const ITEMS = [
  {
    idx: '№ 01',
    q: <>What do you need from me to start?</>,
    a: "A 30-minute call, access to your brand (if any), and rough answers to six questions I'll send ahead. No Notion databases, no 40-field briefs. If you have existing copy, great. If not, I'll write a first pass.",
  },
  {
    idx: '№ 02',
    q: <>What if I don't like the first direction?</>,
    a: "I present two directions on day three. We pick one and refine, or — rarely — I explore a third. If after that we're still not close, you pay 30% and walk. It hasn't happened yet, but the option is there.",
  },
  {
    idx: '№ 03',
    q: <>Do you work with <em>WordPress, Webflow, Framer?</em></>,
    a: "I build hand-coded static sites by default — faster, cheaper to host, nothing to update. If you need a CMS, I'll set up a light one (Sanity, or Framer for short-term) and train you in under an hour.",
  },
  {
    idx: '№ 04',
    q: <>Can I pay in instalments?</>,
    a: "Yes. 50% to book, 50% on launch, is standard. For retainers, monthly in advance. Bank transfer, Stripe link, or Wise — whatever's least friction for you.",
  },
  {
    idx: '№ 05',
    q: <>How hands-on do I need to be?</>,
    a: "Two calls, four async check-ins, one launch review. About three hours of your time, spread over two weeks. I do the thinking; you do the approving.",
  },
  {
    idx: '№ 06',
    q: <>Who <em>shouldn't</em> hire you?</>,
    a: 'Teams with more than five stakeholders on a single page. Projects that need complex auth, dashboards, or anything past four pages. Anyone whose first question is "can you match this template?" — I\'m not the right fit, and I\'ll say so on the call.',
  },
]

export default function Faq() {
  const [open, setOpen] = useState(null)

  return (
    <section className="page" id="faq">
      <div className="wrap">
        <div className="section-head">
          <div className="label">§ 05 — Frequently asked</div>
          <h2 className="display reveal">Questions, <span className="italic">answered</span> plainly.</h2>
        </div>

        <div className="faq">
          <div>
            <p className="mono reveal">Still something<br />on your mind?<br /><br /><a href="#contact" style={{ color: 'var(--ink)', textTransform: 'none', letterSpacing: 0, fontSize: '13px', fontFamily: 'var(--font-body)', borderBottom: '1px solid var(--hair-strong)', paddingBottom: '2px' }}>Ask me directly →</a></p>
          </div>
          <div className="faq-list">
            {ITEMS.map((item, i) => (
              <div
                className={'faq-item reveal' + (open === i ? ' open' : '')}
                data-d={Math.min(i + 1, 4)}
                key={item.idx}
                onClick={() => setOpen(open === i ? null : i)}
              >
                <div className="idx">{item.idx}</div>
                <div>
                  <div className="q">{item.q}</div>
                  <div className="a">{item.a}</div>
                </div>
                <div className="toggle">+</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
