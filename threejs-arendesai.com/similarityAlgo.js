const urls = [
  "https://example.com/products/wireless-headphones",
  "https://example.com/blog/top-10-wireless-devices",
  "https://example.com/support/headphone-troubleshooting",
  "https://example.com/products/bluetooth-speakers"
];

export function findMostSimilarUrl(phrase, urls) {
  // Preprocess the phrase and URLs
  const normalizedPhrase = phrase.toLowerCase().replace(/[^\w\s]/g, '');
  const phraseWords = normalizedPhrase.split(/\s+/).filter(word => word.length > 2);
  
  // Create a simple score for each URL
  const urlScores = urls.map(url => {
    // Extract words from the URL by replacing non-alphanumeric chars with spaces
    const urlNormalized = url.toLowerCase().replace(/[^\w\s]/g, ' ');
    const urlWords = urlNormalized.split(/\s+/).filter(word => word.length > 2);
    
    // Calculate word overlap score (simple but effective)
    let matchScore = 0;
    
    // Count matching words
    phraseWords.forEach(word => {
      if (urlWords.some(urlWord => urlWord.includes(word) || word.includes(urlWord))) {
        matchScore += 1;
      }
    });
    
    // Bonus for consecutive word matches
    for (let i = 0; i < phraseWords.length - 1; i++) {
      const twoWordPhrase = phraseWords[i] + phraseWords[i + 1];
      if (urlNormalized.includes(twoWordPhrase)) {
        matchScore += 0.5;
      }
    }
    
    return { url, score: matchScore };
  });
  
  // Sort by score (descending) and return the best match
  urlScores.sort((a, b) => b.score - a.score);
  return urlScores[0].url;
}

const userPhrase = "do you have any top wireless equipment?";
const bestMatch = findMostSimilarUrl(userPhrase, urls);
console.log(`Best match: ${bestMatch}`);