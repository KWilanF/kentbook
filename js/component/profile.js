// Profile picture functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Profile picture manager initializing...');
    
    const profileManager = ProfilePictureManager.getInstance();
    
    // Initialize profile pictures
    profileManager.init();
    
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