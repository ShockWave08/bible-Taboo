import { useEffect, useState, useRef, useCallback } from 'react';
import { db } from '../../firebase';
import { collection, getDocs, addDoc } from 'firebase/firestore';

const Upload = () => {
  const [cardsCount, setCardsCount] = useState(0);
  const [allStoredAnswers, setAllStoredAnswers] = useState([]);
  const [answer, setAnswer] = useState('');
  const [tabooedWords, setTabooedWords] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [answerHasError, setanswerHasError] = useState(false);
  const [wordsHasError, setwordsHasError] = useState(false);

  const answerRef = useRef(null);
  const tabooedWordsRef = useRef(null);

  useEffect(() => {
    getCardsCount();
    getAllAnswers();
  }, []);

  // get the number of cards stored in the firestore
  const getCardsCount = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'taboo-cards'));
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });

    setCardsCount(arr.length);
  }, []);

  const getAllAnswers = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'taboo-cards'));
    let tempArr = [];
    querySnapshot.forEach((doc) => {
      tempArr.push(doc.data().answer);
    });
    setAllStoredAnswers(tempArr);
  }, []);

  // push new cards to the database
  async function handleSubmit(e) {
    e.preventDefault();
    if (handleErrors()) {
      const docRef = await addDoc(collection(db, 'taboo-cards'), {
        answer: answer,
        tabooed: tabooedWords,
      });
      getCardsCount();
    }
  }

  function handleErrors() {
    if (allStoredAnswers.some((ans) => ans === answer)) {
      setanswerHasError(true);
      setError('There is already are card for this Answer');
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }

    return true;
  }

  return (
    <main>
      <h1 className="text-3xl text-center font-bold">Upload Data</h1>
      <div className="h-screen w-screen flex justify-center items-center flex-col">
        <form className="h-auto w-3/6 p-4 border border-grey-100 rounded-xl shadow-xl">
          <div className="h-auto w-full mb-4">
            <input value={answer} onChange={(e) => setAnswer(e.target.value)} />
          </div>
          <div className="h-auto w-full">
            <textarea
              value={tabooedWords && tabooedWords.join(',')}
              onChange={(e) => setTabooedWords(e.target.value.split(','))}
            ></textarea>
          </div>

          <div className="">
            <button type="submit" className="" onClick={(e) => handleSubmit(e)}>
              Submit
            </button>
          </div>
        </form>

        <div className="h-auto w-2/6 text-center mt-9">
          <p className="font-bold text-xl">
            Cards stored:
            <span className="">
              {/* Show number of cards in database */}
              {cardsCount}
            </span>
          </p>
        </div>
      </div>
    </main>
  );
};

export default Upload;
