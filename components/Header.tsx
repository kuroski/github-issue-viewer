import {
  Avatar,
  Button,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorMode,
} from "@chakra-ui/react";
import {
  EnterIcon,
  ExitIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import useTranslation from "next-translate/useTranslation";
import React from "react";

const handleLogin = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
  e.preventDefault();
  signIn("github");
};

const Header = (): JSX.Element => {
  const { data: session } = useSession();
  const { colorMode, toggleColorMode } = useColorMode();
  const { t } = useTranslation("common");

  return (
    <Flex align="center" justify="space-between" mb={3}>
      <div>
        <IconButton
          mr={3}
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label={t("switch_to_mode", {
            mode: colorMode === "light" ? "dark" : "light",
          })}
          onClick={toggleColorMode}
        />

        <Link href="/">
          <a>
            <IconButton aria-label={t("home_page")} icon={<HomeIcon />} />
          </a>
        </Link>
      </div>

      {session?.user ? (
        <Menu>
          <MenuButton
            as={IconButton}
            icon={
              <Avatar
                size="sm"
                name={session.user.name || "You"}
                src={session.user.image ?? ""}
              />
            }
          />
          <MenuList>
            <MenuItem icon={<ExitIcon />} onClick={() => signOut()}>
              {t("logout")}
            </MenuItem>
          </MenuList>
        </Menu>
      ) : (
        <Button rightIcon={<EnterIcon />} onClick={handleLogin}>
          {t("login")}
        </Button>
      )}
    </Flex>
  );
};

export default Header;
