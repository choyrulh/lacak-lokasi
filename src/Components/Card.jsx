export const Card = ({ label }) => {
  return (
    <div className="h-[250px] w-[100%} flex flex-row gap-2 justify-evenly">
      {label.map((item) => (
        <div
          key={item.id}
          className=" h-[250px] w-40 relative hover:scale-125 hover:z-10 transition all ease-in-out duration-200 cursor-pointer "
        >
          <img
            src={`https://image.tmdb.org/t/p/w500${item.poster_path}`}
            className="object-fill w-[100%] h-[100%] rounded-lg"
          />
          <div className=" w-full h-[50%] absolute bottom-0 rounded-b-lg bg-gradient-to-t from-black to-transparent flex flex-row justify-center">
            <h2 className="absolute bottom-2 ">
              {item.title ? item.title : item.name}
            </h2>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;
