import React from "react";
import { Checkbox, FormControlLabel, FormGroup, useTheme } from "@mui/material";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/Square";
import ShieldIcon from "@mui/icons-material/Shield";
import ShieldOutlined from "@mui/icons-material/ShieldOutlined";
import MoonIcon from "@mui/icons-material/Bedtime";
import MoonOutlined from "@mui/icons-material/BedtimeOutlined";
import CircleIcon from "@mui/icons-material/Circle";
import CircleOutlinedIcon from "@mui/icons-material/CircleOutlined";
import Fieldset from "@/components/ui/Fieldset";
import { pointOfInterests } from "../common";

interface SystemContentCheckboxGroupProps {
  value: string[];
  onChange: (value: string[]) => void;
}

const SystemContentCheckboxGroup: React.FC<SystemContentCheckboxGroupProps> = ({
  value,
  onChange,
}) => {
  const theme = useTheme();

  const checkboxes = React.useMemo(() => {
    const checked: React.ReactNode[] = [];
    const unchecked: React.ReactNode[] = [];
    for (let i = 0; i < pointOfInterests.length; i++) {
      const valueItem = pointOfInterests[i];
      if (!valueItem) continue;
      const isChecked = value.includes(valueItem.name);
      let Icon = CheckBoxOutlineBlankIcon;
      let CheckedIcon = CheckBoxIcon;
      if (valueItem.icon === "shield") {
        Icon = ShieldOutlined;
        CheckedIcon = ShieldIcon;
      } else if (valueItem.icon === "circle") {
        Icon = CircleOutlinedIcon;
        CheckedIcon = CircleIcon;
      } else if (valueItem.icon === "moon") {
        Icon = MoonOutlined;
        CheckedIcon = MoonIcon;
      }
      const fragment = (
        <FormControlLabel
          control={
            <Checkbox
              size="small"
              icon={<Icon />}
              checkedIcon={<CheckedIcon />}
              onChange={(event) =>
                onChange(
                  event.target.checked
                    ? [...value, valueItem.name]
                    : value.filter((v) => v !== valueItem.name)
                )
              }
              sx={{
                color: valueItem.color,
                "&.Mui-checked": {
                  color: valueItem.color,
                },
                padding: 0.5,
              }}
              disableRipple
              disableFocusRipple
            />
          }
          slotProps={{
            typography: {
              fontSize: 12,
            },
          }}
          label={valueItem.name}
          key={valueItem.name}
          checked={isChecked}
        />
      );
      if (isChecked) {
        checked.push(fragment);
      } else {
        unchecked.push(fragment);
      }
    }
    return (
      <>
        <>{checked}</>
        <>{unchecked}</>
      </>
    );
  }, [value, onChange]);

  return (
    <Fieldset
      title={`Content (${value.length})`}
      color="secondary.main"
      sx={{
        maxHeight: "20vh",
        overflowY: "auto",
        scrollbarColor: `${theme.palette.secondary.main} transparent`,
      }}
    >
      <FormGroup sx={{ fontSize: 10 }}>{checkboxes}</FormGroup>
    </Fieldset>
  );
};

export default SystemContentCheckboxGroup;
