# Technology and institutions

Status: realm knowledge/local adoption implemented in the current completion batch.
The invention table remains the consumer specification for physical equipment and
institutions. Learning and craft adapters continue in #40/#43; a known method
never creates a machine, castle, ship, school, weapon, or money by itself.

Initialized worlds use `technologyCapability`, `institutionalCapability` and
`constructionCapability` to check historical invention, actual realm knowledge,
prerequisites and local adoption. The previously explicit stone-keep discrepancy
is intentionally resolved in favour of the proposal: ordinary worlds discover
stone keeps no earlier than **AD 1080**. The old **AD 1070** calendar gate remains
only when no technology state was initialized (small legacy fixtures). The query
is pure; consumers still buy materials and complete paid construction.

Direct starts initialize inherited knowledge dated at least thirty years before
the opening year, with the established AD 850 methods always present. These are
opening conditions, with no prehistory ticks, random draws, or historical payment
records invented. Later settlements receive information about that inherited
knowledge and pay their actual local teaching cost before adopting it.

## The idea

The great inventions of the period arrive in every realm on their own, later than they did in history. A ruler who sponsors learning and trade brings them on time; a careless or unlucky one falls further behind. No realm gets an invention before its historical year.

| Realm | Arrives |
|---|---|
| Sponsors education, trades widely, keeps the peace | at the historical year, or a few years after |
| Left to itself | about a generation late (20–40 years) |
| Poor, isolated, at war, struck by plague | later still |

Each invention also reaches places one by one. A realm *knows* a technique first; each place *takes it up* when it pays there. Sponsored places get it first.

## How knowledge grows

Each day the realm gains learning from quantities it already has or will have:

- **Scholars:** literate clergy, monks and friars (#35), schoolmasters and masters at a university (#40), weighted by their number.
- **Contact:** foreign ships in port, fairs, merchants who travel abroad. Ideas came with trade.
- **Wealth:** towns, workshops and the surplus that pays for experiment.
- **Patronage:** what the crown and lords spend on schools, scholars' stipends, foreign masters invited, libraries. This is the lever the player holds.

**Timing.**
- An invention becomes discoverable at its historical year, provided its prerequisites are known.
- Each day after that, the chance of discovery grows with the realm's learning against a historical yardstick. A realm with that learning has a median arrival in the historical year; a realm with the unsponsored baseline has a median about 30 years later.
- Draws use the simulation's own random stream, so a save replays identically.
- Plague killing clerics, a sacked town or a burned library lower the learning that follows.

**Taking it up, place by place.** Once known, an invention spreads from where it first arrived, along roads and trade routes. Each place adopts it when the quantity says it pays:
- a windmill is built where grain must be ground and wind is steady, and the yield covers the cost;
- a household changes to the heavy plough when its oxen and its soil make the extra yield worth more than the team.

Guilds may slow a technique that threatens their members' trade. That cuts both ways, as it did historically.

**Starting later.** A world started in a later year (`&y=1250`) knows what history knew by then, minus the usual lag, so it isn't anachronistically advanced.

## The inventions

Years are the period's diffusion in north-western Europe. Effects say which existing quantity changes; none pins a price.

### Field and farm
| Invention | Year | Needs | Changes |
|---|---|---|---|
| Heavy mouldboard plough | known at 850 in the north; spreads to 1000 | — | Heavy clay soils become worth ploughing; yield on them rises; needs an ox team |
| Nailed horseshoe | 900 | — | Horses work stony ground and roads; carriage faster |
| Padded horse collar | 1000 | horseshoe | Horses can plough and haul; faster than oxen, dearer to feed (oats) |
| Three-field rotation | 1100 | heavy plough | Two thirds of the land in crop each year instead of half; oats and pulses; fallow grazing |
| Wheelbarrow | 1200 | — | Building and carting labour per load falls |

### Mills and making
| Invention | Year | Needs | Changes |
|---|---|---|---|
| Horizontal treadle loom | 1050 | — | Weavers' output per hand rises; cloth cheaper |
| Fulling mill | 1150 | watermill | Cloth finishing by water; wool towns grow at falls |
| Post windmill | 1185 | — | Mills where no river runs; flat and coastal places can grind their own |
| Treadwheel crane | 1225 | — | Stone building (walls, towers, churches) goes faster |
| Paper mill | 1280 | watermill | Writing cheaper; adds to learning |
| Spinning wheel | 1280 | loom | Yarn output per hand rises several times; more weavers employed |
| Blast furnace | 1350 | — | Iron cheaper and plentiful; tools, ploughshares, arms |

### Building and war
| Invention | Year | Needs | Changes |
|---|---|---|---|
| Crossbow | 1050 | — | Townsmen and militia hit harder; defence stronger |
| Stone keep | 1080 | — | Castles in stone; sieges longer |
| Gothic vault and buttress | 1140 | stone keep | Larger, lighter churches; prestige; masons' demand |
| Counterweight trebuchet | 1190 | — | Walls breach faster; besiegers gain |
| Concentric castle | 1280 | stone keep, trebuchet | Defence regains the lead |
| Longbow in mass | 1300 | — | Yeoman archers decide battles; levies matter more than knights |
| Gunpowder | 1330 | — | Early guns; little effect on walls |
| Plate armour | 1400 | blast furnace | Knights survive arrows; armour costly |
| Siege cannon | 1450 | gunpowder, blast furnace | Old walls fall in days; walls must thicken (bastions) |

### Sea and road
| Invention | Year | Needs | Changes |
|---|---|---|---|
| Stern-post rudder | 1200 | — | Larger ships steer; sea routes longer and safer |
| Cog | 1200 | rudder | Bulk cargo by sea; grain and wool trade |
| Magnetic compass | 1190 | — | Sailing in overcast and winter; fewer wrecks |
| Portolan charts | 1275 | compass | Sea routes shorter and surer |
| Canal pound lock | 1373 | — | Canals climb; inland water carriage |
| Carrack | 1450 | cog, compass | Ocean ships; long-distance trade |

### Money, law and learning
| Invention | Year | Needs | Changes |
|---|---|---|---|
| Roman law revived | 1100 | — | Written law; royal courts stronger (#37) |
| University | 1150 | — | A great source of learning; masters and students (#40) |
| Arabic numerals (algorism) | 1202 | — | Reckoning faster; merchants' and stewards' errors fall |
| Bill of exchange | 1250 | numerals | Merchants pay at a distance without carrying coin (#38) |
| Spectacles | 1290 | — | Scholars and craftsmen work later in life; more learning |
| Mechanical clock | 1300 | — | Town clocks; the working day reckoned by hours |
| Double-entry bookkeeping | 1340 | numerals, bill of exchange | Merchant houses and stewards keep honest accounts; less leakage |
| Quarantine | 1377 | — | Plague spreads less between ports |
| Printing press | 1450 | paper mill | Learning grows far faster; books cheap |

## The player's levers

- **Patronage of learning:** a yearly sum from the crown or a lord to schools, a university, scholars' stipends and libraries. A journaled command.
- **Founding:** a school, a university (#40), or endowing a monastery's school (#35).
- **Inviting masters:** pay a foreign master to bring a known technique. That shortens its adoption at one place, not its discovery.
- **Peace and trade:** contact and wealth come from roads, ports and fairs.

## Shown to the player

- **A Learning view in the court panel:** what is known, what is discoverable now and how near it is, the yearly learning by source, and where each known technique has been taken up.
- **The annals:** for example, "The first windmill in Ormaine turns at Becville, in the spring of 1191."
- **The advisor** reads all of this through `game:panel` and `game:state`.

## Fitting the game's rules

- **Things happen because a quantity makes them worth doing.** Discovery depends on learning; adoption depends on profit at each place. No year forces adoption.
- **No price fixing.** Effects change yields, labour per unit, carrying cost and build time; prices follow.
- **Determinism.** Draws use the simulation's random stream, and patronage is a journaled command.
- **Performance:**
  - Learning and eligible adoption are decided daily inside the existing production phase.
  - Actor indices hold only local prospective teachers and merchants; eligibility validates actual living, present, supported people.
  - Each place visits its sparse ready-method set; discovery visits only pending methods.
  - Effects are factors on quantities the day already computes.
  - Actual cargo, ship and lord arrivals convey known methods; there is no daily place × road × invention search.
- **Worker and screen.** Technology state lives in the worker's world. The screen and the advisor see projected fields and panel reads.

## Recorded decisions and remaining consumers

- No invention before its historical date; all query paths enforce that date.
- Knowledge is realm wide; local uptake and patronage favour actual places.
- Losing teachers/buildings removes subsequent learning. Previously acquired
  realm knowledge is retained; it does not depend on a decorative library.
- Ordinary decisions are daily. Market days, terms, rent and tax dates remain
  meaningful calendar events in their own systems.
- Benedictine rules are available in the early AD 850 opening. AD 910 refers to
  Cluny, not the invention of Benedictine monasticism; `benedictine910` is a
  backwards-compatible alias. Augustinian adoption starts AD 1100 and Cistercian
  granges AD 1128. Accepted Cistercian-first founding remains the abbey adapter's
  policy, separate from capability.
- Guild resistance uses actual sold-work claims and chest-funded named writing
  and authority licence receipts before a finite local ordinance delays new
  machines. Existing paid equipment keeps operating; knowledge and prices do
  not change.

See [TECHNOLOGY-RUNTIME.md](TECHNOLOGY-RUNTIME.md) for the source contracts,
phase order, equipment/payment requirements and exact remaining consumer list.
The timing formula now operates on actual staffing/contact and daily receipts;
the root runner must calibrate the historical lag with the combined native
institution tests. Passing the small fixture does not assert a calibrated realm.
