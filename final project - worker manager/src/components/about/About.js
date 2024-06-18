import Title from "../general/Title";
import { Link } from "react-router-dom";

function About() {
  return (
    <>
      <Title mainTxt="About This App">
        <p className="fs-2">
         so, why it is so important to know how to manage your workers?
        </p>
      </Title> 
      <div className="container text-center mt-5">
        <p className="text-muted">
          as companies we belive in order that makes us do things more efficiently. <br/>
          as long as we know how to orgenize the information the workers needs - <br/>
          our company will grow up and higher and cost less sources to manage the workers.
        </p>
        <Link to="/" className="nav-link active">
          <button className="btn btn-primary">start today</button>
        </Link>
      </div>
    </>
  );
}

export default About;
