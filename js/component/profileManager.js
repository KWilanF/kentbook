// Profile Picture Manager - Singleton pattern
const ProfilePictureManager = (function() {
    let instance;
    let currentProfilePic = '../images/pp.png'; // Default profile picture
    
    function createInstance() {
        return {
            // Set profile picture
            setProfilePicture: function(newImageSrc) {
                currentProfilePic = newImageSrc;
                this.updateBackboneUserModel();
                this.updateAllProfilePictures();
                this.saveToLocalStorage();
                
                // Trigger custom event for Backbone views - ADDED THIS LINE
                $(document).trigger('profilePictureChanged');
            },
            
            // Get current profile picture
            getProfilePicture: function() {
                const savedPic = localStorage.getItem('kentbook_profile_pic');
                return savedPic || currentProfilePic;
            },
            
            // Update Backbone User model with new profile picture
            updateBackboneUserModel: function() {
                // Get current user from localStorage
                const currentUsername = localStorage.getItem("kentbook_current_user");
                const localStorageUsers = JSON.parse(localStorage.getItem("kentbook_users")) || [];
                const currentUserData = localStorageUsers.find(u => u.username === currentUsername);
                
                if (currentUserData && window.App && window.App.users) {
                    // Find the current user in Backbone users collection
                    const currentBackboneUser = App.users.find(user => 
                        user.get('name') === currentUserData.name || 
                        user.get('email') === currentUserData.email
                    );
                    
                    if (currentBackboneUser) {
                        console.log("Updating Backbone user model avatar");
                        currentBackboneUser.set('avatar', currentProfilePic);
                        
                        // Trigger change event to re-render views
                        App.users.trigger('change');
                        App.posts.trigger('change');
                    }
                }
            },
            
            // Update all profile picture elements on the page
            updateAllProfilePictures: function() {
                // Update DOM elements directly
                const profileImages = document.querySelectorAll(
                    'img[alt="Kent Wilan"], img[alt="user"], #profileImage, #profileImageSmall, .avatar, .profile-photo img, .story img[src*="pp.png"]'
                );
                
                profileImages.forEach(img => {
                    if (img.tagName === 'IMG') {
                        // Only update if it's a profile picture (not story backgrounds, etc.)
                        if (img.src.includes('pp.png') || 
                            img.alt.includes('Kent') || 
                            img.alt.includes('user') ||
                            img.classList.contains('avatar')) {
                            img.src = currentProfilePic + '?t=' + new Date().getTime();
                        }
                    }
                });
                
                // Update specific elements with more precision
                this.updateSpecificElements();
            },
            
            // Update specific elements that need special handling
            updateSpecificElements: function() {
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
            
            // Save to localStorage
            saveToLocalStorage: function() {
                localStorage.setItem('kentbook_profile_pic', currentProfilePic);
            },
            
            // Load from localStorage
            loadFromLocalStorage: function() {
                const savedPic = localStorage.getItem('kentbook_profile_pic');
                if (savedPic) {
                    currentProfilePic = savedPic;
                    this.updateBackboneUserModel();
                    this.updateAllProfilePictures();
                }
            },
            
            // Initialize
            init: function() {
                this.loadFromLocalStorage();
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
                    // Small delay to ensure DOM is updated
                    setTimeout(() => {
                        this.updateAllProfilePictures();
                    }, 100);
                });
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