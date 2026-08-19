# Dependency Review status

The GitHub Dependency Review workflow is intentionally disabled while this private repository lacks the GitHub Dependency Graph capability required by `actions/dependency-review-action`.

The action otherwise produces a permanent false-failure on every pull request before it can evaluate a dependency diff. Product CI, secret scanning, `npm audit`, Pi boundary validation, and Workers build checks remain enabled.

Restore dependency review by enabling the required GitHub security capability for this repository, then reintroduce the workflow. See issue #41.
