import { FC } from 'react';

interface CardBoxProps {
  title: string;
  value: number | string;
}

const CardBox: FC<CardBoxProps> = ({ title, value }) => {
  return (
    <div className="bg-gray-300 p-4 text-center rounded shadow hover:shadow-lg transition duration-300">
      <h2 className="text-3xl font-bold">{value}</h2>
      <p>{title}</p>
    </div>
  );
};

export default CardBox;
