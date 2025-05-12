import React, { useState } from 'react';
import { motion } from "framer-motion";
import { FaCheckCircle, FaComment, FaEye, FaEyeSlash } from 'react-icons/fa';
import NotificationCard from '../components/NotificationCard';
import './Notifications.css';
import NavBar from '../components/Navbar/UserNavbar';
import Footer from '../components/Footer';

const Notifications = () => {
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [notifications, setNotifications] = useState([
    { 
      id: 1,
      type: 'Video',
      message: 'New Video posted in "Full-Stack Development"', 
      subMessage: '"Mastering APIs with Django" by Jane Mwangi [Watch Now]', 
      time: '5m ago',
      icon: <FaCheckCircle style={{ color: '#11203A' }} />,
      read: false
    },
    { 
      id: 2,
      type: 'Article',
      message: 'New article in your followed category "DevOps"', 
      subMessage: '"CI/CD Done Right: Real Use Cases" [Read Article]', 
      time: '1 hour ago',
      icon: <FaCheckCircle style={{ color: '#11203A' }} />,
      read: false
    },
    { 
      id: 3,
      type: 'Comment',
      message: 'Newton Manyisa  replied to your comment on "Tech Careers"', 
      subMessage: '"Totally agree with your point about mentorship!" [View Thread]', 
      time: '20m ago',
      icon: <FaComment style={{ color: '#11203A' }} />,
      read: false
    },
  ]);

  const toggleRead = (id) => {
    setNotifications(notifications.map(notif =>
      notif.id === id ? { ...notif, read: !notif.read } : notif
    ));
  };

  const filteredNotifications = notifications
    .filter(notification => {
      const matchesFilter = filter === 'All' || notification.type === filter;
      const matchesSearch = notification.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           notification.subMessage.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      const timeA = new Date(`2025-05-03T${a.time.replace('m ago', 'minutes ago').replace('hour ago', 'hours ago')}`);
      const timeB = new Date(`2025-05-03T${b.time.replace('m ago', 'minutes ago').replace('hour ago', 'hours ago')}`);
      return sortBy === 'newest' ? timeB - timeA : timeA - timeB;
    });

  const unreadCount = notifications.filter(n => !n.read).length;
  const categories = ['All', 'Video', 'Article', 'Comment'];
  const sortOptions = ['newest', 'oldest'];

  return (
    <div>
      <NavBar />
      <div style={{ backgroundColor: '#f6f6f6', minHeight: '100vh', padding: '2rem', color: '#11203A' }}>
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{ fontSize: '2.5rem', marginBottom: '1.5rem', fontWeight: 700, textTransform: 'capitalize', position: 'relative' }}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="badge">{unreadCount}</span>
          )}
           <p style={{ color: '#11203A', marginBottom: '1.5rem', fontSize: '1.1rem', fontWeight: 'normal' }}>Stay updated with content & interactions</p>
        </motion.h1>
        <div className="controls">
            <div className="filter-section">
              {categories.map(category => (
                <button
                  key={category}
                  className={`filter-btn ${filter === category ? 'active' : ''}`}
                  onClick={() => setFilter(category)}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="sort-section">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="sort-select">
                {sortOptions.map(option => (
                  <option key={option} value={option}>{option.charAt(0).toUpperCase() + option.slice(1)}</option>
                ))}
              </select>
            </div>
            <div className="search-bar1">
              <input
                type="text"
                placeholder="Search Notifications"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
        </div>

        <div className="notifications-container">
          
          <div className="notifications-grid">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notif) => (
                <motion.div
                  key={notif.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="notification-wrapper"
                >
                  <NotificationCard
                    icon={notif.icon}
                    message={notif.message}
                    subMessage={notif.subMessage}
                    time={notif.time}
                    // read={notif.read}
                    // onToggleRead={() => toggleRead(notif.id)}
                    actionLabel={notif.subMessage.match(/\[(.*?)\]/)[1]}
                    onActionClick={() => alert(`Navigating to ${notif.subMessage.match(/\[(.*?)\]/)[1]}`)}
                  />
                  {/* <button
                    className="action-btn"
                    onClick={() => alert(`Navigating to ${notif.subMessage.match(/\[(.*?)\]/)[1]}`)}
                  >
                    {notif.subMessage.match(/\[(.*?)\]/)[1]}
                  </button> */}
                </motion.div>
              ))
            ) : (
              <p className="no-notifications">No notifications found.</p>
            )}
          </div>
          <button className="clear-btn" onClick={() => setNotifications([])}>Clear All</button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Notifications;