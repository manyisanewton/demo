import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/UserNavbar";
import './Home2.css';
import FeedSection from "../components/FeedSection";
import CommentsCarousel from "../components/CommentsCarousel";
import Footer from "../components/Footer";
import { getUserProfile, getContent, getUserContent, getVideos, getArticles, getAudio } from "../api";

function Home2() {
  const [user, setUser] = useState({ name: 'User' });
  const [tags, setTags] = useState(['Full-Stack', 'Front-End', 'DevOps']);
  const [content, setContent] = useState([]);
  const [userContent, setUserContent] = useState([]); // Add state for user-specific content
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [audio, setAudio] = useState([]);
  const [error, setError] = useState('');
  const [contentPage, setContentPage] = useState(1);
  const [videosPage, setVideosPage] = useState(1);
  const [articlesPage, setArticlesPage] = useState(1);
  const [audioPage, setAudioPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await getUserProfile();
        setUser({ name: data.name || data.email });
        localStorage.setItem('user_id', data.id); // Store user_id for fetching user content
      } catch (err) {
        console.error('Failed to fetch user profile:', err);
      }
    };

    const fetchFeedData = async () => {
      try {
        // Fetch published content
        const contentResponse = await getContent(contentPage, itemsPerPage);
        console.log('Fetched content:', contentResponse);
        setContent(contentResponse || []);

        // Fetch user's content (pending or published)
        const userContentResponse = await getUserContent(contentPage, itemsPerPage);
        console.log('Fetched user content:', userContentResponse);
        setUserContent(userContentResponse || []);

        const videosResponse = await getVideos();
        console.log('Fetched videos:', videosResponse.data.items);
        setVideos(videosResponse.data.items || []);

        const articlesResponse = await getArticles();
        console.log('Fetched articles:', articlesResponse.data);
        setArticles(articlesResponse.data || []);

        const audioResponse = await getAudio();
        console.log('Fetched audio:', audioResponse.data);
        setAudio(audioResponse.data || []);
      } catch (err) {
        console.error('Failed to fetch feed data:', err);
        setError('Failed to load feed');
      }
    };

    fetchUser();
    fetchFeedData();
  }, [contentPage]);

  return (
    <div className="homepage">
      <Navbar />
      <main className="main-container">
        <section className="user-greeting">
          <h1>Hello, {user.name}</h1>
          <div className="tags">
            {tags.map((tag, index) => (
              <span key={index} className="tag">{tag}</span>
            ))}
          </div>
        </section>

        {/* Display User's Content */}
        {userContent.length > 0 && (
          <section className="user-content-section">
            <h2>Your Content</h2>
            <div className="content-list">
              {userContent.map((item) => (
                <div key={item.id} className="content-card">
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                  <p><strong>Category:</strong> {item.category_name}</p>
                  <p><strong>Status:</strong> {item.status}</p>
                  {item.media_url && (
                    <div>
                      {item.content_type === 'video' ? (
                        <video width="320" height="240" controls>
                          <source src={item.media_url} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : (
                        <img src={item.media_url} alt={item.title} style={{ maxWidth: '300px' }} />
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
      <FeedSection
        content={content}
        videos={videos}
        articles={articles}
        audio={audio}
        error={error}
        contentPage={contentPage}
        setContentPage={setContentPage}
        videosPage={videosPage}
        setVideosPage={setVideosPage}
        articlesPage={articlesPage}
        setArticlesPage={setArticlesPage}
        audioPage={audioPage}
        setAudioPage={setAudioPage}
        itemsPerPage={itemsPerPage}
      />
      <CommentsCarousel />
      <Footer />
    </div>
  );
}

export default Home2;