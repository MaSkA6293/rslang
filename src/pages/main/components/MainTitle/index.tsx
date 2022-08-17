import './index.scss';

function MainTitle() {
  return (
    <section className="main-title">
      <div className="main-title__image" />
      <div className="main-title__text-container">
        <h1 className="main-title__title">RSLang</h1>
        <p className="main-title__subtitle">
          Изучать английский язык с нами - весело и интересно!
        </p>
      </div>
    </section>
  );
}

export default MainTitle;
