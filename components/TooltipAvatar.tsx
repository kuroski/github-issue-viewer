import { Avatar, Tooltip } from "@chakra-ui/react"

const TooltipAvatar: typeof Avatar = (props) =>
  <Tooltip label={props.name}>
    <Avatar {...props} />
  </Tooltip>

export default TooltipAvatar
