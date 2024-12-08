// Function to preserve line breaks when rendering text
function preserveLineBreaks(text) {
    return text.replace(/\n/g, '<br>'); // Replace \n with <br>
  }
  // Function to make URLs in the review text clickable
function makeLinksClickable(text) {
    const urlPattern = /(https?:\/\/[^\s]+)/g; // Regular expression to match URLs
}
  
  // Fetch reviews from the server and display them
  function loadReviews() {
    fetch('/reviews')
      .then((response) => response.json())
      .then((reviews) => {
        const reviewsContainer = document.getElementById('reviews-container');
        reviewsContainer.innerHTML = ''; // Clear existing reviews
  
        reviews.forEach(({ product, review }) => {
          const reviewElement = document.createElement('div');
          reviewElement.className = 'review';
          reviewElement.innerHTML = `
            <h3>${product}</h3>
            <p>${preserveLineBreaks(review)}</p> <!-- Apply the function -->
          `;
          reviewsContainer.appendChild(reviewElement);
        });
      })
      .catch((error) => {
        console.error('Error loading reviews:', error);
      });
  }
  

  // Call loadReviews when the page loads
  document.addEventListener('DOMContentLoaded', loadReviews); 

// Handle login
document.getElementById('login-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  fetch('/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
  })
      .then(response => response.json())
      .then(data => {
          const message = document.getElementById('login-message');
          if (data.success) {
              window.location.href = '/submit-review.html';
          } else {
              message.textContent = 'Login failed. Please try again.';
          }
      });
});

// Handle search
document.getElementById('search-form')?.addEventListener('submit', (e) => {
  e.preventDefault();
  const searchQuery = document.getElementById('search').value;

  fetch(`/search-reviews?query=${searchQuery}`)
      .then(response => response.json())
      .then(data => {
          const searchResults = document.getElementById('search-results');
          searchResults.innerHTML = '';

          if (data.length === 0) {
              searchResults.innerHTML = '<p>No matching products found.</p>';
          } else {
              data.forEach(review => {
                  const resultDiv = document.createElement('div');
                  resultDiv.innerHTML = `<h3>${review.product}</h3><p>${review.review}</p>`;
                  searchResults.appendChild(resultDiv);
              });
          }
      });
});

document.addEventListener('DOMContentLoaded', () => {
    const teamContainer = document.getElementById('team-container');

    // Team members array
    const teamMembers = [
        {
            name: 'Raghavendra',
            role: 'Founder and Managing Editor',
            description: 'Raghavendra establishes the publications vision and oversees both its editorial content and business operations.',
        },
        {
            name: 'Manoj Kumar',
            role: 'Lead Developer',
            description: 'Manoj Kumar is an experienced developer who specializes in backend technologies.'
        },
        {
            name: 'Praveen Kumar',
            role: 'UI/UX Designer',
            description: 'Praveen Kumar focuses on creating beautiful and user-friendly designs'
        },
        {
            name: 'Pavan Rao',
            role: 'Project Manager',
            description: 'Pavan Rao is responsible for ensuring the project runs smoothly.'
        }
        // Add more members as needed
    ];

    // Dynamically create and insert team member cards
    teamMembers.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.classList.add('team-member');

        memberDiv.innerHTML = `
            <h3>${member.name}</h3>
            <p>Role: ${member.role}</p>
            <p>${member.description}</p>
        `;

        teamContainer.appendChild(memberDiv);
    });
});
// Handle Signup Form Submission
document.getElementById('signupForm').onsubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: e.target.username.value,
            email: e.target.email.value,
            password: e.target.password.value,
        }),
    });
    const data = await response.json();
    alert(data.error || 'Signup successful!');
};

    document.addEventListener('DOMContentLoaded', () => {
        const loginForm = document.getElementById('loginForm');
        const errorMessage = document.getElementById('errorMessage');
    
        if (!loginForm || !errorMessage) {
            console.error('Required DOM elements are missing.');
            return;
        }
    
        // Handle login form submission
        loginForm.onsubmit = async (e) => {
            e.preventDefault(); // Prevent default form submission behavior
    
            const email = e.target.email.value;
            const password = e.target.password.value;
    
            try {
                // Send login request to the server
                const response = await fetch('/user-login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });
    
                const data = await response.json();
    
                if (response.ok && data.success) {
                    // Redirect to My Profile page
                    window.location.href = '/my-profile.html';
                } else {
                    // Display error message
                    errorMessage.innerText = data.error || 'Login failed.';
                }
            } catch (error) {
                console.error('Error during login:', error);
                errorMessage.innerText = 'An error occurred. Please try again.';
            }
        };
    });
    
