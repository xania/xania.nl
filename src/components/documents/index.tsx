import sampledoc from "./sample.pdf";
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

export function DocumentViewer() {
  return (
    <div class="absolute h-full">
      <div class="pdfViewer"></div>
      <DocumentLoader path={sampledoc} />
    </div>
  );
}

function DocumentLoader(props: { path: string }) {
  return {
    async attachTo(container: HTMLDivElement) {
      const pdfDocument = await PDFJS.getDocument(props.path).promise;
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
      linkService.setDocument(pdfDocument, null);
      pdfViewer.setDocument(pdfDocument);
    },
  };
}
