// Profile Picture Manager - Singleton pattern
const ProfilePictureManager = (function() {
    let instance;
    const defaultProfilePic = 'images/pp.png';
    
    function createInstance() {
        const self = {}; // Create object first to maintain context
        
        self.setProfilePicture = function(newImageSrc) {
            console.log('setProfilePicture called with:', newImageSrc ? newImageSrc.substring(0, 50) + '...' : 'null');
            const currentUsername = localStorage.getItem("kentbook_current_user");
            if (!currentUsername) {
                console.error('No current user found');
                return false;
            }
            
            try {
                // Save to user-specific storage
                self.saveUserProfilePicture(currentUsername, newImageSrc);
                self.updateBackboneUserModel();
                self.updateAllProfilePictures();
                
                // Trigger custom event for Backbone views
                $(document).trigger('profilePictureChanged');
                console.log('Profile picture updated successfully for user:', currentUsername);
                return true;
            } catch (error) {
                console.error('Error in setProfilePicture:', error);
                return false;
            }
        };
        
        // Get current user's profile picture
        self.getProfilePicture = function() {
            const currentUsername = localStorage.getItem("kentbook_current_user");
            if (!currentUsername) return defaultProfilePic;
            
            return self.getUserProfilePicture(currentUsername) || defaultProfilePic;
        };
        
        // Get profile picture for specific user
        self.getUserProfilePicture = function(username) {
            try {
                const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                return userPictures[username];
            } catch (e) {
                console.error('Error getting user profile picture:', e);
                return null;
            }
        };
        
        // Save profile picture for specific user
        self.saveUserProfilePicture = function(username, imageSrc) {
            try {
                console.log('Saving profile picture for user:', username);
                const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
                userPictures[username] = imageSrc;
                localStorage.setItem('kentbook_user_profile_pictures', JSON.stringify(userPictures));
                console.log('Profile picture saved successfully');
            } catch (e) {
                console.error('Error saving profile picture:', e);
                throw new Error('Failed to save profile picture: ' + e.message);
            }
        };
        
        // Update Backbone User model with new profile picture
        self.updateBackboneUserModel = function() {
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
                    currentBackboneUser.set('avatar', self.getProfilePicture());
                    
                    // Trigger change event to re-render views
                    App.users.trigger('change');
                    App.posts.trigger('change');
                }
            }
        };
        
        // Update all profile picture elements on the page
        self.updateAllProfilePictures = function() {
            const currentProfilePic = self.getProfilePicture();
            console.log('Updating all profile pictures with:', currentProfilePic);
            
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
            
            self.updateSpecificElements();
        };
        
        // Update specific elements with more precision
        self.updateSpecificElements = function() {
            const currentProfilePic = self.getProfilePicture();
            
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
        };
        
        // Initialize for current user
        self.init = function() {
            console.log('ProfilePictureManager initialized');
            self.updateAllProfilePictures();
            
            // Listen for Backbone collection changes to update avatars
            if (window.App && window.App.users) {
                self.setupBackboneListeners();
            }
        };
        
        // Setup listeners for Backbone events
        self.setupBackboneListeners = function() {
            // Re-render posts when user data changes
            App.users.on('change', () => {
                console.log('Users collection changed, updating avatars');
                self.updateAllProfilePictures();
            });
            
            // Also listen for posts rendering
            App.posts.on('add remove reset', () => {
                setTimeout(() => {
                    self.updateAllProfilePictures();
                }, 100);
            });
        };
        
        // Clean up user data (optional - for account deletion)
        self.deleteUserProfilePicture = function(username) {
            const userPictures = JSON.parse(localStorage.getItem('kentbook_user_profile_pictures') || '{}');
            delete userPictures[username];
            localStorage.setItem('kentbook_user_profile_pictures', JSON.stringify(userPictures));
        };
        
        return self;
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