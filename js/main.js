import { CELL_VALUE, GAME_STATUS, TURN } from "./constants.js";
import {
  getCellElementAtIdx,
  getCellElementList,
  getCellListElement,
  getCurrentTurnElement,
  getGameStatusElement,
  getRelayButtonElement,
} from "./selectors.js";
import { checkGameStatus } from "./utils.js";

/**
 * Global variables
 */
let currentTurn = TURN.CROSS;
let cellValues = new Array(9).fill("");

let gameStatus = GAME_STATUS.PLAYING;
/**
 * TODOs
 *
 * 1. Bind click event for all cells
 * 2. On cell click, do the following:
 *    - Toggle current turn
 *    - Mark current turn to the selected cell
 *    - Check game state: win, ended or playing
 *    - If game is win, highlight win cells
 *    - Not allow to re-click the cell having value.
 *
 * 3. If game is win or ended --> show replay button.
 * 4. On replay button click --> reset game to play again.
 *
 */

function toggleTurn() {
  currentTurn = currentTurn === TURN.CROSS ? TURN.CIRCLE : TURN.CROSS;

  const currentTurnElement = getCurrentTurnElement();
  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }
}

function updateGameStatus(status) {
  gameStatus = status;

  const statusElement = getGameStatusElement();

  if (statusElement) statusElement.textContent = gameStatus;
}

function showReplayButton() {
  const replayButton = getRelayButtonElement();
  if (replayButton) replayButton.classList.add("show");
}

function hideReplayButton() {
  const replayButton = getRelayButtonElement();
  if (replayButton) replayButton.classList.remove("show");
}

function highlightWinCell(winPositions) {
  if (!Array.isArray(winPositions) || winPositions.length !== 3) return;

  for (const position of winPositions) {
    const cell = getCellElementAtIdx(position);
    if (cell) cell.classList.add("win");
  }
}

function handleCellClick(liElement, index) {
  const isEndGame = gameStatus !== GAME_STATUS.PLAYING;
  const isClicked =
    liElement.classList.contains(TURN.CIRCLE) ||
    liElement.classList.contains(TURN.CROSS);

  if (isClicked || isEndGame) return;

  liElement.classList.add(currentTurn);

  cellValues[index] =
    currentTurn === TURN.CROSS ? CELL_VALUE.CROSS : CELL_VALUE.CIRCLE;

  const game = checkGameStatus(cellValues);

  switch (game.status) {
    case GAME_STATUS.ENDED:
    case GAME_STATUS.O_WIN:
    case GAME_STATUS.X_WIN: {
      updateGameStatus(game.status);
      highlightWinCell(game.winPositions);
      showReplayButton();
      break;
    }

    default:
      break;
  }

  toggleTurn();
}

function initCellElementList() {
  const cellElementList = getCellElementList();

  if (!cellElementList) return;

  cellElementList.forEach((cell, index) => {
    cell.dataset.idx = index;
  });

  const cellList = getCellListElement();
  if (cellList) {
    cellList.addEventListener("click", (e) => {
      if (e.target.tagName === "LI") {
        const index = Number(e.target.dataset.idx);
        handleCellClick(e.target, index);
      }
    });
  }
}

function resetGame() {
  currentTurn = TURN.CROSS;
  gameStatus = GAME_STATUS.PLAYING;
  cellValues = cellValues.fill("");

  updateGameStatus(gameStatus);

  const cellElementList = getCellElementList();
  for (const cellElement of cellElementList) {
    cellElement.className = "";
  }
  const currentTurnElement = getCurrentTurnElement();

  if (currentTurnElement) {
    currentTurnElement.classList.remove(TURN.CIRCLE, TURN.CROSS);
    currentTurnElement.classList.add(currentTurn);
  }

  hideReplayButton();
}

function initReplayButton() {
  const replayButton = getRelayButtonElement();
  if (replayButton) {
    replayButton.addEventListener("click", resetGame);
  }
}

(() => {
  initCellElementList();
  initReplayButton();
})();
