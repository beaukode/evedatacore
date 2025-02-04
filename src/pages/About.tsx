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
              You are welcome to contact me with any feedback, suggestions via
              Discord:{" "}
              <ExternalLink
                href="https://discordapp.com/users/978559673571606589"
                title="Discord"
              />
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              You can also report issues on GitHub at:
              <br />
              <ExternalLink
                href="https://github.com/beaukode/eve-frontier-tools/issues"
                title="GitHub issues"
              />
            </Typography>
            <Typography
              variant="body2"
              component="p"
              textAlign="justify"
              padding={2}
            >
              If you would like to contribute to this project, feel free to fork
              it and submit a pull request.
              <br />
              For new features or major changes, please contact me beforehand to
              discuss your plans.
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
              This website is built using some libraries and tools, many thanks
              to the contributors of these projects. You can refer to the{" "}
              <code>package.json</code> file for the full list of dependencies.
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
              The source code for this website is available on GitHub at:
              <br />
              <ExternalLink
                href="https://github.com/beaukode/eve-frontier-tools"
                title="GitHub"
              />
            </Typography>
          </Paper>
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
        </Grid>
        <Grid size={12}>
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
      </Grid>
    </Box>
  );
};

export default About;
