@AGENTS.md

## How this site was built

This is a pixel-faithful rebuild of a Framer marketing site, reverse-engineered
from the running page rather than from a design export. Geometry, colour and
motion were measured off the live site — not eyeballed, and not taken from Figma.

If you are extending or fixing it, read **[docs/agent-playbook.md](docs/agent-playbook.md)**
first. It covers the measure-then-build loop, the probe scripts, the Framer
behaviours that are invisible to naive DOM inspection, and a catalogue of traps
that have already cost time here — including several that make working code look
broken.

The one rule that matters most: **never write a value you did not measure.**
