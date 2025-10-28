// Profile picture functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile picture manager initializing...');
    
    const profileManager = ProfilePictureManager.getInstance();
    
    // Initialize profile pictures
    profileManager.init();
    
    // Initialize user data and posts
    initializeUserProfileData();
    initializeProfilePosts();
    setupProfilePostCreation();
    
    // Profile Picture Modal Elements
    const profilePicModal = document.getElementById('profilePicModal');
    const changePhotoBtn = document.getElementById('changePhotoBtn');
    const closeModal = document.getElementById('closeModal');
    const cancelChange = document.getElementById('cancelChange');
    const saveProfilePic = document.getElementById('saveProfilePic');
    const profilePicInput = document.getElementById('profilePicInput');
    const profilePicPreview = document.getElementById('profilePicPreview');
    
    // Cover Photo Modal Elements
    const coverPicModal = document.getElementById('coverPicModal');
    const changeCoverBtn = document.getElementById('changeCoverBtn');
    const closeCoverModal = document.getElementById('closeCoverModal');
    const cancelCoverChange = document.getElementById('cancelCoverChange');
    const saveCoverPic = document.getElementById('saveCoverPic');
    const coverPicInput = document.getElementById('coverPicInput');
    const coverPicPreview = document.getElementById('coverPicPreview');
    
    // Debug: Check if elements exist
    console.log('Profile Modal:', profilePicModal);
    console.log('Save Button:', saveProfilePic);
    console.log('Change Button:', changePhotoBtn);
    
    // Debug current user
    const currentUsername = localStorage.getItem("kentbook_current_user");
    console.log('Current username from localStorage:', currentUsername);
    
    // Initialize with current user's profile picture
    const currentProfilePic = profileManager.getProfilePicture();
    console.log('Current profile picture:', currentProfilePic);
    
    if (document.getElementById('profileImage')) {
        document.getElementById('profileImage').src = currentProfilePic;
    }
    if (document.getElementById('profileImageSmall')) {
        document.getElementById('profileImageSmall').src = currentProfilePic;
    }
    
    // Set preview to current picture
    if (profilePicPreview) {
        profilePicPreview.src = currentProfilePic;
    }
    
    // Open Profile Picture Modal
    if (changePhotoBtn) {
        changePhotoBtn.addEventListener('click', function() {
            console.log('Change photo button clicked');
            if (profilePicPreview) {
                profilePicPreview.src = profileManager.getProfilePicture();
            }
            if (profilePicModal) {
                profilePicModal.style.display = 'flex';
            }
        });
    }
    
    // Open Cover Photo Modal
    if (changeCoverBtn) {
        changeCoverBtn.addEventListener('click', function() {
            console.log('Change cover button clicked');
            if (coverPicModal) {
                coverPicModal.style.display = 'flex';
            }
        });
    }
    
    // Close Modals
    function closeModals() {
        console.log('Closing modals...');
        if (profilePicModal) {
            profilePicModal.style.display = 'none';
            console.log('Profile modal hidden');
        }
        if (coverPicModal) {
            coverPicModal.style.display = 'none';
            console.log('Cover modal hidden');
        }
        // Reset file inputs
        if (profilePicInput) profilePicInput.value = '';
        if (coverPicInput) coverPicInput.value = '';
    }
    
    // Add close event listeners
    if (closeModal) {
        closeModal.addEventListener('click', closeModals);
    }
    if (cancelChange) {
        cancelChange.addEventListener('click', closeModals);
    }
    if (closeCoverModal) {
        closeCoverModal.addEventListener('click', closeModals);
    }
    if (cancelCoverChange) {
        cancelCoverChange.addEventListener('click', closeModals);
    }
    
    // Profile Picture Preview
    if (profilePicInput) {
        profilePicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (profilePicPreview) {
                        profilePicPreview.src = e.target.result;
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Cover Photo Preview
    if (coverPicInput) {
        coverPicInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    if (coverPicPreview) {
                        coverPicPreview.src = e.target.result;
                    }
                }
                reader.readAsDataURL(file);
            }
        });
    }
    
    // Save Profile Picture
    if (saveProfilePic) {
        saveProfilePic.addEventListener('click', function() {
            console.log('Save profile picture clicked');
            
            let imageData = null;
            
            if (profilePicInput.files && profilePicInput.files[0]) {
                const file = profilePicInput.files[0];
                console.log('File selected:', file);
                
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    console.log('File read successfully');
                    imageData = e.target.result;
                    console.log('Image data length:', imageData.length);
                    saveProfilePictureAction(imageData);
                };
                
                reader.onerror = function(e) {
                    console.error('Error reading file:', e);
                    showNotification('Error reading image file!');
                };
                
                reader.readAsDataURL(file);
            } else {
                console.log('No file selected, using preview');
                imageData = profilePicPreview ? profilePicPreview.src : profileManager.getProfilePicture();
                console.log('Preview image data:', imageData ? imageData.substring(0, 50) + '...' : 'null');
                saveProfilePictureAction(imageData);
            }
        });
    }
    
    // Helper function to save profile picture
    function saveProfilePictureAction(imageData) {
        console.log('Saving profile picture action started...');
        console.log('Image data type:', typeof imageData);
        
        if (!imageData) {
            console.error('No image data provided!');
            showNotification('Error: No image data!');
            return;
        }
        
        try {
            console.log('Calling profileManager.setProfilePicture...');
            
            // Update profile picture globally
            const success = profileManager.setProfilePicture(imageData);
            console.log('setProfilePicture result:', success);
            
            if (success) {
                // Update the profile images on the page immediately
                if (document.getElementById('profileImage')) {
                    document.getElementById('profileImage').src = imageData;
                }
                if (document.getElementById('profileImageSmall')) {
                    document.getElementById('profileImageSmall').src = imageData;
                }
                
                // Close modal FIRST
                console.log('Closing modals...');
                closeModals();
                
                // Show success message
                showNotification('Profile picture updated successfully!');
                
                // Force refresh of Backbone views after a short delay
                setTimeout(() => {
                    if (window.App && window.App.postsView) {
                        console.log('Refreshing posts view...');
                        App.postsView.render();
                    }
                }, 100);
            } else {
                // Debug why setProfilePicture failed
                const currentUsername = localStorage.getItem("kentbook_current_user");
                console.error('setProfilePicture failed. Current username:', currentUsername);
                console.error('LocalStorage kentbook_users:', localStorage.getItem("kentbook_users"));
                
                // Try direct save as fallback
                console.log('Attempting direct save as fallback...');
                try {
                    const username = localStorage.getItem("kentbook_current_user");
                    if (username) {
                        const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                        userPictures[username] = imageData;
                        localStorage.setItem('kentbook_user_profile_pictures', JSON.stringify(userPictures));
                        console.log('Direct save successful!');
                        
                        // Update the profile images on the page immediately
                        if (document.getElementById('profileImage')) {
                            document.getElementById('profileImage').src = imageData;
                        }
                        if (document.getElementById('profileImageSmall')) {
                            document.getElementById('profileImageSmall').src = imageData;
                        }
                        
                        // Close modal
                        closeModals();
                        
                        // Show success message
                        showNotification('Profile picture updated successfully!');
                        
                        // Refresh views
                        setTimeout(() => {
                            if (window.App && window.App.postsView) {
                                App.postsView.render();
                            }
                        }, 100);
                    } else {
                        throw new Error('No username found in localStorage');
                    }
                } catch (fallbackError) {
                    console.error('Fallback save also failed:', fallbackError);
                    showNotification('Error: Could not save profile picture. Please try again.');
                }
            }
            
        } catch (error) {
            console.error('Error in saveProfilePictureAction:', error);
            console.error('Error stack:', error.stack);
            showNotification('Error updating profile picture: ' + error.message);
        }
    }
    
    // Save Cover Photo
    if (saveCoverPic) {
        saveCoverPic.addEventListener('click', function() {
            console.log('Save cover photo clicked');
            
            if (coverPicInput.files && coverPicInput.files[0]) {
                const file = coverPicInput.files[0];
                const reader = new FileReader();
                
                reader.onload = function(e) {
                    // Update cover photo
                    const coverPhoto = document.querySelector('.cover-photo img');
                    if (coverPhoto) {
                        coverPhoto.src = e.target.result;
                    }
                    
                    // Save to localStorage
                    localStorage.setItem('kentbook_cover_pic', e.target.result);
                    
                    // Close modal FIRST
                    closeModals();
                    
                    // Show success message
                    showNotification('Cover photo updated successfully!');
                };
                
                reader.onerror = function(e) {
                    console.error('Error reading cover photo file:', e);
                    showNotification('Error reading cover photo file!');
                };
                
                reader.readAsDataURL(file);
            } else {
                // If no file selected, just close the modal
                closeModals();
            }
        });
    }
    
    // Load saved cover photo
    const savedCoverPic = localStorage.getItem('kentbook_cover_pic');
    if (savedCoverPic) {
        const coverPhoto = document.querySelector('.cover-photo img');
        if (coverPhoto) {
            coverPhoto.src = savedCoverPic;
        }
        if (coverPicPreview) {
            coverPicPreview.src = savedCoverPic;
        }
    }
    
    // Utility function to show notifications
    function showNotification(message) {
        console.log('Showing notification:', message);
        
        try {
            // Remove any existing notifications first
            const existingNotifications = document.querySelectorAll('.custom-notification');
            existingNotifications.forEach(notification => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            });
            
            // Create notification element
            const notification = document.createElement('div');
            notification.className = 'custom-notification';
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                background: #1877f2;
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 10000;
                font-weight: 500;
                box-shadow: 0 2px 10px rgba(0,0,0,0.2);
                animation: slideIn 0.3s ease-out;
            `;
            notification.textContent = message;
            
            // Add CSS animation if not already added
            if (!document.getElementById('notification-styles')) {
                const style = document.createElement('style');
                style.id = 'notification-styles';
                style.textContent = `
                    @keyframes slideIn {
                        from {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                        to {
                            transform: translateX(0);
                            opacity: 1;
                        }
                    }
                    @keyframes slideOut {
                        from {
                            transform: translateX(0);
                            opacity: 1;
                        }
                        to {
                            transform: translateX(100%);
                            opacity: 0;
                        }
                    }
                `;
                document.head.appendChild(style);
            }
            
            document.body.appendChild(notification);
            
            // Remove after 3 seconds
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOut 0.3s ease-in';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.parentNode.removeChild(notification);
                        }
                    }, 300);
                }
            }, 3000);
            
        } catch (error) {
            console.error('Error showing notification:', error);
            // Fallback to alert
            alert(message);
        }
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (profilePicModal && e.target === profilePicModal) {
            closeModals();
        }
        if (coverPicModal && e.target === coverPicModal) {
            closeModals();
        }
    });
    
    console.log('Profile picture manager initialized successfully');
});

// Function to initialize user profile data
function initializeUserProfileData() {
    const currentUsername = localStorage.getItem("kentbook_current_user");
    const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    const currentUser = users.find(u => u.username === currentUsername);
    
    if (currentUser) {
        console.log('Found current user:', currentUser);
        
        // Update profile name
        const profileNameElement = document.getElementById('profileUserName');
        if (profileNameElement) {
            profileNameElement.textContent = currentUser.name || `${currentUser.firstName} ${currentUser.lastName}`;
        }
        
        // Update post input placeholder
        const postInput = document.querySelector('.post-input');
        if (postInput) {
            postInput.placeholder = `What's on your mind, ${currentUser.firstName || currentUser.name}?`;
        }
        
        // Update intro section with user data
        updateIntroSection(currentUser);
    } else {
        console.log('No current user found in localStorage');
    }
}

// Function to update intro section with user data
function updateIntroSection(user) {
    const introItems = document.querySelectorAll('.intro-item');
    
    // Update location if available
    if (user.location) {
        const locationItem = introItems[0];
        if (locationItem) {
            locationItem.querySelector('span').textContent = `Lives in ${user.location}`;
        }
    }
    
    // Update workplace if available
    if (user.workplace) {
        const workItem = introItems[1];
        if (workItem) {
            workItem.querySelector('span').textContent = `Works at ${user.workplace}`;
        }
    }
    
    // Update education if available
    if (user.education) {
        const educationItem = introItems[2];
        if (educationItem) {
            educationItem.querySelector('span').textContent = `Studied at ${user.education}`;
        }
    }
}

// Function to initialize profile posts
function initializeProfilePosts() {
    const currentUsername = localStorage.getItem("kentbook_current_user");
    const users = JSON.parse(localStorage.getItem("kentbook_users")) || [];
    const currentUser = users.find(u => u.username === currentUsername);
    
    if (!currentUser) {
        console.log('No current user found for posts');
        return;
    }
    
    // Get user's posts from localStorage
    const appData = JSON.parse(localStorage.getItem('kentbook_data_v1')) || {};
    const posts = appData.posts || [];
    
    console.log('Total posts found:', posts.length);
    
    // Filter posts by current user - FIXED LOGIC
    const userPosts = posts.filter(post => {
        // Get the current user's ID from localStorage users
        const currentUserData = users.find(u => u.username === currentUsername);
        if (!currentUserData) return false;
        
        // Simple matching: if post has user_id 1 or matches current user's name
        return post.user_id === 1 || 
               (currentUserData.name && post.body && post.body.includes(currentUserData.name));
    });
    
    console.log('User posts found:', userPosts.length);
    
    // Update posts count
    const postsCountElement = document.getElementById('profilePostsCount');
    if (postsCountElement) {
        postsCountElement.textContent = `${userPosts.length} posts`;
    }
    
    // Render user posts
    renderProfilePosts(userPosts, currentUser);
}

// Function to render profile posts
function renderProfilePosts(posts, user) {
    const profileRight = document.querySelector('.profile-right');
    if (!profileRight) return;
    
    // Remove existing hardcoded posts (keep the create post card)
    const existingPosts = profileRight.querySelectorAll('.post-card');
    existingPosts.forEach(post => {
        if (!post.classList.contains('create-post-card')) {
            post.remove();
        }
    });
    
    console.log('Rendering', posts.length, 'posts for user:', user.name);
    
    // Add user's posts
    posts.forEach(postData => {
        const postElement = createPostElement(postData, user);
        // Insert after the create post card
        const createPostCard = profileRight.querySelector('.create-post-card');
        if (createPostCard) {
            createPostCard.insertAdjacentElement('afterend', postElement);
        }
    });
    
    // If no posts, show empty state
    if (posts.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'post-card';
        emptyState.innerHTML = `
            <div class="post-header">
                <img src="${user.avatar || '../images/pp.png'}" alt="${user.name}">
                <div class="post-user-info">
                    <div class="post-user-name">${user.name}</div>
                </div>
            </div>
            <div class="post-content" style="text-align: center; padding: 40px;">
                <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                <h3 style="margin-bottom: 8px;">No posts yet</h3>
                <p style="color: var(--muted);">Share your first post!</p>
            </div>
        `;
        
        const createPostCard = profileRight.querySelector('.create-post-card');
        if (createPostCard) {
            createPostCard.insertAdjacentElement('afterend', emptyState);
        }
    }
}

// Function to create post element
function createPostElement(postData, user) {
    const postElement = document.createElement('div');
    postElement.className = 'post-card';
    
    const timeAgo = getTimeAgo(postData.created_at);
    const profileManager = ProfilePictureManager.getInstance();
    const userAvatar = profileManager.getProfilePicture();
    
    postElement.innerHTML = `
        <div class="post-header">
            <img src="${userAvatar}" alt="${user.name}">
            <div class="post-user-info">
                <div class="post-user-name">${user.name}</div>
                <div class="post-time">${timeAgo} · <svg width="12" height="12" viewBox="0 0 16 16" fill="#65676b"><path d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zm0 13V8l4 2-4 2v2z"/></svg></div>
            </div>
            <button class="post-options-btn">···</button>
        </div>
        <div class="post-content">
            ${escapeHtml(postData.body)}
        </div>
        ${postData.image ? `
            <div class="post-image">
                <img src="${postData.image}" alt="Post image">
            </div>
        ` : ''}
        <div class="post-stats">
            <div class="post-likes">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="#ffffff">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-5.03-2.76a.5.5 0 0 0-.97.24v4a.5.5 0 0 0 .97.24l1-4a.5.5 0 0 0 0-.48l-1-4zM4.5 6.5A.5.5 0 0 0 4 7v2a.5.5 0 0 0 1 0V7a.5.5 0 0 0-.5-.5zm3 0a.5.5 0 0 0-.5.5v2a.5.5 0 0 0 1 0V7a.5.5 0 0 0-.5-.5z"/>
                </svg>
                <span>${postData.likes || 0}</span>
            </div>
            <div class="post-comments">${postData.comments || 0} comments · ${postData.shares || 0} shares</div>
        </div>
        <div class="post-actions">
            <button class="post-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#65676b">
                    <path d="M18.77 11h-4.23l1.52-4.94C16.38 5.03 15.54 4 14.38 4c-.58 0-1.14.24-1.52.65L7 11H3v10h14.43c1.06 0 1.98-.67 2.19-1.61l1.34-6c.31-1.37-.73-2.39-2.19-2.39zM7 20H4v-8h3v8zm12.57-7l-1.34 6H9v-8l4.65-5.97C13.7 4.62 14.06 4.5 14.38 4.5c.28 0 .54.13.73.37l4.41 5.66.01.01.01-.01.02.01-1.99 7.99z"/>
                </svg>
                <span>Like</span>
            </button>
            <button class="post-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#65676b">
                    <path d="M20 2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4V4c0-1.1-.9-2-2-2zm-3 12H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1zm0-3H7c-.55 0-1-.45-1-1s.45-1 1-1h10c.55 0 1 .45 1 1s-.45 1-1 1z"/>
                </svg>
                <span>Comment</span>
            </button>
            <button class="post-action">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#65676b">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                </svg>
                <span>Share</span>
            </button>
        </div>
    `;
    
    return postElement;
}

// Helper function to calculate time ago
function getTimeAgo(createdAt) {
    if (!createdAt) return 'Just now';
    
    const created = new Date(createdAt);
    const now = new Date();
    const diffMs = now - created;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return diffMins + ' mins';
    if (diffHours < 24) return diffHours + ' hrs';
    if (diffDays < 7) return diffDays + ' days';
    return created.toLocaleDateString();
}

// Helper function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Add this to profile.js to handle post creation
function setupProfilePostCreation() {
    const postInput = document.querySelector('.post-input');
    const postActionBtns = document.querySelectorAll('.post-action-btn');
    
    if (postInput) {
        postInput.addEventListener('click', function() {
            // Redirect to home page to create post
            window.location.href = '../index.html';
        });
    }
    
    // Make post action buttons functional
    postActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            window.location.href = '../index.html';
        });
    });
}