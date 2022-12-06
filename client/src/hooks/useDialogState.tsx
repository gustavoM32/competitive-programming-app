import { useState } from "react";

export type DialogState = {
  open: boolean;
  data: any;
  setData: any;
  handleOpen: (newData: any) => void;
  handleClose: () => void;
};

export function useDialogState(): DialogState {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({});

  const handleOpen = (newData: any) => {
    setOpen(true);
    setData(newData);
  };

  const handleClose = () => {
    setOpen(false);
    setData({});
  };

  return {
    open,
    data,
    setData,
    handleOpen,
    handleClose,
  };
}
