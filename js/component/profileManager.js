// Profile Picture Manager - Singleton pattern
const ProfilePictureManager = (function() {
    let instance;
    const defaultProfilePic = 'images/pp.png';
    
    function createInstance() {
        return {
            // Set profile picture for current user
            setProfilePicture: function(newImageSrc) {
                const currentUsername = localStorage.getItem("kentbook_current_user");
                if (!currentUsername) return;
                
                // Save to user-specific storage
                this.saveUserProfilePicture(currentUsername, newImageSrc);
                this.updateBackboneUserModel();
                this.updateAllProfilePictures();
                
                // Trigger custom event for Backbone views
                $(document).trigger('profilePictureChanged');
            },
            
            // Get current user's profile picture
            getProfilePicture: function() {
                const currentUsername = localStorage.getItem("kentbook_current_user");
                if (!currentUsername) return defaultProfilePic;
                
                return this.getUserProfilePicture(currentUsername) || defaultProfilePic;
            },
            
            // Get profile picture for specific user
            getUserProfilePicture: function(username) {
                const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                return userPictures[username];
            },
            
            // Save profile picture for specific user
            saveUserProfilePicture: function(username, imageSrc) {
                const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                userPictures[username] = imageSrc;
                localStorage.setItem('kentbook_user_profile_pictures', JSON.stringify(userPictures));
            },
            
            // Update Backbone User model with new profile picture
            updateBackboneUserModel: function() {
                const currentUsername = localStorage.getItem("kentbook_current_user");
                const localStorageUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
                const currentUserData = localStorageUsers.find(u => u.username === currentUsername);
                
                if (currentUserData && window.App && window.App.users) {
                    const currentBackboneUser = App.users.find(user => 
                        user.get('name') === currentUserData.name || 
                        user.get('email') === currentUserData.email
                    );
                    
                    if (currentBackboneUser) {
                        console.log("Updating Backbone user model avatar");
                        currentBackboneUser.set('avatar', this.getProfilePicture());
                        
                        // Trigger change event to re-render views
                        App.users.trigger('change');
                        App.posts.trigger('change');
                    }
                }
            },
            
            // Update all profile picture elements on the page
            updateAllProfilePictures: function() {
                const currentProfilePic = this.getProfilePicture();
                
                // Update DOM elements directly
                const profileImages = document.querySelectorAll(
                    'img[alt="Kent Wilan"], img[alt="user"], #profileImage, #profileImageSmall, .avatar, .profile-photo img, .story img[src*="pp.png"]'
                );
                
                profileImages.forEach(img => {
                    if (img.tagName === 'IMG') {
                        if (img.src.includes('pp.png') || 
                            img.alt.includes('Kent') || 
                            img.alt.includes('user') ||
                            img.classList.contains('avatar')) {
                            img.src = currentProfilePic + '?t=' + new Date().getTime();
                        }
                    }
                });
                
                this.updateSpecificElements();
            },
            
            // Update specific elements with more precision
            updateSpecificElements: function() {
                const currentProfilePic = this.getProfilePicture();
                
                // Update header dropdown avatar
                const headerAvatar = document.querySelector('.dropdown-profile .avatar');
                if (headerAvatar) {
                    headerAvatar.src = currentProfilePic;
                }
                
                // Update left sidebar avatar
                const sidebarAvatar = document.querySelector('.left-sidebar .avatar');
                if (sidebarAvatar) {
                    sidebarAvatar.src = currentProfilePic;
                }
                
                // Update story create story image
                const createStoryImg = document.querySelector('.create-story img');
                if (createStoryImg) {
                    createStoryImg.src = currentProfilePic;
                }
                
                // Update composer avatar
                const composerAvatar = document.querySelector('#composer .avatar');
                if (composerAvatar) {
                    composerAvatar.src = currentProfilePic;
                }
            },
            
            // Initialize for current user
            init: function() {
                this.updateAllProfilePictures();
                
                // Listen for Backbone collection changes to update avatars
                if (window.App && window.App.users) {
                    this.setupBackboneListeners();
                }
            },
            
            // Setup listeners for Backbone events
            setupBackboneListeners: function() {
                // Re-render posts when user data changes
                App.users.on('change', () => {
                    console.log('Users collection changed, updating avatars');
                    this.updateAllProfilePictures();
                });
                
                // Also listen for posts rendering
                App.posts.on('add remove reset', () => {
                    setTimeout(() => {
                        this.updateAllProfilePictures();
                    }, 100);
                });
            },
            
            // Clean up user data (optional - for account deletion)
            deleteUserProfilePicture: function(username) {
                const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                delete userPictures[username];
                localStorage.setItem('kentbook_user_profile_pictures', JSON.stringify(userPictures));
            }
        };
    }
    
    return {
        getInstance: function() {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();