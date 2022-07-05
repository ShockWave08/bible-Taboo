import { useState, useEffect, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, getDocs } from 'firebase/firestore';

import Card from '../../components/Card/Card';
import Timer from '../../components/Timer/Timer';
import GameOver from './GameOver';
import { genRandomIndex } from '../../Utils/getRandomIndex';

const Gameplay = () => {
  const [tabooCards, setTabooCards] = useState([
    {
      answer: 'How to play',
      tabooed: ['Swipe card left'],
    },
    {
      answer: 'Great!!',
      tabooed: ['Get the next card'],
    },
    {
      answer: 'Good Job!',
      tabooed: ['Now Swipe Right', 'Get the Previous Card'],
    },
    {
      answer: 'Desktop Players',
      tabooed: ['Use Arrows Below', 'Or', 'Use mouse to drag cards'],
    },
  ]);
  const [tempCards, setTempCards] = useState([]);
  const [cardCounter, setCardCounter] = useState(0);
  const [chosenCard, setChosenCard] = useState(0);
  const [loading, setLoading] = useState(false);
  const [chosenCardList, setChosenCardList] = useState([]);
  const [gameStatus, setGameStatus] = useState('Start');
  const [gameRunning, setgameRunning] = useState(false);
  const [timer, setTimer] = useState(60);
  const [intervalId, setIntervalId] = useState(0);
  const [prevIndex, setPrevIndex] = useState(0);
  const [prevCounter, setPrevCounter] = useState(0);

  // slide
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [animationID, setAnimationID] = useState(0);

  useEffect(() => {
    getCardInfo();
  }, []);

  const getCardInfo = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, ''));
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });
    setTempCards(arr);
    setCardCounter(arr.length);
    setLoading(true);
    //window.localStorage.setItem('tabooCards', JSON.stringify(arr));
  }, []);

  function createCard() {
    const getCards = tabooCards.map((card, i) => (
      <Card
        setSliderPosition={setSliderPosition()}
        onDragStart={(e) => dragStart(e)}
        onTouchStart={() => touchStart(chosenCard)}
        onTouchEnd={touchEnd}
        onTouchMove={touchMove}
        onMouseDown={() => touchStart(chosenCard)}
        onMouseUp={touchEnd}
        onMouseLeave={touchEnd}
        onMouseMove={touchMove}
        cards={Object.entries(card)}
        key={i}
      />
    ));
    return getCards;
  }

  // swipe functions
  function dragStart() {}

  function touchStart(index) {
    return function (event) {
      setIsDragging(true);
      setStartPos(getPositionX(event));
      setAnimationID(requestAnimationFrame(animation));
    };
  }

  function touchEnd() {
    setIsDragging(false);
    cancelAnimationFrame(animationID);

    const movedBy = currentTranslate;

    if (movedBy < -100) {
      if (gameRunning === false && tabooCards.length - 1 > chosenCard) {
        setChosenCard(chosenCard + 1);
      } else {
        setChosenCard(tabooCards.length - 1);
      }

      if (gameRunning) {
        nextCard();
      }
    }

    if (movedBy > 100) {
      if (gameRunning === false && chosenCard > 0) {
        setChosenCard(chosenCard - 1);
      } else {
        setChosenCard(0);
      }

      if (gameRunning) {
        prevCard();
      }
    }

    setPositionByIndex();
  }

  function touchMove(event) {
    if (isDragging) {
      const currentPosition = getPositionX(event);
      setCurrentTranslate(currentPosition - startPos);
    }
  }

  function getPositionX(event) {
    return event.type.includes('mouse')
      ? event.pageX
      : event.touches[0].clientX;
  }

  function animation() {
    setSliderPosition();
    if (isDragging) {
      requestAnimationFrame(animation);
    }
  }

  function setSliderPosition() {
    return `translateX(${currentTranslate}px)`;
  }

  function setPositionByIndex() {
    setCurrentTranslate(0);
    //setPrevTranslate(currentTranslate);
    setSliderPosition();
  }

  // Game Logic

  function startTimer() {
    setTabooCards(tempCards);
    setgameRunning(!gameRunning);
    if (intervalId) {
      clearInterval(intervalId);
      setIntervalId(0);
    }

    if (gameStatus === 'Start') {
      setGameStatus('Pause');
    } else {
      setGameStatus('Start');
    }

    const newIntervalId = setInterval(() => {
      setTimer((prevTime) => prevTime - 1);
    }, 1000);

    setIntervalId(newIntervalId);

    nextCard();
  }

  function nextCard() {
    if (prevCounter > 0) {
      setPrevIndex((prev) => prev + 1);
      setChosenCard(chosenCardList[prevIndex + 1]);
      setPrevCounter((prev) => prev - 1);
    } else {
      let newCardIndex = genRandomIndex(chosenCardList, cardCounter);
      setChosenCardList([...chosenCardList, newCardIndex]);
      setChosenCard(newCardIndex);
    }
  }

  function prevCard() {
    if (chosenCardList.length > 1) {
      let foundIndex = chosenCardList.findIndex((card) => card === chosenCard);

      if (foundIndex === -1) {
        setChosenCard(chosenCardList[0]);
        return;
      }

      if (foundIndex === 0) {
        setChosenCard(chosenCardList[0]);
        return;
      }

      let lastIndex = foundIndex - 1;
      setChosenCard(chosenCardList[lastIndex]);
      setPrevIndex(lastIndex);
      setPrevCounter((prev) => prev + 1);
    } else {
      setChosenCard(chosenCardList[0]);
    }
  }

  function resetGame() {
    clearInterval(intervalId);
    setgameRunning(false);
    setTabooCards([
      {
        answer: '-',
        tabooed: ['-', '-', '-', '-', '-'],
      },
    ]);
    setTimer(60);
    setChosenCardList([]);
    setChosenCard(0);
    setPrevIndex(0);
    setPrevCounter(0);
  }

  return (
    <div className="h-screen overflow-hidden w-screen over m-0 p-0">
      {!loading && (
        <div className="h-screen w-screen flex justify-center items-center flex-col">
          <h3 className="text-blue-800 text-5xl font-bold pb-5">
            Loading cards....
          </h3>
        </div>
      )}
      {loading && timer < 0 && <GameOver reset={resetGame} />}
      {loading && timer > 0 && (
        <div className="h-screen w-screen">
          <header className="h-1/6 w-screen">
            <Timer timer={timer} />
          </header>

          <section className=" h-4/6 w-screen overflow-hidden text-white flex justify-center items-center flex-col">
            {createCard()[chosenCard]}
            <div className="h-auto w-5/12 md:w-3/12 mt-3 md:mt-4 hidden md:flex justify-between items-center flex-row ">
              <button
                className="h-auto w-auto py-3 px-5 bg-blue text-white font-bold text-lg rounded-full cursor-pointer"
                onClick={prevCard}
                disabled={!gameRunning}
              >
                &larr;
              </button>
              <button
                className="h-auto w-auto py-3 px-5 bg-blue text-white font-bold text-lg rounded-full cursor-pointer"
                onClick={nextCard}
                disabled={!gameRunning}
              >
                &rarr;
              </button>
            </div>
          </section>

          <div className="h-1/6 w-screen flex justify-center items-center">
            <button
              type="button"
              className="h-auto w-auto py-5 px-10 bg-blue text-white font-bold text-2xl rounded-full  cursor-pointer"
              onClick={startTimer}
              disabled={gameRunning}
            >
              {gameRunning ? 'Reset' : 'Start'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gameplay;
