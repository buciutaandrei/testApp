/* eslint-disable no-unused-vars */
import React from "react";
import { useSpring, animated } from "react-spring";
import { observer } from "mobx-react";

const Circle = ({ circleId, store }) => {
  // Show/HideLetter animation duration
  const diplayLetterAnimDuration = 250;

  // Delay from start to ShowLetter animation
  const showLetterDelay = 500;

  // Delay from start to HideLetter animation
  const hideLetterDelay = 500;

  const translateValue =
    circleId === "R" ? "translate(-110%, -50%)" : "translate(10%, -50%)";

  const positionValue = circleId === "R" ? "100%" : "0%";

  let verticalMovement;

  if (store.reversedOccluder) {
    verticalMovement =
      circleId === "R"
        ? { top: "0%", transform: "translate(-50%, 10%)" }
        : { top: "100%", transform: "translate(-50%, -110%)" };
  } else {
    verticalMovement =
      circleId === "R"
        ? { top: "100%", transform: "translate(-50%, -110%)" }
        : { top: "0%", transform: "translate(-50%, 10%)" };
  }

  const [complexAnim, complexApi] = useSpring(() => ({
    immediate: true,
    config: { duration: 800 },
    to: async (next, cancel) => {
      await next({
        config: { duration: diplayLetterAnimDuration },
        delay: showLetterDelay,
        color: "black",
      });
      await next({
        config: { duration: diplayLetterAnimDuration },
        delay: hideLetterDelay,
        color: "white",
      });
      await next({ left: "50%", transform: "translate(-50%, -50%)" });
      await next({ ...verticalMovement });
      await next({
        config: { duration: 0 },
        color: "black",
        onStart: () => {
          store.setStartingRecordedTime();
          if (!store.isLettersChanged) {
            store.changeLetters();
          }
        },
      });
    },
    from: {
      left: positionValue,
      transform: translateValue,
      top: "50%",
      opacity: 1,
      color: "white",
    },
  }));

  let circleStyle = {
    position: "absolute",
    padding: 10,
    display: "flex",
    border: "1px solid black",
    borderRadius: "50%",
    width: 75,
    height: 75,
    transform: translateValue,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 64,
    color: "white",
  };

  if (circleId === "R") {
    circleStyle = {
      ...circleStyle,
      left: "100%",
    };
  }

  return (
    <animated.div style={{ ...circleStyle, ...complexAnim }}>
      <p style={{ transform: `rotate(-${store.rotationDegrees}deg)` }}>
        {circleId === "L" ? store.circleLLetter : store.circleRLetter}
      </p>
    </animated.div>
  );
};

export default observer(Circle);
