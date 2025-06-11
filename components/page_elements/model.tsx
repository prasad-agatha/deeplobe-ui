import React from "react";
import { Row, Nav, Col, Form, Tab, Accordion, Card, Button } from "react-bootstrap";

function Model(props) {
  const [activeId, setActiveId] = React.useState();
  const [state, setState] = React.useState({
    valuesIndex: 0,
  });

  const testModel = () => {
    props.testModel();
  };
  const toggleActive = (id) => {
    if (activeId === id) {
      setActiveId(null);
    } else {
      setActiveId(id);
    }
  };

  return (
    <div>
      <div className="text-center">
        <p className="pb-2">
          Your model has finished training! You can check the performance below or test it!
        </p>
      </div>
      <hr />
      <div className="col-lg-12 w-100">
        <p className=" text-center model-para">Model accuracy: 78.23%</p>
        <div className="text-center">
          <a className="btn request" onClick={testModel}>
            TEST THE MODEL&nbsp;<i className="fa fa-arrow-right pl-3 "></i>
          </a>
        </div>
        {/* Accordion wrapper */}
        <div className="mt-5">
          <Accordion>
            <Card className="border-0">
              <Card.Header className="accordion-head">
                {/* <Accordion.Toggle
                  as={Button}
                  variant="link"
                  onClick={() => toggleActive("0")}
                  eventKey="0"
                  className="btn-block"
                >
                  <h5 className="mb-0">
                    Check model accuracy details{" "}
                    <i
                      className={
                        activeId === "0"
                          ? "fas fa-minus float-right"
                          : "fas fa-plus rotate-icon float-right"
                      }
                      style={{ color: "#6152d9" }}
                    ></i>
                  </h5>
                </Accordion.Toggle> */}
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <div className="w-100 ">
                    <Tab.Container id="left-tabs-example" defaultActiveKey="Progress">
                      <Row>
                        <Col sm={2}>
                          <Nav variant="pills" className="flex-column accuracy-tab">
                            <Nav.Item>
                              <Nav.Link eventKey="Progress">Progress</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="ROC">ROC</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="CorrectIncorrect">Correct Incorrect</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                              <Nav.Link eventKey="ConfusionMatrix">Confusion Matrix</Nav.Link>
                            </Nav.Item>
                          </Nav>
                        </Col>
                        <Col sm={10}>
                          <Tab.Content>
                            <Tab.Pane eventKey="Progress">
                              <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="ROC">
                              <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="CorrectIncorrect">
                              <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </div>
                            </Tab.Pane>
                            <Tab.Pane eventKey="ConfusionMatrix">
                              <div>
                                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
                                eiusmod tempor incididunt ut labore et dolore magna aliqua.
                              </div>
                            </Tab.Pane>
                          </Tab.Content>
                        </Col>
                      </Row>
                    </Tab.Container>
                  </div>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
        </div>
        {/* Accordion wrapper */}
      </div>
    </div>
  );
}
export default Model;
