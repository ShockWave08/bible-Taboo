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
    if (cardsCount < 1) {
      getCardsCount();
    }

    if (allStoredAnswers.length < 1) {
      getAllAnswers();
    }
  }, [cardsCount, allStoredAnswers]);

  // get the number of cards stored in the firestore
  const getCardsCount = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, ''));
    let arr = [];
    querySnapshot.forEach((doc) => {
      arr.push(doc.data());
    });

    setCardsCount(arr.length);
  }, []);

  //  const getCardsCount = useCallback(() => {
  //   const querySnapshot = await getDocs(collection(db, ''));
  //   let count;
  //   querySnapshot.forEach((doc) => {
  //     count++;
  //   });

  //   setCardsCount(count);
  // },[])

  //   use useCallback, or create a new parameter where you can pass setState to the function
  // normally people choose the useCallback solution
  // but the later one has better performance

  const getAllAnswers = useCallback(async () => {
    const querySnapshot = await getDocs(collection(db, 'taboo-cards'));
    let tempArr = [];
    querySnapshot.forEach((doc) => {
      tempArr.push(doc.data().answer);
    });
    setAllStoredAnswers(tempArr);
    window.localStorage.setItem('allStoredAnswers', JSON.stringify(tempArr));
  }, []);

  // push new cards to the database
  async function handleSubmit(e) {
    e.preventDefault();
    if (handleErrors()) {
      setSuccess('Successfully Uploaded');
      const docRef = await addDoc(collection(db, 'taboo-cards'), {
        answer: answer,
        tabooed: tabooedWords,
      });
      console.log('Document written wit ID:', docRef.id);
      setCardsCount((count) => count + 1);
      setTimeout(() => {
        setSuccess('');
      }, 3000);
      setAnswer('');
      setTabooedWords('');
    }
  }

  function handleErrors() {
    if (answer.length < 1 && tabooedWords.length < 1) {
      setanswerHasError(true);
      setwordsHasError(true);
      setError('Please enter a values in all fields');
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }
    if (!Array.isArray(tabooedWords)) {
      setwordsHasError(true);
      setError('Please use commas to seperate words');
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }
    if (
      tabooedWords.length > 5 ||
      tabooedWords.length < 5 ||
      tabooedWords.length !== 5
    ) {
      setwordsHasError(true);
      setError('Please enter 5 words seperated by commas');
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }
    if (answer.length < 3) {
      setanswerHasError(true);
      setError('Please enter a valid value for Answer');
      setTimeout(() => {
        setError('');
      }, 3000);
      return false;
    }
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
        {error.length < 1 || (
          <div className="h-auto w-3/6 m-2">
            <p className="p-3 text-center text-red-600">{error}</p>
          </div>
        )}
        {success.length < 1 || (
          <div className="h-auto w-3/6 m-2">
            <p className="p-3 text-center text-green-600">{success}</p>
          </div>
        )}

        <form className="h-auto w-3/6 p-4 border border-grey-100 rounded-xl shadow-xl">
          <div className="h-auto w-full mb-4">
            <input
              className="h-auto w-full py-2 px-2 border border-grey-400 focus:border-grey-900 rounded-lg"
              type="text"
              name=""
              id=""
              placeholder="Enter Answer"
              ref={answerRef}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
            />
          </div>
          <div className="h-auto w-full">
            <textarea
              className="w-full p-2 border border-grey-400 rounded-lg"
              name=""
              id=""
              cols="30"
              rows="10"
              placeholder="Enter 5 Tabooed Words seperated by a comma"
              ref={tabooedWordsRef}
              value={tabooedWords && tabooedWords.join(',')}
              onChange={(e) => setTabooedWords(e.target.value.split(','))}
            ></textarea>
          </div>

          <div className=" mt-5 mb-3 flex justify-center items-center">
            <button
              type="submit"
              className="py-2 px-9 bg-teal-700 text-white font-bold rounded-full"
              onClick={(e) => handleSubmit(e)}
            >
              Submit
            </button>
          </div>
        </form>

        <div className="h-auto w-2/6 text-center mt-9">
          <p className="font-bold text-xl">
            Cards stored:
            <span className="h-auto w-auto ml-2 p-2 bg-teal-800 text-white font-bold text-xl rounded-full">
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
