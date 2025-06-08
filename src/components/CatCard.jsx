import '../styles/CatCard.css'

const CatCard = ({ cat }) => {
  return (
    <div className="cat-card">
      <img src={cat.url} alt="Random cat" />
    </div>
  )
}

export default CatCard