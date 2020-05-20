import React, { useState, useEffect } from "react";
import moment from "moment";
import classNames from "classnames";
import { Arrow01, Arrow02, Calendar, Clip, MailSP, Search } from "./assets";
import mockData from "./mock_data.json";
import "./App.css";

const MOMENT_FORMAT_DATE_TIME = "YYYY-MM-DD hh:mm";
const MOMENT_FORMAT_DATE = "YYYY-MM-DD";

const SearchField = ({ onClickSearch }) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className={classNames("SearchWrapper", "SPWrapper")}>
      <div className={"SearchContainer"}>
        <img src={Calendar} alt="calendar" width={20} height={20} />
        <input
          className={"SearchField"}
          type={"date"}
          id={"startDate"}
          onChange={(e) => setStartDate(e.target.value)}
        />{" "}
        -
        <input
          className={"SearchField"}
          type={"date"}
          id={"endDate"}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>
      <div
        className={classNames("SearchContainer", "SearchIcon")}
        onClick={() => onClickSearch(startDate, endDate)}
      >
        <img src={Search} alt="search" width={20} height={20} />
      </div>
    </div>
  );
};

const parseDate = (dateJson) => {
  const dateMoment = moment(dateJson, MOMENT_FORMAT_DATE_TIME);
  if (
    dateMoment.format(MOMENT_FORMAT_DATE) ===
    moment().format(MOMENT_FORMAT_DATE)
  )
    return dateMoment.format("HH:mm");
  else if (dateMoment.isSame(moment(), "year"))
    return dateMoment.format("MMM DD");
  else return dateMoment.format("YYYY/MM/DD");
};

const sortMockData = (key, order = "asc") => {
  return (a, b) => {
    if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
      return 0;
    }
    const varA = typeof a[key] === "string" ? a[key].toUpperCase() : a[key];
    const varB = typeof b[key] === "string" ? b[key].toUpperCase() : b[key];

    let comparison = 0;
    if (varA > varB) {
      comparison = 1;
    } else if (varA < varB) {
      comparison = -1;
    }
    return order === "desc" ? comparison * -1 : comparison;
  };
};

const App = () => {
  const [mockDataParse, setMockDataParse] = useState(mockData);
  const [sortHeader, setSortHeader] = useState("");
  const [isOpenMail, setIsOpenMail] = useState(true);
  const [selectedMail, setSelectedMail] = useState(mockDataParse[0]);

  const onSortData = (key, order = "asc") => {
    let updatedData = [...mockData];
    let keyCheck = "";
    if (key !== sortHeader) {
      const tempMockData = [...mockDataParse];
      updatedData = tempMockData.sort(sortMockData(key, order));
      keyCheck = key;
    }
    setMockDataParse(updatedData);
    setSortHeader(keyCheck);
  };

  const [deviceType, setDeviceType] = useState("sp");

  useEffect(() => {
    if (!window.matchMedia) return;

    const mediaQuerySP = window.matchMedia("(max-width: 743px)");

    const updateMediaQuery = () => {
      if (mediaQuerySP.matches) setDeviceType("sp");
      else setDeviceType("pc/tl");
    };

    updateMediaQuery();
    mediaQuerySP.addListener(updateMediaQuery);

    return () => mediaQuerySP.removeListener(updateMediaQuery);
  }, []);

  const onClickSearch = (startDate, endDate) => {
    let tempData = [...mockData];
    let updatedData = tempData;
    if (!!startDate && !!endDate) {
      updatedData = tempData.filter((item) =>
        moment(item.date, MOMENT_FORMAT_DATE_TIME).isBetween(
          startDate,
          endDate,
          "m",
          "[]"
        )
      );
    }
    setMockDataParse(updatedData);
  };

  const openMailContent = (value, item) => {
    setIsOpenMail(value);
    setSelectedMail(item);
  };

  return (
    <div className="App">
      <SearchField onClickSearch={onClickSearch} />
      <span className={classNames("ResultText", "SPResultText")}>
        Results: <span className={"ResultTotal"}>{mockDataParse.length}</span>{" "}
        mail(s)
      </span>
      <hr />
      {isOpenMail ? (
        <div className={"OMWrapper"}>
          <div
            className={classNames("AlignItemsCenter", "OMBackWrapper")}
            onClick={() => openMailContent(false, {})}
          >
            <img
              className={"OMBack"}
              src={Arrow02}
              alt="Go Back"
              width={13}
              height={13}
            />
            <span>Back</span>
          </div>
          <div className={"OMSubject"}>{selectedMail.subject}</div>
          <div className={"SpaceBetween"}>
            <div className={"TextEllipsis"}>From: {selectedMail.from}</div>
            <div className={"AlignItemsCenter"}>
              <img
                className={"RowMargin5"}
                src={Clip}
                alt="Attachment"
                width={15}
                height={15}
              />
              <span>
                {moment(selectedMail.date).format(
                  deviceType === "sp"
                    ? "YYYY/MM/DD hh:mm A"
                    : "DD MMM, YYYY hh:mm A"
                )}
              </span>
            </div>
          </div>
          <div className={"TextEllipsis"}>To: {selectedMail.to}</div>
          <div className={"OMContentWrapper"}>{selectedMail.content}</div>
        </div>
      ) : mockDataParse.length ? (
        <div>
          <div
            className={classNames(
              "SPTableWrapper",
              "TableHeaderWrapper",
              "TableRowHeader"
            )}
          >
            <div
              className={classNames(
                deviceType === "sp" ? "RowMargin5" : "RowMargin15",
                "RowHeader",
                "FromRow",
                sortHeader === "from" && "SortedRowHeader"
              )}
              onClick={() => onSortData("from")}
            >
              From
              {sortHeader === "from" && (
                <img
                  className={"TableSortIcon"}
                  src={Arrow01}
                  alt="Sort"
                  width={10}
                  height={10}
                />
              )}
            </div>
            <div
              className={classNames(
                deviceType === "sp" ? "RowMargin5" : "RowMargin15",
                "RowHeader",
                "ToRow",
                sortHeader === "to" && "SortedRowHeader"
              )}
              onClick={() => onSortData("to")}
            >
              To
              {sortHeader === "to" && (
                <img
                  className={"TableSortIcon"}
                  src={Arrow01}
                  alt="Sort"
                  width={10}
                  height={10}
                />
              )}
            </div>
            <div
              className={classNames(
                deviceType === "sp" ? "RowMargin5" : "RowMargin15",
                "RowHeader",
                "SubjectRow",
                sortHeader === "subject" && "SortedRowHeader"
              )}
              onClick={() => onSortData("subject")}
            >
              Subject
              {sortHeader === "subject" && (
                <img
                  className={"TableSortIcon"}
                  src={Arrow01}
                  alt="Sort"
                  width={10}
                  height={10}
                />
              )}
            </div>
            <div
              className={classNames(
                deviceType !== "sp" && "RowHeader",
                "DateRow",
                sortHeader === "date" && "SortedRowHeader"
              )}
              onClick={() => onSortData("date", "desc")}
            >
              Date
              {sortHeader === "date" && (
                <img
                  className={"TableSortIcon"}
                  src={Arrow01}
                  alt="Sort"
                  width={10}
                  height={10}
                />
              )}
            </div>
          </div>
          {mockDataParse.map((item, idx) =>
            deviceType !== "sp" ? (
              <div
                key={idx}
                className={classNames("TableHeaderWrapper", "DataHover")}
                onClick={() => openMailContent(true, item)}
              >
                <div
                  className={classNames(
                    "RowMargin15",
                    "FromRow",
                    "TextEllipsis"
                  )}
                >
                  <span
                    className={
                      sortHeader === "from" ? "SortedRowHeader" : undefined
                    }
                  >
                    {item.from}
                  </span>
                </div>
                <div
                  className={classNames("RowMargin15", "ToRow", "TextEllipsis")}
                >
                  {item.to.length > 1 ? (
                    <div className={"SpaceBetween"}>
                      <div
                        className={classNames(
                          "TextEllipsis",
                          sortHeader === "to" && "SortedRowHeader"
                        )}
                      >
                        {item.to[0]}, ...
                      </div>
                      <div className={"MultiAddressee"}>
                        +{item.to.length - 1}
                      </div>
                    </div>
                  ) : (
                    <span
                      className={
                        sortHeader === "to" ? "SortedRowHeader" : undefined
                      }
                    >
                      {item.to}
                    </span>
                  )}
                </div>
                <div
                  className={classNames(
                    "RowMargin15",
                    "SubjectRow",
                    "SpaceBetween"
                  )}
                >
                  <div
                    className={classNames(
                      "RowMargin15",
                      "SubjectRowText",
                      "TextEllipsis",
                      sortHeader === "subject" && "SortedRowHeader"
                    )}
                  >
                    {item.subject}
                  </div>
                  {item.hasAttachment && (
                    <img src={Clip} alt="Attachment" width={15} height={15} />
                  )}
                </div>
                <div
                  className={classNames(
                    "DateRow",
                    "TextEllipsis",
                    sortHeader === "date" && "SortedRowHeader"
                  )}
                >
                  {parseDate(item.date)}
                </div>
              </div>
            ) : (
              <div
                key={idx}
                className={classNames("HeaderWrapper", "DataHover")}
                onClick={() => openMailContent(true, item)}
              >
                <div
                  className={classNames("SPDataWrapper", "AlignItemsCenter")}
                >
                  <img
                    className={"RowMargin5"}
                    src={MailSP}
                    alt="MailSP"
                    width={20}
                    height={30}
                  />
                  <div className={"SPFromToWrapper"}>
                    <div
                      className={classNames("SpaceBetween", "MarginBottom5")}
                    >
                      <div
                        className={classNames(
                          "TextEllipsis",
                          sortHeader === "from" && "SortedRowHeader"
                        )}
                      >
                        {item.from}
                      </div>
                      <div className={"SpaceBetween"}>
                        {item.hasAttachment && (
                          <img
                            className={"RowMargin5"}
                            src={Clip}
                            alt="Attachment"
                            width={15}
                            height={15}
                          />
                        )}
                        <div
                          className={classNames(
                            "DateRow",
                            "TextEllipsis",
                            "RowMargin5",
                            sortHeader === "date" && "SortedRowHeader"
                          )}
                        >
                          {parseDate(item.date)}
                        </div>
                        <img src={Arrow02} alt="Arrow 2" width={7} height={7} />
                      </div>
                    </div>
                    <div className={classNames("RowMargin15", "TextEllipsis")}>
                      {item.to.length > 2 ? (
                        <div className={"SpaceBetween"}>
                          <div
                            className={classNames(
                              "TextEllipsis",
                              sortHeader === "to" && "SortedRowHeader"
                            )}
                          >
                            {item.to.slice(0, 2)}, ...
                          </div>
                          <div className={"MultiAddressee"}>
                            +{item.to.length - 2}
                          </div>
                        </div>
                      ) : (
                        <span
                          className={
                            sortHeader === "to" ? "SortedRowHeader" : undefined
                          }
                        >
                          {item.to}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <div
                  className={classNames(
                    "SPSubjectText",
                    "TextEllipsis",
                    sortHeader === "subject" && "SortedRowHeader"
                  )}
                >
                  {item.subject}
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="ContentWrapper">
          <img src={process.env.PUBLIC_URL + "/files/logo.png"} alt="logo" />
        </div>
      )}
    </div>
  );
};

export default App;
