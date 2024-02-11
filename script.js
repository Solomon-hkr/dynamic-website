let currentPage = 1; 
const postsPerPage = 4; 
let loading = false;


document.addEventListener('DOMContentLoaded', () => {    
    fetch('https://dummyjson.com/users?limit=80')
        .then(response => {
            if (!response.ok) {
                throw new Error('Users data cannot be fetched');
            }
            return response.json();
        })
        .then(data => {
            const users = data.users;
            userMap = organizeUserData(users);

            fetchPosts(currentPage, postsPerPage, userMap); //first page
        })
        .catch(error => console.error('Error fetching users:', error));

    window.addEventListener('scroll', () => ManageScrolling(userMap)); //to enable infinite scrolling

        // for form validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const confirmCheckbox = document.getElementById('confirm');
        const submitButton = document.querySelector('button[type="submit"]');
    
        function validateName(name) {
            return /^(?!\s)[a-zA-Z\s]{2,}$/.test(name);
        }
    
        function validateEmail(email) {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        }
    
        function isCheckboxChecked() {
            return confirmCheckbox.checked;
        }    
        
        //Check validity of inputs and update the status
        function updateSubmitButton() {
            if (validateName(nameInput.value) && validateEmail(emailInput.value) && isCheckboxChecked()) {
                submitButton.disabled = false;
            } else {
                submitButton.disabled = true;
            }
        }
    
        //listens the event and calls the update function
        nameInput.addEventListener('input', updateSubmitButton); 
        emailInput.addEventListener('input', updateSubmitButton);
        confirmCheckbox.addEventListener('change', updateSubmitButton); 
    });


function fetchPosts(page, perPage, userMap) {

    loading = true; //prevent simultaneous requests
    
    fetch(`https://dummyjson.com/posts?limit=${perPage}&skip=${(page - 1) * perPage}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Posts data cannot be fetched');
            }
            return response.json();
        })
        .then(data => {
            console.log('Posts data:', data); // Log the data received from the API
            const posts = data.posts;
            displayPosts(posts, userMap);
            fetchCommentsForPosts(posts);
            currentPage++;
            loading = false; // Set loading back to false after data is loaded
        })
        .catch(error => {
            console.error('Error fetching posts:', error);
            loading = false; // Set loading back to false in case of error
        });
}

function ManageScrolling(userMap) {

    if (loading) return; //if data is already being loaded, return

    let scrollPosition = window.innerHeight + window.scrollY;
    let documentHeight = document.body.offsetHeight;

    // Load more data if user has scrolled to the bottom
    if (scrollPosition >= documentHeight - 200) {
        fetchPosts(currentPage, postsPerPage, userMap);
    }
}

function displayPosts(posts, userMap) {
    const postsContainer = document.getElementById('big-all-posts-container');
    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.classList.add('post-container');
        const authorName = userMap[post.userId] ? `${userMap[post.userId].firstName} ${userMap[post.userId].lastName}` : 'Author Unknown';
        const authorImage = userMap[post.userId] ? `${userMap[post.userId].image}` : 'No image';
        postElement.innerHTML = `
            <div class="image-and-name-container">
                <img src="${authorImage}" alt="image of the author">
                <p><span class="author" data-user-id="${post.userId}">${authorName}</span></p>
                <p class="user-id">userId:${post.userId}</p>           
            </div>
            <h4>${post.title}</h4>
            <p class="post-body">${post.body}</p>
            <div class="reaction-container">
                <p class="post-comment"> Comments </p>
                <p class="fas fa-thumbs-up">${post.reactions}</p>
                <p class="post-id">postId:${post.id}</p>            
            </div>
            <div class="big-comments-container" id="comments-${post.id}"></div>
        `;
        postsContainer.appendChild(postElement);
        //event listener for user name click
        const authorElement = postElement.querySelector('.author');
        authorElement.addEventListener('click', () => {
            const userId = authorElement.getAttribute('data-user-id');
            const user = userMap[userId];
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
    const userMap = {};
    users.forEach(user => {
        userMap[user.id] = user;
    });
    return userMap;
}

