document.addEventListener('DOMContentLoaded', () => {
    fetch('/reviews.json')
        .then(response => response.json())
        .then(reviews => {
            const reviewsContainer = document.getElementById('reviews-list');
            reviewsContainer.innerHTML = '';

            reviews.forEach((review, index) => {
                const reviewElement = document.createElement('div');
                reviewElement.innerHTML = `
                    <p><strong>${review.productName}</strong>: ${review.reviewText}</p>
                `;
                reviewsContainer.appendChild(reviewElement);
            });
        });
});
