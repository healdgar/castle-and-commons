# Crafts, apprenticeship and guilds

Issue #43 uses native residents, households, work rooms and corporate accounts.
Existing opening craftsmen inherit their actual trade and occupied or leased
workshop. Nobody arrives with a new purse or a second family.

Daily craft decisions follow paid learning and local technology uptake at the
start of `tickEconomy`, before production. `peoplePrepare` must already have
prepared the native person index and household accounts. `craftIndex` retains
local candidates, trade groups and measured rooms by native population revision
and year. It scans no other settlement. `W.apprentices` contains only active
native person IDs; the completed contract remains on the person.

- A seven-year apprenticeship is an explicit contract custom. It names a living
  local master; the family pays that master's premium. Family apprentices pay
  no one twice. Days of actual master work and a present pupil accrue service and
  hand skill; Sunday and absence do neither. Completion requires both service
  and achieved skill. A dead or departed master ends the contract without a
  fabricated qualification or refund. Mature workers may retrain only when the
  actual alternative occupation would pay substantially better.
- Independent masters have a real sound work room and pay its actual owner for
  any separate workshop lease. New entry requires achieved ability, affordable
  guild entry and rent, and an income that can repay these costs. Native
  residential `capOf` is unchanged; `craftRoomCapacity` measures work benches.
- Journeymen are existing qualified native household heads. A master hires only
  when his recorded actual receipts and measured benches can support the
  worker's bread and foregone earnings. Daily actual wages set `paidDay` and a
  worked fraction. Monthly `payCrafts` credits independent shops, with paid
  hands affecting their share; hired people receive no second independent
  share. A missing room or purse closes the actual employment.
- `institutionalJobHeld(p)` excludes actual teaching, enrolled study, clerical,
  estate, abbey, apprentice and employee contracts from a second full job.
  Independent masters remain available to native construction employers.
  `buildWorks` records only the actual net receipts of its named workers.
- Guilds require locally adopted merchant/craft-guild knowledge. A charter is
  worthwhile when the native trade's income dilution exceeds each master's
  actual share of its price. Masters fund a zero-start corporate chest, which
  pays the actual lord or chartered commune and a named literate writer. The
  licence custom is six months' bread per founder; writing uses the writer's
  actual foregone-work cost. No crown subsidy or prosperity stamp remains.
- A new entrant pays one year's measured income dilution to the chest. Explicit
  charter ordinances allow one apprentice per master and quality of 0.35 KCr;
  quarterage is 1/48 of actual sold work. These are in-world customs, rather
  than price remedies. No guild fixes goods prices. Quarterly searches fine
  only actual members with actual sold work below that quality ordinance.
- Every 90 days the actual chest pays needy members, recorded member burials,
  the parish fund, real guildhall rent/upkeep and goods and services for a
  feast. Feast drink is purchased and consumed; ordinary family bread remains
  a single native household meal. An empty membership transfers its remaining
  cash to its parish or actual lord before dissolution.

`craftState`, `craftPlaceHTML` and `craftGuildsHTML` are read-only worker reports.
The journaled `s-guild` command permits or refuses an actual charter purchase
without granting a free institution. Private simulation fields are `W.guilds`,
`W.apprentices`, `W._craftDay`, settlement `guildIds`, `guildPolicy`, `_craftIndex`,
`_craftOpening`, building `craftMasters`, and person `craft`/`apprentice`. Reports
return scalar receipts and native IDs, never account or people graphs.

The [physical machine adapter](EQUIPMENT-RUNTIME.md) now binds native smith and
weaver processing to actual master rooms and today's paid journeyman fractions.
Available native household members provide cottage weaving. Actual military,
foreign, outlaw and religious roles cannot continue their previous private
workshop work. Paid installed machinery changes working capacity only when its
actual inputs and operator exist. Guild resistance to particular machines now uses a funded actual local
ordinance; knowledge by itself installs no equipment.

Light evidence: inline JavaScript syntax and `tools/guilds.test.mjs`, six focused
fixtures covering real premiums/wages, takings and chest conservation, measured
entry/dilution, paid quality searches, exclusivity and pure reads. Root alone
runs the combined source, projection, replay and economic gates. Trade history
changes intentionally from the old instant trade switch and foreign-master
premium; it remains independent of browser speed and rendering.

Daily apprenticeship recruitment now prepares one ephemeral ordered roster of
actual working masters. Working-day, room, guild and existing slot checks are
reused during that one decision; each actual commission immediately consumes
its native slot. Each candidate's head and available purse are read once while
its alternatives are quoted. Trade incomes are reused only within the same
synchronous decision; teacher cost is refreshed if the native trade-count
record is first initialized. The roster is never saved or used across phases.
Native trade/master/pupil order and comparisons are unchanged. The focused
reference-loop fixture verifies the same contracts and transfers with a filled
guild slot and fewer master-working calculations. Root owns the whole-history
identity proof and actual CPU measurement; this local evidence claims no
century-per-minute throughput.

A prospective loom/wheel/fulling, furnace/hammer or saw installation can prompt
the actual affected trade guild to petition. Only living local masters with
actual sold-work receipts supply an income-dilution case. A real chest must pay
a named literate writer for one actual working day and its real lord or commune
for a licence. The writer holds an exclusive native office until the next day.
The paid custom is one year; its licence must cover the greater of one month's
bread per master or the authority's assessed five-percent foregone output
revenue. The authority refuses a prohibition of its own commissioned equipment.
No purse, writer, measured loss or affordable worthwhile petition means no rule.
A purchased ordinance delays new installations of that particular method at that
place. Already paid machines and commissioned recipes keep working. Deaths,
expiry, dissolution or changed local authority stop the restriction. Local
sovereign `s-machine ...:allow` can repeal it; no command grants a free ban or
changes knowledge or goods prices. The actual petition receipts and finite rule
are reported in the guild view.

Additional worker-only state is guild `machinePetitions`, `machineWriting`,
`machineLicences`, `ordinances.machines`, settlement `guildMachinePolicy`, and
person `guildWriting`. These are actual account/office and licence records.
