document.addEventListener('DOMContentLoaded', () => {
    // Fetch and display posts
    fetch('https://dummyjson.com/posts')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        })
        .then(data => {
            const posts = data.posts; // Access the 'posts' array from the response
            displayPosts(posts);
            // Fetch comments for each post and display them
            posts.forEach(post => {
                fetch(`https://dummyjson.com/comments?postId=${post.id}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to fetch comments');
                        }
                        return response.json();
                    })
                    .then(comments => displayComments(post.id, comments))
                    .catch(error => console.error('Error fetching comments:', error));
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
});


    // Fetch user data
    fetch('https://dummyjson.com/users')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch users');
            }
            return response.json();
        })
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
        })
        .catch(error => console.error('Error fetching users:', error));


function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p>Author: <span class="author" data-user-id="${post.userId}">User Name</span></p>
            <div class="comments" id="comments-${post.id}"></div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function displayComments(postId, comments) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p>${comment.body}</p>
            <p>By: ${comment.name}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}

function organizeUserData(users) {
    // Organize user data into an object or class
    // Return the organized data
    const userMap = {};
    users.forEach(user => {
        userMap[user.id] = user;
    });
    return userMap;
}

function displayUserProfile(user) {
    // Display user profile information in a modal
    const modal = document.getElementById('userProfileModal');
    const userProfileDetails = document.getElementById('userProfileDetails');
    userProfileDetails.innerHTML = `
        <h2>User Profile</h2>
        <p>Name: ${user.name}</p>
        <p>Email: ${user.email}</p>
        <p>Website: ${user.website}</p>
    `;
    modal.style.display = 'block';

    // Close modal when user clicks on close button
    const closeBtn = document.querySelector('.close');
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    // Close modal when user clicks anywhere outside of the modal content
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}



