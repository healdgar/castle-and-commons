# Actual patrons and compound chests

A compound is a native collection of paid components, connections and rights. It
has no purse. `compoundPatronRecipient` resolves its current registered owner:
a gift to a Castle, College or private estate reaches its actual Crown/great-house
account; a gift to an abbey reaches its existing `abbey:N` corporate account. Gone,
detached, unknown or dead-holder references cannot receive patronage. Giving to
your own account is refused because the coin is already there.

`compoundPatronQuote` reads the living named donor, actual account and full
available coin without initializing prices, ledgers, land, roads or heads.
`compoundPatronGift` uses the native `transfer` under **compound patron
endowment**, then `unearned` for the recipient. Actual cash and running books
record the capital movement; it is not recurring income or an ecclesiastical
assessment base. The quote rejects an insufficient purse instead of letting
`transfer` clip the gift. No goods, workers, rights or construction progress are
created or copied.

Construction turns that available capital into sustained local demand: successive
paid components buy real timber and stone, pay builders and use the existing
merchant and transport economy. Recipients can spend their earnings through the
ordinary household and craft mechanisms. Funding remains a transfer from a real
patron, not newly created income for the realm or a guaranteed multiplier. Supply,
prices, food and other commitments can delay or prevent a campaign. Later upkeep
and rebuilding must arise from actual asset needs through the same ownership and
payment rules.

The current labour measure remains abstract: project progress follows the paid
fraction of its recipe's daily labour bill. Recipients are actual eligible heads,
but `buildWorks` reserves no shared person-day capacity across projects, upkeep
and ordinary craft work. Several employers may therefore pay the same builder
on the same day. The dependency audit records this as #80: a common deterministic
daily allocation needs an explicit recipe work unit before it can represent
finite attendance. Consolidating those consumers can also reuse their native
worker selection, rather than searching and dividing each bill independently.
This next phase must retain actual named payments and paid project progress;
it supplies no established economic multiplier or browser speedup yet.

The current player consumer is `abbey-gift`, with the exact journal payload
`donorHouse:abbeyId:amount`. Worker policy and the simulation both check the
explicit named donor against the current ruler. The Crown may give to any living
realm religious house; a lord may give to its own foundation or one in its
current manor. The religious card and the Crown/lord **Religious foundations**
panel offer 100, 500 and 1,000 gold presets, with live purse and refusal text.
The native order also accepts an exact finite positive decimal amount. Neither
render timing nor speed decides the amount or recipient. The established worker
journal records the command once, and normal replay gives it again on its day.

This supplies the accepted give-to-an-abbey control. Generic Castle, College and
Estate use is verified at the shared service; this phase adds no extra UI for
moving a ruler's money between its own accounts. There is no automatic top-up,
forced borrowing or construction reserve exemption. Separately patron-assisted
native gates retain the same actual materials, wages, admissions, food, crop,
industry and unfinished-save criteria as the unassisted gate. The original
frozen `af07d28` underfunded day720 outcome remains recorded as such.

The single light native-source fixture `tools/compound-patron-gifts.test.mjs`
passes ten checks. Generated-world command/save, worker and construction
continuation gates belong to the serialized release runner. No daily phase,
realm people scan, new stored account or presentation authority object is added.
