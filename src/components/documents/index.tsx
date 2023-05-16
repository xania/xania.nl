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
    <div class="pdf-viewer-container absolute overflow-hidden">
      <div class="pdfViewer w-full"></div>
      <DocumentLoader path={sampledoc} />

      <div class="absolute left-6 top-[1500px] z-10 border-2 border-solid border-red-400 bg-white bg-opacity-60 p-4 ">
        bla
      </div>
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

      for (let i = 0; i < pdfDocument.numPages; i++) {
        const page = pdfDocument.getPage(i + 1);
      }

      const pdfViewer = new PDFViewer({
        container,
        eventBus,
        linkService,
        l10n: NullL10n,
        textLayerMode: TEXT_LAYER_MODE,
        useOnlyCssZoom: true,

        // defaultViewport: pdfPage.getViewport({ scale: SCALE }),
      });

      linkService.setViewer(pdfViewer);
      linkService.setDocument(pdfDocument, null);
      pdfViewer.setDocument(pdfDocument);
    },
  };
}

function fetchUserProfile(userName: string) {
  return Promise.resolve({ userName });
}

async function SayHello(props: { name: string }) {
  const profile = await fetchUserProfile(props.name);
  return (<span>Hello, {profile.userName}</span>) as any;
}

async function HelloApp() {
  return (
    <div>
      <SayHello name="Ibrahim" />
    </div>
  ) as any;
}
