import React from "react";
import {
  Box,
  Paper,
  Typography,
  Grid2 as Grid,
  List,
  ListItem,
} from "@mui/material";
import ContactIcon from "@mui/icons-material/Chat";
import ContributorsIcon from "@mui/icons-material/Diversity1";
import SourceCodeIcon from "@mui/icons-material/Code";
import LicenseIcon from "@mui/icons-material/Gavel";
import DisclaimerIcon from "@mui/icons-material/WarningAmber";
import PrivacyIcon from "@mui/icons-material/PrivacyTip";
import { Helmet } from "react-helmet";
import ExternalLink from "@/components/ui/ExternalLink";

const About: React.FC = () => {
  return (
    <Box p={2} flexGrow={1} overflow="auto">
      <Helmet>
        <title>EVE Datacore - About</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <ContactIcon />
            Contact / Feedbacks / Issues
          </Typography>
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              You are welcome to contact me with any feedback, suggestions via{" "}
              <ExternalLink
                href="https://discordapp.com/users/978559673571606589"
                title="Discord DM"
              >
                Discord DM
              </ExternalLink>{" "}
              or by joinning the{" "}
              <ExternalLink
                href="https://discord.gg/cu2n3wjqgb"
                title="EVE Datacore Discord server"
              >
                Discord server
              </ExternalLink>
            </Typography>
          </Paper>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <SourceCodeIcon />
            Source code
          </Typography>
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              The source code for this project is available on GitHub.
              <br />
              Website:{" "}
              <ExternalLink
                href="https://github.com/beaukode/evedatacore"
                title="EVE Datacore website GitHub"
              />
              <br />
              Route planner:{" "}
              <ExternalLink
                href="https://github.com/beaukode/evedatacore-route-planner"
                title="EVE Datacore route planner GitHub"
              />
            </Typography>
          </Paper>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <ContributorsIcon />
            Contributors
          </Typography>
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              Thanks to everyone who helped me understand the game data &
              mechanics by answering my questions.
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              Many thanks to Shish for his work on the first version of the
              route planner:
              <br />
              <ExternalLink
                href="https://eftb.shish.io/"
                title="Shish route planner"
              >
                https://eftb.shish.io/
              </ExternalLink>
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              This website is built using some libraries and tools, many thanks
              to the contributors of these projects. You can refer to the{" "}
              <code>package.json</code> file for the full list of dependencies.
            </Typography>
          </Paper>

          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <DisclaimerIcon />
            Disclaimer
          </Typography>
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              This website is provided "as is," without any guarantee of
              completeness, accuracy, timeliness, or the results obtained from
              the use of its information. It is offered without any warranty,
              express or implied, including, but not limited to, warranties of
              performance, merchantability, and fitness for a particular
              purpose.
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              EVE Frontier is a registered trademark of CCP. All rights are
              reserved worldwide. All other trademarks are the property of their
              respective owners. This website is not affiliated with CCP in any
              way. CCP is not responsible for the content or functionality of
              this website, nor can it be held liable for any damages arising
              from its use.
            </Typography>
          </Paper>
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <LicenseIcon />
            License
          </Typography>
          <Paper elevation={1} sx={{ mb: 2 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              This project is licensed under the
              <br />
              <code>
                Creative Commons Attribution-NonCommercial 4.0 International (CC
                BY-NC 4.0).
              </code>
              <br />
              <br />
              You are free to:
              <List>
                <ListItem>
                  Share: Copy and redistribute the material in any medium or
                  format.
                </ListItem>
                <ListItem>
                  Adapt: Remix, transform, and build upon the material.
                </ListItem>
              </List>
              Under the following terms:{" "}
              <List>
                <ListItem>
                  Attribution: You must give appropriate credit, provide a link
                  to the license, and indicate if changes were made. You may do
                  so in any reasonable manner, but not in any way that suggests
                  the licensor endorses you or your use.
                </ListItem>
                <ListItem>
                  NonCommercial: You may not use the material for commercial
                  purposes.
                </ListItem>
              </List>
              For more details, see the full license at:
              <br />
              <ExternalLink
                href="https://creativecommons.org/licenses/by-nc/4.0/"
                title="CC BY-NC 4.0"
              />
            </Typography>
          </Paper>
          <Typography
            variant="h6"
            component="h2"
            sx={{ bgcolor: "background.default" }}
            gutterBottom
          >
            <PrivacyIcon />
            Privacy policy
          </Typography>
          <Paper elevation={1} sx={{ mb: 2, py: 0.1 }}>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              margin={2}
            >
              This website reports some of your activity to the server, such as
              the pages you visited and the features you used. This data is
              collected anonymously to improve the website and is not shared
              with anyone.
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              margin={2}
            >
              The website does not send the exact page you visited, only the
              first two parts of the route, like /explore/characters. This is
              because we do not want to track your exact page visits, nor the
              query strings and parameters of your web3 calls (Obviously, we
              already watching them from the blockchain).
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              margin={2}
            >
              You can check data sent to the server by looking at the
              <code>/api/events</code> requests in your browser's developer
              tools.
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              margin={2}
            >
              Each day the server give you a random cookie to identify you as a
              unique visitor. This cookie expire at midnight UTC. Next day, you
              will get a new cookie and there is no way to link your cookies
              across multiple days.
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              margin={2}
            >
              Servers logs store your IP address, user agent, and the date and
              time. They are deleted after 365 days.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default About;
