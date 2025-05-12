import React, { useState, useEffect } from 'react';
import "./Categories.css";
import Navbar from '../components/Navbar/UserNavbar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faChevronRight, faThumbsUp, faComment, faTimes } from '@fortawesome/free-solid-svg-icons';
import Footer from '../components/Footer';
import axios from 'axios';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [selectedPost, setSelectedPost] = useState(null);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState({});
  const [searchTerm, setSearchTerm] = useState(''); // New state for search

  const RSS2JSON_API_KEY = 'qaroytlfmvhtdcvktht1hraeubbedie4ggiogmaz';
  const VIDEO_API = `https://api.rss2json.com/v1/api.json?rss_url=https://www.youtube.com/feeds/videos.xml?channel_id=UC8butISFwT-Wl7EV0hUK0BQ&api_key=${RSS2JSON_API_KEY}`;
  const ARTICLE_API = 'https://dev.to/api/articles';
  const AUDIO_API = `https://listen-api.listennotes.com/api/v2/search?q=podcast&sort_by_date=0&type=episode&offset=0&len_min=10&len_max=30&genre_ids=68,69&published_before=1698777600&published_after=1368902400&only_in=title%2Cdescription&language=English&safe_mode=0`;
  const LISTENNOTES_API_KEY = '7414408b9ba6479aba86eb06545f7a98';

  const getCTA = (type) => {
    switch (type) {
      case "video":
        return "Watch Now";
      case "article":
        return "Read Article";
      case "audio":
        return "Listen Now";
      default:
        return "Explore";
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setError('Please log in to view categories.');
        return;
      }

      try {
        const videoResponse = await axios.get(VIDEO_API);
        const videos = videoResponse.data.items || [];

        const articleResponse = await axios.get(ARTICLE_API);
        const articles = articleResponse.data || [];

        const audioResponse = await axios.get(AUDIO_API, {
          headers: { 'X-ListenAPI-Key': LISTENNOTES_API_KEY }
        });
        const audios = audioResponse.data.results || [];

        const categoryData = [
          {
            id: 1,
            name: "Fullstack Development",
            posts: [
              ...videos.slice(0, 3).map((item, index) => ({
                id: index + 1,
                type: "video",
                title: item.title,
                author: item.author || "Unknown",
                date: item.pubDate,
                url: item.link,
                likesCount: 0,
                comments: []
              })),
              ...articles.slice(0, 2).map((item, index) => ({
                id: videos.length + index + 1,
                type: "article",
                title: item.title,
                author: item.user?.name || "Unknown",
                date: item.published_at,
                url: '',
                likesCount: item.positive_reactions_count || 0,
                comments: []
              }))
            ]
          },
          {
            id: 2,
            name: "Cyber Security",
            posts: [
              ...audios.slice(0, 3).map((item, index) => ({
                id: index + 1,
                type: "audio",
                title: item.title,
                author: item.publisher || "Unknown",
                date: item.published_date,
                url: item.audio,
                likesCount: 0,
                comments: []
              })),
              ...articles.slice(2, 4).map((item, index) => ({
                id: audios.length + index + 1,
                type: "article",
                title: item.title,
                author: item.user?.name || "Unknown",
                date: item.published_at,
                url: '',
                likesCount: item.positive_reactions_count || 0,
                comments: []
              }))
            ]
          }
        ];

        for (let category of categoryData) {
          for (let post of category.posts) {
            const likeResponse = await axios.get(`http://localhost:5000/categories/${post.id}/likes`, {
              headers: { Authorization: `Bearer ${token}` }
            }).catch(() => ({ data: { likes: 0 } }));
            post.likesCount = likeResponse.data.likes || 0;

            const commentsResponse = await axios.get(`http://localhost:5000/categories/${post.id}/comments`, {
              headers: { Authorization: `Bearer ${token}` }
            }).catch(() => ({ data: [] }));
            setComments(prev => ({ ...prev, [post.id]: commentsResponse.data }));
          }
        }

        setCategories(categoryData);
        setError('');
      } catch (err) {
        setError('Failed to load categories or posts. Error: ' + (err.response?.data?.error || err.message));
        console.error('Fetch error:', err.response?.data || err.message);
        const fallbackData = [
          {
            id: 1,
            name: "Fullstack Development",
            posts: [
              { id: 1, type: "video", title: "Sample Video", author: "Sample Author", date: new Date().toISOString(), url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', likesCount: 10, comments: [] },
              { id: 2, type: "article", title: "Sample Article", author: "Sample Author", date: new Date().toISOString(), url: '', likesCount: 15, comments: [] },
            ],
          },
          {
            id: 2,
            name: "Cyber Security",
            posts: [
              { id: 1, type: "audio", title: "Sample Audio", author: "Sample Author", date: new Date().toISOString(), url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', likesCount: 20, comments: [] },
              { id: 2, type: "article", title: "Sample Article", author: "Sample Author", date: new Date().toISOString(), url: '', likesCount: 12, comments: [] },
            ],
          },
        ];
        setCategories(fallbackData);
      }
    };

    fetchCategories();
  }, []);

  const scrollRow = (direction, rowIndex) => {
    const row = document.querySelectorAll('.cards-row')[rowIndex];
    if (row) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      row.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleLike = async (postId) => {
    const token = localStorage.getItem('access_token');
    try {
      await axios.post(`http://localhost:5000/categories/${postId}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const likeResponse = await axios.get(`http://localhost:5000/categories/${postId}/likes`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const updatedCategories = categories.map(category => ({
        ...category,
        posts: category.posts.map(post =>
          post.id === postId ? { ...post, likesCount: likeResponse.data.likes } : post
        )
      }));
      setCategories(updatedCategories);
    } catch (err) {
      console.error('Like error:', err.response?.data || err.message);
    }
  };

  const handleCommentSubmit = async (postId) => {
    const token = localStorage.getItem('access_token');
    const commentBody = newComment[postId] || '';
    if (!commentBody.trim()) return;

    try {
      await axios.post(`http://localhost:5000/categories/${postId}/comments`, { body: commentBody }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const commentsResponse = await axios.get(`http://localhost:5000/categories/${postId}/comments`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setComments(prev => ({ ...prev, [postId]: commentsResponse.data }));
      setNewComment(prev => ({ ...prev, [postId]: '' }));
    } catch (err) {
      console.error('Comment error:', err.response?.data || err.message);
    }
  };

  const closeModal = () => setSelectedPost(null);

  // Filter posts based on search term (only video and article)
  const filteredCategories = categories.map(category => ({
    ...category,
    posts: category.posts.filter(post =>
      (post.type === "video" || post.type === "article") &&
      post.title.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }));

  return (
    <div className="categories-wrapper">
      <Navbar />
      <header className='categories-header'>
        <h1>Categories</h1>
        <p>Dive into curated content by your favorite tech domains</p>     
        <div className='search-bar'>
          <input
            type="text"
            placeholder="Search Categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
        </div>  
      </header>  

      <div className="wrap">
        {filteredCategories.length > 0 ? (
          filteredCategories.map((category, index) => (
            <div className="category-section" key={category.id}>
              <h3 className="category-title">{category.name}</h3>
              <div className="cards-row-wrapper">
                <button className="chevron-btn left" onClick={() => scrollRow("left", index)}>
                  <FontAwesomeIcon icon={faChevronRight} rotation={180} />
                </button>
                <div className="cards-row">
                  {category.posts.map((post) => (
                    <div className="category-card" key={post.id}>
                      <h4 className="post-title">{post.title}</h4>
                      <p className="post-meta">{new Date(post.date).toLocaleDateString()}</p>
                      <div className="post-stats">
                        <span>
                          {post.likesCount} likes{" "}
                          <FontAwesomeIcon
                            icon={faThumbsUp}
                            onClick={() => handleLike(post.id)}
                            style={{ cursor: "pointer", color: "gray" }}
                          />
                        </span>
                        <span>
                          {(comments[post.id] || []).length} comments <FontAwesomeIcon icon={faComment} />
                        </span>
                      </div>
                      <div className="post-actions">
                        <button className={`btn ${post.type}`} onClick={() => setSelectedPost(post)}>
                          {getCTA(post.type)}
                        </button>
                        <button className="like-btn" onClick={() => handleLike(post.id)}>
                          Like
                        </button>
                      </div>
                      <div className="comment-section">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          onKeyPress={(e) => e.key === "Enter" && handleCommentSubmit(post.id)}
                        />
                        <div className="comments-list">
                          {(comments[post.id] || []).map((comment) => (
                            <p key={comment.id}>{comment.body}</p>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="chevron-btn right" onClick={() => scrollRow("right", index)}>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>{error || "No matching videos or articles found."}</p>
        )}
      </div>
      {selectedPost && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={closeModal}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
            <h3>{selectedPost.title}</h3>
            {selectedPost.type === "video" && (
              <iframe
                width="400"
                height="225"
                src={`https://www.youtube.com/embed/${selectedPost.url.split('v=')[1].split('&')[0]}`}
                title={selectedPost.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
            {selectedPost.type === "audio" && (
              <audio controls>
                <source src={selectedPost.url} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            )}
            {selectedPost.type === "article" && (
              <div className="article-content">
                <p>
                  {selectedPost.title} by {selectedPost.author}. Content: This is a sample article about{" "}
                  {selectedPost.title.toLowerCase().replace(/[^a-zA-Z0-9]/g, " ")}. Read more details here.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
      <Footer />
    </div>
  );
}

export default Categories;