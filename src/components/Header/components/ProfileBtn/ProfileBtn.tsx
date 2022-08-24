import { useNavigate } from 'react-router-dom';

export default function ProfileBtn() {
  const navigate = useNavigate();

  const handleBtn = () => {
    navigate('/profile');
  };

  return (
    <button onClick={handleBtn} type="button" className="signIn">
      К профилю
    </button>
  );
}
