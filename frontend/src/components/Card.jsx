function Card({ icon, title, desc, color }) {
  return (
    <div className="card">
      <img src={icon} className="card-icon" />
      <h3 className={`card-title ${color}`}>{title}</h3>
      <p className="card-desc">{desc}</p>
    </div>
  );
}

export default Card;
