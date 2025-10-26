// Profile page functionality
document.addEventListener('DOMContentLoaded', function() {
  // DOM elements
  const changePhotoBtn = document.getElementById('changePhotoBtn');
  const changeCoverBtn = document.getElementById('changeCoverBtn');
  const profilePicModal = document.getElementById('profilePicModal');
  const coverPicModal = document.getElementById('coverPicModal');
  const closeModal = document.getElementById('closeModal');
  const closeCoverModal = document.getElementById('closeCoverModal');
  const cancelChange = document.getElementById('cancelChange');
  const cancelCoverChange = document.getElementById('cancelCoverChange');
  const profilePicInput = document.getElementById('profilePicInput');
  const coverPicInput = document.getElementById('coverPicInput');
  const saveProfilePic = document.getElementById('saveProfilePic');
  const saveCoverPic = document.getElementById('saveCoverPic');
  const profileImage = document.getElementById('profileImage');
  const profileImageSmall = document.getElementById('profileImageSmall');
  const profilePicPreview = document.getElementById('profilePicPreview');
  const coverPicPreview = document.getElementById('coverPicPreview');
  const coverPhoto = document.querySelector('.cover-photo img');

  // Show modal when change photo button is clicked
  changePhotoBtn.addEventListener('click', function() {
    profilePicModal.style.display = 'flex';
  });

  // Show modal when change cover button is clicked
  changeCoverBtn.addEventListener('click', function() {
    coverPicModal.style.display = 'flex';
  });

  // Close modal when X is clicked
  closeModal.addEventListener('click', function() {
    profilePicModal.style.display = 'none';
    profilePicInput.value = '';
  });

  closeCoverModal.addEventListener('click', function() {
    coverPicModal.style.display = 'none';
    coverPicInput.value = '';
  });

  // Close modal when cancel is clicked
  cancelChange.addEventListener('click', function() {
    profilePicModal.style.display = 'none';
    profilePicInput.value = '';
  });

  cancelCoverChange.addEventListener('click', function() {
    coverPicModal.style.display = 'none';
    coverPicInput.value = '';
  });

  // Close modal when clicking outside the modal content
  window.addEventListener('click', function(event) {
    if (event.target === profilePicModal) {
      profilePicModal.style.display = 'none';
      profilePicInput.value = '';
    }
    if (event.target === coverPicModal) {
      coverPicModal.style.display = 'none';
      coverPicInput.value = '';
    }
  });

  // Preview profile picture when file is selected
  profilePicInput.addEventListener('change', function() {
    const file = this.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        this.value = '';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        this.value = '';
        return;
      }
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Update preview image
        profilePicPreview.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Preview cover photo when file is selected
  coverPicInput.addEventListener('change', function() {
    const file = this.files[0];
    
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file (JPEG, PNG, etc.)');
        this.value = '';
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Please select an image smaller than 5MB');
        this.value = '';
        return;
      }
      
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Update preview image
        coverPicPreview.src = e.target.result;
      };
      
      reader.readAsDataURL(file);
    }
  });

  // Handle profile picture change
  saveProfilePic.addEventListener('click', function() {
    const file = profilePicInput.files[0];
    
    if (file) {
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Update profile image with the new image
        profileImage.src = e.target.result;
        profileImageSmall.src = e.target.result;
        
        // In a real application, you would send this to the server
        // For now, we'll store it in localStorage
        localStorage.setItem('kentbook_profile_pic', e.target.result);
        
        // Close the modal
        profilePicModal.style.display = 'none';
        profilePicInput.value = '';
        
        // Show success message
        alert('Profile picture updated successfully!');
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image to upload');
    }
  });

  // Handle cover photo change
  saveCoverPic.addEventListener('click', function() {
    const file = coverPicInput.files[0];
    
    if (file) {
      // Create a FileReader to read the image
      const reader = new FileReader();
      
      reader.onload = function(e) {
        // Update cover photo with the new image
        coverPhoto.src = e.target.result;
        
        // In a real application, you would send this to the server
        // For now, we'll store it in localStorage
        localStorage.setItem('kentbook_cover_pic', e.target.result);
        
        // Close the modal
        coverPicModal.style.display = 'none';
        coverPicInput.value = '';
        
        // Show success message
        alert('Cover photo updated successfully!');
      };
      
      reader.readAsDataURL(file);
    } else {
      alert('Please select an image to upload');
    }
  });

  // Load saved profile picture from localStorage if available
  const savedProfilePic = localStorage.getItem('kentbook_profile_pic');
  if (savedProfilePic) {
    profileImage.src = savedProfilePic;
    profileImageSmall.src = savedProfilePic;
  }

  // Load saved cover photo from localStorage if available
  const savedCoverPic = localStorage.getItem('kentbook_cover_pic');
  if (savedCoverPic) {
    coverPhoto.src = savedCoverPic;
  }

  // Handle navigation active states
  const navItems = document.querySelectorAll('.profile-nav li');
  navItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      navItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
      
      // In a real application, you would load the appropriate content
      // based on which tab was clicked
    });
  });

  // Handle top navigation active states
  const topNavItems = document.querySelectorAll('.topbar .icon-btn');
  topNavItems.forEach(item => {
    item.addEventListener('click', function() {
      // Remove active class from all items
      topNavItems.forEach(navItem => navItem.classList.remove('active'));
      
      // Add active class to clicked item
      this.classList.add('active');
    });
  });

  // Handle post actions
  const postActions = document.querySelectorAll('.post-action');
  postActions.forEach(action => {
    action.addEventListener('click', function() {
      const actionText = this.querySelector('span').textContent;
      
      // In a real application, this would trigger the appropriate action
      // For now, we'll just log it
      console.log(`${actionText} button clicked`);
    });
  });

  // Handle post options
  const postOptionsBtns = document.querySelectorAll('.post-options-btn');
  postOptionsBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      // In a real application, this would show a menu of options
      alert('Post options menu would appear here');
    });
  });
});