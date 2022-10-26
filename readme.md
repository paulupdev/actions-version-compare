# GitHub Action to make sure

Fails if version in current branch is not valid or if not different than base branch.

Add it as a step to a job in a GitHub Action as follows:

```yaml
jobs:
  basic-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: /version-compare@main
        with:
          # token only required if private repo
          token: ${{ secrets.GITHUB_TOKEN }}
          # base-branch-name only required if not "main"
          base-branch-name: 'main'
```
