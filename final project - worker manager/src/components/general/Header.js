import { Link } from "react-router-dom";
import { parseJwt } from "./utils";

function Header() {
  const token = localStorage.getItem('token');
  let isAdmin = false;
  let isUser = false;

  if (token) {
    const decodedToken = parseJwt(token);
    isAdmin = decodedToken && decodedToken.role === 'admin';
    isUser = decodedToken && decodedToken.role === 'user';
  }

  return (
    <>
      <nav className="container-fluid bg-warning text-center text-white p-3">

        {isAdmin && (
          <div className="row align-items-start">
            <h2 className="col-6" href="#">
              <Link to="/admin" className="nav-link active">
                <i className="bi bi-clipboard-check"></i> Admin home page</Link>
            </h2>
            <h2 className="col-6" href="#">
              <Link to="/about" className="nav-link active">About</Link>
            </h2>
          </div>
        )}
      {isUser && (
        <div className="row align-items-start">
          <p className="col-4" href="#">
            <Link to="/" className="nav-link active">Home</Link>
          </p>
          <p className="col-4" href="#">
            <Link to="/workers" className="nav-link active">Workers</Link>
          </p>
          <p className="col-4" href="#">
            <Link to="/about" className="nav-link active">About</Link>
          </p>
        </div>
      )}

    </nav >

    </>
  );
}

export default Header;
