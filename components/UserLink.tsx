import { Text } from "@chakra-ui/react"

import { User } from "@/lib/decoders/issue"

type UserLinkProps = {
  user: User,
  children?: React.ReactNode
}

const UserLink = (props: UserLinkProps) => {
  return <Text fontWeight="bold" display="inline-flex">
    {props.children}
  </Text>
}

export default UserLink
