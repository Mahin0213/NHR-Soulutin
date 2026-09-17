/* HR calculators. Every formula below is standard UK practice and is
   implemented exactly — no rounding shortcuts. Figures the user enters are
   never sent anywhere. */
const { SectionHeading, Card, Button, Badge, IconWrapper } = window.NHRSolutionDesignSystem_0db691;

const gbp = n => '£' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const gbp0 = n => '£' + Math.round(Number(n)).toLocaleString('en-GB');

/* ---------- shared shell ---------- */
function CalcField({ label, hint, children }) {
  return (
    <label style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      <span style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--text-heading)' }}>{label}</span>
      {children}
      {hint && <span style={{ fontSize: 12, color: 'var(--text-muted-on-light)' }}>{hint}</span>}
    </label>
  );
}

function calcInputStyle(focus) {
  return {
    width: '100%', fontFamily: 'var(--font-core)', fontSize: 15.5, color: 'var(--text-heading)',
    background: 'var(--surface-page)',
    border: '1px solid ' + (focus ? 'var(--nhr-turquoise-deep)' : 'var(--border-subtle)'),
    borderRadius: 'var(--radius-btn)', padding: '12px 14px', outline: 'none',
    boxShadow: focus ? '0 0 0 3px rgba(0,229,212,.18)' : 'none',
    transition: 'border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)'
  };
}

function NumInput({ label, hint, value, onChange, min = 0, step = 1, suffix }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <CalcField label={label} hint={hint}>
      <span style={{ position: 'relative', display: 'flex' }}>
        <input type="number" value={value} min={min} step={step}
          onChange={e => onChange(e.target.value)}
          onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
          style={Object.assign({}, calcInputStyle(focus), suffix ? { paddingRight: 48 } : {})} />
        {suffix && <span style={{ position: 'absolute', right: 14, top: 13, fontSize: 14, color: 'var(--text-muted-on-light)' }}>{suffix}</span>}
      </span>
    </CalcField>
  );
}

function SelInput({ label, hint, value, onChange, options }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <CalcField label={label} hint={hint}>
      <select value={value} onChange={e => onChange(e.target.value)}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={Object.assign({}, calcInputStyle(focus), {
          appearance: 'none', cursor: 'pointer', padding: '12px 38px 12px 14px',
          backgroundImage: 'linear-gradient(45deg,transparent 50%,#8A9998 50%),linear-gradient(135deg,#8A9998 50%,transparent 50%)',
          backgroundPosition: 'calc(100% - 20px) 21px,calc(100% - 15px) 21px',
          backgroundSize: '5px 5px,5px 5px', backgroundRepeat: 'no-repeat'
        })}>
        {options.map(o => {
          const v = typeof o === 'string' ? o : o.value;
          const l = typeof o === 'string' ? o : o.label;
          return <option key={v} value={v}>{l}</option>;
        })}
      </select>
    </CalcField>
  );
}

function ResultPanel({ headline, sub, rows = [], note }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', gap: 16, padding: 22,
      borderRadius: 'var(--radius-card)', border: '1px solid var(--border-accent)',
      background: 'var(--surface-accent-soft)'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
        <span style={{ fontSize: 34, fontWeight: 800, letterSpacing: '-.025em', lineHeight: 1.05, color: 'var(--text-accent)' }}>{headline}</span>
        {sub && <span style={{ fontSize: 14, color: 'var(--text-body)' }}>{sub}</span>}
      </div>
      {rows.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 9, paddingTop: 4, borderTop: '1px solid rgba(0,191,178,.25)' }}>
          {rows.map(([k, v]) => (
            <span key={k} style={{ display: 'flex', justifyContent: 'space-between', gap: 14, fontSize: 14 }}>
              <span style={{ color: 'var(--text-body)' }}>{k}</span>
              <span style={{ fontWeight: 700, color: 'var(--text-heading)', fontFamily: 'var(--font-mono)', textAlign: 'right' }}>{v}</span>
            </span>
          ))}
        </div>
      )}
      {note && <span style={{ fontSize: 12.5, lineHeight: 1.6, color: 'var(--text-muted-on-light)' }}>{note}</span>}
    </div>
  );
}

function CalcShell({ id, icon, title, description, explanation, inputs, result, onReset }) {
  return (
    <Card id={id} padding="var(--card-padding-lg)" style={{ display: 'flex', flexDirection: 'column', gap: 22, scrollMarginTop: 100 }}>
      <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
        <IconWrapper><Icon name={icon} /></IconWrapper>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 'var(--text-card-title)', fontWeight: 700, letterSpacing: 'var(--tracking-tight)' }}>{title}</h3>
          <p style={{ margin: 0, fontSize: 'var(--text-body-sm)', lineHeight: 1.6 }}>{description}</p>
        </div>
      </div>
      <div className="calc-split" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {inputs}
          <Button variant="ghost" size="sm" onClick={onReset} iconLeft={<Icon name="RotateCcw" size={15} />}>Reset</Button>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {result}
          <details style={{ fontSize: 13, color: 'var(--text-body)' }}>
            <summary style={{ cursor: 'pointer', fontWeight: 700, color: 'var(--text-heading)', padding: '4px 0' }}>How this is calculated</summary>
            <div style={{ paddingTop: 8, lineHeight: 1.65 }}>{explanation}</div>
          </details>
        </div>
      </div>
    </Card>
  );
}

/* ---------- 1. Bradford Factor ---------- */
function BradfordCalc() {
  const [spells, setSpells] = React.useState(4);
  const [days, setDays] = React.useState(7);
  const S = Number(spells) || 0, D = Number(days) || 0;
  const score = S * S * D;
  const band = score >= 900 ? ['Very high', 'danger'] : score >= 450 ? ['High', 'warning'] : score >= 150 ? ['Moderate', 'warning'] : ['Low', 'success'];
  return (
    <CalcShell id="bradford" icon="Activity" title="Bradford Factor Calculator"
      description="Weights short, frequent absences more heavily than a single long one. Used to decide when an absence conversation is due."
      onReset={() => { setSpells(4); setDays(7); }}
      inputs={<React.Fragment>
        <NumInput label="Number of separate absence spells" value={spells} onChange={setSpells} hint="Each unbroken period of absence counts as one spell" />
        <NumInput label="Total days absent" value={days} onChange={setDays} hint="Across all spells in the period, usually 12 months" />
      </React.Fragment>}
      result={<ResultPanel headline={score.toLocaleString('en-GB')} sub="Bradford Factor score"
        rows={[['Spells (S)', S], ['Days (D)', D], ['Calculation', 'S² × D'], ['Band', band[0]]]}
        note="Trigger points are set by your own absence policy. Common thresholds are 150, 450 and 900, but they are a prompt for a conversation, not an automatic sanction." />}
      explanation={<React.Fragment>The score is <strong>S² × D</strong>, where S is the number of separate absence spells and D the total days absent. Here: {S} × {S} × {D} = <strong>{score.toLocaleString('en-GB')}</strong>. Squaring the spell count is what penalises repeated short absences.</React.Fragment>} />
  );
}

/* ---------- 2. Holiday entitlement ---------- */
function HolidayCalc() {
  const [mode, setMode] = React.useState('Days per week');
  const [daysPerWeek, setDaysPerWeek] = React.useState(5);
  const [hoursPerWeek, setHoursPerWeek] = React.useState(37.5);
  const [monthsWorked, setMonthsWorked] = React.useState(12);
  const dpw = Math.min(Number(daysPerWeek) || 0, 5);
  const hpw = Number(hoursPerWeek) || 0;
  const months = Math.min(Math.max(Number(monthsWorked) || 0, 0), 12);
  const proRata = months / 12;
  const statutoryDays = Math.min(dpw * 5.6, 28);
  const entitlementDays = statutoryDays * proRata;
  const entitlementHours = hpw * 5.6 * proRata;
  const isHours = mode === 'Hours per week';
  return (
    <CalcShell id="holiday" icon="Plane" title="Holiday Entitlement Calculator"
      description="Statutory minimum paid holiday in the UK is 5.6 weeks, capped at 28 days for full-time work."
      onReset={() => { setMode('Days per week'); setDaysPerWeek(5); setHoursPerWeek(37.5); setMonthsWorked(12); }}
      inputs={<React.Fragment>
        <SelInput label="Work pattern" value={mode} onChange={setMode} options={['Days per week', 'Hours per week']} />
        {isHours
          ? <NumInput label="Hours worked per week" value={hoursPerWeek} onChange={setHoursPerWeek} step={0.5} suffix="hrs" />
          : <NumInput label="Days worked per week" value={daysPerWeek} onChange={setDaysPerWeek} step={0.5} hint="Capped at 5 for the statutory calculation" />}
        <NumInput label="Months worked in the holiday year" value={monthsWorked} onChange={setMonthsWorked} step={1} hint="Use 12 for a full year" />
      </React.Fragment>}
      result={<ResultPanel
        headline={isHours ? entitlementHours.toFixed(1) + ' hrs' : entitlementDays.toFixed(1) + ' days'}
        sub={months < 12 ? 'Pro-rata for ' + months + ' months' : 'Full holiday year entitlement'}
        rows={isHours
          ? [['Hours per week', hpw], ['Statutory weeks', '5.6'], ['Full-year hours', (hpw * 5.6).toFixed(1)], ['Pro-rata factor', proRata.toFixed(3)]]
          : [['Days per week', dpw], ['Statutory weeks', '5.6'], ['Full-year days', statutoryDays.toFixed(1)], ['Pro-rata factor', proRata.toFixed(3)]]}
        note="This is the statutory minimum. Many contracts are more generous, and bank holidays may or may not be included — check the contract." />}
      explanation={isHours
        ? <React.Fragment>Hours per week × 5.6 weeks × (months ÷ 12). Here: {hpw} × 5.6 × {proRata.toFixed(3)} = <strong>{entitlementHours.toFixed(1)} hours</strong>.</React.Fragment>
        : <React.Fragment>Days per week × 5.6 weeks, capped at 28 days, then pro-rated. Here: {dpw} × 5.6 = {(dpw * 5.6).toFixed(1)}, capped to {statutoryDays.toFixed(1)}, × {proRata.toFixed(3)} = <strong>{entitlementDays.toFixed(1)} days</strong>.</React.Fragment>} />
  );
}

/* ---------- 3. Salary / take-home (England & NI, 2025/26 thresholds) ---------- */
const TAX = {
  personalAllowance: 12570, taperStart: 100000,
  basicTo: 50270, higherTo: 125140,
  basicRate: 0.20, higherRate: 0.40, additionalRate: 0.45,
  niPrimary: 12570, niUpper: 50270, niMain: 0.08, niUpperRate: 0.02
};

function incomeTax(gross) {
  const allowance = gross > TAX.taperStart
    ? Math.max(0, TAX.personalAllowance - (gross - TAX.taperStart) / 2)
    : TAX.personalAllowance;
  const taxable = Math.max(0, gross - allowance);
  const basicBand = Math.max(0, TAX.basicTo - TAX.personalAllowance);
  const higherBand = Math.max(0, TAX.higherTo - TAX.basicTo);
  const basic = Math.min(taxable, basicBand);
  const higher = Math.min(Math.max(taxable - basicBand, 0), higherBand);
  const additional = Math.max(taxable - basicBand - higherBand, 0);
  return {
    allowance,
    basic: basic * TAX.basicRate,
    higher: higher * TAX.higherRate,
    additional: additional * TAX.additionalRate,
    total: basic * TAX.basicRate + higher * TAX.higherRate + additional * TAX.additionalRate
  };
}

function employeeNI(gross) {
  const main = Math.min(Math.max(gross - TAX.niPrimary, 0), TAX.niUpper - TAX.niPrimary) * TAX.niMain;
  const upper = Math.max(gross - TAX.niUpper, 0) * TAX.niUpperRate;
  return main + upper;
}

function SalaryCalc() {
  const [gross, setGross] = React.useState(35000);
  const [pension, setPension] = React.useState(5);
  const g = Number(gross) || 0;
  const pensionPct = Number(pension) || 0;
  const pensionAmt = g * pensionPct / 100;
  const taxableBase = Math.max(0, g - pensionAmt);
  const tax = incomeTax(taxableBase);
  const ni = employeeNI(g);
  const net = g - pensionAmt - tax.total - ni;
  return (
    <CalcShell id="salary" icon="Wallet" title="Salary & Take-Home Calculator"
      description="Estimated take-home pay after income tax, employee National Insurance and pension contributions."
      onReset={() => { setGross(35000); setPension(5); }}
      inputs={<React.Fragment>
        <NumInput label="Gross annual salary" value={gross} onChange={setGross} step={500} suffix="£" />
        <NumInput label="Pension contribution" value={pension} onChange={setPension} step={0.5} suffix="%" hint="Deducted before tax (net pay arrangement)" />
      </React.Fragment>}
      result={<ResultPanel headline={gbp0(net)} sub={'Estimated take-home per year · ' + gbp0(net / 12) + ' per month'}
        rows={[
          ['Gross salary', gbp0(g)],
          ['Pension (' + pensionPct + '%)', '−' + gbp(pensionAmt)],
          ['Personal allowance', gbp0(tax.allowance)],
          ['Income tax', '−' + gbp(tax.total)],
          ['National Insurance', '−' + gbp(ni)],
          ['Take-home', gbp(net)]
        ]}
        note="Estimate using 2025/26 England & Northern Ireland rates: allowance £12,570 (tapered above £100,000), 20% to £50,270, 40% to £125,140, 45% above. Employee NI 8% then 2%. Scotland has different bands. Excludes student loan and other deductions." />}
      explanation={<React.Fragment>Pension is deducted first, then income tax is applied band by band to what remains above the personal allowance, and National Insurance is charged on gross pay. Tax here: {gbp(tax.basic)} basic + {gbp(tax.higher)} higher + {gbp(tax.additional)} additional = <strong>{gbp(tax.total)}</strong>.</React.Fragment>} />
  );
}

/* ---------- 4. Hourly rate ---------- */
function HourlyCalc() {
  const [salary, setSalary] = React.useState(32000);
  const [hours, setHours] = React.useState(37.5);
  const [weeks, setWeeks] = React.useState(52);
  const s = Number(salary) || 0, h = Number(hours) || 0, w = Number(weeks) || 52;
  const annualHours = h * w;
  const rate = annualHours > 0 ? s / annualHours : 0;
  const nmw = 12.21;
  return (
    <CalcShell id="hourly" icon="Clock" title="Hourly Rate Calculator"
      description="Converts an annual salary into an effective hourly rate, and checks it against the National Living Wage."
      onReset={() => { setSalary(32000); setHours(37.5); setWeeks(52); }}
      inputs={<React.Fragment>
        <NumInput label="Gross annual salary" value={salary} onChange={setSalary} step={500} suffix="£" />
        <NumInput label="Contracted hours per week" value={hours} onChange={setHours} step={0.5} suffix="hrs" />
        <NumInput label="Paid weeks per year" value={weeks} onChange={setWeeks} step={1} hint="52 including paid holiday" />
      </React.Fragment>}
      result={<ResultPanel headline={gbp(rate)} sub="Effective hourly rate"
        rows={[
          ['Annual hours', annualHours.toFixed(1)],
          ['Daily (7.5 hrs)', gbp(rate * 7.5)],
          ['Weekly', gbp(rate * h)],
          ['Monthly', gbp(s / 12)],
          ['vs National Living Wage', rate >= nmw ? 'Above (' + gbp(nmw) + ')' : 'BELOW (' + gbp(nmw) + ')']
        ]}
        note={rate < nmw && rate > 0
          ? 'This rate is below the April 2025 National Living Wage of £12.21 for workers aged 21 and over. Check the contract and hours.'
          : 'National Living Wage from April 2025 is £12.21 for ages 21 and over. Lower rates apply to younger workers and apprentices.'} />}
      explanation={<React.Fragment>Salary ÷ (hours per week × paid weeks). Here: {gbp0(s)} ÷ ({h} × {w} = {annualHours.toFixed(1)} hours) = <strong>{gbp(rate)}</strong> per hour.</React.Fragment>} />
  );
}

/* ---------- 5. Statutory notice period ---------- */
function NoticeCalc() {
  const [years, setYears] = React.useState(4);
  const [months, setMonths] = React.useState(0);
  const y = Math.max(0, Number(years) || 0);
  const m = Math.max(0, Number(months) || 0);
  const totalMonths = y * 12 + m;
  let notice, basis;
  if (totalMonths < 1) { notice = 'None'; basis = 'Under one month of service'; }
  else if (totalMonths < 24) { notice = '1 week'; basis = 'One month to under two years'; }
  else { const wks = Math.min(Math.floor(totalMonths / 12), 12); notice = wks + ' weeks'; basis = 'One week per full year, capped at 12'; }
  return (
    <CalcShell id="notice" icon="CalendarClock" title="Notice Period Calculator"
      description="Statutory minimum notice an employer must give, based on continuous service."
      onReset={() => { setYears(4); setMonths(0); }}
      inputs={<React.Fragment>
        <NumInput label="Complete years of service" value={years} onChange={setYears} step={1} />
        <NumInput label="Additional months" value={months} onChange={setMonths} step={1} />
      </React.Fragment>}
      result={<ResultPanel headline={notice} sub="Statutory minimum employer notice"
        rows={[['Continuous service', y + ' yr ' + m + ' mth'], ['Total months', totalMonths], ['Basis', basis], ['Employee must give', totalMonths >= 1 ? '1 week minimum' : 'None']]}
        note="This is the statutory floor. Contractual notice is often longer and takes precedence when more generous. Notice rules do not apply to gross misconduct dismissals." />}
      explanation={<React.Fragment>Under one month: none. One month to under two years: one week. Two years or more: one week per complete year, capped at twelve. Here {totalMonths} months of service gives <strong>{notice}</strong>.</React.Fragment>} />
  );
}

/* ---------- 6. Employee cost (employer view) ---------- */
function EmployeeCostCalc() {
  const [salary, setSalary] = React.useState(35000);
  const [pension, setPension] = React.useState(3);
  const [extras, setExtras] = React.useState(1200);
  const s = Number(salary) || 0;
  const pensionPct = Number(pension) || 0;
  const secondaryThreshold = 5000;
  const employerNIRate = 0.15;
  const employerNI = Math.max(0, s - secondaryThreshold) * employerNIRate;
  const pensionCost = Math.max(0, s - 6240) * pensionPct / 100;
  const other = Number(extras) || 0;
  const total = s + employerNI + pensionCost + other;
  const uplift = s > 0 ? ((total / s - 1) * 100) : 0;
  return (
    <CalcShell id="cost" icon="Users" title="Employee Cost Calculator"
      description="The true annual cost of an employee to the business: salary plus employer National Insurance, pension and other costs."
      onReset={() => { setSalary(35000); setPension(3); setExtras(1200); }}
      inputs={<React.Fragment>
        <NumInput label="Gross annual salary" value={salary} onChange={setSalary} step={500} suffix="£" />
        <NumInput label="Employer pension contribution" value={pension} onChange={setPension} step={0.5} suffix="%" hint="Auto-enrolment minimum is 3% of qualifying earnings" />
        <NumInput label="Other annual costs" value={extras} onChange={setExtras} step={100} suffix="£" hint="Equipment, training, benefits, software licences" />
      </React.Fragment>}
      result={<ResultPanel headline={gbp0(total)} sub={'Total annual cost · ' + uplift.toFixed(1) + '% above salary'}
        rows={[
          ['Gross salary', gbp0(s)],
          ['Employer NI (15%)', '+' + gbp(employerNI)],
          ['Employer pension', '+' + gbp(pensionCost)],
          ['Other costs', '+' + gbp0(other)],
          ['Total cost', gbp0(total)],
          ['Monthly cost', gbp0(total / 12)]
        ]}
        note="Uses 2025/26 employer NI at 15% above the £5,000 secondary threshold, and pension on qualifying earnings above £6,240. Employment Allowance may reduce NI for eligible employers." />}
      explanation={<React.Fragment>Employer NI is 15% of salary above the £5,000 secondary threshold. Pension is {pensionPct}% of qualifying earnings above £6,240. Adding other costs: {gbp0(s)} + {gbp(employerNI)} + {gbp(pensionCost)} + {gbp0(other)} = <strong>{gbp0(total)}</strong>.</React.Fragment>} />
  );
}

/* ---------- 7. Overtime ---------- */
function OvertimeCalc() {
  const [rate, setRate] = React.useState(14.5);
  const [hours, setHours] = React.useState(6);
  const [multiplier, setMultiplier] = React.useState('1.5');
  const r = Number(rate) || 0, h = Number(hours) || 0, m = Number(multiplier) || 1;
  const otRate = r * m;
  const pay = otRate * h;
  return (
    <CalcShell id="overtime" icon="Timer" title="Overtime Calculator"
      description="Overtime pay at time-and-a-quarter, time-and-a-half or double time."
      onReset={() => { setRate(14.5); setHours(6); setMultiplier('1.5'); }}
      inputs={<React.Fragment>
        <NumInput label="Standard hourly rate" value={rate} onChange={setRate} step={0.25} suffix="£" />
        <NumInput label="Overtime hours worked" value={hours} onChange={setHours} step={0.5} suffix="hrs" />
        <SelInput label="Overtime multiplier" value={multiplier} onChange={setMultiplier}
          options={[{ value: '1', label: 'Standard rate (1×)' }, { value: '1.25', label: 'Time and a quarter (1.25×)' }, { value: '1.5', label: 'Time and a half (1.5×)' }, { value: '2', label: 'Double time (2×)' }]} />
      </React.Fragment>}
      result={<ResultPanel headline={gbp(pay)} sub="Overtime pay for this period"
        rows={[['Standard rate', gbp(r)], ['Overtime rate', gbp(otRate)], ['Hours', h], ['Premium above standard', gbp(pay - r * h)]]}
        note="There is no statutory right to a premium overtime rate in the UK — it depends on the contract — but average pay must not fall below the National Minimum Wage." />}
      explanation={<React.Fragment>Hourly rate × multiplier × hours. Here: {gbp(r)} × {m} = {gbp(otRate)} per hour, × {h} hours = <strong>{gbp(pay)}</strong>.</React.Fragment>} />
  );
}

/* ---------- 8. Payroll cost of a team ---------- */
function PayrollCalc() {
  const [employees, setEmployees] = React.useState(25);
  const [avgSalary, setAvgSalary] = React.useState(31000);
  const [pension, setPension] = React.useState(3);
  const n = Number(employees) || 0, avg = Number(avgSalary) || 0;
  const pensionPct = Number(pension) || 0;
  const salaryTotal = n * avg;
  const niTotal = n * Math.max(0, avg - 5000) * 0.15;
  const pensionTotal = n * Math.max(0, avg - 6240) * pensionPct / 100;
  const total = salaryTotal + niTotal + pensionTotal;
  return (
    <CalcShell id="payroll" icon="Banknote" title="Payroll Calculator"
      description="Total annual and monthly payroll cost for a whole team, including employer contributions."
      onReset={() => { setEmployees(25); setAvgSalary(31000); setPension(3); }}
      inputs={<React.Fragment>
        <NumInput label="Number of employees" value={employees} onChange={setEmployees} step={1} />
        <NumInput label="Average gross salary" value={avgSalary} onChange={setAvgSalary} step={500} suffix="£" />
        <NumInput label="Employer pension contribution" value={pension} onChange={setPension} step={0.5} suffix="%" />
      </React.Fragment>}
      result={<ResultPanel headline={gbp0(total)} sub={'Annual payroll cost · ' + gbp0(total / 12) + ' per month'}
        rows={[
          ['Salaries', gbp0(salaryTotal)],
          ['Employer NI', '+' + gbp0(niTotal)],
          ['Employer pension', '+' + gbp0(pensionTotal)],
          ['Total annual', gbp0(total)],
          ['Cost per employee', gbp0(n > 0 ? total / n : 0)]
        ]}
        note="A planning estimate using flat averages and 2025/26 employer rates. Real payroll varies with individual salaries, tax codes, benefits and Employment Allowance eligibility." />}
      explanation={<React.Fragment>Each employee costs their salary, plus 15% employer NI above £5,000, plus {pensionPct}% pension above £6,240. Multiplied across {n} employees at an average of {gbp0(avg)}: <strong>{gbp0(total)}</strong> a year.</React.Fragment>} />
  );
}

const CALCULATORS = [
  { id: 'bradford', name: 'Bradford Factor', icon: 'Activity' },
  { id: 'holiday', name: 'Holiday Entitlement', icon: 'Plane' },
  { id: 'salary', name: 'Salary & Take-Home', icon: 'Wallet' },
  { id: 'hourly', name: 'Hourly Rate', icon: 'Clock' },
  { id: 'notice', name: 'Notice Period', icon: 'CalendarClock' },
  { id: 'cost', name: 'Employee Cost', icon: 'Users' },
  { id: 'overtime', name: 'Overtime', icon: 'Timer' },
  { id: 'payroll', name: 'Payroll', icon: 'Banknote' }
];

function CalculatorsBody() {
  return (
    <React.Fragment>
      <PageHero eyebrow="Free Tools" title="HR Calculators That" highlight="Do The Maths For You"
        description="Eight everyday HR and payroll calculations, worked correctly and explained. Nothing you type is sent anywhere."
        primary="Get Started" secondary="Book a Demo"
        breadcrumbs={[{ label: 'Home', href: 'index.html' }, { label: 'Resources', href: 'resources.html' }, { label: 'Calculators' }]} />

      <Section subtle>
        <div className="grid-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {CALCULATORS.map(c => (
            <a key={c.id} href={'#' + c.id} style={{
              display: 'flex', alignItems: 'center', gap: 12, padding: '15px 17px',
              background: 'var(--surface-card)', border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)', textDecoration: 'none'
            }}>
              <Icon name={c.icon} size={18} style={{ color: 'var(--text-accent)' }} />
              <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-heading)' }}>{c.name}</span>
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <BradfordCalc /><HolidayCalc /><SalaryCalc /><HourlyCalc />
          <NoticeCalc /><EmployeeCostCalc /><OvertimeCalc /><PayrollCalc />
        </div>
        <div style={{
          marginTop: 32, padding: '18px 20px', display: 'flex', gap: 12, alignItems: 'flex-start',
          border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-md)', background: 'var(--surface-subtle)'
        }}>
          <Icon name="Info" size={17} style={{ color: 'var(--text-accent)', marginTop: 2 }} />
          <span style={{ fontSize: 13.5, lineHeight: 1.65, color: 'var(--text-body)' }}>
            These calculators use 2025/26 UK rates for England and Northern Ireland and are provided for guidance only. They are not tax, legal or financial advice — check figures against HMRC guidance or your accountant before acting on them. Scotland operates different income tax bands.
          </span>
        </div>
      </Section>

      <DemoCta />
    </React.Fragment>
  );
}

Object.assign(window, { CalculatorsBody, CALCULATORS, incomeTax, employeeNI, BradfordCalc, HolidayCalc, SalaryCalc, HourlyCalc, NoticeCalc, EmployeeCostCalc, OvertimeCalc, PayrollCalc });
