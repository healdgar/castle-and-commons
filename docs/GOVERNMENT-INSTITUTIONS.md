# Government institutions

This behaviour phase adds native government business at the existing justice
boundary. The model changes history intentionally. It uses simulation days,
real accounts, named existing officials and the shared learning/adoption
capability seam. Heavy release validation is the coordinator's next gate.

## Jurisdiction and business

- A hundred is a market town and its nearest villages. Its monthly sitting
  reviews native pending loan business and asks the existing manor courts to
  hear real pleas. A living lettered local head serves as bailiff. His service
  is paid from the actual local courts' receipts, reducing their net receipts.
  No sitting creates a debt or salary merely because its date arrives.
- The shire sheriff hears existing road-duty neglect monthly, and existing
  unpursued robbery presentments at the twice-yearly tourn. Detailed cases
  clear only after their actual ruling; felony evidence remains for the eyre.
  A real lettered household holds the office and earns funded service fees.
  Unfilled funded clerk/sheriff/bench demand is recorded as a native vacancy
  for the learning/schooling system; no proficient worker is fabricated.
- Once a closed year provides actual net sheriff receipts, a funded willing
  officer may farm that stream for its observed yield. His household receives
  the subsequent actual court receipts and owes the customary farm annually.
  Payment preserves the family's subsistence; unpaid farm remains an arrear.
  A merger follows the existing household account. An extinct farmer's debt
  is discharged and recorded rather than charged to an unrelated replacement.
- The capital bench receives an actual recoverable old native loan only when
  the creditor's expected recovery exceeds the writ, travel and board. The
  plaintiff buys a writ, travels along a real native route, remains through
  the next monthly sitting and buys actual capital board. The court transfers
  the debtor's surplus to the real creditor, reduces the original loan, and
  pays a living justice. Unfunded hearings adjourn; no personal debt is
  invented or assigned to an unrelated heir.
- Registered land pledges reach `creditJudgement` at their actual maturity.
  A funded local court pays its named officials, conveys the secured parcel's
  ownership, pays any value above the debt to its actual owner, and reduces
  the same registered claims. The parcel's native working right is retained.
- `benchLandPlead` receives recoverable registered rent-charge arrears with an
  explicit claimant, adverse account, contract evidence and actual amount.
  A funded monthly bench sitting recovers real surplus and updates that same
  charge. General disputes between competing land titles remain additional
  historical detail; consensual sales and inheritances create no such plea.

Court staffing uses the same native employment eligibility as the later
government offices. New and retained officers must be present, lettered heads
at their actual seat. Religious members, paid servants or keepers, teachers,
active students/apprentices and employed journeymen cannot hold a second court
job. An independent household craft remains eligible; assigning an office
refreshes the actual work rosters so that its holder no longer works a second
shift. Stewards and clerks retain their matching office and house, rather than
swapping a stale incumbent into another vacancy. Candidate quotes change no
office or financial record. Only a funded sitting/pledge judgement or royal
appointment releases a replaced holder's exact office-and-employer markers;
another institution's reassigned office and its contracts remain intact.

## Attendance and consent

An estate summons sets a notice period and a three-week sitting. Lord
attendance weighs the actual royal obligation shortfall, local threat,
confidence and travel cost, or follows the player's journaled attend/decline
policy. A lord uses the exact existing notable (or its existing `fp` alias),
never a new resident. Native traveller records carry an explicit lord actor
kind and NID. They set `h.at` only on simulation arrival and retain the actual
return journey. Death cancels the same actor. No resident population is added.
A destination banner reads only projected residence; its drawing moves no coin.

Boroughs pay named resident burgesses' actual customary attendance wages from
their own chest when they can fund the whole commitment. The member travels
and buys actual bread and craft service at the capital. Visiting lords buy
board from their own house purse; the next hall budget deducts those actual
board bills. Their seat's servants remain at the seat.

`governmentMeals` runs after actual abbey hospitality and before population/household meals. It reads already-scheduled actual lord arrivals/stays and existing bench/burgess visits, never commissions a new journey or sitting. A remote non-lord guest must retain its real return leg at the host; outbound transit, cancelled travel, death and the return date grant no destination meal. An actual current-day person receipt records only food consumed from the named payer's purchased stock. Partial school, abbey, government and cargo meals fill the same single person need. Home household provisioning/eating and the exact travelling head's own-seat hall deduct that food, including local hosted meals; no proxy retinue travels or eats at the host. Late justice still decides authoritative arrival/return, fees, hearings and consent. Early tournament and military cargo consumers use the same receipt. This intentionally corrects same-day food timing without changing native identities.

Before parliament is learned/adopted, the ruler can order a subsidy. Once it
is available, the weighted deterministic votes of actual attending lords and
burgesses decide. A refusal or a sitting with no eligible attendees creates
no tax grant. Votes weigh threat, war, loyalty/legitimacy, the requested rate,
recent grants, hunger and unrest. No dice decide consent.

## Tax assessment and obligation books

A grant records its requested rural rate (towns one half more, the customary
fifteenth/tenth relationship), real place due dates and a one-year assessment
term. Each place is assessed once at its next annual tenure day, by a named
collector. Actual household coin, owned animals and held/sale goods are valued
at local prices. Coin collection preserves a family's next month's bread and
rent. The shortfall remains a real named household obligation; collection
fees come from coin actually received.

The annual due date is the earliest assessment day. If no present eligible
collector exists then, the same uncompleted assessment checks again each day
until its real grant expiry. It neither waits another month nor reassesses a
completed place; old saved `retry` backoff values grant no delay or early tax.

The persistent obligation map is created by assessments, not a polling census.
Quarter-day recoveries follow native single-household mergers. Extinct estates
are discharged explicitly. Thus assessed wealth reconciles to collected coin,
remaining arrears and recorded discharges. Completed grant books do not assess
again. Only twelve recent grant books remain; older totals are aggregated and
unpaid references coalesce without dropping their principal. Session and
judgement rolls use the existing bounded roll mechanism.

## Charters

A commune purchases the actual delegated market-toll and local court-profit
stream, not other owners' rents, grain or private debts. Its farm is the last
closed observed delegated yield. The town offers an entry year's farm only
when its current actual receipts project a yield exceeding that farm and the
entry cost, and its real chest can fund the entry. The lord accepts a useful
fixed farm plus entry, or the player orders the offer. Tolls, local court fines
and court fees then reach the native town chest; original private creditors
and due principals retain their accounts. Annual farm payments go to the town's
actual current lord. Unpaid amounts remain in its contract and bounded roll.

A village's existing market-trade and road/river/harbour conditions are reviewed
daily in growth, before housing and town proposals. The native weekly-market
charter changes its actual town/layout classification once; annual population,
building-peak and history quantities keep their original reckoning dates. This
market right precedes the distinct purchased fee-farm commune.

An existing commune reviews its present mayor daily. Actual delegated receipts
must support the annual farm and the household's customary service fee; town
coin must retain the full farm and arrears before paying one day's real service.
The saved pay date prevents a second payment that day. A funded replacement
releases only the former mayor's exact town office and refreshes native work
rosters. Absence or another held job prevents service; a mayor assigned to
another town retains that town's marker and receives no pay here. A genuinely
funded vacant office records demand for learning, without creating a worker.
The farm itself still transfers only on its annual contractual anniversary.
Mayor pay dates and totals remain worker fiscal/job data, outside visual geometry.

## Controls and reads

Journaled commands are `c-estates`, `c-subsidy-rate`, `s-charter`, `h-attend` and
`h-stay`. Ruler ownership checks remain authoritative in the simulation. The
worker builds the government accounts, consent and charter views. Advisor
`state: estates` reads a bounded stored report. Read-only views appoint no
people, populate no person index and change no financial state.

Light fixtures cover cash conservation, actual movables, one-time assessment,
true due dates, denied/no-attendee consent, household merger/extinction,
existing-notable travel/arrival/return/death, real charter finance, native loan
writ/recovery, sheriff service/farm and read-only accounts. Full native
speed/RNG, worker, world-save and goods conservation gates remain the serialized
release runner's responsibility. The 15 light fixtures pass in 0.8953 child CPU
seconds, load 0.111/0.072/0.038 before and 0.263/0.104/0.049 after (cloud host).

The focused royal/court staffing regression passes all 28 checks, including
new and retained native employment conflicts, observational selection,
compatible office reuse, exact replacement markers, actual work-roster
invalidation and conserved fees. Its final run used 3.47 CPU seconds on the
cloud host (load 0.17 before and 0.07 after). This is an intended staffing/history
correction; the coordinator's native release gates still cover the assembled
model.

The daily charter/collector/mayor slice passes 22 focused government checks in
1.65 CPU seconds (cloud host, load 0.00 before and after). These preserve actual
annual obligations, cash conservation, native actor identity and readonly
visual records. Midyear promotion uses the captured native layout callback;
the coordinator still owns generated-world, save/speed and release validation.
