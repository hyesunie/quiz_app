import React, { ReactElement, useState, useEffect, createElement } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import { QuizInfo } from './Home';
import './Quiz.css';

const Quiz: React.FC = (): ReactElement => {
  const [isNext, setNext] = useState<boolean>(false);
  // TODO: 전역으로 빼야할듯
  const [isAnswer, setAnswer] = useState<boolean>(false);
  const [clickedElement, setClickedElement] = useState<HTMLLIElement>();
  const { id } = useParams();

  useEffect(() => {
    setNext(false);
    setAnswer(false);
    if (!clickedElement) return;
    clickedElement.style.backgroundColor = 'inherit';
    setClickedElement(clickedElement);
  }, [id]);

  const { state } = useLocation();
  const quizList = state as QuizInfo[];
  const { question, answerIdx, answerList } = quizList[Number(id) - 1];
  const nextId = `/quiz/${Number(id) + 1}`;

  const onClickAnswer = (
    e:
      | React.MouseEvent<HTMLLIElement, MouseEvent>
      | React.KeyboardEvent<HTMLLIElement>
  ): void => {
    const $answer = (e.target as HTMLElement).closest(`li`);
    if (!$answer || isNext) return;
    $answer.style.backgroundColor = 'yellow';
    setClickedElement($answer);
    if ($answer.id === String(answerIdx)) {
      setAnswer(true);
    }
    setNext(true);
  };

  const styles = {
    answer: [{ color: 'green' }, { color: 'red' }],
  };

  return (
    <div className="quiz">
      <section className="quiz-wrapper">
        <div className="quiz__title-wrapper">
          <span className="quiz__title__number">{id}.</span>
          <span className="quiz__title__question">{question}</span>
        </div>
        <ul className="quiz__answer-list">
          {answerList.map((e, idx) => {
            return (
              <li
                key={`${String(idx)}quiz`}
                id={`${idx}`}
                className={isNext ? 'quiz__answer' : 'quiz__answer active'}
                onClick={onClickAnswer}
                onKeyDown={onClickAnswer}
                role="presentation"
              >
                <span>{e}</span>
              </li>
            );
          })}
        </ul>
        {isNext && (
          <article className="quiz__answer-wrapper">
            <div style={isAnswer ? styles.answer[0] : styles.answer[1]}>
              {isAnswer
                ? '정답입니다.'
                : `틀렸습니다. 정답: ${answerIdx + 1}번`}
            </div>
            {Number(id) !== quizList.length ? (
              <Link to={nextId} state={quizList} className="quiz__next-button">
                다음문제
              </Link>
            ) : (
              <Link to="/result" className="quiz__result-button">
                결과보기
              </Link>
            )}
          </article>
        )}
      </section>
    </div>
  );
};

export default Quiz;