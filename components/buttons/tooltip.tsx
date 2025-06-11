import * as React from "react";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Tooltip, { TooltipProps, tooltipClasses } from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import Link from "next/link";

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#263238",
    color: "#D1CBFF",
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

export default function TooltipButton({ workspace }) {
  return (
    <div>
      <HtmlTooltip
        title={
          <React.Fragment>
            <span className="text-white">
              This feature is available for
              <br /> Growth Plan users.{" "}
            </span>
            <span className="cursor-pointer">
              <Link
                href={`/settings?tab=subscription&goToPlan=${
                  workspace?.plan === process.env.NEXT_PUBLIC_FREE_PLAN ? "Growth" : "Enterprise"
                }`}
              >
                <u>{"Upgrade"}</u>
              </Link>
            </span>

            <span className="text-white">
              {" "}
              <br />
              to Growth plan.
            </span>
          </React.Fragment>
        }
      >
        <button className="btn user-btn px-4">Add User</button>
      </HtmlTooltip>
    </div>
  );
}
