// components/PdfViewerWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";

const PdfViewer = dynamic(() => import("./PDFREnder"), { ssr: false });

export default function PdfViewerWrapper({ url }: { url: string }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return <p>Loading...</p>;

  return <PdfViewer url={url} />;
}
