import React, { useState, useEffect } from "react";
import { renderEditor } from "../../utility/renderEditor";
import { GetBook, AddSummary } from "../../../api/socket-requests";
import { toast } from "react-toastify";
import history from "../../../routing/history";
import { connect } from "react-redux";
import CheckBox from "../../utility/checkbox1";
import Popover from "../../utility/popover";

const WriteSummaryForm = (props) => {
  const bookId = props.match.params.bookId;
  const [book, setBook] = useState({ image: "", title: "", atuhors: "" });
  const user = props.user;
  const [summary, setSummary] = useState({
    description: "",
    title: "",
    authorId: user._id,
    bookId: bookId,
    private: false,
  });
  useEffect(() => {
    let filter = { _id: bookId };
    GetBook(filter, (res) => {
      if (res.error) {
        toast.error(res.error.toString());
      } else {
        setBook(res.filteredBooks[0]);
      }
    });

    renderEditor(
      "question-editor",
      "Summary",
      summary.description,
      (newDescription) => {
        setSummary((prev) =>
          Object.assign({}, prev, { description: newDescription })
        );
      }
    );
  }, []);

  return (
    <div className="row no-gutters px-2 px-sm-3 px-md-4 px-lg-5 pt-3 pb-5">
      <div className="col-12 px-4">
        <div className="row no-gutters justify-content-between border p-4 bg-white mb-3">
          <div className="col-auto pb-5">
            <div className="row no-gutters" style={{ maxWidth: "436px" }}>
              <div className="h1 col-12">Write a Summary</div>
              <div className="col-12">
                Share your impressions about the book. What topics and themes
                stood out?
              </div>
            </div>
          </div>
          <div className="col-auto pb-4">
            <div className="row no-gutters" style={{ maxWidth: "350px" }}>
              <div className="col-auto pr-3 mb-3 mb-md-0">
                <img src={book.image} width="100" className="img-fluid" />
              </div>
              <div className="col">
                <div className="row no-gutters h4">{book.title}</div>
                <div className="row no-gutters">{book.authors}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="title" className="lead" style={{ fontWeight: "500" }}>
            Title
          </label>
          <input
            value={summary.title}
            onChange={(e) => {
              e.persist();
              setSummary((prev) =>
                Object.assign({}, prev, { title: e.target.value })
              );
            }}
            type="text"
            className="form-control"
            style={{ borderRadius: "8px" }}
            id="title"
          />
        </div>
        <div className="row no-gutters" id="question-editor"></div>
        <div className="row no-gutters align-items-center my-4">
          <div className="mr-2">
            <CheckBox
              size="30"
              checked={summary.private}
              setChecked={(checked) =>
                setSummary((s) => Object.assign({}, s, { private: checked }))
              }
            ></CheckBox>
          </div>
          <div className="mr-2">Make summary private</div>
          <Popover
            info={"Private summaries won't appear on book page"}
          ></Popover>
        </div>
        <div className="row no-gutters">
          <div
            className="btn btn-primary bg-theme-simple py-3 px-5 mt-3 mr-2"
            onClick={() => {
              let summarryObj = { ...summary };

              AddSummary(
                {
                  bookId,
                  summary: Object.assign({}, summarryObj, {
                    authorId: user._id,
                  }),
                },
                (res) => {
                  if (res.error) {
                    toast.error(res.error.toString());
                  } else {
                    history.push(`/books/${bookId}`);
                  }
                }
              );
            }}
          >
            Publish
          </div>
          <div
            className="btn btn-outline-secondary py-3 px-5 mt-3"
            onClick={() => {
              history.push(`/books/${bookId}`);
            }}
          >
            Cancel
          </div>
        </div>
      </div>
    </div>
  );
};

function mapStateToProps(state, ownProps) {
  return {
    user: state.user,
    ...ownProps,
  };
}

export default connect(mapStateToProps)(WriteSummaryForm);
