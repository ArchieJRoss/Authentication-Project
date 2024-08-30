import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  return (
    <div>
      <h1>Home</h1>
      <p>Welcome to the home page. Log in by clicking the button below.</p>
      <button onClick={handleLoginClick}>Login</button>
    </div>
  );
}

export default Home;