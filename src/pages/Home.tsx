import React from "react";
import { Helmet } from "react-helmet";
import { Typography, Box } from "@mui/material";
import ExternalLink from "@/components/ui/ExternalLink";
import InternalLink from "@/components/ui/InternalLink";

const Home: React.FC = () => {
  return (
    <Box flexGrow={1} overflow="auto">
      <Helmet>
        <title>
          EVE Datacore - Your ultimate resource for navigating and understanding
          the universe of EVE Frontier
        </title>
      </Helmet>
      <Typography sx={{ m: 2 }}>Hello Rider,</Typography>
      <Typography sx={{ m: 2 }}>
        Welcome to EVE Datacore website, a collection of tools and data for the
        game EVE Frontier. The game is actually in alpha test and take place in
        a large space universe like EVE Online, but with a different gameplay.
        The game empowers players to shape the world using the{" "}
        <ExternalLink title="Redstone blockchain" href="https://redstone.xyz/">
          Redstone blockchain
        </ExternalLink>{" "}
        (Actually{" "}
        <ExternalLink title="Pyrope testnet" href="https://pyropechain.com/">
          Pyrope testnet
        </ExternalLink>{" "}
        during the alpha).
        <br />
        Visit the website for more informations:{" "}
        <ExternalLink
          title="EVE Frontier website"
          href="https://www.evefrontier.com/"
        />{" "}
        <br /> <br />
        Here you can explore world users data like{" "}
        <InternalLink to="/explore/characters" title="Explore characters">
          characters
        </InternalLink>
        ,{" "}
        <InternalLink to="/explore/corporations" title="Explore corporations">
          corporations
        </InternalLink>
        ,{" "}
        <InternalLink to="/explore/assemblies" title="Explore assemblies">
          assemblies
        </InternalLink>
        ,{" "}
        <InternalLink to="/explore/killmails" title="Explore killmails">
          killmails
        </InternalLink>
        .
        <br />
        As well it provide a simple access to blockchain{" "}
        <ExternalLink title="MUD Frameworkd website" href="https://mud.dev/">
          Mud
        </ExternalLink>{" "}
        world data:{" "}
        <InternalLink to="/explore/namespaces" title="Explore namespaces">
          namespaces
        </InternalLink>
        ,{" "}
        <InternalLink to="/explore/tables" title="Explore tables">
          tables
        </InternalLink>
        ,{" "}
        <InternalLink to="/explore/systems" title="Explore systems">
          systems
        </InternalLink>{" "}
        and{" "}
        <InternalLink to="/explore/functions" title="Explore functions">
          functions
        </InternalLink>{" "}
        <br />
        <br />
        Data displayed is very accurate and fresh as it comes directly from the
        blockchain tables via the Mud indexer.
        <br />
        <br />
        Additionally, you'll find{" "}
        <InternalLink
          to="/calculate/various-calculators"
          title="Various calculators"
        >
          various calculators
        </InternalLink>{" "}
        and an advanced{" "}
        <InternalLink to="/calculate/route-planner" title="Route planner">
          route planner
        </InternalLink>{" "}
        to help optimize your journey through the universe.
        <br />
        <br />
        Feedbacks and bug reports are welcome,{" "}
        <InternalLink to="/about" title="Contact">
          contact me
        </InternalLink>
        <br />
        <br />
        Fly safe <span style={{ fontSize: "80%" }}>o</span>7
        <br />
      </Typography>
    </Box>
  );
};

export default Home;
