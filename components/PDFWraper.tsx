"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import Loader from "./Loader";

const PdfViewer = dynamic(() => import("./PDFREnder"), { ssr: false });

export default function PdfViewerWrapper({ url }: { url: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <Loader />;

  return <PdfViewer url={url} />;
}
