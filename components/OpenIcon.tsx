import { Box, forwardRef } from "@chakra-ui/react"
import { CircleIcon, DotFilledIcon } from "@radix-ui/react-icons"

const OpenIcon = forwardRef((props, ref) => (
  <Box position="relative" color="green.500" alignSelf="flex-start" ref={ref} {...props}>
    <CircleIcon width="24" height="24" />
    <DotFilledIcon style={{
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
    }} width="16" height="16" />
  </Box>
))

export default OpenIcon
