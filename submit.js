document.getElementById('submit-review-button').addEventListener('click', (e) => {
  e.preventDefault();

  const product = document.getElementById('product').value.trim();
  const review = document.getElementById('review-text').value.trim();

  if (!product || !review) {
    alert('Please provide both the product name and review.');
    return;
  }

  fetch('/submit-review', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ product, review }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        alert('Review submitted successfully!');
        window.location.href = '/index.html'; // Redirect to home page
      } else {
        alert(data.error || 'Error submitting the review.');
      }
    })
    .catch((error) => {
      console.error('Error submitting review:', error);
      alert('Error submitting the review.');
    });
});
