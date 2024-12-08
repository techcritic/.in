document.addEventListener('DOMContentLoaded', async () => {
    const reviewsGrid = document.getElementById('reviews-grid');

    const response = await fetch('/api/reviews');
    const reviews = await response.json();

    if (reviews.length > 0) {
        reviews.forEach(review => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${review.title}</h3>
                <p>${review.description}</p>
            `;
            reviewsGrid.appendChild(card);
        });
    } else {
        reviewsGrid.innerHTML = '<p>No reviews to display.</p>';
    }
});
