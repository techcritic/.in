document.getElementById('search-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    
    fetch('/reviews.json')
        .then(response => response.json())
        .then(reviews => {
            const results = reviews.filter(review => 
                review.productName.toLowerCase().includes(searchTerm)
            );

            if (results.length > 0) {
                displaySearchResults(results);
            } else {
                alert('No match found.');
            }
        });
});

function displaySearchResults(results) {
    const resultContainer = document.getElementById('search-results');
    resultContainer.innerHTML = '';

    results.forEach(review => {
        const reviewItem = document.createElement('div');
        reviewItem.innerText = `Product: ${review.productName} - Review: ${review.review}`;
        resultContainer.appendChild(reviewItem);
    });
}
