"use client";

import { Document, Page, pdfjs } from "react-pdf";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";

// Load local worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfViewer({ url }: { url: string }) {
  const [blobUrl, setBlobUrl] = useState<string | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.2); // 🔍 Initial zoom scale

  useEffect(() => {
  let objectUrl: string;

  const fetchPdf = async () => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      objectUrl = URL.createObjectURL(blob);
      setBlobUrl(objectUrl);
    } catch (err) {
      console.error("Error fetching PDF:", err);
    }
  };

  fetchPdf();

  return () => {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
    }
  };
}, [url]);


  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.6));

  if (!blobUrl) return <p>Loading PDF...</p>;

  return (
    <div className="fixed w-full bg-white rounded-md shadow flex flex-col items-center">
      {/* Top Bar */}
      <div className="h-14 w-full border-b border-zinc-200 flex items-center justify-between px-4">
        <div className="text-sm text-zinc-700 font-medium">
          Page {pageNumber} of {numPages || "?"}
        </div>
        {/* Pagination */}
      <div className="my-2 flex items-center justify-center gap-4">
        <button
          disabled={pageNumber <= 1}
          className="bg-gray-600 text-white font-medium py-1 px-4 rounded-md disabled:opacity-50"
          onClick={() => setPageNumber((p) => Math.max(1, p - 1))}
        >
          <ChevronLeft />
        </button>
        <span className="border border-gray-300 px-3 py-1 rounded-md text-sm">
          Page {pageNumber} of {numPages}
        </span>
        <button
          disabled={pageNumber >= numPages}
          className="bg-gray-600 text-white font-medium py-1 px-4 rounded-md disabled:opacity-50"
          onClick={() => setPageNumber((p) => Math.min(numPages, p + 1))}
        >
          <ChevronRight />
        </button>
      </div>
        {/* Zoom controls */}
        <div className="flex gap-2 items-center">
          <button
            onClick={zoomOut}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ZoomOut size={18} />
          </button>
           <span className="text-sm font-medium">{Math.round(scale * 100)}%</span>
          <button
            onClick={zoomIn}
            className="p-2 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            <ZoomIn size={18} />
          </button>
        </div>
      </div>

      {/* Document + Page View */}
      <div className="w-full max-h-screen p-4 overflow-y-auto flex justify-center">
        <Document
          file={blobUrl}
          onLoadSuccess={({ numPages }) => {
            setNumPages(numPages);
            setPageNumber(1);
          }}
          loading={<p className="text-center">Loading PDF...</p>}
          error={<p className="text-red-500">Failed to load PDF.</p>}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={pageNumber + "-" + scale}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="min-h-[500px]"
            >
              <motion.div
                key={pageNumber + "-" + scale}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="min-h-[500px]"
              >
                <Page
                  pageNumber={pageNumber}
                  scale={scale}
                  renderMode="canvas"
                  renderAnnotationLayer={true}
                  renderTextLayer={true}
                  devicePixelRatio={
                    typeof window !== "undefined"
                      ? window.devicePixelRatio || 1
                      : 1
                  }
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </Document>
      </div>

      
    </div>
  );
}
