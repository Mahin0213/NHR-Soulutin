const { SectionHeading, Card, Button, Badge, Switch, PricingCard, FaqItem, IconWrapper } = window.NHRSolutionDesignSystem_0db691;

function money(n) { return '£' + n.toLocaleString('en-GB', { maximumFractionDigits: 0 }); }

function PriceCalculator({ employees, setEmployees, annual, setAnnual }) {
  const P = window.NHR_SITE.pricing;
  return (
    <Card padding="var(--card-padding-lg)" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <label htmlFor="emp-count" style={{ fontSize: 'var(--text-caption)', fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase', color: 'var(--text-muted-on-light)' }}>How many employees?</label>
          <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.02em', color: 'var(--text-heading)' }}>{employees}</span>
        </span>
        <Switch label={'Annual billing (save ' + Math.round(P.annualDiscount * 100) + '%)'} checked={annual} onChange={e => setAnnual(e.target.checked)} />
      </div>
      <input id="emp-count" type="range" min="1" max="500" step="1" value={employees}
        onChange={e => setEmployees(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--nhr-turquoise)', height: 30 }} />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {[5, 25, 50, 120, 250].map(n => (
          <button key={n} type="button" onClick={() => setEmployees(n)} style={{
            padding: '8px 14px', borderRadius: 'var(--radius-pill)', cursor: 'pointer',
            border: '1px solid ' + (employees === n ? 'var(--nhr-turquoise)' : 'var(--border-subtle)'),
            background: employees === n ? 'var(--surface-accent-soft)' : 'transparent',
            color: employees === n ? 'var(--text-accent)' : 'var(--text-body)',
            fontFamily: 'var(--font-core)', fontSize: 13.5, fontWeight: 700
          }}>{n}</button>
        ))}
      </div>
      <span style={{ fontSize: 13, color: 'var(--text-muted-on-light)' }}>
        Estimates only, calculated as a plan base plus a per-employee rate. All figures are placeholders held in one data structure and are not a quotation.
      </span>
    </Card>
  );
}

function ComparePlans() {
  const P = window.NHR_SITE.pricing;
  const cell = (v) => {
    if (v === true) return <Icon name="Check" size={17} style={{ color: 'var(--text-accent)' }} />;
    if (v === false) return <Icon name="Minus" size={16} style={{ color: 'var(--text-muted-on-light)' }} />;
    return <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-heading)' }}>{v}</span>;
  };
  return (
    <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-card)', background: 'var(--surface-card)' }}>
      <table style={{ width: '100%', minWidth: 720, borderCollapse: 'collapse', fontFamily: 'var(--font-core)' }}>
        <thead>
          <tr>
            <th scope="col" style={{ textAlign: 'left', padding: '18px 20px', fontSize: 'var(--text-caption)', fontWeight: 700, letterSpacing: '.08em', textTransform: 'uppercase', color: 'var(--text-muted-on-light)', borderBottom: '1px solid var(--border-subtle)' }}>Feature</th>
            {P.plans.map(p => (
              <th key={p.name} scope="col" style={{ padding: '18px 16px', fontSize: 14, fontWeight: 800, color: p.featured ? 'var(--text-accent)' : 'var(--text-heading)', borderBottom: '1px solid var(--border-subtle)', whiteSpace: 'nowrap' }}>{p.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {P.compare.map(g => (
            <React.Fragment key={g.group}>
              <tr>
                <th scope="colgroup" colSpan={5} style={{ textAlign: 'left', padding: '14px 20px', fontSize: 12, fontWeight: 800, letterSpacing: '.14em', textTransform: 'uppercase', color: 'var(--text-accent)', background: 'var(--surface-subtle)' }}>{g.group}</th>
              </tr>
              {g.rows.map(r => (
                <tr key={r[0]}>
                  <th scope="row" style={{ textAlign: 'left', padding: '14px 20px', fontSize: 14.5, fontWeight: 500, color: 'var(--text-body)', borderBottom: '1px solid var(--border-subtle)' }}>{r[0]}</th>
                  {r.slice(1).map((v, i) => (
                    <td key={i} style={{ textAlign: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border-subtle)' }}>{cell(v)}</td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PricingPageBody() {
  const P = window.NHR_SITE.pricing;
  const [employees, setEmployees] = React.useState(25);
  const [annual, setAnnual] = React.useState(false);
  const [openFaq, setOpenFaq] = React.useState(0);

  const priceFor = (p) => {
    if (p.price) return { value: p.price, period: '' };
    const monthly = p.base + p.perEmployee * employees;
    if (annual) return { value: money(Math.round(monthly * 12 * (1 - P.annualDiscount))), period: '/year' };
    return { value: money(Math.round(monthly)), period: '/month' };
  };

  const faqs = [
    { q: 'How is the price calculated?', a: 'Each plan has a base price plus a per-employee rate. Move the slider to see an estimate for your headcount. Annual billing applies a discount to the twelve-month total.' },
    { q: 'Can I change plan later?', a: 'Yes. Plans can move up or down at the start of a billing period, and your data stays in place.' },
    { q: 'What counts as an employee?', a: 'Anyone with a record in your workspace. Employees who leave stop counting from the following billing period.' },
    { q: 'Are these final prices?', a: 'No. Every figure on this page is placeholder content held in one data structure, pending commercial sign-off.' }
  ];

  return (
    <React.Fragment>
      <PageHero eyebrow="Pricing" title="Simple Plans." highlight="Powerful Tools."
        description="Pick the tools you need today and scale as your team grows. Move the slider to estimate your monthly cost."
        primary="Get Started" secondary="Talk to Sales"
        breadcrumbs={[{ label: 'Home', href: 'index.html' }, { label: 'Pricing' }]} />

      <Section>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <PriceCalculator employees={employees} setEmployees={setEmployees} annual={annual} setAnnual={setAnnual} />
        </div>
        <div className="grid-4 pricing" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, marginTop: 48, alignItems: 'stretch' }}>
          {P.plans.map(p => {
            const pr = priceFor(p);
            return <PricingCard key={p.name} name={p.name} blurb={p.blurb} price={pr.value} period={pr.period}
              featured={p.featured} ctaLabel={p.ctaLabel} features={p.features} />;
          })}
        </div>
        <p style={{ margin: '28px auto 0', maxWidth: 720, textAlign: 'center', fontSize: 13.5, color: 'var(--text-muted-on-light)' }}>
          Estimated for {employees} {employees === 1 ? 'employee' : 'employees'}, billed {annual ? 'annually' : 'monthly'}. Excludes VAT. Placeholder pricing pending sign-off.
        </p>
      </Section>

      <Section subtle>
        <SectionHeading align="center" eyebrow="Compare" title="Compare Plans"
          description="Every feature, side by side. Enterprise adds contractual and multi-site controls on top of Business." />
        <div style={{ marginTop: 44 }}><ComparePlans /></div>
      </Section>

      <Section>
        <div className="split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          <SectionHeading eyebrow="What's included" title="Every Plan Starts With The Same Foundations"
            description="No plan is crippled to make the next one look better. The difference is depth, not access." />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {[['ShieldCheck', 'Role-based access'], ['Cloud', 'Hosted workspace'], ['Smartphone', 'Mobile access'], ['LifeBuoy', 'Help centre'], ['FileDown', 'Data export'], ['Users', 'Unlimited managers']].map(([ic, t]) => (
              <span key={t} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <IconWrapper size="sm"><Icon name={ic} size={18} /></IconWrapper>
                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text-heading)' }}>{t}</span>
              </span>
            ))}
          </div>
        </div>
      </Section>

      <Section subtle narrow>
        <SectionHeading align="center" eyebrow="FAQ" title="Pricing Questions" />
        <div style={{ marginTop: 36 }}>
          {faqs.map((q, i) => (
            <FaqItem key={q.q} id={'pfaq-' + i} question={q.q} answer={q.a} open={openFaq === i} onToggle={() => setOpenFaq(openFaq === i ? -1 : i)} />
          ))}
        </div>
      </Section>
    </React.Fragment>
  );
}

Object.assign(window, { PricingPageBody, PriceCalculator, ComparePlans });
