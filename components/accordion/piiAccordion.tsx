const AlwaysOpenExample = ({ result, activeKey, setActiveKey }) => {
  function piiEntityName(value: any) {
    if (["Passport_No"].includes(value)) return "Passport Number";
    else if (["Email_Password"].includes(value)) return "Email Password";
    else if (["Email_id"].includes(value)) return "Email Id";
    else if (["Username_Password"].includes(value)) return "Username Password";
    else if (["Email_password"].includes(value)) return "Email Password";
    else if (["Financial_Acc_No", "Financial_acc_no_data"].includes(value))
      return "Financial Account Number";
    else if (["Financial_acc_pwd_data"].includes(value)) return "Financial Account Password";
    else if (["CreditCard_data"].includes(value)) return "Credit Card Number";
    else if (["SSN_data"].includes(value)) return "Social Security Number (SSN)";
    else if (["DL"].includes(value)) return "Driving Licence";
    else if (["Expiry_date"].includes(value)) return "Credit Card Expiry Date";
    else if (["CVV", "Cvv_data"].includes(value)) return "Credit Card CVV Number";
    else if (["Routing_No"].includes(value)) return "Routing Number";
    else if (["DOB"].includes(value)) return "Date of Birth";
    else if (["Is_Deceased"].includes(value)) return "Deceased or not";
    else if (["Medical_Info_details"].includes(value)) return "Medical Information Details";
    else if (["Health_Insurance_details"].includes(value)) return "Health Insurance Details";
    return value;
  }

  return (
    <>
      {Object.entries(result).map((e: any, id: any) => (
        <div className="accord" key={id}>
          <div className="row">
            <div className="col ps-0">
              <div className="tabs my-2">
                <div className="tab">
                  <input type="checkbox" id={id.toString()} />
                  <label
                    className="tab-label font-weight-500 d-flex align-items-center"
                    htmlFor={id.toString()}
                    style={{ backgroundColor: "#ebefff" }}
                    onClick={() => {
                      setActiveKey(id.toString());
                    }}
                  >
                    {piiEntityName(e[0])}

                    <span className="mx-3 my-2 ms-auto">{e[1].length}</span>
                  </label>

                  {e[1].map((el: any, idx: any) => (
                    <div
                      className={
                        "tab-content  " +
                        (idx === 0 && e[1].length === 2
                          ? "tab-0 "
                          : idx === 0 && e[1].length !== 1
                          ? "tab-0 border-bottom-0"
                          : e[1].length - 1 === idx
                          ? "tab-last"
                          : "")
                      }
                      key={idx}
                    >
                      {el.text.replace("(cid:10)", "")}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default AlwaysOpenExample;
