document.addEventListener('DOMContentLoaded', () => {
    // This event listener waits for the DOM content to be fully loaded before 
    //executing its callback function

    //Fetch user data from a remote API endpoint
    fetch('https://dummyjson.com/users?limit=80')
        .then(response => {
            if (!response.ok) {
                throw new Error('Users data can not be fetched');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users; // Extract users array from the response data 
            const userMap = organizeUserData(users);

            // Fetch and display posts
            fetch('https://dummyjson.com/posts?limit=80')
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Posts data can not be fetched');
                    }
                    return response.json();
                })
                .then(data => {
                    const posts = data.posts; //Extract posts array from the response data

                    displayPosts(posts, userMap);
                    fetchCommentsForPosts(posts);
                })
                .catch(error => console.error('Error fetching posts:', error));
        })
        .catch(error => console.error('Error fetching users:', error));
});


function displayPosts(posts, userMap) {
    const postsContainer = document.getElementById('big-all-posts-container');
    posts.forEach(post => {   // Iterate through each post in the posts array
        const postElement = document.createElement('div');
        postElement.classList.add('post-container');
        const authorName = userMap[post.userId] ? `${userMap[post.userId].firstName} ${userMap[post.userId].lastName}` : 'Author Unknown';

        const authorImage = userMap[post.userId] ? `${userMap[post.userId].image}` : 'No image';

        postElement.innerHTML = `
            <div class="image-and-name-container">
            <img src="${authorImage}" alt ="image of the author">
            <p>  <span class="author"  data-user-id="${post.userId}">${authorName}</span> </p>
            <p class="user-id">userId:${post.userId}</p>           
            </div>
           
            <h4>${post.title}</h4>
            <p class="post-body">${post.body}</p>

            <div class="reaction-container">
            <p class="post-comment"> Comments </p>
            <p>reactions:${post.reactions}</p>
            <p class="post-id">postId:${post.id}</p>            
            
            </div>
 
            
            <div class="big-comments-container" id="comments-${post.id}"></div>
        `;

        postsContainer.appendChild(postElement); //Append the post container element to the posts container

        // Add event listener for user name click
        const authorElement = postElement.querySelector('.author');
        authorElement.addEventListener('click', () => {
            const userId = authorElement.getAttribute('data-user-id');
            const user = userMap[userId]; //Get the user data from the user map based on the user ID
            displayUserProfile(user);
        });
    });
}


function fetchCommentsForPosts(posts) {
    posts.forEach(post => {
        
        fetch(`https://dummyjson.com/comments?postId=${post.id}&limit=100`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(comments => displayComments(post.id, comments))
            .catch(error => console.error('Error fetching comments:', error));
    });
}

function displayComments(postId, commentsData) {
    const commentsContainer = document.getElementById(`comments-${postId}`);
    
    if (!commentsData.hasOwnProperty('comments')) {
        console.error('Invalid comments data:', commentsData);
        return;
    }
    
    const comments = commentsData.comments;

    const postComments = comments.filter(comment => comment.postId === postId);

    postComments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.classList.add('small-comments-container');
        commentElement.innerHTML = `
            <p>${comment.body}</p>

            <div class="comment-name-and-id">
            <p>By: ${comment.user.username}</p>
            <p>id: ${comment.id}</p>
            <p>postId: ${comment.postId}</p>
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });
}


function displayUserProfile(user) {
    const userProfilePopupBox = document.getElementById('userProfilePopupBox');
    const userProfilePopupBoxDetails = document.getElementById('userProfilePopupBoxDetails');

    userProfilePopupBoxDetails.innerHTML = `
        <h2>User Profile</h2>
        <p><strong>Name:</strong> ${user.firstName} ${user.lastName}</p>
        <p><strong>Age:</strong> ${user.age}</p>
        <p><strong>Gender:</strong> ${user.gender}</p>
        <p><strong>Email:</strong> ${user.email}</p>        
    `;

    userProfilePopupBox.style.display = 'block';

    // Close modal when close button or outside modal is clicked
    const closeBtn = document.getElementsByClassName('close')[0];
    closeBtn.onclick = function() {
        userProfilePopupBox.style.display = 'none';
    }

    window.onclick = function(event) {
        if (event.target == userProfilePopupBox) {
            userProfilePopupBox.style.display = 'none';
        }
    }
}

function organizeUserData(users) {
    if (!Array.isArray(users)) {  // Check if the users data is an array
        console.error('Invalid users data:', users);
        return {};
    }

    const userMap = {}; // Initialize an empty object to store user data

    users.forEach(user => {    // Iterate through each user in the users array        
        userMap[user.id] = user; //Add user data to the user map with user ID as the key
    });
    return userMap;
}

