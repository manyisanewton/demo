import { useState, useEffect } from 'react';
import { getContent, getVideos, getArticles, getArticleById, getAudio, getArticleComments } from '../api';
import './FeedSection.css';
// import Navbar from "../components/Navbar/UserNavbar";

function Feed() {
  const [content, setContent] = useState([]);
  const [videos, setVideos] = useState([]);
  const [articles, setArticles] = useState([]);
  const [audio, setAudio] = useState([]);
  const [error, setError] = useState('');

  // Pagination states
  const [contentPage, setContentPage] = useState(1);
  const [videosPage, setVideosPage] = useState(1);
  const [articlesPage, setArticlesPage] = useState(1);
  const [audioPage, setAudioPage] = useState(1);
  const itemsPerPage = 3;

  // Modal states
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [articleContent, setArticleContent] = useState(null);
  const [articleComments, setArticleComments] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const contentResponse = await getContent(contentPage, itemsPerPage);
        console.log('Backend content:', contentResponse);
        setContent(contentResponse || []);

        const videosResponse = await getVideos();
        console.log('YouTube videos:', videosResponse.data);
        setVideos(videosResponse.data.items || []);

        const articlesResponse = await getArticles();
        console.log('Dev.to articles:', articlesResponse.data);
        setArticles(articlesResponse.data || []);

        const audioResponse = await getAudio();
        console.log('Audio:', audioResponse.data);
        setAudio(audioResponse.data || []);
      } catch (err) {
        console.error('Feed error:', err);
        setError('Failed to load feed');
      }
    };
    fetchData();
  }, [contentPage]);

  useEffect(() => {
    if (selectedArticle) {
      const fetchArticleDetails = async () => {
        try {
          const response = await getArticleById(selectedArticle.id);
          console.log('Article content:', response.data);
          setArticleContent(response.data);

          const commentsResponse = await getArticleComments(selectedArticle.id);
          console.log('Article comments:', commentsResponse.data);
          setArticleComments(commentsResponse.data || []);
        } catch (err) {
          console.error('Error fetching article details:', err);
          setArticleContent(null);
          setArticleComments([]);
        }
      };
      fetchArticleDetails();
    } else {
      setArticleContent(null);
      setArticleComments([]);
    }
  }, [selectedArticle]);

  const paginate = (data, page) => {
    const start = (page - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return data.slice(start, end);
  };

  const closeModal = () => {
    setSelectedVideo(null);
    setSelectedArticle(null);
  };

  return (
    <div>
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
{/* <Navbar /> */}
      <div className="your-feed">
        <h2 className="title">CONTENT</h2>
        <div className="feed-grid">
          {content.length > 0 ? (
            content.map((item) => (
              <div key={item.id} className="feed-cards">
                <span className="cat">Backend</span>
                <h3 className="feed-title">{item.title}</h3>
                <p className="date">{item.created_at}</p>
              </div>
            ))
          ) : (
            <p>No backend content available</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setContentPage((prev) => Math.max(prev - 1, 1))}
            disabled={contentPage === 1}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Previous
          </button>
          <span>Page {contentPage}</span>
          <button
            onClick={() => setContentPage((prev) => prev + 1)}
            disabled={content.length < itemsPerPage}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Next
          </button>
        </div>
      </div>

      <div className="your-feed">
        <h2 className="title">YOUR VIDEOS</h2>
        <div className="feed-grid">
          {paginate(videos, videosPage).length > 0 ? (
            paginate(videos, videosPage).map((video) => (
              <div
                key={video.guid}
                className="feed-cards"
                onClick={() => setSelectedVideo(video)}
                style={{ cursor: 'pointer' }}
              >
                <span className="cat">Watch Video</span>
                <h3 className="feed-title">{video.title}</h3>
                <p className="date">{video.pubDate}</p>
              </div>
            ))
          ) : (
            <p>No videos available</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setVideosPage((prev) => Math.max(prev - 1, 1))}
            disabled={videosPage === 1}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Previous
          </button>
          <span>Page {videosPage}</span>
          <button
            onClick={() => setVideosPage((prev) => prev + 1)}
            disabled={videosPage * itemsPerPage >= videos.length}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Next
          </button>
        </div>
      </div>

      <div className="your-feed">
        <h2 className="title">DEV ARTICLES</h2>
        <div className="feed-grid">
          {paginate(articles, articlesPage).length > 0 ? (
            paginate(articles, articlesPage).map((article) => (
              <div
                key={article.id}
                className="feed-cards"
                onClick={() => setSelectedArticle(article)}
                style={{ cursor: 'pointer' }}
              >
                <span className="cat">Read Article</span>
                <h3 className="feed-title">{article.title}</h3>
                <p className="date">{article.published_at}</p>
              </div>
            ))
          ) : (
            <p>No articles available</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setArticlesPage((prev) => Math.max(prev - 1, 1))}
            disabled={articlesPage === 1}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Previous
          </button>
          <span>Page {articlesPage}</span>
          <button
            onClick={() => setArticlesPage((prev) => prev + 1)}
            disabled={articlesPage * itemsPerPage >= articles.length}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Next
          </button>
        </div>
      </div>

      <div className="your-feed">
        <h2 className="title">AUDIO</h2>
        <div className="feed-grid">
          {paginate(audio, audioPage).length > 0 ? (
            paginate(audio, audioPage).map((track, index) => (
              <div key={index} className="audio-card">
                <span className="cat">{track.category}</span>
                <h3 className="feed-title">{track.title}</h3>
                <p className="date">{track.date}</p>
                {track.audio_url && (
                  <div className="audio-player">
                    <audio controls src={track.audio_url} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No audio available</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <button
            onClick={() => setAudioPage((prev) => Math.max(prev - 1, 1))}
            disabled={audioPage === 1}
            style={{ marginRight: '10px', padding: '5px 10px' }}
          >
            Previous
          </button>
          <span>Page {audioPage}</span>
          <button
            onClick={() => setAudioPage((prev) => prev + 1)}
            disabled={audioPage * itemsPerPage >= audio.length}
            style={{ marginLeft: '10px', padding: '5px 10px' }}
          >
            Next
          </button>
        </div>
      </div>

      {selectedVideo && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '80%',
              maxWidth: '800px',
              position: 'relative',
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <h3>{selectedVideo.title}</h3>
            <iframe
              width="100%"
              height="400"
              src={`https://www.youtube.com/embed/${selectedVideo.link.split('v=')[1].split('&')[0]}`}
              title={selectedVideo.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}

      {selectedArticle && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              width: '80%',
              maxWidth: '800px',
              position: 'relative',
              maxHeight: '80vh',
              overflowY: 'auto',
            }}
          >
            <button
              onClick={closeModal}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '1.5rem',
                cursor: 'pointer',
              }}
            >
              ×
            </button>
            <h3>{selectedArticle.title}</h3>
            {articleContent ? (
              <div>
                <p>Published on: {articleContent.published_at}</p>
                <p><strong>Author:</strong> {articleContent.user?.name || 'Unknown'}</p>
                <p><strong>Tags:</strong> {Array.isArray(articleContent.tag_list) ? articleContent.tag_list.join(', ') : articleContent.tag_list || 'None'}</p>
                <p><strong>Description:</strong> {articleContent.description || 'No description available'}</p>
                <div
                  dangerouslySetInnerHTML={{
                    __html: articleContent.body_html.replace(
                      /src="\/([^"]+)"/g,
                      'src="https://dev.to/$1"'
                    ).replace(
                      /href="\/([^"]+)"/g,
                      'href="https://dev.to/$1"'
                    )
                  }}
                  style={{ lineHeight: '1.6', fontSize: '1rem', marginTop: '10px' }}
                />
                {articleComments.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h4>Comments:</h4>
                    {articleComments.map(comment => (
                      <div key={comment.id_code} style={{ marginBottom: '10px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
                        <p><strong>{comment.user?.name || 'Anonymous'}:</strong></p>
                        <div
                          dangerouslySetInnerHTML={{ __html: comment.body_html }}
                          style={{ lineHeight: '1.6', fontSize: '0.9rem' }}
                        />
                      </div>
                    ))}
                  </div>
                )}
                <p style={{ marginTop: '10px' }}>
                  <a
                    href={selectedArticle.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ color: 'blue', textDecoration: 'underline' }}
                  >
                    Read the full article on Dev.to
                  </a>
                </p>
              </div>
            ) : (
              <p>Loading article details...</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Feed;