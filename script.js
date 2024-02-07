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
            fetchCommentsForPosts(posts);
        })
        .catch(error => console.error('Error fetching posts:', error));

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
});


function displayPosts(posts) {
    const postsContainer = document.getElementById('posts');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.body}</p>
            <p>id:${post.id}</p>
            <p>userId:${post.userId}</p>
            <p>reactions:${post.reactions}</p>
            <p>tags:${post.tags}</p>
            <p>Author: <span class="author" data-user-id="${post.userId}">User Name</span></p>
            <div class="comments" id="comments-${post.id}"></div>
        `;
        postsContainer.appendChild(postElement);
    });
}

function fetchCommentsForPosts(posts) {
    posts.forEach(post => {
        fetch(`https://dummyjson.com/comments?postId=${post.id}`)
        //appending the postId of the current post to the URL as a query parameter. 
        //This is done using string interpolation ${post.id} to insert the id of 
        //the current post into the URL.
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json(); //converts the response from a stream to a JSON object.
            })
            .then(comments => displayComments(post.id, comments))
             // Passing the id of the current post (post.id) and the comments data as parameters
             //in the displayComment function
            .catch(error => console.error('Error fetching comments:', error));
    });
}

function displayComments(postId, commentsData) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    
    // Check if 'comments' property exists in the data
    if (!commentsData.hasOwnProperty('comments')) {
        console.error('Invalid comments data:', commentsData);
        return;
    }
    
    const comments = commentsData.comments;

    // Filter comments based on postId
    const postComments = comments.filter(comment => comment.postId === postId);

    // Append filtered comments to the commentsContainer
    postComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('comment');
        commentElement.innerHTML = `
            <p>${comment.body}</p>
            <p>By: ${comment.user.username}</p>
            <p>id: ${comment.id}</p>
            <p>postId: ${comment.postId}</p>
        `;
        commentsContainer.appendChild(commentElement);
    });
}




function organizeUserData(users) {
    // Ensure users is an array
    if (!Array.isArray(users)) {
        console.error('Invalid users data:', users);
        return {};
    }

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

