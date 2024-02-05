document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display posts
    fetch('https://dummyjson.com/posts')
        .then(response => response.json())
        .then(posts => displayPosts(posts));

    // Fetch user data
    fetch('https://dummyjson.com/users')
        .then(response => response.json())
        .then(users => {
            // Organize user data into an object or class
            const userMap = organizeUserData(users);

            // Add click event to posts for displaying user profiles
            document.getElementById('posts').addEventListener('click', (event) => {
                const userId = event.target.dataset.userId;
                if (userId) {
                    displayUserProfile(userMap[userId]);
                }
            });
        });

    // Fetch comments and display them for each post
    fetch('https://dummyjson.com/comments')
        .then(response => response.json())
        .then(comments => displayComments(comments));

    // Validate contact form
    const contactForm = document.getElementById('contactForm');
    contactForm.addEventListener('input', validateForm);
    contactForm.addEventListener('submit', submitForm);
});

function displayPosts(posts) {
    // Display posts on the page
}

function organizeUserData(users) {
    // Organize user data into an object or class
    // Return the organized data
}

function displayUserProfile(user) {
    // Display user profile information in a modal
}

function displayComments(comments) {
    // Display comments for each post
}

function validateForm() {
    // Validate the contact form
    // Enable or disable the "Send" button based on validation
}

function submitForm(event) {
    // Handle form submission
    event.preventDefault();
    // Implement form submission logic
}
