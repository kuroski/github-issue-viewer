import { Button, Flex, Menu, MenuButton, MenuItemOption, MenuList, MenuOptionGroup } from "@chakra-ui/react"
import { flow, pipe } from "fp-ts/function"
import { useEffect, useState } from "react"

import { Visibility, visibilityDecoder } from "@/lib/decoders/issue"
import { IssueType, issueTypeDecoder } from "@/lib/decoders/issueFilter"
import { IssueFilter } from "@/lib/decoders/issueFilter"

type FiltersProps = {
  globalFilter: IssueFilter,
  onChange: (value: Omit<IssueFilter, 'state'>) => void
}

const Filters = (props: FiltersProps) => {
  const [type, setType] = useState<IssueType>(props.globalFilter.type || 'created')
  const [visibility, setVisibility] = useState<Visibility>(props.globalFilter.visibility || 'all')

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

  useEffect(() => {
    props.onChange({
      type,
      visibility
    })
  }, [type, visibility])

  return (
    <Flex gap="2">
      <Menu closeOnSelect={false}>
        <MenuButton as={Button} colorScheme='blue'>
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

      <Menu closeOnSelect={false}>
        <MenuButton as={Button} colorScheme='blue'>
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
    </Flex>
  )
}

export default Filters
