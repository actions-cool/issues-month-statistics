const core = require('@actions/core');
const github = require('@actions/github');
const { Octokit } = require('@octokit/rest');

const { doMonthStatistics } = require('./util');

async function run() {
  try {
    const ctx = github.context;
    const { owner, repo } = ctx.repo;
    const labels = core.getInput('labels');
    const assignees = core.getInput('assignees');
    await doMonthStatistics(owner, repo, labels, assignees);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
