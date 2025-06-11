import React, { Component } from "react";

import { Document, Page, pdfjs } from "react-pdf";
import type { IHighlight, NewHighlight } from "interfaces";
import pdfjsWorker from "pdfjs-dist/build/pdf.worker.entry";
import AlwaysOpenExample from "@components/accordion/piiAccordion";

pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;

interface State {
  url: string;
  highlights: Array<IHighlight>;
}

const getNextId = () => String(Math.random()).slice(2);

const parseIdFromHash = () => document.location.hash.slice("#highlight-".length);

const resetHash = () => {
  document.location.hash = "";
};

const updateHash = (highlight: any) => {
  document.location.hash = `highlight-${highlight.id}`;
};

const HighlightPopup = ({ comment }: { comment: { text: string; emoji: string; id?: string } }) =>
  comment.text ? (
    <div
      // className="Highlight__popup"
      className={"Highlight__popup" + (comment?.id === parseIdFromHash() ? "" : " d-none")}
    >
      {comment.emoji} {comment.text}
    </div>
  ) : null;

interface Props {
  url: any;
  result: any;
  highlights: any;
  toggle: any;
  setToggle: any;
  activeKey: any;
  setActiveKey: any;
  setNumPages: any;
  numPages: any;
}

class PdfViewer extends Component<Props, State> {
  state = {
    url: this.props.url,
    highlights: [...this.props.highlights],
    result: this.props.result,
  };
  resetHighlights = () => {
    this.setState({
      highlights: [],
    });
  };

  scrollViewerTo = (highlight: any) => {};

  scrollToHighlightFromHash = () => {
    const highlight = this.getHighlightById(parseIdFromHash());

    if (highlight) {
      this.scrollViewerTo(highlight);
    }
  };

  componentDidMount() {
    window.addEventListener("hashchange", this.scrollToHighlightFromHash, false);
  }

  getHighlightById(id: string) {
    const { highlights } = this.state;

    return highlights.find((highlight) => highlight.id === id);
  }

  addHighlight(highlight: NewHighlight) {
    const { highlights } = this.state;

    console.log("Saving highlight", highlight);

    this.setState({
      highlights: [{ ...highlight, id: getNextId() }, ...highlights],
    });
  }

  updateHighlight(highlightId: string, position: Object, content: Object) {
    console.log("Updating highlight", highlightId, position, content);

    this.setState({
      highlights: this.state.highlights.map((h) => {
        const { id, position: originalPosition, content: originalContent, ...rest } = h;
        return id === highlightId
          ? {
              id,
              position: { ...originalPosition, ...position },
              content: { ...originalContent, ...content },
              ...rest,
            }
          : h;
      }),
    });
  }

  render() {
    const { url, highlights, result } = this.state;
    const { activeKey, setActiveKey, toggle, setToggle, numPages, setNumPages } = this.props;

    return (
      <div className="row flex-grow-1">
        <div className={"col-12  col-xl-4 mb-4"}>
          {Object.keys(result).length !== 0 ? (
            <>
              <AlwaysOpenExample
                result={result}
                setActiveKey={setActiveKey}
                activeKey={activeKey}
              />
            </>
          ) : (
            <div className="text-center pt-5 mt-5">
              <img className="mb-3" src="/no_data.svg" alt="no_data" />
              <p className="font-size-18 font-weigth-400 lgray mt-4">
                We didn't find any PII <br></br> information in your data
              </p>
            </div>
          )}
        </div>
        <div className={"col-12 col-xl-8 pt-3 pt-sm-0"}>
          <div>
            <div className={"pdf-div w-100"}>
              <Document
                file={url}
                onLoadSuccess={({ numPages }) => {
                  setNumPages(numPages);
                }}
              >
                {Array.apply(null, Array(numPages))
                  .map((x, i) => i + 1)
                  .map((page) => (
                    <Page pageNumber={page} renderTextLayer={false} />
                  ))}
              </Document>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PdfViewer;
