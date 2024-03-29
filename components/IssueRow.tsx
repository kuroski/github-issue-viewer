import { AvatarGroup, Box, Flex, Heading, Link, Text, Tooltip } from "@chakra-ui/react";
import { ChatBubbleIcon, CheckCircledIcon, CircleIcon, CommitIcon, DotFilledIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";
import Trans from "next-translate/Trans";
import useTranslation from "next-translate/useTranslation";

import OpenIcon from "@/components/OpenIcon";
import TooltipAvatar from "@/components/TooltipAvatar";
import UserLink from "@/components/UserLink";
import { IssueDecoder } from "@/lib/decoders/issue";
import { dateTimeFormat } from "@/lib/utils";

type IssueSubtitleProps = IssueDecoder
const IssueSubtitle = (props: IssueSubtitleProps) => {
  const { t } = useTranslation('common')
  const date = dateTimeFormat({ day: 'numeric', month: 'short', year: 'numeric' })

  if (props.state === "open") {
    return (
      <Text color="gray" fontSize="sm">
        <Trans
          i18nKey="common:issue_subtitle_open"
          components={[<UserLink user={props.user} key="user" />, <br key="break" />]}
          values={{
            repo: props.repository.fullName,
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
        components={[<UserLink user={props.user} key="user" />, <br key="break" />]}
        values={{
          repo: props.repository.fullName,
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
  const { t } = useTranslation('common')
  const [orgName, repoName] = props.issue.repository.fullName.split('/')
  return (
    <Flex alignItems="center" gap="2" data-testid={`issue-${props.issue.id}`}>
      <>
        {props.issue.state === "open" && (
          <Tooltip label={t('open_issue')} openDelay={500}>
            <OpenIcon data-testid="issue-open-icon" />
          </Tooltip>
        )}
        {props.issue.state === "closed" && (
          <Tooltip label={t('closed_issue')} openDelay={500}>
            <Box color="purple.500" alignSelf="flex-start">
              <CheckCircledIcon data-testid="issue-closed-icon" width="24" height="24" />
            </Box>
          </Tooltip>
        )}


        <Flex flex="1" direction="column" gap="1">
          <Heading as="h3" size="sm">
            <Link href={props.issue.htmlUrl} _hover={{ color: "blue.500" }}>{props.issue.title}</Link>
          </Heading>
          <IssueSubtitle {...props.issue} />
        </Flex>

        <Flex alignSelf="flex-start" alignItems="center" gap="6">
          {props.issue.pullRequest && (
            <Link
              href={props.issue.pullRequest.htmlUrl}
              target="_blank"
              _hover={{ color: "blue.500" }}
              display="flex"
              alignItems="center"
              gap="1"
              data-testid={`issue-pull-request-${props.issue.id}`}
            >
              <CommitIcon />
            </Link>
          )}
          {props.issue.assignees && (
            <AvatarGroup size='xs' max={3} data-testid={`issue-assignees-${props.issue.id}`}>
              {props.issue.assignees.map((assignee) => (
                <TooltipAvatar key={assignee.id} name={t('assigned_to', { user: assignee.login })} as={Link} src={assignee.avatarUrl} href={assignee.htmlUrl} target="_blank" />
              ))}
            </AvatarGroup>
          )}
          {props.issue.comments > 0 && (
            <Link
              href={props.issue.htmlUrl}
              _hover={{ color: "blue.500" }}
              display="flex"
              alignItems="center"
              gap="1"
            >
              <ChatBubbleIcon />
              {props.issue.comments}
            </Link>
          )}
        </Flex>
      </>
    </Flex>
  )
}

export default IssueRow
