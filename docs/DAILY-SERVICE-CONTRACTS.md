# Service work and later payment (#80)

Read-only dependency audit of held candidate `bc15442` on 11 October 2026.
This record precedes the remaining service refactor. It does not claim that the
current game has finite attendance for all services. The first attendance slice
and its boundaries are recorded in [DAILY-LABOUR.md](DAILY-LABOUR.md).

Cash settlement, physical work and actual workers must be connected before a
service enters daily attendance. A month's fee or livery is not one day's work.
The allocator begins after the clock advances, spans all 59 phases, and clears
in `finally`. Actual unfinished duties and named payables belong to saved native
contracts; derived daily rosters and used-time scratch do not.

| Source | What happens now | Dependency before allocating attendance |
|---|---|---|
| `craftWork` → `_poolBy` → `payCrafts` | The buyer pays into a trade pool; the market later selects current heads by `craftWeight`. No service-day worker is retained. | Define the service quantity and fulfilled order first. A delayed payable must retain the actual worker, payer, place, service day and amount; later settlement pays that worker. |
| Monthly `provision` | Thirty days of goods, sundries and service margins are accounted on the place's market day. | Keep the period-sales/obligation abstraction until actual service quantities and workers are defined. Do not retroactively reserve thirty elapsed days or convert the whole fee into market-day attendance. |
| `governmentBoard` | Actual grain is purchased and eaten for a named person's daily meal, then cook/brewer fees enter the monthly pool. | This is a concrete daily service with delayed settlement: select a present cook/brewer and claim real meal-service work when provided; retain the named payable. Define unavailable/self-service behavior explicitly. |
| Monthly provision's `pay2` → `payAmong` | A share of household surplus is transferred to selected poor heads as service/day-hire, without a task or quantity. | Either retain a named historical monthly obligation or introduce an actual service order with worker, task, quantity, date/span and remaining obligation. Money alone supplies none of those work units. |
| Hall `tickDomains` → `liveries`/`payAmong` | Selected households receive monthly food in kind and coin. There is no saved domestic appointment or duty day. | A finite domestic service needs an actual appointment/term, daily duties and named fee accrual. Preserve food consumption and avoid paying the in-kind component twice. |
| `watchPay`/`payWatch` | Garrison is a numeric count; monthly payment chooses poorer young heads. Crown `_watchOwed` accrues daily, but no post roster/duty is saved. | Introduce native named guard appointments and a duty schedule before claiming attendance. Monthly payroll settles the actual schedule; it cannot retrospectively choose a different worker. |
| `hostPay`/`soldiersPay` with `a.men` | Actual army members receive service pay through spouse/parent/head account proxies, with arrears. Deployed people are already excluded from ordinary work. | Service identity is the actual living member, not the household receiving payment. Preserve away/role exclusions; any local daily duty uses the member's attendance, never a second proxy worker. |
| Host pay without `a.men` | Cash is distributed to local young heads without a named service roster. | A physical host requires actual native membership/appointments first. A fallback cash distribution cannot establish who served. |

The smallest coherent continuation is to join real daily board work to named
delayed payables, then model guard and domestic appointments. Historical market
and retainer settlement dates can remain scheduled. The remaining aggregate
payments must stay explicitly classified until their work quantities and actors
exist. No new generic labour ledger, pretend employee, automatic wage conversion
or second income source is required.

Live presence, death, travel and employment must be checked when duty is
performed. A retained roster may reuse canonical identities; it may not cache
availability. Current `payCrafts` and `tradeCounts` do not enforce the same
presence conditions as the covered physical consumers. These omissions remain
#80, alongside the immediate-effect and aggregate-staffing contracts in the
attendance record.

Verification for this continuation must exercise an actual day of service and
later named settlement, competing physical work, absence/death between service
and pay, food-in-kind conservation, real member versus payroll proxy, and native
save continuation of unfinished duties/payables. It must preserve the same
history at every speed and across worker/reference execution. This audit ran no
worlds or tests and supplies no completion or performance evidence.
