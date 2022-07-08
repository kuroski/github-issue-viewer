import { Button, Flex, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from "@chakra-ui/react"
import { flow } from "fp-ts/function"
import { useEffect, useState } from "react"

import { Filter, filterArrayValueDecoder, IssueType, issueTypeDecoder } from "@/lib/decoders/filter"
import { Visibility, visibilityDecoder } from "@/lib/decoders/issue"
import { Org } from "@/lib/decoders/org"
import { Repo } from "@/lib/decoders/repo"

type FiltersProps = {
  orgs: Org[],
  repos: Repo[],
  globalFilter: Filter,
  onChange: (value: Omit<Filter, 'state'>) => void
}

const Filters = (props: FiltersProps) => {
  const [type, setType] = useState<IssueType>(props.globalFilter.type || 'created')
  const [visibility, setVisibility] = useState<Visibility>(props.globalFilter.visibility || 'all')
  const [orgs, setOrgs] = useState<string[]>(props.globalFilter.orgs?.flatMap((f) => !!f ? [f] : []) || [])
  const [repos, setRepos] = useState<string[]>(props.globalFilter.repos?.flatMap((f) => !!f ? [f] : []) || [])

  const filterText = {
    'created': "Created",
    "assigned": "Assigned",
    "mentioned": "Mentioned"
  }[type]
  const visibilityText = {
    'all': "Visibility",
    "public": "Public repositories only",
    "private": "Private repositories only"
  }[visibility]
  const orgsText = orgs.length > 0 ? `${orgs.length} orgs` : 'Orgs'
  const reposText = repos.length > 0 ? `${repos.length} repos` : 'Repos'

  function selected() {
    props.onChange({
      type,
      visibility,
      repos
    })
  }

  return (
    <Flex gap="2">
      <Menu closeOnSelect={false} onClose={selected}>
        <MenuButton as={Button}>
          {filterText}
        </MenuButton>
        <MenuList minWidth='240px'>
          <MenuOptionGroup type='radio' value={type} onChange={flow(issueTypeDecoder.parse, setType)}>
            <MenuItemOption value='created'>Created</MenuItemOption>
            <MenuItemOption value='assigned'>Assigned</MenuItemOption>
            <MenuItemOption value='mentioned'>Mentioned</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      <Menu closeOnSelect={false} onClose={selected}>
        <MenuButton as={Button}>
          {visibilityText}
        </MenuButton>
        <MenuList minWidth='240px'>
          <MenuOptionGroup type='radio' value={visibility} onChange={flow(visibilityDecoder.parse, setVisibility)}>
            <MenuItemOption value='all'>Visibility</MenuItemOption>
            <MenuItemOption value='public'>Public repositories only</MenuItemOption>
            <MenuItemOption value='private'>Private repositories only</MenuItemOption>
          </MenuOptionGroup>
        </MenuList>
      </Menu>

      {props.orgs.length > 0 && (
        <Menu closeOnSelect={false} onClose={selected}>
          <MenuButton as={Button}>
            {orgsText}
          </MenuButton>
          <MenuList minWidth='240px'>
            <MenuOptionGroup type='checkbox' value={orgs} onChange={flow(visibilityDecoder.parse, setVisibility)}>
              {props.orgs.map((org) => (
                <MenuItemOption key={org.id} value={org.login}>{org.login}</MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}

      {props.repos.length > 0 && (
        <Menu closeOnSelect={false} onClose={selected}>
          <MenuButton as={Button}>
            {reposText}
          </MenuButton>
          <MenuList minWidth='240px' maxH="50vh" overflow="scroll">
            <MenuOptionGroup type='checkbox' value={repos} onChange={flow(filterArrayValueDecoder.parse, setRepos)}>
              {props.repos.map((repo) => (
                <MenuItemOption key={repo.id} value={repo.fullName}>{repo.fullName}</MenuItemOption>
              ))}
            </MenuOptionGroup>
          </MenuList>
        </Menu>
      )}
    </Flex>
  )
}

export default Filters
