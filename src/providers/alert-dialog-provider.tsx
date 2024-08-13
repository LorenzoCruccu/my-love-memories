"use client"
import React, { createContext, useContext, useState, type ReactNode } from "react";
import {
  AlertDialog as BaseAlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "~/components/ui/alert-dialog";

type AlertDialogOptions = {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel?: () => void;
};

type AlertDialogContextType = {
  showAlertDialog: (options: AlertDialogOptions) => void;
};

const AlertDialogContext = createContext<AlertDialogContextType | undefined>(undefined);

export const useAlertDialog = (): AlertDialogContextType => {
  const context = useContext(AlertDialogContext);
  if (!context) {
    throw new Error("useAlertDialog must be used within an AlertDialogProvider");
  }
  return context;
};

export const AlertDialogProvider = ({ children }: { children: ReactNode }) => {
  const [alertDialogOptions, setAlertDialogOptions] = useState<AlertDialogOptions | null>(null);

  const showAlertDialog = (options: AlertDialogOptions) => {
    setAlertDialogOptions(options);
  };

  const handleClose = () => {
    if (alertDialogOptions?.onCancel) {
      alertDialogOptions.onCancel();
    }
    setAlertDialogOptions(null);
  };

  const handleConfirm = () => {
    alertDialogOptions?.onConfirm();
    setAlertDialogOptions(null);
  };

  return (
    <AlertDialogContext.Provider value={{ showAlertDialog }}>
      {children}
      {alertDialogOptions && (
        <BaseAlertDialog open={true} onOpenChange={handleClose}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{alertDialogOptions.title}</AlertDialogTitle>
              <AlertDialogDescription>
                {alertDialogOptions.description}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={handleClose}>
                {alertDialogOptions.cancelText ?? "Cancel"}
              </AlertDialogCancel>
              <AlertDialogAction onClick={handleConfirm}>
                {alertDialogOptions.confirmText ?? "Confirm"}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </BaseAlertDialog>
      )}
    </AlertDialogContext.Provider>
  );
};
