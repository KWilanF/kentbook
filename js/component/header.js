(function(){
  'use strict';

  window.App = window.App || {};

  // Page templates and content
  App.Pages = {
    friends: `
      <div class="page-content friends-page">
        <div class="friends-header">
          <h1>Friends</h1>
          <div class="friends-tabs">
            <button class="tab-btn active" data-tab="home">Home</button>
            <button class="tab-btn" data-tab="friends">Friends</button>
            <button class="tab-btn" data-tab="requests">Friend Requests</button>
            <button class="tab-btn" data-tab="suggestions">Suggestions</button>
            <button class="tab-btn" data-tab="all">All Friends</button>
            <button class="tab-btn" data-tab="birthdays">Birthdays</button>
          </div>
        </div>

        <div class="friends-content">
          <div class="friends-main">
            <!-- Friend Requests Section -->
            <div class="requests-section">
              <div class="section-header">
                <h2>Friend requests <span class="requests-count">(122)</span></h2>
                <a href="#" class="see-all-link">See all</a>
              </div>
              <div class="requests-grid" id="requests-grid">
                <!-- Friend requests will be populated by JavaScript -->
              </div>
            </div>

            <!-- Suggestions Section -->
            <div class="suggestions-section">
              <div class="section-header">
                <h2>People you may know</h2>
                <a href="#" class="see-all-link">See all</a>
              </div>
              <div class="suggestions-grid" id="suggestions-grid">
                <!-- Suggestions will be populated by JavaScript -->
              </div>
            </div>
          </div>

          <div class="friends-sidebar">
            <!-- Birthdays Section -->
            <div class="sidebar-section">
              <h3>Birthdays</h3>
              <div class="birthdays-list">
                <div class="birthday-item">
                  <div class="birthday-icon">🎂</div>
                  <div class="item-info">
                    <h4>Alex Morgan and 4 others</h4>
                    <p>Birthdays today</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Contacts Section -->
            <div class="sidebar-section">
              <h3>Contacts</h3>
              <div class="contacts-list">
                <div class="contact-item">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Alex Cooper" class="contact-avatar">
                  <div class="item-info">
                    <h4>Alex Cooper</h4>
                  </div>
                </div>
                <div class="contact-item">
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Julie Wilson" class="contact-avatar">
                  <div class="item-info">
                    <h4>Julie Wilson</h4>
                  </div>
                </div>
                <div class="contact-item">
                  <img src="https://randomuser.me/api/portraits/men/22.jpg" alt="John Bates" class="contact-avatar">
                  <div class="item-info">
                    <h4>John Bates</h4>
                  </div>
                </div>
                <div class="contact-item">
                  <img src="https://randomuser.me/api/portraits/women/33.jpg" alt="Emma Roberts" class="contact-avatar">
                  <div class="item-info">
                    <h4>Emma Roberts</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    watch: `
      <div class="page-content watch-page">
        <div class="watch-header">
          <h1>Watch</h1>
          <div class="watch-tabs">
            <button class="tab-btn active" data-tab="for-you">For You</button>
            <button class="tab-btn" data-tab="live">Live</button>
            <button class="tab-btn" data-tab="saved">Saved</button>
            <button class="tab-btn" data-tab="shows">Shows</button>
          </div>
        </div>

        <div class="video-grid" id="video-grid">
          <!-- Video 1: Nature Documentary -->
          <div class="video-card">
            <div class="video-container">
              <video class="video-player" poster="https://images.unsplash.com/photo-1518837695005-2083093ee35b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="video-overlay">
                <button class="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div class="video-duration">2:45</div>
              </div>
            </div>
            <div class="video-info">
              <div class="video-meta">
                <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Nature Channel" class="channel-avatar">
                <div class="video-details">
                  <h3 class="video-title">Amazing Nature Documentary - Wildlife in 4K</h3>
                  <p class="channel-name">Nature Channel</p>
                  <p class="video-stats">1.2M views · 2 days ago</p>
                </div>
              </div>
              <div class="video-actions">
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>15K</span>
                </button>
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Video 2: IT Programming Tutorial -->
          <div class="video-card">
            <div class="video-container">
              <video class="video-player" poster="https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="video-overlay">
                <button class="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div class="video-duration">8:32</div>
              </div>
            </div>
            <div class="video-info">
              <div class="video-meta">
                <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Code Master" class="channel-avatar">
                <div class="video-details">
                  <h3 class="video-title">JavaScript Tutorial: Building a Modern Web App</h3>
                  <p class="channel-name">Code Master</p>
                  <p class="video-stats">850K views · 1 week ago</p>
                </div>
              </div>
              <div class="video-actions">
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>42K</span>
                </button>
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Video 3: Tech Review -->
          <div class="video-card">
            <div class="video-container">
              <video class="video-player" poster="https://images.unsplash.com/photo-1518709268805-4e9042af2176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="video-overlay">
                <button class="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div class="video-duration">4:12</div>
              </div>
            </div>
            <div class="video-info">
              <div class="video-meta">
                <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="Tech Reviews" class="channel-avatar">
                <div class="video-details">
                  <h3 class="video-title">New MacBook Pro M3 Review - Is It Worth It?</h3>
                  <p class="channel-name">Tech Reviews</p>
                  <p class="video-stats">2.1M views · 3 days ago</p>
                </div>
              </div>
              <div class="video-actions">
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>28K</span>
                </button>
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Video 4: AI & Machine Learning -->
          <div class="video-card">
            <div class="video-container">
              <video class="video-player" poster="https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80">
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" type="video/mp4">
                Your browser does not support the video tag.
              </video>
              <div class="video-overlay">
                <button class="play-btn">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
                <div class="video-duration">12:45</div>
              </div>
            </div>
            <div class="video-info">
              <div class="video-meta">
                <img src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80" alt="AI Insights" class="channel-avatar">
                <div class="video-details">
                  <h3 class="video-title">Machine Learning Explained for Beginners</h3>
                  <p class="channel-name">AI Insights</p>
                  <p class="video-stats">950K views · 5 days ago</p>
                </div>
              </div>
              <div class="video-actions">
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                  </svg>
                  <span>36K</span>
                </button>
                <button class="video-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"/>
                  </svg>
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,

    marketplace: `
      <div class="page-content marketplace-page">
        <div class="marketplace-header">
          <h1>Marketplace</h1>
          <div class="marketplace-tabs">
            <button class="tab-btn active" data-tab="browse">Browse All</button>
            <button class="tab-btn" data-tab="buying">Buying</button>
            <button class="tab-btn" data-tab="selling">Selling</button>
            <button class="tab-btn" data-tab="saved">Saved</button>
          </div>
          
          <div class="categories">
            <button class="category-btn active">All Categories</button>
            <button class="category-btn">Vehicles</button>
            <button class="category-btn">Property</button>
            <button class="category-btn">Electronics</button>
            <button class="category-btn">Home & Garden</button>
            <button class="category-btn">Fashion</button>
            <button class="category-btn">Sports</button>
          </div>
        </div>

        <div class="items-grid" id="items-grid">
          <!-- Items will be populated by JavaScript -->
        </div>
      </div>
    `,

    notifications: `
      <div class="page-content notifications-page">
        <div class="notifications-header">
          <h1>Notifications</h1>
          <div class="notifications-tabs">
            <button class="tab-btn active" data-tab="all">All Notifications</button>
            <button class="tab-btn" data-tab="unread">Unread</button>
            <button class="tab-btn" data-tab="mentions">Mentions</button>
            <button class="tab-btn" data-tab="reactions">Reactions</button>
          </div>
        </div>

        <div class="notifications-list" id="notifications-list">
          <!-- Notifications will be populated by JavaScript -->
        </div>
      </div>
    `,

    messages: `
      <div class="page-content messages-page">
        <div class="messages-header">
          <h1>Chats</h1>
          <div class="messages-search">
            <svg class="search-icon" width="16" height="16" viewBox="0 0 16 16" fill="#65676b">
              <path d="M15.7 13.3l-3.8-3.8A5.9 5.9 0 0 0 13 6a6 6 0 1 0-6 6 5.9 5.9 0 0 0 3.5-1.1l3.8 3.8a1 1 0 0 0 1.4 0 1 1 0 0 0 0-1.4zM2 6a4 4 0 1 1 8 0 4 4 0 0 1-8 0z"/>
            </svg>
            <input type="text" placeholder="Search messages" />
          </div>
        </div>

        <div class="messages-container">
          <div class="conversations-sidebar">
            <div class="conversations-list" id="conversations-list">
              <!-- Conversations will be populated by JavaScript -->
            </div>
          </div>

          <!-- Mobile Chat Area -->
          <div class="chat-area">
            <div class="chat-header">
              <!-- Chat header will be populated by JavaScript -->
            </div>
            <div class="messages-area">
              <!-- Messages will be populated by JavaScript -->
            </div>
            <div class="message-input-area">
              <div class="message-input-wrapper">
                <button class="message-action-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/>
                  </svg>
                </button>
                <input type="text" class="message-input" placeholder="Type a message...">
                <button class="send-btn">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>

          <!-- Desktop Empty State -->
          <div class="empty-chat-state">
            <div class="empty-chat-icon">💬</div>
            <h2>Your Messages</h2>
            <p>Send private messages to a friend or group.</p>
            <button class="new-message-btn">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 2a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1h12zM2 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2H2z"/>
                <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
              </svg>
              New Message
            </button>
          </div>
        </div>
      </div>
    `
  };

  // Chat Widgets Manager
  App.ChatWidgets = {
    activeWidgets: new Map(),
    widgetCounter: 0,

    init: function() {
      this.createWidgetsContainer();
    },

    createWidgetsContainer: function() {
      // Remove existing container if any
      const existingContainer = document.querySelector('.chat-widgets-container');
      if (existingContainer) {
        existingContainer.remove();
      }

      // Create new container
      const container = document.createElement('div');
      container.className = 'chat-widgets-container';
      document.body.appendChild(container);
    },

    openChat: function(conversation) {
      // Check if chat is already open
      const existingWidget = this.activeWidgets.get(conversation.id);
      if (existingWidget) {
        // Focus existing widget
        this.focusWidget(conversation.id);
        return;
      }

      // Create new widget
      const widgetId = `chat-widget-${++this.widgetCounter}`;
      const widget = this.createChatWidget(widgetId, conversation);
      
      // Add to container
      const container = document.querySelector('.chat-widgets-container');
      container.appendChild(widget);

      // Store in active widgets
      this.activeWidgets.set(conversation.id, {
        element: widget,
        conversation: conversation,
        minimized: false
      });

      // Setup widget events
      this.setupWidgetEvents(widgetId, conversation.id);
    },

    createChatWidget: function(widgetId, conversation) {
      const widget = document.createElement('div');
      widget.className = 'chat-widget active';
      widget.id = widgetId;
      widget.setAttribute('data-conversation-id', conversation.id);

      widget.innerHTML = `
        <div class="chat-widget-header">
          <div class="chat-widget-header-info">
            <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-widget-avatar">
            <span class="chat-widget-name">${conversation.name}</span>
          </div>
          <div class="chat-widget-actions">
            <button class="chat-widget-btn minimize-btn" title="Minimize">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M14 8v1H3V8h11z"/>
              </svg>
            </button>
            <button class="chat-widget-btn close-btn" title="Close">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854z"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="chat-widget-body">
          <div class="chat-widget-messages">
            ${conversation.messages.map(msg => `
              <div class="chat-widget-message ${msg.sent ? 'sent' : 'received'}">
                <div class="message-text">${msg.text}</div>
                <div class="message-time">${msg.time}</div>
              </div>
            `).join('')}
          </div>
          <div class="chat-widget-input-area">
            <div class="chat-widget-input-wrapper">
              <input type="text" class="chat-widget-input" placeholder="Type a message...">
              <button class="chat-widget-send-btn">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M15.964.686a.5.5 0 0 0-.65-.65L.767 5.855a.5.5 0 0 0-.082.887l.52.52a.5.5 0 0 0 .566.047l4.56-2.28 2.28 4.56a.5.5 0 0 0 .47.28.5.5 0 0 0 .047-.566l-2.28-4.56 4.56-2.28a.5.5 0 0 0 .047-.566l-.52-.52a.5.5 0 0 0-.887-.082L15.964.686z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      `;

      return widget;
    },

    setupWidgetEvents: function(widgetId, conversationId) {
      const widget = document.getElementById(widgetId);
      if (!widget) return;

      const widgetData = this.activeWidgets.get(parseInt(conversationId));
      if (!widgetData) return;

      // Minimize button
      const minimizeBtn = widget.querySelector('.minimize-btn');
      minimizeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleMinimize(conversationId);
      });

      // Close button
      const closeBtn = widget.querySelector('.close-btn');
      closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.closeChat(conversationId);
      });

      // Header click to restore
      const header = widget.querySelector('.chat-widget-header');
      header.addEventListener('click', (e) => {
        if (widgetData.minimized) {
          this.toggleMinimize(conversationId);
        }
      });

      // Send message functionality
      const input = widget.querySelector('.chat-widget-input');
      const sendBtn = widget.querySelector('.chat-widget-send-btn');
      const messagesArea = widget.querySelector('.chat-widget-messages');

      const sendMessage = () => {
        const text = input.value.trim();
        if (text) {
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          const messageHTML = `
            <div class="chat-widget-message sent">
              <div class="message-text">${text}</div>
              <div class="message-time">${currentTime}</div>
            </div>
          `;
          
          messagesArea.innerHTML += messageHTML;
          input.value = '';
          messagesArea.scrollTop = messagesArea.scrollHeight;

          // Auto-reply after 1 second
          setTimeout(() => {
            const replies = [
              "That's interesting!",
              "Tell me more about that.",
              "I see what you mean.",
              "Thanks for sharing!",
              "That's great to hear!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyHTML = `
              <div class="chat-widget-message received">
                <div class="message-text">${randomReply}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            `;
            
            messagesArea.innerHTML += replyHTML;
            messagesArea.scrollTop = messagesArea.scrollHeight;
          }, 1000);
        }
      };

      sendBtn.addEventListener('click', sendMessage);
      input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          sendMessage();
        }
      });
    },

    toggleMinimize: function(conversationId) {
      const widgetData = this.activeWidgets.get(conversationId);
      if (!widgetData) return;

      const widget = widgetData.element;
      widgetData.minimized = !widgetData.minimized;

      if (widgetData.minimized) {
        widget.classList.add('minimized');
      } else {
        widget.classList.remove('minimized');
      }
    },

    closeChat: function(conversationId) {
      const widgetData = this.activeWidgets.get(conversationId);
      if (!widgetData) return;

      widgetData.element.remove();
      this.activeWidgets.delete(conversationId);
    },

    focusWidget: function(conversationId) {
      const widgetData = this.activeWidgets.get(conversationId);
      if (!widgetData) return;

      // Remove minimized state if minimized
      if (widgetData.minimized) {
        this.toggleMinimize(conversationId);
      }

      // Move widget to end of container (bring to front)
      const container = document.querySelector('.chat-widgets-container');
      container.appendChild(widgetData.element);
    }
  };

  // Header functionality
  App.HeaderManager = {
    init: function() {
      console.log('HeaderManager initializing...');
      this.bindMenuButton();
      this.bindDropdownNavigation();
      this.bindSearch();
      this.setupRouter();
      this.bindNavigationButtons();
      this.bindTopbarIcons();
      this.bindSidebarNavigation();
      
      // Initialize chat widgets
      App.ChatWidgets.init();
      
      // Initial page load
      this.handleRoute();
    },

    // Setup simple router
    setupRouter: function() {
      // Handle hash changes
      window.addEventListener('hashchange', this.handleRoute.bind(this));
    },

    // Handle route changes
    handleRoute: function() {
      const hash = window.location.hash.replace('#', '');
      const validRoutes = ['friends', 'watch', 'marketplace', 'notifications', 'messages'];
      
      if (validRoutes.includes(hash)) {
        this.showPage(hash);
      } else {
        this.showHomePage();
      }
    },

    // Show specific page
    showPage: function(page) {
      console.log('Showing page:', page);
      
      // Use the main-content area
      const mainContent = document.querySelector('.main-content');
      if (!mainContent) {
        console.error('Main content area not found');
        return;
      }

      // Show the requested page
      if (App.Pages[page]) {
        mainContent.innerHTML = App.Pages[page];
        
        // Initialize page-specific content
        this.initializePageContent(page);
        
        // Update active state
        this.setActiveIcon(page);
        
        console.log('Page loaded successfully:', page);
      } else {
        console.error('Page template not found:', page);
      }
    },
    
    // Show home page (default content from index.html)
    showHomePage: function() {
      console.log('Showing home page');
      
      const mainContent = document.querySelector('.main-content');
      if (!mainContent) {
        console.error('Main content area not found');
        return;
      }

      // Restore the original home page content from index.html
      mainContent.innerHTML = `
        <div class="page-content home-page">
          <!-- STORIES -->
          <div class="stories-row">
            <div class="story create-story">
              <img src="images/pp.png" alt="Create Story" class="story-bg" />
              <div class="plus-icon">+</div>
              <p>Create Story</p>
            </div>
            <div class="story">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Tom" class="story-bg" />
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="Tom" class="story-avatar" />
              <p>dodo</p>
            </div>
            <div class="story">
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Sarah" class="story-bg" />
              <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="Sarah" class="story-avatar" />
              <p>partner</p>
            </div>
            <div class="story">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Mike" class="story-bg" />
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="Mike" class="story-avatar" />
              <p>kuya do</p>
            </div>
            <div class="story">
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" alt="Emily" class="story-bg" />
              <img src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-1.2.1&auto=format&fit=crop&w=100&q=60" alt="Emily" class="story-avatar" />
              <p>wilan</p>
            </div>
          </div>

          <div id="composer"></div>
          <div id="feed"></div>
        </div>
      `;

      // Initialize home page
      this.initializeHomePage();
      
      // Update active state
      this.setActiveIcon('home');
      
      console.log('Home page loaded successfully');
    },

    // Update active icon in topbar
    setActiveIcon: function(page) {
      console.log('Setting active icon for:', page);
      
      // Remove active class from all icons
      document.querySelectorAll('.center-icons .icon-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to current page icon
      const activeIcon = document.querySelector(`.center-icons .icon-btn[data-route="${page}"]`);
      if (activeIcon) {
        activeIcon.classList.add('active');
        console.log('Active icon set:', activeIcon);
      }
    },

    // Initialize page-specific content
    initializePageContent: function(page) {
      console.log('Initializing page:', page);
      switch(page) {
        case 'home':
          this.initializeHomePage();
          break;
        case 'friends':
          this.initializeFriendsPage();
          break;
        case 'watch':
          this.initializeWatchPage();
          break;
        case 'marketplace':
          this.initializeMarketplacePage();
          break;
        case 'notifications':
          this.initializeNotificationsPage();
          break;
        case 'messages':
          this.initializeMessagesPage();
          break;
      }
    },

    // Initialize Home Page
    initializeHomePage: function() {
      console.log('Initializing home page');
      
      // Your existing home page initialization
      if (window.App.initializeApp) {
        App.initializeApp();
      }
    },

    // Initialize Friends Page
    initializeFriendsPage: function() {
      console.log('Initializing friends page');
      const friendRequests = [
        { 
          name: 'Kent Milan', 
          mutual: 1, 
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg', 
          timeAgo: '1w'
        },
        { 
          name: 'Dechosa Jerry', 
          mutual: 1, 
          avatar: 'https://randomuser.me/api/portraits/men/2.jpg', 
          timeAgo: '47w'
        }
      ];

      const suggestions = [
        { name: 'John Doe', mutual: 5, avatar: 'https://randomuser.me/api/portraits/men/3.jpg' },
        { name: 'Jane Smith', mutual: 12, avatar: 'https://randomuser.me/api/portraits/women/3.jpg' }
      ];

      this.renderFriendRequests(friendRequests);
      this.renderSuggestions(suggestions);
      this.setupTabs('.friends-tabs', 'friends-tab');
    },

    // Initialize Watch Page
    initializeWatchPage: function() {
      console.log('Initializing watch page');
      this.setupTabs('.watch-tabs', 'watch-tab');
      this.initializeVideoPlayers();
    },

    // Initialize Marketplace Page
    initializeMarketplacePage: function() {
      console.log('Initializing marketplace page');
      const itemsData = [
        { 
          title: 'iPhone 13 Pro Max 256GB', 
          price: '$799', 
          location: 'New York, NY', 
          image: 'https://picsum.photos/300/200?phone',
          seller: 'Tech Deals',
          sellerAvatar: 'https://randomuser.me/api/portraits/men/7.jpg'
        }
      ];

      this.renderItems(itemsData);
      this.setupTabs('.marketplace-tabs', 'marketplace-tab');
      this.setupCategories();
    },

    // Initialize Notifications Page
    initializeNotificationsPage: function() {
      console.log('Initializing notifications page');
      const notificationsData = [
        {
          id: 1,
          type: 'reaction',
          user: {
            name: 'Alice Cooper',
            avatar: 'https://randomuser.me/api/portraits/women/33.jpg'
          },
          action: 'liked your post',
          target: 'Your recent photo',
          time: '5 min ago',
          unread: true
        },
        {
          id: 2,
          type: 'friend_request',
          user: {
            name: 'Mark Wilson',
            avatar: 'https://randomuser.me/api/portraits/men/45.jpg'
          },
          action: 'sent you a friend request',
          time: '1 hour ago',
          unread: true
        },
        {
          id: 3,
          type: 'comment',
          user: {
            name: 'John Davis',
            avatar: 'https://randomuser.me/api/portraits/men/67.jpg'
          },
          action: 'commented on your post',
          target: '"Great photo!"',
          time: '3 hours ago',
          unread: false
        },
        {
          id: 4,
          type: 'mention',
          user: {
            name: 'Emma Roberts',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
          },
          action: 'mentioned you in a comment',
          target: '@KentWilan check this out!',
          time: '1 day ago',
          unread: false
        }
      ];

      this.renderNotifications(notificationsData);
      this.setupTabs('.notifications-tabs', 'notifications-tab');
    },

    // Initialize Messages Page
    initializeMessagesPage: function() {
      console.log('Initializing messages page');
      const conversationsData = [
        {
          id: 1,
          name: "Alice Cooper",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
          online: true,
          lastMessage: "Hey! How are you doing?",
          time: "10:30 AM",
          unread: 2,
          messages: [
            { id: 1, text: "Hey there! 👋", time: "10:25 AM", sent: false },
            { id: 2, text: "How's your day going?", time: "10:26 AM", sent: false },
            { id: 3, text: "Pretty good! Just working on some projects. How about you?", time: "10:28 AM", sent: true }
          ]
        },
        {
          id: 2,
          name: "Mark Wilson",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          online: true,
          lastMessage: "Let's meet up this weekend!",
          time: "Yesterday",
          unread: 0,
          messages: [
            { id: 1, text: "Are we still on for Saturday?", time: "Yesterday", sent: true },
            { id: 2, text: "Yes! Looking forward to it. 7 PM at the usual place?", time: "Yesterday", sent: false }
          ]
        },
        {
          id: 3,
          name: "John Davis",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg",
          online: false,
          lastMessage: "Thanks for helping me with the project!",
          time: "2 days ago",
          unread: 0,
          messages: [
            { id: 1, text: "I really appreciate your help with the project!", time: "2 days ago", sent: false },
            { id: 2, text: "No problem! Happy to help anytime.", time: "2 days ago", sent: true }
          ]
        },
        {
          id: 4,
          name: "Emma Roberts",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          online: true,
          lastMessage: "Did you see the new movie?",
          time: "3 days ago",
          unread: 1,
          messages: [
            { id: 1, text: "Did you see the new Marvel movie?", time: "3 days ago", sent: false },
            { id: 2, text: "Not yet! Is it good?", time: "3 days ago", sent: true }
          ]
        }
      ];

      this.renderConversations(conversationsData);
      this.setupMessagesEvents();
    },

    // Setup messages events - UPDATED FOR MOBILE
    setupMessagesEvents: function() {
      const conversationItems = document.querySelectorAll('.conversation-item');
      const newMessageBtn = document.querySelector('.new-message-btn');
      const backButton = document.querySelector('.back-to-conversations');

      conversationItems.forEach(item => {
        item.addEventListener('click', () => {
          // Remove active class from all items
          conversationItems.forEach(i => i.classList.remove('active'));
          // Add active class to clicked item
          item.classList.add('active');
          
          const conversationId = item.getAttribute('data-conversation-id');
          
          // Check if mobile view
          if (window.innerWidth <= 900) {
            // For mobile: show the chat area
            this.showMobileChat(conversationId);
          } else {
            // For desktop: use chat widgets
            this.openChat(conversationId);
          }
        });
      });

      // Back button for mobile chat
      if (backButton) {
        backButton.addEventListener('click', () => {
          this.hideMobileChat();
        });
      }

      if (newMessageBtn) {
        newMessageBtn.addEventListener('click', function() {
          alert('New message feature would open a friend list to select from');
        });
      }
    },

    // Show mobile chat - NEW METHOD
    showMobileChat: function(conversationId) {
      const chatArea = document.querySelector('.chat-area');
      const conversationsSidebar = document.querySelector('.conversations-sidebar');
      const emptyChatState = document.querySelector('.empty-chat-state');
      
      if (chatArea && conversationsSidebar) {
        // Hide conversations sidebar and empty state
        conversationsSidebar.style.display = 'none';
        if (emptyChatState) emptyChatState.style.display = 'none';
        
        // Show chat area
        chatArea.style.display = 'flex';
        chatArea.classList.add('active');
        
        // Load the chat content
        this.loadMobileChatContent(conversationId);
        
        // Add active class to messages page for header visibility
        document.querySelector('.messages-page')?.classList.add('chat-active');
      }
    },

    // Hide mobile chat - NEW METHOD
    hideMobileChat: function() {
      const chatArea = document.querySelector('.chat-area');
      const conversationsSidebar = document.querySelector('.conversations-sidebar');
      const emptyChatState = document.querySelector('.empty-chat-state');
      
      if (chatArea && conversationsSidebar) {
        // Show conversations sidebar and empty state
        conversationsSidebar.style.display = 'block';
        if (emptyChatState) emptyChatState.style.display = 'flex';
        
        // Hide chat area
        chatArea.style.display = 'none';
        chatArea.classList.remove('active');
        
        // Remove active class
        document.querySelector('.messages-page')?.classList.remove('chat-active');
      }
    },

    // Load mobile chat content - NEW METHOD
    loadMobileChatContent: function(conversationId) {
      const conversations = [
        {
          id: 1,
          name: "Alice Cooper",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
          online: true,
          messages: [
            { id: 1, text: "Hey there! 👋", time: "10:25 AM", sent: false },
            { id: 2, text: "How's your day going?", time: "10:26 AM", sent: false },
            { id: 3, text: "Pretty good! Just working on some projects. How about you?", time: "10:28 AM", sent: true }
          ]
        },
        {
          id: 2,
          name: "Mark Wilson",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          online: true,
          messages: [
            { id: 1, text: "Are we still on for Saturday?", time: "Yesterday", sent: true },
            { id: 2, text: "Yes! Looking forward to it. 7 PM at the usual place?", time: "Yesterday", sent: false }
          ]
        },
        {
          id: 3,
          name: "John Davis",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg",
          online: false,
          messages: [
            { id: 1, text: "I really appreciate your help with the project!", time: "2 days ago", sent: false },
            { id: 2, text: "No problem! Happy to help anytime.", time: "2 days ago", sent: true }
          ]
        },
        {
          id: 4,
          name: "Emma Roberts",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          online: true,
          messages: [
            { id: 1, text: "Did you see the new Marvel movie?", time: "3 days ago", sent: false },
            { id: 2, text: "Not yet! Is it good?", time: "3 days ago", sent: true }
          ]
        }
      ];

      const conversation = conversations.find(conv => conv.id === parseInt(conversationId));
      if (!conversation) return;

      const chatArea = document.querySelector('.chat-area');
      if (!chatArea) return;

      // Update chat header
      const chatHeader = chatArea.querySelector('.chat-header');
      if (chatHeader) {
        chatHeader.innerHTML = `
          <button class="back-to-conversations">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/>
            </svg>
          </button>
          <img src="${conversation.avatar}" alt="${conversation.name}" class="chat-avatar">
          <div class="chat-header-info">
            <div class="chat-header-name">${conversation.name}</div>
            <div class="chat-header-status">${conversation.online ? 'Online' : 'Offline'}</div>
          </div>
          <div class="chat-header-actions">
            <button class="chat-header-btn">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
              </svg>
            </button>
          </div>
        `;
      }

      // Update messages area
      const messagesArea = chatArea.querySelector('.messages-area');
      if (messagesArea) {
        messagesArea.innerHTML = conversation.messages.map(msg => `
          <div class="message ${msg.sent ? 'sent' : 'received'}">
            <div class="message-text">${msg.text}</div>
            <div class="message-time">${msg.time}</div>
          </div>
        `).join('');
        
        // Scroll to bottom
        messagesArea.scrollTop = messagesArea.scrollHeight;
      }

      // Setup send functionality
      this.setupMobileChatSend(conversationId);
      
      // Re-attach back button event
      const newBackButton = chatArea.querySelector('.back-to-conversations');
      if (newBackButton) {
        newBackButton.addEventListener('click', () => {
          this.hideMobileChat();
        });
      }
    },

    // Setup mobile chat send functionality - NEW METHOD
    setupMobileChatSend: function(conversationId) {
      const input = document.querySelector('.message-input');
      const sendBtn = document.querySelector('.send-btn');
      const messagesArea = document.querySelector('.messages-area');

      const sendMessage = () => {
        const text = input.value.trim();
        if (text) {
          const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          
          const messageHTML = `
            <div class="message sent">
              <div class="message-text">${text}</div>
              <div class="message-time">${currentTime}</div>
            </div>
          `;
          
          messagesArea.innerHTML += messageHTML;
          input.value = '';
          messagesArea.scrollTop = messagesArea.scrollHeight;

          // Auto-reply after 1 second
          setTimeout(() => {
            const replies = [
              "That's interesting!",
              "Tell me more about that.",
              "I see what you mean.",
              "Thanks for sharing!",
              "That's great to hear!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            
            const replyHTML = `
              <div class="message received">
                <div class="message-text">${randomReply}</div>
                <div class="message-time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            `;
            
            messagesArea.innerHTML += replyHTML;
            messagesArea.scrollTop = messagesArea.scrollHeight;
          }, 1000);
        }
      };

      if (sendBtn) {
        sendBtn.addEventListener('click', sendMessage);
      }
      
      if (input) {
        input.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }
    },

    // Initialize Video Players for Watch Page
    initializeVideoPlayers: function() {
      const videoContainers = document.querySelectorAll('.video-container');
      
      videoContainers.forEach(container => {
        const video = container.querySelector('.video-player');
        const playBtn = container.querySelector('.play-btn');
        const overlay = container.querySelector('.video-overlay');
        
        if (video && playBtn && overlay) {
          // Play/pause functionality
          const togglePlay = () => {
            if (video.paused) {
              video.play();
              container.classList.add('playing');
            } else {
              video.pause();
              container.classList.remove('playing');
            }
          };
          
          playBtn.addEventListener('click', togglePlay);
          container.addEventListener('click', togglePlay);
          
          // Pause other videos when one starts playing
          video.addEventListener('play', () => {
            document.querySelectorAll('.video-player').forEach(otherVideo => {
              if (otherVideo !== video && !otherVideo.paused) {
                otherVideo.pause();
                otherVideo.closest('.video-container')?.classList.remove('playing');
              }
            });
          });
          
          // Handle video ended
          video.addEventListener('ended', () => {
            container.classList.remove('playing');
          });
        }
      });
    },

    // Render methods for different pages
    renderFriendRequests: function(requests) {
      const requestsGrid = document.getElementById('requests-grid');
      if (!requestsGrid) {
        console.error('Requests grid not found');
        return;
      }

      requestsGrid.innerHTML = requests.map(request => `
        <div class="request-card">
          <img src="${request.avatar}" alt="${request.name}" class="request-avatar">
          <div class="request-info">
            <h3 class="request-name">${request.name}</h3>
            <p class="mutual-friends">${request.mutual} mutual friend${request.mutual > 1 ? 's' : ''}</p>
            <p class="time-ago">${request.timeAgo}</p>
            <div class="request-actions">
              <button class="btn-primary">Confirm</button>
              <button class="btn-secondary">Delete</button>
            </div>
          </div>
        </div>
      `).join('');
    },

    renderSuggestions: function(suggestions) {
      const suggestionsGrid = document.getElementById('suggestions-grid');
      if (!suggestionsGrid) {
        console.error('Suggestions grid not found');
        return;
      }

      suggestionsGrid.innerHTML = suggestions.map(suggestion => `
        <div class="suggestion-card">
          <div style="position: relative;">
            <img src="${suggestion.avatar}" alt="${suggestion.name}" class="suggestion-avatar">
            <button class="remove-btn">×</button>
          </div>
          <div class="suggestion-info">
            <h4 class="suggestion-name">${suggestion.name}</h4>
            <p class="mutual-count">${suggestion.mutual} mutual friend${suggestion.mutual > 1 ? 's' : ''}</p>
            <button class="add-friend-btn">Add Friend</button>
          </div>
        </div>
      `).join('');
    },

    renderItems: function(items) {
      const itemsGrid = document.getElementById('items-grid');
      if (!itemsGrid) {
        console.error('Items grid not found');
        return;
      }

      itemsGrid.innerHTML = items.map(item => `
        <div class="item-card">
          <img src="${item.image}" alt="${item.title}" class="item-image">
          <div class="item-info">
            <p class="item-price">${item.price}</p>
            <h3 class="item-title">${item.title}</h3>
            <p class="item-location">${item.location}</p>
            <div class="item-seller">
              <img src="${item.sellerAvatar}" alt="${item.seller}" class="seller-avatar">
              <span class="seller-name">${item.seller}</span>
            </div>
          </div>
        </div>
      `).join('');
    },

    renderNotifications: function(notifications) {
      const notificationsList = document.getElementById('notifications-list');
      if (!notificationsList) {
        console.error('Notifications list not found');
        return;
      }

      notificationsList.innerHTML = notifications.map(notification => `
        <div class="notification-item ${notification.unread ? 'unread' : ''}">
          <img src="${notification.user.avatar}" alt="${notification.user.name}" class="notification-avatar">
          <div class="notification-content">
            <div class="notification-text">
              <strong>${notification.user.name}</strong> ${notification.action}
              ${notification.target ? `<span class="notification-target">${notification.target}</span>` : ''}
            </div>
            <div class="notification-time">${notification.time}</div>
          </div>
          ${notification.unread ? '<div class="unread-dot"></div>' : ''}
        </div>
      `).join('');
    },

    renderConversations: function(conversations) {
      const conversationsList = document.getElementById('conversations-list');
      if (!conversationsList) {
        console.error('Conversations list not found');
        return;
      }

      conversationsList.innerHTML = conversations.map(conv => `
        <div class="conversation-item" data-conversation-id="${conv.id}">
          <div class="conversation-avatar-wrapper">
            <img src="${conv.avatar}" alt="${conv.name}" class="conversation-avatar">
            ${conv.online ? '<span class="online-status"></span>' : ''}
          </div>
          <div class="conversation-info">
            <div class="conversation-header">
              <span class="conversation-name">${conv.name}</span>
              <span class="conversation-time">${conv.time}</span>
            </div>
            <div class="conversation-preview">${conv.lastMessage}</div>
          </div>
          ${conv.unread > 0 ? `<div class="unread-badge">${conv.unread}</div>` : ''}
        </div>
      `).join('');
    },

    // Open chat function - now uses desktop widgets
    openChat: function(conversationId) {
      const conversations = [
        {
          id: 1,
          name: "Alice Cooper",
          avatar: "https://randomuser.me/api/portraits/women/33.jpg",
          online: true,
          messages: [
            { id: 1, text: "Hey there! 👋", time: "10:25 AM", sent: false },
            { id: 2, text: "How's your day going?", time: "10:26 AM", sent: false },
            { id: 3, text: "Pretty good! Just working on some projects. How about you?", time: "10:28 AM", sent: true }
          ]
        },
        {
          id: 2,
          name: "Mark Wilson",
          avatar: "https://randomuser.me/api/portraits/men/45.jpg",
          online: true,
          messages: [
            { id: 1, text: "Are we still on for Saturday?", time: "Yesterday", sent: true },
            { id: 2, text: "Yes! Looking forward to it. 7 PM at the usual place?", time: "Yesterday", sent: false }
          ]
        },
        {
          id: 3,
          name: "John Davis",
          avatar: "https://randomuser.me/api/portraits/men/67.jpg",
          online: false,
          messages: [
            { id: 1, text: "I really appreciate your help with the project!", time: "2 days ago", sent: false },
            { id: 2, text: "No problem! Happy to help anytime.", time: "2 days ago", sent: true }
          ]
        },
        {
          id: 4,
          name: "Emma Roberts",
          avatar: "https://randomuser.me/api/portraits/women/68.jpg",
          online: true,
          messages: [
            { id: 1, text: "Did you see the new Marvel movie?", time: "3 days ago", sent: false },
            { id: 2, text: "Not yet! Is it good?", time: "3 days ago", sent: true }
          ]
        }
      ];

      const conversation = conversations.find(conv => conv.id === parseInt(conversationId));
      if (!conversation) return;

      // Use desktop chat widgets
      App.ChatWidgets.openChat(conversation);
    },

    // Setup tabs for different pages
    setupTabs: function(containerSelector, type) {
      const container = document.querySelector(containerSelector);
      if (!container) {
        console.error('Tab container not found:', containerSelector);
        return;
      }

      const tabs = container.querySelectorAll('.tab-btn');
      tabs.forEach(tab => {
        tab.addEventListener('click', () => {
          tabs.forEach(t => t.classList.remove('active'));
          tab.classList.add('active');
          this.handleTabChange(type, tab.dataset.tab);
        });
      });
    },

    setupCategories: function() {
      const categories = document.querySelectorAll('.category-btn');
      categories.forEach(category => {
        category.addEventListener('click', () => {
          categories.forEach(c => c.classList.remove('active'));
          category.classList.add('active');
        });
      });
    },

    handleTabChange: function(type, tab) {
      console.log(`${type} tab changed to:`, tab);
    },

    // Bind navigation buttons
    bindNavigationButtons: function() {
      // Messages button now handled by the router
      // No need for special handling since it's integrated like other pages
    },

    // Bind menu button for dropdown
    bindMenuButton: function() {
      const menuBtn = document.querySelector('.menu-btn');
      const dropdownMenu = document.querySelector('.dropdown-menu');
      
      if (menuBtn && dropdownMenu) {
        menuBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          const isVisible = dropdownMenu.style.display === 'block';
          dropdownMenu.style.display = isVisible ? 'none' : 'block';
        });
        
        // Close dropdown when clicking elsewhere
        document.addEventListener('click', () => {
          dropdownMenu.style.display = 'none';
        });
        
        // Prevent dropdown from closing when clicking inside it
        dropdownMenu.addEventListener('click', (e) => {
          e.stopPropagation();
        });
      }
    },

    // Bind dropdown navigation items
    bindDropdownNavigation: function() {
      const dropdownItems = document.querySelectorAll('.dropdown-item[data-route]');
      dropdownItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          const route = item.getAttribute('data-route');
          
          // Close dropdown
          const dropdownMenu = document.querySelector('.dropdown-menu');
          if (dropdownMenu) {
            dropdownMenu.style.display = 'none';
          }
          
          // Navigate to route
          this.showPage(route);
        });
      });

      // Handle logout button
      const logoutItems = document.querySelectorAll('.logout-btn');
      logoutItems.forEach(item => {
        item.addEventListener('click', (e) => {
          e.preventDefault();
          this.handleLogout();
        });
      });
    },

    // Bind search functionality
    bindSearch: function() {
      const searchInput = document.querySelector('.search');
      if (searchInput) {
        searchInput.addEventListener('focus', function() {
          this.parentElement.style.background = 'var(--card)';
          this.parentElement.style.boxShadow = '0 0 0 1px var(--primary)';
        });
        
        searchInput.addEventListener('blur', function() {
          this.parentElement.style.background = 'var(--bg)';
          this.parentElement.style.boxShadow = 'none';
        });
        
        searchInput.addEventListener('input', function() {
          console.log('Search:', this.value);
        });
      }
    },

    // Handle logout
    handleLogout: function() {
      // Clear authentication data
      localStorage.removeItem("kentbook_logged_in");
      localStorage.removeItem("kentbook_current_user");
      
      // Hide main app and show login page
      const mainApp = document.getElementById("main-app");
      const loginPage = document.getElementById("login-page");
      const loadingScreen = document.getElementById("loading-screen");
      
      if (mainApp) mainApp.style.display = "none";
      if (loginPage) loginPage.style.display = "flex";
      if (loadingScreen) loadingScreen.style.display = "none";
      
      // Clear URL hash
      window.location.hash = "";
      
      // Reset login form
      const loginForm = document.getElementById("loginForm");
      if (loginForm) {
        loginForm.reset();
      }

      // Hide dropdown if open
      const dropdownMenu = document.querySelector('.dropdown-menu');
      if (dropdownMenu) {
        dropdownMenu.style.display = 'none';
      }

      // Close all chat widgets
      App.ChatWidgets.activeWidgets.clear();
      const widgetsContainer = document.querySelector('.chat-widgets-container');
      if (widgetsContainer) {
        widgetsContainer.innerHTML = '';
      }
    },

    // Bind topbar icon clicks
    bindTopbarIcons: function() {
      console.log('Binding topbar icons...');
      
      const routes = [
        { selector: '.center-icons .icon-btn[data-route="home"]', route: 'home' },
        { selector: '.center-icons .icon-btn[data-route="friends"]', route: 'friends' },
        { selector: '.center-icons .icon-btn[data-route="watch"]', route: 'watch' },
        { selector: '.center-icons .icon-btn[data-route="marketplace"]', route: 'marketplace' },
        { selector: '.center-icons .icon-btn[data-route="notifications"]', route: 'notifications' },
        { selector: '.center-icons .icon-btn[data-route="messages"]', route: 'messages' }
      ];

      routes.forEach(link => {
        const el = document.querySelector(link.selector);
        if (el) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Topbar icon clicked:', link.route);
            
            if (link.route === 'home') {
              // For home, use showHomePage instead of showPage
              this.showHomePage();
              window.location.hash = '';
            } else {
              // For other pages, use showPage
              this.showPage(link.route);
              window.location.hash = link.route;
            }
          });
        } else {
          console.warn('Topbar icon not found:', link.selector);
        }
      });
      
      console.log('Topbar icons bound successfully');
    },

    // Bind sidebar navigation
    bindSidebarNavigation: function() {
      console.log('Binding sidebar navigation...');
      
      const sidebarRoutes = [
        { selector: '.left-sidebar li[data-route="friends"]', route: 'friends' },
        { selector: '.left-sidebar li[data-route="watch"]', route: 'watch' },
        { selector: '.left-sidebar li[data-route="notifications"]', route: 'notifications' },
        { selector: '.left-sidebar li[data-route="marketplace"]', route: 'marketplace' },
        { selector: '.left-sidebar li[data-route="messages"]', route: 'messages' }
      ];

      sidebarRoutes.forEach(link => {
        const el = document.querySelector(link.selector);
        if (el) {
          el.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Sidebar item clicked:', link.route);
            
            // Navigate to route
            this.showPage(link.route);
            
            // Update URL hash
            window.location.hash = link.route;
          });
        } else {
          console.warn('Sidebar item not found:', link.selector);
        }
      });
      
      console.log('Sidebar navigation bound successfully');
    }
  };

  // Initialize header when DOM is ready
  document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing header manager');
    
    // Wait a bit for the main app to initialize
    setTimeout(function() {
      if (document.getElementById('main-app') && 
          document.getElementById('main-app').style.display !== 'none') {
        console.log('Main app visible, initializing navigation');
        App.HeaderManager.init();
      } else {
        console.log('Main app not visible yet');
      }
    }, 1000);
  });

  // Re-initialize when main app becomes visible (after login)
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
        const mainApp = document.getElementById('main-app');
        if (mainApp && mainApp.style.display !== 'none') {
          console.log('Main app became visible, re-initializing navigation');
          // Small delay to ensure everything is loaded
          setTimeout(function() {
            App.HeaderManager.init();
          }, 500);
        }
      }
    });
  });

  const mainApp = document.getElementById('main-app');
  if (mainApp) {
    observer.observe(mainApp, { attributes: true });
  }

})();