<p align="center">
  <a href="">
    <img width="140" src="https://avatars.githubusercontent.com/u/73879334?s=200&v=4" />
  </a>
</p>

<h1 align="center">📅 Issues Month Statistics</h1>

<div align="center">
Create a issue to show month statistics by GitHub Actions
</div>

![](https://img.shields.io/github/workflow/status/actions-cool/issues-month-statistics/CI?style=flat-square)
[![](https://img.shields.io/badge/marketplace-issues--month--statistics-blueviolet?style=flat-square)](https://github.com/marketplace/actions/issues-month-statistics)
[![](https://img.shields.io/github/v/release/actions-cool/issues-month-statistics?style=flat-square&color=orange)](https://github.com/actions-cool/issues-month-statistics/releases)

## 🚀 How to use?

At 1 o'clock on the 1st of each month, an issue is generated for the statistics of the previous month.

```
name: Issue Month Statistics

on:
  schedule:
    - cron: "0 1 1 * *"

jobs:
  month-statistics:
    runs-on: ubuntu-latest
    steps:
      - name: month-statistics
        uses: actions-cool/issues-month-statistics@v1
        with:
          count-lables: true
          count-comments: true
          emoji: '+1, -1'
          labels: '1, 2'
          assignees: '1'
```

| Param | Desc  | Type | Required |
| -- | -- | -- | -- |
| token | Action Token | string | ✖ |
| labels | The labels for the new issue | string | ✖ |
| assignees | The assignees for the new issue | string | ✖ |
| count-lables | Whether the new issue count labels | string | ✖ |
| count-comments | Whether the new issue count comments | string | ✖ |
| emoji | Add emoji for the new issue | string | ✖ |

- The new issue title defaults to `[Current repo] Month Statistics: Year-Month`
- `count-lables`: You can set `'true'` to add labels statistics
- `count-comments`: You can set `'true'` to add comments statistics

### emoji types

| content | emoji |
| -- | -- |
| `+1` | 👍 |
| `-1` | 👎 |
| `laugh` | 😄 |
| `confused` | 😕 |
| `heart` | ❤️ |
| `hooray` | 🎉 |
| `rocket` | 🚀 |
| `eyes` | 👀 |

## ⚡ Feedback

You are very welcome to try it out and put forward your comments. You can use the following methods:

- Report bugs or consult with [Issue](https://github.com/actions-cool/issues-month-statistics/issues)
- Submit [Pull Request](https://github.com/actions-cool/issues-month-statistics/pulls) to improve the code

也欢迎加入 钉钉交流群

![](https://github.com/actions-cool/resources/blob/main/dingding.jpeg?raw=true)

## Changelog

[CHANGELOG](./CHANGELOG.md)

## LICENSE

[MIT](./LICENSE)
