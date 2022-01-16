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
      core.info('Using specified token')
      headers.Authorization = `token ${token}`
    }

    console.log(token)

    const url = `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/main/package.json?token=${token}`
    const mainVersion = (await fetch(url, { headers }).then(res => res.json()))
      .version
    console.log(mainVersion)

    // const mainVersion = await execute(
    //   'git',
    //   ['show', `origin/main:package.json`],
    //   getVersion
    // )
    const localVersion =
      require(`${process.env.GITHUB_WORKSPACE}/package.json`).version

    if (!semver.valid(localVersion)) {
      core.setFailed(`Current version '${localVersion}' is invalid`)
    }
    if (!semver.gt(localVersion, mainVersion)) {
      core.setFailed(
        `Version '${localVersion}' is not greater than '${mainVersion}'`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
