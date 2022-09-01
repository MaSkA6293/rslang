


interface props {
  difficult: number;
  setDifficult: (e: number) => void
}

export default function Difficult({difficult, setDifficult}: props) {
  const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

  return (
    <>
      <p>Выберите уровень</p>
      {levels.map((level, index) => (
        <button key={level} style={{background: difficult === index ? 'red' : 'white'}} onClick={() => setDifficult(index)}>{level}</button>
      ))}
    </>
  );
}
