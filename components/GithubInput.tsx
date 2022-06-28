import { Box, Input, useDisclosure } from "@chakra-ui/react"
import { ChangeEvent, useState } from "react"

import { trpc } from "@/lib/trpc"

type Trigger = {
  command: string
}

type GithubInputProps = {}

const GithubInput = (props: GithubInputProps) => {
  const { data } = trpc.useQuery(['github.repos.list'], {
    retry: 0,
    refetchOnWindowFocus: false
  })
  const { isOpen, onToggle, onClose, onOpen } = useDisclosure({
    defaultIsOpen: false
  })

  const triggers = [
    {
      command: 'repo:',
      triggered: (value: unknown) => {
        console.log({ event: 'triggered', value })
      },
      changed: (value: unknown) => {
        console.log({ event: 'changed', value })
      }
    }
  ]

  function changed(e: ChangeEvent<HTMLInputElement>) {
    console.log(e)
    if (!isOpen) {
      onOpen()
    }
  }

  function focused() {
    if (!isOpen) {
      onOpen()
    }
  }

  return <Box>
    <Input type="search" onChange={changed} onFocus={focused} onBlur={onClose} />
    {isOpen && <Box>
      {triggers.map(({ command }) => command)}
    </Box>}
  </Box>
}

export default GithubInput
