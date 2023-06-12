import React, { PropsWithChildren } from "react";

export type DialogAction = {
  name: string;
  className?: string;
  onClick: (event: React.MouseEvent) => void;
};

export interface DialogProps extends PropsWithChildren {
  open: boolean;
  title: string;
  actions?: DialogAction[];
}

export default function Dialog(props: DialogProps) {
  return <></>;
}
