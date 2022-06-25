import { Box, ColorProps, Flex, Heading, Link, Text } from "@chakra-ui/react";
import { CheckCircledIcon, CircleIcon, DotFilledIcon, DotIcon, Link1Icon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import Trans from "next-translate/Trans"
import useTranslation from "next-translate/useTranslation";

import { IssueDecoder } from "@/lib/decoders/issue";
import { dateTimeFormat } from "@/lib/utils";

import UserLink from "./UserLink";

type IssueSubtitleProps = IssueDecoder
const IssueSubtitle = (props: IssueSubtitleProps) => {
  const { t } = useTranslation('common')
  const date = dateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric' })

  if (props.state === "open") {
    return (
      <Text color="gray" fontSize="sm">
        <Trans
          i18nKey="common:issue_subtitle_open"
          components={[<UserLink user={props.user} key="user" />]}
          values={{
            number: props.number,
            date: date.format(props.createdAt),
            user: props.user.login,
          }}
        />
      </Text>
    )
  }

  if (!props.closedAt) {
    console.error('No `closedAt` property provided')
    return <></>
  }

  return (
    <Text color="gray" fontSize="sm">
      <Trans
        i18nKey="common:issue_subtitle_close"
        components={[<UserLink user={props.user} key="user" />]}
        values={{
          number: props.number,
          date: date.format(props.closedAt),
          user: props.user.login,
        }}
      />
    </Text>
  )
}

type IssueRowProps = {
  issue: IssueDecoder
}

const IssueRow = (props: IssueRowProps) => {
  return (
    <Flex alignItems="center" gap="2">
      <>
        {props.issue.state === "open" && (
          <Box position="relative" color="green.500" alignSelf="flex-start">
            <CircleIcon width="24" height="24" />
            <DotFilledIcon style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }} width="16" height="16" />
          </Box>
        )}
        {props.issue.state === "closed" && (
          <Box color="purple.500" alignSelf="flex-start">
            <CheckCircledIcon width="24" height="24" />
          </Box>
        )}


        <Flex flex="1" direction="column" gap="1">
          <Heading as="h3" size="sm">
            <NextLink href={{ pathname: "/issues/:id" }} passHref>
              <Link>{props.issue.title}</Link>
            </NextLink>
          </Heading>
          <IssueSubtitle {...props.issue} />
        </Flex>

        <Link href={props.issue.url} target="_blank">
          <Link1Icon />
        </Link>
      </>
    </Flex>
  )
}

export default IssueRow
