const { Button, Badge, StatTile } = window.NHRSolutionDesignSystem_0db691;

function FloatingCard({ children, style, className }) {
  return <div className={className} style={{
    position: 'absolute', width: 216, padding: 0,
    background: 'rgba(13,17,17,.82)', backdropFilter: 'blur(14px)', WebkitBackdropFilter: 'blur(14px)',
    border: '1px solid rgba(0,229,212,.28)', borderRadius: 'var(--radius-card)',
    boxShadow: '0 24px 60px -24px rgba(0,0,0,.9), 0 0 0 1px rgba(255,255,255,.03)',
    ...style
  }}>{children}</div>;
}

function MiniStat({ label, value, delta }) {
  return (
    <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted-dark)' }}>{label}</span>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-.02em' }}>{value}</span>
        {delta && <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--nhr-turquoise)' }}>{delta}</span>}
      </div>
    </div>
  );
}

function Hero() {
  return (
    <div id="top" style={{ position: 'relative', overflow: 'hidden', background: 'var(--nhr-black)' }}>
      <DotField size={280} opacity={.4} inset={-110} />
      <DotField corner="br" size={280} opacity={.32} inset={-60} />
      <GridLines opacity={.6} />
      <Glow size={820} left={-180} top={-260} strength={.16} />
      <Glow size={620} right={-140} bottom={-280} strength={.12} />
      <div className="nhr-container hero-grid" style={{ position: 'relative', paddingTop: 84, paddingBottom: 104 }}>
        <div className="hero-copy" style={{ display: 'flex', flexDirection: 'column', gap: 26, maxWidth: 620 }}>
          <span className="nhr-eyebrow" style={{ color: 'var(--nhr-turquoise)' }}>Smart Tools for Smarter Businesses</span>
          <h1 style={{
            margin: 0, fontSize: 'var(--text-hero)', fontWeight: 800,
            letterSpacing: 'var(--tracking-hero)', lineHeight: 'var(--lh-tight)', color: '#fff'
          }}>Everything Your Business Needs to <span style={{ color: 'var(--nhr-turquoise)' }}>Work Smarter</span>.</h1>
          <p style={{ margin: 0, fontSize: 'var(--text-lead)', lineHeight: 1.6, color: 'var(--text-body-dark)', maxWidth: 540 }}>
            Powerful HR, workforce, payroll, compliance and business tools designed to simplify your day-to-day operations.
          </p>
          <div className="hero-cta" style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
            <Button size="lg" iconRight={<Icon name="ArrowRight" size={20} />}>Get Started</Button>
            <Button size="lg" variant="secondary" tone="dark">Book a Demo</Button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: 'var(--text-muted-dark)', fontSize: 14 }}>
            <Icon name="Check" size={16} style={{ color: 'var(--nhr-turquoise)' }} />
            Built for modern businesses
          </div>
        </div>
        <div className="hero-visual" style={{ position: 'relative', minWidth: 0 }}>
          <div style={{ transform: 'perspective(1600px) rotateY(-9deg) rotateX(3deg)', transformOrigin: 'left center' }}>
            <AppWindow compact height={470} />
          </div>
          <FloatingCard className="hero-float" style={{ top: -26, right: 6 }}><MiniStat label="Employees" value="248" delta="+6" /></FloatingCard>
          <FloatingCard className="hero-float" style={{ top: 132, right: -34, width: 200 }}><MiniStat label="Attendance" value="96.8%" /></FloatingCard>
          <FloatingCard className="hero-float" style={{ bottom: -30, right: 40, width: 234 }}>
            <div style={{ padding: 16, display: 'flex', gap: 22 }}>
              <MiniStatInline label="Payroll (Sept)" value="£84,520" />
              <MiniStatInline label="Tasks" value="92%" />
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}

function MiniStatInline({ label, value }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <span style={{ fontSize: 17, fontWeight: 800, color: 'var(--nhr-turquoise)', letterSpacing: '-.02em' }}>{value}</span>
      <span style={{ fontSize: 11, color: 'var(--text-muted-dark)', lineHeight: 1.3 }}>{label}</span>
    </div>
  );
}

Object.assign(window, { Hero, FloatingCard, MiniStat, MiniStatInline });
