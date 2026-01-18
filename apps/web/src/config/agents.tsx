export type Agent = {
  name: string
  logo?: string
  link: string
}

export const SUPPORTED_AGENTS: Agent[] = [
  {
    name: 'Claude Code',
    logo: '/brands/claude-code.svg',
    link: 'https://claude.com/product/claude-code',
  },
  {
    name: 'Cursor',
    logo: '/brands/cursor.png',
    link: 'http://cursor.com/',
  },
  {
    name: 'Copilot',
    logo: '/brands/github-copilot.png',
    link: 'https://github.com/features/copilot',
  },
  {
    name: 'Gemini CLI',
    logo: '/brands/gemini-cli.svg',
    link: 'https://geminicli.com/',
  },
  {
    name: 'Windsurf',
    logo: '/brands/windsurf.png',
    link: 'http://windsurf.com/',
  },
  {
    name: 'Trae',
    logo: '/brands/trae.svg',
    link: 'http://trae.ai/',
  },
  {
    name: 'Factory Droid',
    link: 'https://factory.ai/',
  },
  { name: 'Letta', link: 'https://www.letta.com/' },
  {
    name: 'OpenCode',
    logo: '/brands/opencode.svg',

    link: 'https://opencode.ai/',
  },
  {
    name: 'Codex',
    logo: '/brands/codex.png',
    link: 'https://openai.com/codex/',
  },
  { name: 'Antigravity', link: 'https://antigravity.google/' },
  { name: 'Amp', link: 'http://ampcode.com/' },
  { name: 'Kilo Code', link: 'https://kilo.ai/' },
  { name: 'Roo Code', link: 'https://roocode.com/' },
  {
    name: 'Goose',
    logo: '/brands/goose.png',
    link: 'https://goose.ai/',
  },
  { name: 'Qoder', link: 'https://qoder.com/' },
]
