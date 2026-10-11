# Funded learning (#40)

The first operative slice is local parish, cathedral and abbey schooling.
Universities, scholars' travel/board, colleges and paid noble tutors are the next
slice; this document does not claim those unfinished mechanisms are present.

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

Next: four supported masters forming a learned university through actual local
adoption; real travelling scholars retaining family links; paid board and lodging
at existing residences/inns or abbey ranges; university teaching and graduate
placement; funded tutors/colleges. These require actual capacity and recipients,
not assumed resident counts or a date-derived university label.
