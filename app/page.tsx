import Loader from "@/components/Loader";
import PdfViewerWrapper from "@/components/PDFWraper";

export default function Home() {
  const pdfUrl =
    "https://utfs.io/f/1arFt4OHB3RfmKF2XL6eCabDQ8p613Z4JTXVMkNnFBH27Ig9";

  return (
    <div>
      <PdfViewerWrapper url={pdfUrl} />
    </div>
  );
}
