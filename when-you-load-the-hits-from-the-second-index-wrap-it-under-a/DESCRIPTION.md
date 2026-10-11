# When you load the hits from the second index, wrap it under a new InstantSearch instantiation so it has a sepa…

When you load the hits from the second index, wrap it under a new InstantSearch instantiation so it has a separate search state.  On the main/parent InstantSearch, you can use onSearchStateChange to capture any refinements being applied from your refinementList.  When refinements are applied, you can save those facet refinement as a state and pass them into a Configure widget inside the second InstantSearch wrapper.

**Original sandbox:** https://codesandbox.io/s/hopeful-borg-4vdjc

This folder is an export of that sandbox. See the sandbox's own `README.md` (if present) for setup notes; typically `npm install && npm start`.
