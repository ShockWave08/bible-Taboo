const Timer = (props) => {
  return (
    <div className="h-full w-full bg-teal-900 flex justify-center items-center p-4 select-none">
      <p className="text-white font-bold text-5xl">{props.timer}</p>
    </div>
  );
};

export default Timer;
