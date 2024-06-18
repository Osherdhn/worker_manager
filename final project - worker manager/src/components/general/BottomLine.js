import { Link } from "react-router-dom";
import { parseJwt } from "./utils";
import "./BottomLine.css"
function BottomLine({ removeToken }) {
  const token = localStorage.getItem('token');
  let isUser = false;

  if (token) {
    const decodedToken = parseJwt(token);
    isUser = decodedToken && decodedToken.role === 'user';
  }

  const handleLogout = () => {
    removeToken();
  };

  return (
    <>
      <nav className="navbar fixed-bottom container-fluid bg-warning text-center text-white p-3 ">
        <div className="container-fluid row">
        {isUser && (
          <p className="col-2" href="#">
            <Link to="/" className="nav-link active">
              <i className="bi bi-clipboard-check"></i> 
              Workers Manager
            </Link>
          </p> 
        )}
          <p className="col-2" href="#">
            <Link to="/login" className="nav-link active">
              Login
            </Link>
          </p>
          <p className="col-2" href="#">
            <Link to="/register" className="nav-link active">
              Register
            </Link>
          </p>
          <p className="col-2">
            <button onClick={handleLogout} className="btn btn-outline-danger">
              Log Out
            </button>
          </p>
        </div>
      </nav>
    </>
  );
}

export default BottomLine;
