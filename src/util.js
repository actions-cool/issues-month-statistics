const core = require('@actions/core');
const { Octokit } = require('@octokit/rest');
var dayjs = require('dayjs');
var utc = require('dayjs/plugin/utc');
dayjs.extend(utc);

const { dealStringToArr } = require('actions-util');
const token = core.getInput('token');
const octokit = new Octokit({ auth: `token ${token}` });

const perPage = 100;

async function doMonthStatistics(owner, repo, labels, assignees) {
  const countLables = core.getInput('count-lables');
  const countComments = core.getInput('count-comments');

  const thisMonth = dayjs.utc().month() + 1;
  const year = thisMonth == 1 ? dayjs.utc().year() - 1 : dayjs.utc().year();

  const month = getPreMonth(thisMonth);
  const showMonth = month < 10 ? `0${month}` : month;

  let issues = await getIssuesInMonth(owner, repo, thisMonth);
  if (issues.length == 0) {
    core.info(`Actions: [query-issues-${month}] empty!`);
    return false;
  }
  issues = issues.filter(i => {
    return getCreatedMonth(i.created_at) == month;
  });
  let total = issues.length;
  let totalIssues = [...issues];
  let openTotal = 0;
  let openIssuesNumber = [];
  let closeTotal = 0;
  let closeIssuesNumber = [];
  let labelsTotals = [];
  const title = `[${owner}/${repo}] Month Statistics: ${year}-${showMonth}`;
  for (let i = 0; i < issues.length; i++) {
    if (issues[i].state == 'closed') {
      closeTotal += 1;
      closeIssuesNumber.push(issues[i].number);
    } else if (issues[i].state == 'open') {
      openTotal += 1;
      openIssuesNumber.push(issues[i].number);
    }
    if (countLables && issues[i].labels) {
      issues[i].labels.forEach(l => {
        if (l.name in labelsTotals) {
          labelsTotals[l.name] += 1;
        } else {
          labelsTotals[l.name] = 1;
        }
      });
    }
  }
  let now = dayjs().utc().format('YYYY-MM-DD HH:mm:ss');
  let body = `
- Created time: ${now}

- Time base: UTC +0
`;
  let totalShow = `
### Count

| Total | Open | Closed |
| -- | -- | -- |
| ${total} | ${openTotal} | ${closeTotal} |

`;

  body += totalShow;

  if (countLables == 'true') {
    let labelsArr = [];
    for (var lab in labelsTotals) {
      labelsArr.push({
        labelName: lab,
        number: labelsTotals[lab],
      });
    }
    labelsArr.sort((a, b) => b.number - a.number);
    let labelsTitle = `
### Labels statistics

<table>
<tr>
<th>Name</th>
<th>Number</th>
</tr>`;
    let labelsBody = '';
    labelsArr.forEach(it => {
      labelsBody += `<tr><td>${it.labelName}</td><td>${it.number}</td></tr>`;
    });
    body =
      body +
      labelsTitle +
      labelsBody +
      `</table>

`;
  }

  if (countComments == 'true') {
    totalIssues.sort((a, b) => b.comments - a.comments);
    const maxComments = totalIssues.slice(0, 3);
    let commentTitle = `
### Most comments

<table>
<tr>
<th>#</th>
<th>Issue</th>
<th>Title</th>
<th>Number</th>
<th>State</th>
</tr>
`;
    let commentBody = '';
    maxComments.forEach((it, ind) => {
      commentBody += `<tr>
<td>${ind + 1}</td>
<td>${it.number}</td>
<td>${it.title}</td>
<td>${it.comments}</td>
<td>${it.state}</td></tr>`;
    });
    body = body + commentTitle + commentBody + '</table>';
  }

  await doCreateIssue(owner, repo, title, body, labels, assignees);
}

async function getIssuesInMonth(owner, repo, thisMonth, page = 1) {
  const month = getPreMonth(thisMonth);
  let { data: issues } = await octokit.issues.listForRepo({
    owner,
    repo,
    state: 'all',
    per_page: perPage,
    page,
  });
  issues = issues.filter(i => {
    return i.pull_request === undefined;
  });
  if (issues.length && getCreatedMonth(issues[issues.length - 1].created_at) >= month) {
    issues = issues.concat(await getIssuesInMonth(owner, repo, thisMonth, page + 1));
  }
  return issues;
}

function getPreMonth(m) {
  return m == 1 ? 12 : m - 1;
}

function getCreatedMonth(d) {
  return dayjs(d).utc().month() + 1;
}

async function doCreateIssue(owner, repo, title, body, labels, assignees) {
  let params = {
    owner,
    repo,
    title,
    body,
    labels: dealStringToArr(labels),
    assignees: dealStringToArr(assignees),
  };

  const { data } = await octokit.issues.create(params);
  core.info(`Actions: [create-issue][${title}] success!`);
  // core.setOutput('issue-number', data.number);

  const contents = core.getInput('emoji');
  if (contents) {
    await doCreateIssueContent(owner, repo, data.number, dealStringToArr(contents));
  }
}

async function doCreateIssueContent(owner, repo, issueNumber, contents) {
  if (contents.length) {
    contents.forEach(async item => {
      if (testContent(item)) {
        await octokit.reactions.createForIssue({
          owner,
          repo,
          issue_number: issueNumber,
          content: item,
        });
        core.info(`Actions: [create-reactions][${item}] success!`);
      }
    });
  }
}

module.exports = {
  doMonthStatistics,
};
