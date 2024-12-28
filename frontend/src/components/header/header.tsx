import { FC, useEffect, useState } from 'react';

const Header: FC = () => {
  const [greeting, setGreeting] = useState('Good Day!');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setGreeting('Good Morning!');
    } else if (hour < 18) {
      setGreeting('Good Afternoon!');
    } else {
      setGreeting('Good Evening!');
    }
  }, []);

  return (
    <div className="bg-blue-900 p-4 text-white">
      <h1 className="text-xl">{greeting}</h1>
    </div>
  );
};

export default Header;
