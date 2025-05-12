import React, { useState, useEffect, useRef } from "react";
import "./CreatePostForm.css";
import { FaUpload } from "react-icons/fa";
import api from "../api";
import io from 'socket.io-client';

const socket = io('http://localhost:5000', {
  auth: {
    token: localStorage.getItem('access_token')?.replace('Bearer ', '')
  }
});

const CreatePostForm = () => {
  const [formData, setFormData] = useState({
    title: "",
    category_id: null,
    description: "",
    file: null,
    contentId: null,
    media_url: null,
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Pending");
  const fileInputRef = useRef(null);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('/categories');
        console.log("Categories fetched:", response.data); // Debug log
        setCategories(response.data);
      } catch (err) {
        setError("Failed to load categories: " + (err.response?.data?.error || err.message));
        console.error("Category fetch error:", err);
      }
    };
    fetchCategories();

    // Listen for real-time status updates
    socket.on('content_status_update', (data) => {
      if (data.content_id === formData.contentId) {
        setStatus(data.status);
      }
    });

    // Cleanup on unmount
    return () => {
      socket.off('content_status_update');
    };
  }, [formData.contentId]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "file") {
      setFormData({ ...formData, file: files[0], media_url: null });
    } else if (name === "category_id") {
      setFormData({ ...formData, [name]: value ? parseInt(value) : null });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileUpload = async () => {
    if (!formData.file) {
      setError("Please select a file to upload.");
      return;
    }
    setLoading(true);
    setError("");
    const formDataToUpload = new FormData();
    formDataToUpload.append("file", formData.file);
    try {
      const response = await api.post("/content/upload", formDataToUpload, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFormData({ ...formData, media_url: response.data.media_url, file: null });
    } catch (err) {
      setError("File upload failed: " + (err.response?.data?.error || err.message));
      console.error("File upload error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.category_id) {
      setError("Please select a category.");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      title: formData.title,
      body: formData.description,
      media_url: formData.media_url || null,
      content_type: formData.media_url ? "Video" : "Article",
      status: "Pending",
      category_id: formData.category_id,
    };

    try {
      const response = await api.post("/content", payload);
      setFormData({ 
        ...formData, 
        contentId: response.data.id, 
        title: "", 
        description: "", 
        file: null, 
        media_url: null, 
        category_id: null 
      });
      setStatus("Pending");
    } catch (err) {
      setError("Failed to submit post for approval: " + (err.response?.data?.error || err.message));
      console.error("Submit error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadAreaClick = () => {
    fileInputRef.current.click();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      setFormData({ ...formData, file: files[0], media_url: null });
    }
  };

  return (
    <div className="create-post">
      <h2>Create Post</h2>
      <p>Share something with the community</p>
      <form className="post-form" onSubmit={handleSubmit}>
        <label>Title:</label>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <label>Category:</label>
        <select
          name="category_id"
          value={formData.category_id || ""}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {categories.length > 0 ? (
            categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))
          ) : (
            <option value="" disabled>No categories available</option>
          )}
        </select>

        <label>Description:</label>
        <textarea
          name="description"
          placeholder="Write the Description"
          value={formData.description}
          onChange={handleChange}
          required
        ></textarea>

        <label>Upload a File (Video or Image):</label>
        <div className="file-upload">
          <div 
            className="upload-area" 
            onClick={handleUploadAreaClick}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <FaUpload className="upload-icon" />
            <p>
              {formData.file?.name || formData.media_url || "Choose a file or drag & drop it here!"}
              <br />
              JPEG, PNG, MP4 formats, up to 50 MB.
            </p>
            <input
              id="file-upload"
              type="file"
              name="file"
              accept="image/jpeg,image/png,video/mp4"
              onChange={handleChange}
              ref={fileInputRef}
              style={{ display: "none" }}
            />
            <button
              type="button"
              className="upload-btn"
              onClick={handleFileUpload}
              disabled={!formData.file || loading}
            >
              {loading ? "Uploading..." : "Upload File"}
            </button>
          </div>
        </div>

        <button 
          type="submit" 
          disabled={loading || !formData.title || !formData.description || !formData.category_id}
        >
          {loading ? "Submitting..." : "Submit for Approval"}
        </button>
        {formData.contentId && (
          <button
            type="button"
            className={status === "Published" ? "approved-btn" : "pending-btn"}
            disabled={true}
          >
            {status === "Published" ? "Approved" : "Pending Approval"}
          </button>
        )}
        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
};

export default CreatePostForm;