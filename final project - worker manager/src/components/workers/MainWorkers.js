import React from 'react';
import Title from "../general/Title";
import Workers from "./Workers";
function MainWorkers() {
  return (
    <>
      <Title mainTxt="Workers">
        <p className="fs-2">
          add new workers to the company list
        </p>
      </Title>
      <div className="container p-5 text-center"><Workers /></div>
    </>
  );
}

export default MainWorkers;