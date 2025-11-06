import { useState, useEffect } from "react";

const Pagination = ({ pagination, setPagination }) => {
  const [num, setNum] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
  const pagi_num = Number(pagination);

  useEffect(() => {
    if (pagi_num === num[num.length - 1]) {
      setNum((prev) => [...prev.slice(1), pagi_num + 1]);
    } else if (pagi_num === num[0] && pagi_num > 1) {
      setNum((prev) => [pagi_num - 1, ...prev.slice(0, -1)]);
    }
  }, [pagination]);

  return (
    <div className="flex justify-center flex-wrap mb-3">
      {num.map((i) => (
        <p
          key={i}
          className={`${
            pagi_num === i ? "text-blue-500" : "text-white"
          } mx-2 my-2 text-xl py-3 px-5 bg-dark-100 rounded-full cursor-pointer`}
          onClick={() => setPagination(i)}
        >
          {i}
        </p>
      ))}
    </div>
  );
};

export default Pagination;
