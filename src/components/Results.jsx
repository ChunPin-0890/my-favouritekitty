import '../styles/Results.css';

const Results = ({ likedCats, onBack }) => {
  return (
    <div className="results-container">
      <h2>Your Cat Preferences</h2>
      
      <div className="stats">
        <p>Total liked: <strong>{likedCats.length}</strong></p>
        {likedCats.length > 0 && (
          <p>Most common tags: <strong>{getTopTags(likedCats)}</strong></p>
        )}
      </div>

      <div className="liked-cats-grid">
        {likedCats.map((cat, index) => (
          <div key={`${cat.id}-${index}`} className="cat-card">
            <img src={cat.url} alt={`Liked cat ${index + 1}`} />
            {cat.tags?.length > 0 && (
              <div className="tags">
                {cat.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <button onClick={onBack} className="back-button">
        Back to Swiping
      </button>
    </div>
  );
};

// Helper function to analyze tags
const getTopTags = (cats) => {
  const tagCounts = {};
  cats.forEach(cat => {
    cat.tags?.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const sortedTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag]) => tag);
  
  return sortedTags.length > 0 ? sortedTags.join(', ') : 'No tags';
};

export default Results;