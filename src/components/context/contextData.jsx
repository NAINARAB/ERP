import React, { createContext, useState } from 'react';

const CurrentCompany = createContext();

const CompanyProvider = ({ children }) => {
  const [compData, setCompData] = useState({
    id: 2,
    Company_Name: 'SM TRADERS'
  });

  return (
    <CurrentCompany.Provider value={{ compData, setCompData} }>
      {children}
    </CurrentCompany.Provider>
  );
};

export { CurrentCompany, CompanyProvider };
