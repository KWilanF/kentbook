// Profile picture functionality
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Open Profile Picture Modal
    changePhotoBtn.addEventListener('click', function() {
        profilePicPreview.src = profileManager.getProfilePicture();
        profilePicModal.style.display = 'flex';
    });
    
    // Open Cover Photo Modal
    changeCoverBtn.addEventListener('click', function() {
        coverPicModal.style.display = 'flex';
    });
    
    // Close Modals
    function closeModals() {
        profilePicModal.style.display = 'none';
        coverPicModal.style.display = 'none';
    }
    
    closeModal.addEventListener('click', closeModals);
    cancelChange.addEventListener('click', closeModals);
    closeCoverModal.addEventListener('click', closeModals);
    cancelCoverChange.addEventListener('click', closeModals);
    
    // Profile Picture Preview
    profilePicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                profilePicPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
    
    // Cover Photo Preview
    coverPicInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                coverPicPreview.src = e.target.result;
            }
            reader.readAsDataURL(file);
        }
    });
    
// Save Profile Picture
saveProfilePic.addEventListener('click', function() {
    if (profilePicInput.files && profilePicInput.files[0]) {
        const file = profilePicInput.files[0];
        const reader = new FileReader();
        
        reader.onload = function(e) {
            // Update profile picture globally
            profileManager.setProfilePicture(e.target.result);
            closeModals();
            
            // Force refresh of Backbone views
            if (window.App && window.App.postsView) {
                App.postsView.render();
            }
            
            // Show success message
            showNotification('Profile picture updated successfully!');
            
            // Refresh page after a short delay to ensure all updates
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
        
        reader.readAsDataURL(file);
    } else {
        // If no file selected, just update with current preview
        profileManager.setProfilePicture(profilePicPreview.src);
        closeModals();
        
        // Force refresh
        if (window.App && window.App.postsView) {
            App.postsView.render();
        }
    }
});
    
    // Save Cover Photo
    saveCoverPic.addEventListener('click', function() {
        if (coverPicInput.files && coverPicInput.files[0]) {
            const file = coverPicInput.files[0];
            const reader = new FileReader();
            
            reader.onload = function(e) {
                // Update cover photo
                const coverPhoto = document.querySelector('.cover-photo img');
                coverPhoto.src = e.target.result;
                
                // Save to localStorage
                localStorage.setItem('kentbook_cover_pic', e.target.result);
                
                closeModals();
                showNotification('Cover photo updated successfully!');
            }
            
            reader.readAsDataURL(file);
        }
    });
    
    // Load saved cover photo
    const savedCoverPic = localStorage.getItem('kentbook_cover_pic');
    if (savedCoverPic) {
        const coverPhoto = document.querySelector('.cover-photo img');
        coverPhoto.src = savedCoverPic;
    }
    
    // Utility function to show notifications
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
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
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === profilePicModal) {
            profilePicModal.style.display = 'none';
        }
        if (e.target === coverPicModal) {
            coverPicModal.style.display = 'none';
        }
    });
});