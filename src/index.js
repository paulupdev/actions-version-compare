const core = require('@actions/core')
const github = require('@actions/github')
const exec = require('@actions/exec')
const fetch = require('node-fetch')
const semver = require('semver')

const execute = async (command, flags, cb) => {
  let result = ''
  const options = {}
  options.listeners = {
    stdout: data => {
      result += data.toString()
    },
  }

  await exec.exec(command, flags, options)
  return cb(result)
}

const getVersion = res => JSON.parse(res).version

const run = async () => {
  try {
    if (github.context.eventName !== 'pull_request') {
      core.info('Skipping as it is not pull request')
      return
    }

    const mainVersion = (
      await fetch(
        `https://raw.githubusercontent.com/${github.context.repo.owner}/${github.context.repo.repo}/main/package.json?token=GHSAT0AAAAAABKWJI6V2GQB4ZTA6ET7FGJCYPMX2TQ`
      ).then(res => res.json())
    ).version

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
    if (!semver.gt(localVersion, version)) {
      core.setFailed(
        `Version '${localVersion}' is not greater than '${mainVersion}'`
      )
    }
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
