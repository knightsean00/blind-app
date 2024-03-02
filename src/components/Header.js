import logo from "../commons/blind-app-logo.png"

function Header() {
    return (
        <div className="container">
        <div className="row">
          <div className="col-md-12 text-center pt-3">
            <a href="/"><img className="logo" src={logo} alt="Home"/></a>
          </div>
        </div>
      </div>
    );
}

export default Header;
