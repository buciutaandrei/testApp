/* eslint-disable no-nested-ternary */
/* eslint-disable no-unused-vars */
import React, { useEffect } from "react";
import { observer } from "mobx-react";
import Circle from "./Circle";

const Test = ({ store }) => {
  const handleKeyPress = (event) => {
    if (!store.isStartTest) {
      store.startTest();
    } else if (event.code === "f" || event.code === "j") {
      store.endTest(event.code);
    } else {
      console.log("OTHER KEY PRESSED", event.code);
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
  }, []);

  return (
    <div
      style={{
        width: "800px",
        height: "800px",
        margin: "auto",
        position: "relative",
        padding: 0,
      }}
    >
      {store.isStartTest ? (
        <div
          style={{
            transform: `rotate(${store.rotationDegrees}deg)`,
            height: "100%",
          }}
        >
          <img
            src={store.selectedOccluder}
            alt="occluder"
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              height: "450px",
              transform: "translate(-50%, -50%)",
              backgroundColor: "white",
              zIndex: "100",
            }}
          />
          <Circle circleId="L" store={store} />
          <Circle circleId="R" store={store} />
        </div>
      ) : store.isTrialConcluded ? (
        <div>Trial concluded. Thank you.</div>
      ) : (
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <h1>Press ANY KEY to start test</h1>
          <h3>{store.lastReactionTimeString}</h3>
        </div>
      )}
    </div>
  );
};

export default observer(Test);
