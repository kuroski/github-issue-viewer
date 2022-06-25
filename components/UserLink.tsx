import { Avatar, Button, Flex, Link, Popover, PopoverArrow, PopoverBody, PopoverCloseButton, PopoverContent, PopoverFooter, PopoverHeader, PopoverTrigger, Portal, Text } from "@chakra-ui/react"
import { Link1Icon } from "@radix-ui/react-icons"
import useTranslation from "next-translate/useTranslation"

import { User } from "@/lib/decoders/issue"

type UserLinkProps = {
  user: User,
  children?: React.ReactNode
}

const UserLink = (props: UserLinkProps) => {
  const { t } = useTranslation('common')
  return <Popover trigger="hover" openDelay={500}>
    <PopoverTrigger>
      <Link href={props.user.htmlUrl} fontWeight="bold" display="inline-flex">
        {props.children}
      </Link>
    </PopoverTrigger>
    <Portal>
      <PopoverContent width="auto" px="2">
        <PopoverArrow />
        <PopoverBody>
          <Flex alignItems="center" direction="row" gap="4">
            <Avatar name={props.user.login} src={props.user.avatarUrl} />
            <Text fontWeight="bold">{props.user.login}</Text>
          </Flex>
        </PopoverBody>
        <PopoverFooter px="0">
          <Button size="sm" as={Link} href={props.user.htmlUrl} target="_blank" display="flex" alignItems="center" gap="2">
            {t('profile')}
            <Link1Icon />
          </Button>
        </PopoverFooter>
      </PopoverContent>
    </Portal>
  </Popover>
}

export default UserLink
