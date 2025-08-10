import { Link } from "react-router-dom";

export default function Header() {
  return (
    <Header className="navbar">
      <h1>SecureBooking</h1>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/login">Login</Link>
      </nav>
    </Header>
  );
}
