const SERVICES = [
  {
    idx: '№ 01',
    title: 'Landing pages',
    sub: '— single-page, high-intent',
    desc: 'One page, built to convert. Strategy, copy direction, design and code — shipped as a static site on your domain, ready to scale.',
    price: 'From £2.4k',
    note: '· 2 weeks',
  },
  {
    idx: '№ 02',
    title: 'Brand micro-sites',
    sub: '— 3 to 6 pages',
    desc: 'A home, a story, a services page, a way to get in touch. Small sites with the polish of big ones, built on a tiny CMS you can actually use.',
    price: 'From £4.8k',
    note: '· 3–4 weeks',
  },
  {
    idx: '№ 03',
    title: 'Identity ',
    sub: '— just enough',
    desc: 'Wordmark, type pairing, a small palette, a few principles. Not a 200-page guideline; a lean system that points the way for everything else.',
    price: 'From £1.8k',
    note: '· 10 days',
  },
  {
    idx: '№ 04',
    title: 'Retainer ',
    sub: '— ongoing care',
    desc: 'A few hours a week, every week. New sections, A/B tests, copy iterations, a fresh case study — I keep your site healthy and the pipeline full.',
    price: '£1.2k / mo',
    note: '· rolling',
  },
]

export default function Services() {
  return (
    <section className="page" id="services">
      <div className="wrap">
        <div className="section-head">
          <div className="label">§ 01 — Services</div>
          <h2 className="display reveal">Four things, <span className="italic">done well.</span></h2>
        </div>

        <div className="services">
          <div>
            <p className="mono reveal">What I do<br />— and what I don't.</p>
          </div>
          <div className="services-list">
            {SERVICES.map((s, i) => (
              <div className="service reveal" data-d={i + 1} key={s.idx}>
                <div className="idx">{s.idx}</div>
                <div>
                  <div className="title">{s.title}<em>{s.sub}</em></div>
                </div>
                <div className="desc">{s.desc}</div>
                <div className="meta">{s.price}<br /><span style={{ opacity: 0.6 }}>{s.note}</span></div>
                <div className="arrow">↗</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
