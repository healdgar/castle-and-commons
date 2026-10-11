# Funded learning (#40)

Local parish, cathedral and abbey schooling, four-master universities and
travelling scholars with actual destination board/lodging are operative. Paid
college construction and noble tutors are the next slice.

## Actual actors and cash

A school requires a surveyed sound church room or the abbey adapter's completed
classroom, an actual present skilled adult household head, and named native
pupils. `W.schools` owns the roll, master contract and actual receipts. A classroom
creates no residential capacity. `a.school.schoolId` binds an abbey's completed
classroom to that one school record; it does not copy teachers or pupils.

Families compare existing local merchant/reeve earnings and actual funded
unfilled government business with fees and foregone work. Government vacancy
fees are an opportunity estimate, never a guaranteed salary or a credited
receipt. Daily teacher cost covers the named master's native family's bread and
foregone trade. Tuition follows that actual cost and willing pupils. Families
retain next month's bread and native rent; lords retain their chest reserve.

`transfer(family,master,fee,'schooling',s)` and an actual owner's optional school
stipend are the only school receipts. A family's shared purse is quoted once
across siblings, so the same money is not promised twice. Unsupported masters,
ruined/removed rooms and lost funding close the school and restore the master's
previous ordinary trade/office. Siege suspends tuition and teaching. Temporary
absences do not invent delivered lessons. Sunday maintains living support but
has no classroom lesson.

Letters, reckoning, scripture and law rise from actual paid delivered lessons,
bounded by the living master's actual skills and the pupil's native ability.
Yearly `educate` retains ordinary bodily/craft/husbandry practice and inherited
opening skills, but after day zero grants no unpaid book skills from settlement
size or dates. Graduation records achieved qualifications on the same native
person; ordinary funded office recruitment still chooses and pays candidates.

## Daily order and interfaces

`tickLearning` runs once each simulation day at the beginning of `tickEconomy`,
after native people/households/ownership preparation and before `tickTechnology`.
It caches local eligible people by native folk revision/year, commissions funded
real rooms and updates active rolls. Tuition reaches native purses before
ordinary food provision. `technologyRecordTeaching` consumes successful receipt
amounts once, then this day's technology update sees supported native masters.

`abbeySchoolEligibility(a,s)` is a pure read returning
`{available,reason,master,pupils,annualFees,annualTeachingCost}`. Before the abbey
builds it quotes the proposed 12×8 hall solely as a classroom; commissioning
still waits for an actual paid completed building. The quote reads prepared
native household accounts, never creates a household, teacher, room or receipt.
Supported religious teachers include actual monks, nuns and Augustinian canons;
actual abbots, abbesses and priors remain eligible sources of knowledge.

The journaled `s-school` command sets an owning ruler's annual stipend allowance
(`si:annualGold`). Each day's support is paid only to a commissioned named master;
unspent coin stays with the owner. The court Learning tab, settlement card and
adviser `game:state {path:'learning'}` report actual records without mutation.

`school`, `schoolIds`, `schoolAllowance` and `_learningIndex` are private
settlement simulation fields. `W.schools`, person `study`, `schoolMaster` and
`schoolTrade` are native simulation data, not a second drawn population. School
DTOs contain ids/receipts rather than the corporate graph or building references.

## Evidence and continuation

The single focused `tools/learning.test.mjs` file checks real-room eligibility,
actual tuition/stipend conservation, paid lesson skills, once-daily execution,
Sunday, bread/rent protection, truthful closure, pure reads, post-opening removal
of unsupported calendar education, and actual graduate qualifications. Root's
serialized native worker/replay/economy gates remain necessary before release.

Next: paid college classrooms/residential buildings and native noble tutors;
abbey scholar board requires an explicit contract admitted by native abbey home
allocation, with member/corrody capacity honored. No hall acquires invented room.

## Universities and visiting scholars

`learningUniversityQuote` requires actual local university knowledge/adoption,
a working real school room, four named skilled native heads, willing enrolled
older pupils, and tuition/stipends covering all four families' bread and foregone
work. Commission expands that one school's teacher company; it does not add a
new building or population. Each teacher receives his own real share through
`transfer`, and has his own dated payment contract. The company is announced
only after four actual paid contracts exist. Losing a master or room stops the
company's teaching. The existing classroom's measured desk capacity is retained;
masters teach different classroom periods, sharing the daily lesson fraction.

Local indexed prospective scholars consider the nearest actual supported
university. Before route/survey work, their family must afford a ninety-day term;
expected real lettered earnings must exceed tuition, board and foregone work.
The term is an explicit academic cadence, not a computation batching interval.
Actual road errand records and `p.away` carry departure, arrival and return. The
person stays on the native home roll and in the same stable family account.

Existing sound inns/hospitals supply lodging only when native `capOf` capacity
is available after resident households and named active scholar reservations.
Those same reservations are deducted by native `houseFolk`; no independent
housing total is introduced. Abbey-owned ranges remain unavailable until the
abbey's admission policy admits a real board contract. Actual room rent goes to
the current prepared property owner, meal service only to an actual resident
cook/brewer/baker, and food is purchased from the destination's actual sellers
and consumed through native custody. Neither absent meals nor absent teachers
produce lessons. The fraction actually eaten at destination is subtracted from
that same family's native home food need, avoiding double consumption.

Ruined/lost/crowded lodgings, a siege, unaffordable board or a finished term send
the real scholar home through an actual return journey. Scholar arrays contain
native ids, not invented guests. `W.schoolLodgings` lists only actual buildings
with reservations, so daily cleanup does not scan the world's building stock.
The university report exposes named masters, real board/rent receipts and actual
graduate counts as a pure DTO. Added focused cases cover four separate paid
masters, unavailable-master closure, family-retaining journeys, destination food
and rent, exactly one home absence, and room-loss return without skill gain.
