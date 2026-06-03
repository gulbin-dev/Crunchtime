"use client";
import { useEffect, useRef, useState } from "react";
export default function FailedDataDialog({
  error,
}: {
  error: { type: string; status: number; message: string } | Error;
}) {
  const [isOpen, setIsOpen] = useState(true);
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    if (dialogRef.current) {
      if (isOpen) dialogRef.current.showModal();
      else dialogRef.current.close();
    }
  }, [isOpen]);
  const handleTry = () => {
    setIsOpen(false);
    location.reload();
  };
  return (
    <dialog
      ref={dialogRef}
      className="rounded-lg place-self-center p-4"
      closedby="any"
    >
      <h2 className="text-heading-md"></h2>
      <p className="text-red-600 mt-3">{error.message}</p>
      <button
        className="bg-cta mt-5 float-right font-bold rounded-md py-1 px-3"
        onClick={handleTry}
      >
        Try Again
      </button>
    </dialog>
  );
}
