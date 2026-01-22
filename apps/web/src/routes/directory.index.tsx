import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowUpRightIcon, DownloadIcon, PlusIcon, SearchIcon, SparkleIcon } from 'lucide-react'
import { useDebouncer } from '@tanstack/react-pacer'
import { useState } from 'react'
import { convexQuery } from '@convex-dev/react-query'
import { api } from '../../convex/_generated/api'
import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from '@/components/ui/empty'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/components/ui/input-group'

import { CodeBlockCommand } from '@/components/code-block-command'
import directory from '../directory.json'
import { zodValidator } from '@tanstack/zod-adapter'
import { z } from 'zod'
import { Badge } from '@/components/ui/badge'

export const Route = createFileRoute('/directory/')({
  component: App,
  validateSearch: zodValidator(
    z.object({
      repoSearch: z.string().optional(),
      skillSearch: z.string().optional(),
    }),
  ),
  loaderDeps: ({ search: { repoSearch, skillSearch } }) => ({
    repoSearch,
    skillSearch,
  }),
  loader: async ({ deps: { repoSearch, skillSearch }, context }) => {
    let allSkills = await context.queryClient.ensureQueryData(
      convexQuery(api.stats.getAllSkills, {})
    )

    let featuredRepos = [...directory]

    if (repoSearch) {
      const query = repoSearch.toLowerCase()
      featuredRepos = featuredRepos.filter(
        (repo) =>
          repo.name.toLowerCase().includes(query) ||
          repo.description.toLowerCase().includes(query) ||
          repo.author.toLowerCase().includes(query),
      )
    }

    if (skillSearch) {
      const query = skillSearch.toLowerCase()
      allSkills = allSkills.filter(
        (skill) =>
          skill.name.toLowerCase().includes(query) ||
          (skill.repo?.toLowerCase().includes(query) ?? false),
      )
    }

    return {
      featuredRepos,
      allSkills,
      searchParams: { repoSearch, skillSearch },
    }
  },
  head: () => ({
    meta: [
      {
        title:
          'Skills Directory · Agent Skills for Claude, Cursor, Copilot, and 13 more',
      },
      {
        name: 'description',
        content:
          'Browse the official directory of AI agent skills. Find and install skills for Claude Code, Cursor, Copilot, Windsurf, Gemini CLI, and 11 more AI coding tools via the flins CLI.',
      },
      // Open Graph
      {
        property: 'og:title',
        content:
          'Skills Directory · Agent Skills for Claude, Cursor, Copilot, and 13 more',
      },
      {
        property: 'og:description',
        content:
          'Browse the official directory of AI agent skills. Find and install skills for Claude Code, Cursor, Copilot, Windsurf, Gemini CLI, and 11 more AI coding tools via the flins CLI.',
      },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://flins.tech' },
      { property: 'og:image', content: 'https://flins.tech/og.png' },
      { property: 'og:site_name', content: 'flins' },
      // Twitter Card
      { name: 'twitter:card', content: 'summary_large_image' },
      {
        name: 'twitter:title',
        content:
          'Skills Directory · Agent Skills for Claude, Cursor, Copilot, and 13 more',
      },
      {
        name: 'twitter:description',
        content:
          'Browse the official directory of AI agent skills. Find and install skills for Claude Code, Cursor, Copilot, Windsurf, Gemini CLI, and 11 more AI coding tools via the flins CLI.',
      },
      { name: 'twitter:image', content: 'https://flins.tech/og.png' },
      { name: 'author', content: 'flinstech' },
      { name: 'robots', content: 'index, follow' },
    ],
    links: [
      {
        rel: 'canonical',
        href: 'https://flins.tech',
      },
    ],
    scripts: [
      {
        type: 'application/ld+json',
        children: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'SoftwareApplication',
          name: 'flins',
          description:
            'Browse the official directory of AI agent skills for flins. Install skills for Claude Code, Cursor, Copilot, Windsurf, Gemini CLI, and 11 more AI coding tools from one unified CLI.',
          url: 'https://flins.tech',
          applicationCategory: 'DeveloperApplication',
          operatingSystem: 'macOS, Linux, Windows',
          offers: {
            '@type': 'Offer',
            price: '0',
            priceCurrency: 'USD',
          },
          author: {
            '@type': 'Organization',
            name: 'flins',
            url: 'https://github.com/flinstech',
          },
          keywords: [
            'skills directory',
            'agent skills',
            'Claude Code skills',
            'Cursor skills',
            'Copilot skills',
            'AI coding agents',
            'Windsurf skills',
            'Gemini CLI skills',
            'Trae skills',
            'Factory Droid skills',
            'Letta skills',
            'OpenCode skills',
            'Codex skills',
            'Antigravity skills',
            'Amp skills',
            'Kilo Code skills',
            'Roo Code skills',
            'Goose skills',
            'Qoder skills',
            'AI developer tools',
            'skills manager',
            'CLI',
            'flins',
          ],
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: '5',
            ratingCount: '1',
          },
        }),
      },
    ],
  }),
})

function App() {
  const { allSkills, searchParams } = Route.useLoaderData()
  const navigate = useNavigate({ from: Route.fullPath })
  const [skillSearchInput, setSkillSearchInput] = useState(
    searchParams.skillSearch ?? ''
  )

  const updateSearch = (params: Partial<typeof searchParams>) => {
    navigate({
      search: (prev) => ({ ...prev, ...params }),
      resetScroll: false,
    })
  }

  const debouncedSkillSearch = useDebouncer(
    (skillSearch: string | undefined) => updateSearch({ skillSearch }),
    { wait: 300 }
  )

  const clearSkillFilters = () => {
    setSkillSearchInput('')
    updateSearch({ skillSearch: undefined })
  }

  return (
    <>
      <main className='w-full'>
        <div className="max-w-7xl min-h-80 justify-center h-full mx-auto border-x border-b flex flex-col relative">
          <PlusIcon
            aria-hidden="true"
            className="absolute text-neutral-300 z-10 top-0 left-0 -translate-x-1/2 -translate-y-1/2"
          />
          <PlusIcon className="absolute text-neutral-300 z-10 top-0 right-0 translate-x-1/2 -translate-y-1/2" />
          <PlusIcon className="absolute text-neutral-300 z-10 bottom-0 left-0 -translate-x-1/2 translate-y-1/2" />
          <PlusIcon className="absolute text-neutral-300 z-10 bottom-0 right-0 translate-x-1/2 translate-y-1/2" />

          <div className="p-8">
            <h1 className="text-4xl">
              Browse Skills Directory
            </h1>
            <p className="text-zinc-400 max-w-2xl mt-1 mb-4">
              Discover and install curated skills for your AI development
              workflow
            </p>

            <InputGroup className="h-12 px-2 gap-2">
              <InputGroupInput
                aria-label="Search skills"
                placeholder="Search skills..."
                type="search"
                value={skillSearchInput}
                onInput={(e) => {
                  const value = e.currentTarget.value
                  setSkillSearchInput(value)
                  debouncedSkillSearch.maybeExecute(value || undefined)
                }}
              />
              <InputGroupAddon>
                <SearchIcon aria-hidden="true" />
              </InputGroupAddon>
            </InputGroup>
          </div>

          {allSkills.length > 0 ? (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 divide-x divide-y border-y">
              {allSkills.map((skill) => (
                <div key={skill.name} className="p-8">
                  <div className='flex items-center gap-1'>
                    {skill.isFeatured && (
                      <Badge variant="outline">
                        <SparkleIcon />
                        featured
                      </Badge>
                    )}
                    <Badge variant="outline">{skill.type}</Badge>
                  </div>
                  <div className="flex gap-2 mt-1 mb-4 justify-between items-center">
                    <h3 className="text-lg">
                      {skill.sourceUrl ? (
                        <a
                          className="flex items-center gap-1 group"
                          href={skill.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {skill.name}
                          <ArrowUpRightIcon className="opacity-0 size-4 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                        </a>
                      ) : (
                        skill.name
                      )}
                    </h3>
                    <div className="flex items-center text-sm text-muted-foreground gap-2">
                      <DownloadIcon className="size-3" />
                      {skill.downloads.toLocaleString()}
                    </div>
                  </div>
                  {skill.repo && (
                    <CodeBlockCommand skill={skill.isFeatured && skill.featuredName ? skill.featuredName : skill.repo} />
                  )}
                </div>
              ))}
            </section>
          ) : (
            <div className="p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <SearchIcon />
                  </EmptyMedia>
                  <EmptyTitle>No skills found</EmptyTitle>
                  <EmptyDescription>
                    Try adjusting your search
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button onClick={clearSkillFilters}>Clear filters</Button>
                </EmptyContent>
              </Empty>
            </div>
          )}
        </div>
      </main>
    </>
  )
}
