/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable import/no-useless-path-segments */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-param-reassign */
import { makeAutoObservable } from "mobx";
// import { ipcRenderer } from "electron";
import { getTime } from "date-fns";
import { readRemoteFile } from "react-papaparse";
import { shuffle } from "underscore";
import file from "../../src/tests.csv";
import occluder from "../../src/Occluder.png";
import mirrorOccluder from "../../src/Occluder_Mirror.png";
import rectangle from "../../src/Rectangle.png";

class Store {
  usedLetterList = ["K", "M", "P", "S", "T", "V"];

  rotationDegrees = 0;

  reversedOccluder = false;

  circleLLetter = "";

  circleLInitialLetter = "";

  circleRLetter = "";

  circleRInitialLetter = "";

  thirdLetter = "";

  initialTime = 0;

  keyPressTime = 0;

  testNo = 0;

  isFirstTestBlock = true;

  isLettersChanged = false;

  isTestEnded = false;

  isStartTest = false;

  isTrialConcluded = false;

  isTestBlocksSet = false;

  reactionTimes = [];

  lastReactionTime;

  lastReactionTimeString = "";

  tests = [];

  firstTestSet = [];

  secondTestSet = [];

  currentTest = [];

  selectedOccluder;

  isGotMatch;

  occluderType;

  occluderOrientation;

  letterMatchType;

  circleShowLetter;

  constructor() {
    makeAutoObservable(this, {}, { deep: false });
    readRemoteFile(file, {
      complete: (results) => {
        this.tests = results.data;
        this.setUpTestBlocks();
      },
    });
  }

  get reactionTime() {
    return this.keyPressTime - this.initialTime;
  }

  setUpTestBlocks = () => {
    if (this.isTestBlocksSet) {
      return;
    }

    this.isTestBlocksSet = true;

    let firstBlock;

    if (this.getRandomNumber(0, 1) === 0) {
      firstBlock = "bl1";
    } else {
      firstBlock = "bl2";
    }

    this.firstTestSet = this.tests.filter((test) => test[0] === firstBlock);
    this.secondTestSet = this.tests.filter((test) => test[0] !== firstBlock);

    this.randomizeTestLists();
  };

  // eslint-disable-next-line class-methods-use-this
  randomizeTestLists() {
    this.firstTestSet = shuffle(this.firstTestSet);
    this.secondTestSet = shuffle(this.secondTestSet);
  }

  selectTestFromList() {
    if (this.testNo > this.firstTestSet.length - 1 && this.isFirstTestBlock) {
      this.testNo = 0;
      this.isFirstTestBlock = false;
    }

    if (this.testNo > this.secondTestSet.length - 1 && this.isSecondTestBlock) {
      this.isTrialConcluded = true;
      this.concludeTrial();
      return;
    }

    if (this.isFirstTestBlock) {
      this.currentTestArray = this.firstTestSet[this.testNo];
    } else {
      this.currentTestArray = this.secondTestSet[this.testNo];
    }

    this.testNo += 1;

    this.rotationDegrees = this.getRandomNumber(0, 175);

    this.applyTestParameters();
  }

  // eslint-disable-next-line class-methods-use-this
  concludeTrial() {}

  applyTestParameters() {
    this.occluderType = this.currentTestArray[0];
    this.occluderOrientation = this.currentTestArray[1];
    this.letterMatchType = this.currentTestArray[2];
    this.circleShowLetter = this.currentTestArray[3];

    if (this.occluderOrientation === "lev") {
      this.reversedOccluder = true;
    } else {
      this.reversedOccluder = false;
    }

    if (this.occluderType === "bl2") {
      this.selectedOccluder = rectangle;
    } else if (this.reversedOccluder === true) {
      this.selectedOccluder = mirrorOccluder;
    } else {
      this.selectedOccluder = occluder;
    }

    this.setInitialLetters();
  }

  setInitialLetters() {
    this.isLettersChanged = false;

    const rand1 = this.getRandomNumber(0, this.usedLetterList.length - 1);
    let tempNumber = this.getRandomNumber(0, this.usedLetterList.length - 1);
    while (tempNumber === rand1) {
      tempNumber = this.getRandomNumber(0, this.usedLetterList.length - 1);
    }
    const rand2 = tempNumber;

    this.circleLLetter = this.usedLetterList[rand1];
    this.circleLInitialLetter = this.usedLetterList[rand1];
    this.circleRLetter = this.usedLetterList[rand2];
    this.circleRInitialLetter = this.usedLetterList[rand2];
  }

  changeLetters() {
    this.isLettersChanged = true;

    this.thirdLetter = "";

    switch (this.letterMatchType) {
      case "nm":
        this.noMatchScenario();
        break;
      case "mc":
        this.matchCongruentScenario();
        break;
      case "mi":
        this.matchIncongruentScenario();
        break;
      case "m":
        this.matchCongruentScenario();
        break;
      default:
        break;
    }
  }

  noMatchScenario() {
    this.thirdLetter = this.getUnusedCharacter();

    if (this.circleShowLetter === "d2") {
      this.circleLLetter = " ";
      this.circleRLetter = this.thirdLetter;
    } else {
      this.circleRLetter = " ";
      this.circleLLetter = this.thirdLetter;
    }
  }

  matchCongruentScenario() {
    if (this.circleShowLetter === "d2") {
      this.circleLLetter = " ";
      this.thirdLetter = this.circleRLetter;
    } else {
      this.circleRLetter = " ";
      this.thirdLetter = this.circleLLetter;
    }
  }

  matchIncongruentScenario() {
    this.circleRLetter = this.circleLInitialLetter;
    this.circleLLetter = this.circleRInitialLetter;

    if (this.circleShowLetter === "d2") {
      this.circleLLetter = " ";
      this.thirdLetter = this.circleRLetter;
    } else {
      this.circleRLetter = " ";
      this.thirdLetter = this.circleLLetter;
    }
  }

  // eslint-disable-next-line class-methods-use-this
  getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  getUnusedCharacter() {
    const unusedCharacterList = [...this.usedLetterList].filter(
      (letter) =>
        letter !== this.circleLInitialLetter &&
        letter !== this.circleRInitialLetter
    );

    let chosenLetter;

    if (Math.floor(Math.random()) === 0) {
      chosenLetter =
        unusedCharacterList[
          this.getRandomNumber(0, unusedCharacterList.length - 1)
        ];
    } else if (Math.round(Math.random()) === 0) {
      chosenLetter = this.circleLInitialLetter;
    } else {
      chosenLetter = this.circleRInitialLetter;
    }

    return chosenLetter;
  }

  setInitialValues() {
    this.initialTime = 0;
    this.keyPressTime = 0;
    this.setInitialLetters();
  }

  setStartingRecordedTime() {
    this.initialTime = getTime(new Date());
    console.log("RECORDING STARTED");
  }

  setKeyPress(pressedKey) {
    console.log("KEY PRESSED");

    if (pressedKey === "j" && this.letterMatchType === "nm") {
      this.isGotMatch = true;
    } else if (
      pressedKey === "f" &&
      (this.letterMatchType === "m" ||
        this.letterMatchType === "mi" ||
        this.letterMatchType === "mc")
    ) {
      this.isGotMatch = true;
    } else {
      this.isGotMatch = false;
    }

    const currentTime = getTime(new Date());
    if (this.keyPressTime === 0) {
      this.keyPressTime = currentTime;
      const letterCombination = `${this.circleLInitialLetter}${this.circleRInitialLetter}${this.thirdLetter}`;
      const testName = `${this.occluderType}_${this.occluderOrientation}_${this.letterMatchType}_${this.circleShowLetter}_${letterCombination}_${this.rotationDegrees}`;
      console.log("KEYPRESS RECORDED");
      console.log("Reaction time: ", this.reactionTime);
      this.lastReactionTime = [testName, this.reactionTime, this.isGotMatch];
      this.lastReactionTimeString = `Test name: ${testName} \n Reaction time: ${this.reactionTime} \n Correct answer: ${this.isGotMatch}`;
      this.reactionTimes.push(this.lastReactionTime);
      window.addRow.addRow(this.lastReactionTime);
      console.log("All results: ", this.reactionTimes);
    } else {
      console.log("A KEYPRESS WAS ALREADY RECORDED");
    }
  }

  setReversedOccluder(isReversed) {
    this.reversedOccluder = isReversed;
  }

  incrementTestNo() {
    this.testNo += 1;
  }

  startTest() {
    this.isTestEnded = false;
    this.isStartTest = true;

    this.currentTestArray = this.selectTestFromList();
  }

  endTest(pressedKey) {
    this.isTestEnded = true;

    if (this.initialTime !== 0) {
      this.isStartTest = false;

      this.setKeyPress(pressedKey);
      this.setInitialValues();
    }
  }
}

export default Store;
