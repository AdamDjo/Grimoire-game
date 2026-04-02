/** @type {import('@commitlint/types').UserConfig} */
const config = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      ['feat', 'fix', 'chore', 'docs', 'refactor', 'test'],
    ],
    'body-max-line-length': [0],
    'no-claude-co-authored-by': [2, 'always'],
  },
  plugins: [
    {
      rules: {
        // Block Claude auto-generated Co-Authored-By lines (noreply@anthropic.com)
        'no-claude-co-authored-by': ({ raw }) => {
          if (!raw) return [true]
          const lines = raw.split('\n')
          for (const line of lines) {
            if (
              /^Co-Authored-By:/i.test(line.trim()) &&
              /noreply@anthropic\.com/i.test(line)
            ) {
              return [
                false,
                `Claude auto-generated Co-Authored-By is forbidden (see CLAUDE.md): "${line.trim()}"`,
              ]
            }
          }
          return [true]
        },
      },
    },
  ],
}

module.exports = config
