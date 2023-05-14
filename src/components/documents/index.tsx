import { Page } from "~/layout/page";
import pdfdoc from "./sample.pdf";
import * as PDFJS from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker.entry";
import {
  EventBus,
  NullL10n,
  PDFLinkService,
  PDFViewer,
} from "pdfjs-dist/web/pdf_viewer";
import "pdfjs-dist/web/pdf_viewer.css";

const TEXT_LAYER_MODE = 1;

export function Viewer() {
  return (
    <div class="absolute inset-0 box-border">
      <div class="pdfViewer box-border h-full overflow-auto"></div>
      {loadPdf(pdfdoc)}
    </div>
  );
}

function loadPdf(path: string) {
  return {
    async attachTo(container: HTMLDivElement) {
      const pdfDocument = await PDFJS.getDocument(pdfdoc).promise;
      const eventBus = new EventBus();
      const linkService = new PDFLinkService({
        eventBus,
      });

      const pdfViewer = new PDFViewer({
        container,
        eventBus,
        linkService,
        l10n: NullL10n,
        textLayerMode: TEXT_LAYER_MODE,
      });

      linkService.setViewer(pdfViewer);
      pdfViewer.setDocument(pdfDocument);
      linkService.setDocument(pdfDocument, null);
    },
  };
}
