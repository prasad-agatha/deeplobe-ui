import React from "react";
import { Form } from "react-bootstrap";
import { useFormik } from "formik";

function CreateTag(props) {
  const { tag, setTag } = props;

  const handleSubmit = () => {
    props.nextStep();
  };

  const input = React.useRef(null);

  React.useEffect(() => {
    input.current.focus();
  }, [tag]);

  const tags = ["Dog", "Cat", "Elephant"];

  return (
    <>
      <div className="row">
        <div className="col-sm-12">
          <div className="clsfctn-row p-4">
            <div className="text-center">
              <p className="Create-tags pb-2">Create Tags</p>
            </div>
            <hr />
            <div className="col-xl-6  col-lg-12 text-center mx-auto">
              <p className="classification-para">
                Give a tag for all the images that you are going to upload
              </p>
              <Form onSubmit={handleSubmit} action="classification/uploadImage">
                <div className="row py-2">
                  <div className="col-10 p-xl-0 p-sm-1">
                    <div className="form-group">
                      <Form.Control
                        ref={input}
                        value={tag}
                        type="text"
                        className="input"
                        id="usr"
                        placeholder="Add tags here for eg. cats and dog"
                        onChange={(e) => {
                          e.preventDefault();
                          setTag(e.target.value);
                        }}
                      ></Form.Control>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <button disabled={!tag} className="btn my-5 request" type="submit">
                    PROCEED<span></span> <i className="fa fa-arrow-right pl-3 "></i>
                  </button>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default CreateTag;
