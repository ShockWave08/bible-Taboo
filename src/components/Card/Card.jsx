import './card.css';

const Card = (props) => {
  function cardData() {
    const data = props.cards.map((taboo) => {
      if (taboo[0] === 'tabooed') {
        return taboo[1].map((item, i) => {
          return (
            <li key={i} className="text-2xl font-sans">
              {item}
            </li>
          );
        });
      }
    });
    return data;
  }

  return (
    <div
      style={{
        transform: props.setSliderPosition,
        transition: 'all .3s linear)',
      }}
      onDragStart={(e) => e.preventDefault()}
      onTouchStart={props.onTouchStart(props.index)}
      onTouchEnd={props.onTouchEnd}
      onTouchMove={props.onTouchMove}
      onMouseDown={props.onMouseDown(props.index)}
      onMouseUp={props.onMouseUp}
      onMouseLeave={props.onMouseLeave}
      onMouseMove={props.onMouseMove}
      className=" card-cont w-5/6 md:w-3/6 lg:w-2/5 h-5/6 md:h-4/6 text-white bg-white cursor-pointer select-none hover:shadow-xl"
    >
      <div className=" h-1/6 flex justify-center items-center rounded-t-2xl bg-pink mb-1">
        <h1 className="text-4xl font-bold text-center p-3">
          {props.cards[0][0] === 'answer'
            ? props.cards[0][1]
            : props.cards[1][1]}
        </h1>
      </div>
      <ul className="w-auto h-5/6 p-2 flex justify-evenly items-center flex-col rounded-b-2xl bg-blue font-sans ">
        {cardData()}
      </ul>
    </div>
  );
};

export default Card;
