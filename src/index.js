const core = require('@actions/core')
const github = require('@actions/github')
const fetch = require('node-fetch')
const semver = require('semver')

const run = async () => {
  try {
    if (github.context.eventName !== 'pull_request') {
      core.info('Skipping as it is not pull request')
      return
    }

    const token = core.getInput('token')
    const headers = {}
    if (token) {
      headers.Authorization = `token ${token}`
    }
    const baseBranchName = core.getInput('base-branch-name') || 'main'

    const url = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/${baseBranchName}/package.json?token=${token}`
    const mainVersion = (await fetch(url, { headers }).then(res => res.json()))
      .version

    const localVersion =
      require(`${process.env.GITHUB_WORKSPACE}/package.json`).version

    if (!semver.valid(localVersion)) {
      core.setFailed(`Current version '${localVersion}' is invalid`)
    }

    if (localVersion === mainVersion) {
      core.setFailed(`Version '${localVersion}' is same as '${mainVersion}'`)
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
