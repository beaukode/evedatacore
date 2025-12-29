import React from "react";
import { Box, SxProps, Tooltip } from "@mui/material";
import CheckBoxIcon from "@mui/icons-material/Square";
import ShieldIcon from "@mui/icons-material/Shield";
import CircleIcon from "@mui/icons-material/Circle";
import MoreIcon from "@mui/icons-material/MoreHoriz";
import { pointOfInterests, PointOfInterest } from "../../common";

interface SystemContentIconsProps {
  value: string[];
  maxIcons?: number;
  sx?: SxProps;
}

const SystemContentIcons: React.FC<SystemContentIconsProps> = ({
  value,
  maxIcons = Infinity,
  sx,
}) => {
  const content: Array<PointOfInterest> = React.useMemo(() => {
    if (value.length > 0) {
      return pointOfInterests.filter((pointOfInterest) =>
        value.includes(pointOfInterest.name)
      );
    }
    return [];
  }, [value]);

  if (content.length === 0) {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          gap: 0.1,
          fontSize: "12px",
          backgroundColor: "rgba(0, 34, 0, 0.3)",
          padding: "2px 4px",
          borderRadius: "2px",
          ...sx,
          "& .extra-poi-icon": {
            display: "none",
          },
          "&:hover .extra-poi-icon": {
            display: "block",
          },
          "&:hover .more-poi-icon": {
            display: "none",
          },
        }}
      >
        {content.map((poi, index) => {
          let Icon = CheckBoxIcon;
          if (poi.icon === "shield") {
            Icon = ShieldIcon;
          } else if (poi.icon === "circle") {
            Icon = CircleIcon;
          }
          return (
            <Tooltip key={poi.name} title={poi.name} arrow>
              <Icon
                fontSize="inherit"
                htmlColor={poi.color}
                classes={{
                  root:
                    content.length > maxIcons && index >= maxIcons - 1
                      ? `extra-poi-icon`
                      : "",
                }}
              />
            </Tooltip>
          );
        })}
        {content.length > maxIcons && (
          <MoreIcon
            fontSize="inherit"
            color="secondary"
            classes={{ root: "more-poi-icon" }}
          />
        )}
      </Box>
    </>
  );
};

export default SystemContentIcons;
