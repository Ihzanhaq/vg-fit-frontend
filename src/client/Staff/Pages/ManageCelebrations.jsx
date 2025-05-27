import React, { useEffect, useState } from "react";
import axios from "axios";
import "../Styles/ManageCelebrations.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ManageCelebrations = () => {
  const [celebrations, setCelebrations] = useState([]);
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [editingTitleId, setEditingTitleId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCelebrations();
  }, []);

  const fetchCelebrations = async () => {
    try {
      setLoading(true);
      const res = await axios.get("https://vgfit-backend.onrender.com/api/celebrations");
      setCelebrations(res.data);
    } catch (error) {
      toast.error("Failed to load celebrations");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    images.forEach((img) => formData.append("images", img));

    try {
      await axios.post("https://vgfit-backend.onrender.com/api/celebrations", formData);
      toast.success("Celebration added successfully!");
      setTitle("");
      setImages([]);
      fetchCelebrations();
    } catch (err) {
      toast.error("Failed to add celebration");
    }
  };

  const handleDeleteImage = async (celebrationId, imageIndex) => {
    try {
      await axios.delete(
        `https://vgfit-backend.onrender.com/api/celebrations/${celebrationId}/image/${imageIndex}`
      );
      toast.success("Image deleted");
      fetchCelebrations();
    } catch (error) {
      toast.error("Failed to delete image");
    }
  };

  const handleReplaceImage = async (celebrationId, imageIndex, e) => {
    const newImage = e.target.files[0];
    if (!newImage) return;

    try {
      const formData = new FormData();
      formData.append("image", newImage);

      await axios.put(
        `https://vgfit-backend.onrender.com/api/celebrations/${celebrationId}/image/${imageIndex}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      toast.success("Image replaced");
      fetchCelebrations();
    } catch (error) {
      toast.error("Failed to replace image");
    }
  };

  const handleAddImage = async (celebrationId, e) => {
    const formData = new FormData();
    formData.append("images", e.target.files[0]);

    try {
      await axios.post(
        `https://vgfit-backend.onrender.com/api/celebrations/${celebrationId}/images`,
        formData
      );
      toast.success("Image added");
      fetchCelebrations();
    } catch {
      toast.error("Failed to add image");
    }
  };

  const handleTitleEdit = async (id, newTitle) => {
    try {
      await axios.put(`https://vgfit-backend.onrender.com/api/celebrations/${id}`, {
        title: newTitle,
      });
      toast.success("Title updated");
      setEditingTitleId(null);
      fetchCelebrations();
    } catch {
      toast.error("Failed to update title");
    }
  };

  const handleDeleteCelebration = async (id) => {
    if (!window.confirm("Are you sure you want to delete this celebration?"))
      return;

    try {
      await axios.delete(`https://vgfit-backend.onrender.com/api/celebrations/${id}`);
      toast.success("Celebration deleted");
      fetchCelebrations();
    } catch (error) {
      console.error("Failed to delete celebration:", error);
      toast.error("Error deleting celebration");
    }
  };

  return (
    <div className="celebration-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <h2 className="celebration-heading">Manage Celebrations</h2>

      {/* Add Celebration */}
      <form onSubmit={handleSubmit} className="celebration-form">
        <input
          type="text"
          placeholder="Celebration Title"
          className="input-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />
        <button type="submit" className="add-button">
          Add Celebration
        </button>
      </form>

      {/* Spinner */}
      {loading && <div className="spinner"></div>}

      {/* Celebration Grid */}
      {!loading && (
        <div className="celebration-grid">
          {celebrations.map((celebration) => (
            <div key={celebration._id} className="celebration-card">
              <button
                className="delete-celebration-button"
                onClick={() => handleDeleteCelebration(celebration._id)}
              >
                Delete Celebration
              </button>

              {editingTitleId === celebration._id ? (
                <input
                  type="text"
                  defaultValue={celebration.title}
                  onBlur={(e) =>
                    handleTitleEdit(celebration._id, e.target.value)
                  }
                  className="input-edit-title"
                  autoFocus
                />
              ) : (
                <h3
                  className="celebration-title"
                  onClick={() => setEditingTitleId(celebration._id)}
                >
                  {celebration.title}
                </h3>
              )}

              {/* Images */}
              <div className="image-grid">
                {celebration.images.map((img, idx) => (
                  <div key={idx} className="image-card">
                    <img
                      src={
                        img.startsWith("http")
                          ? img
                          : `https://vgfit-backend.onrender.com${img}`
                      }
                      alt="celebration"
                    />
                    <div className="image-actions">
                      <button
                        onClick={() => handleDeleteImage(celebration._id, idx)}
                        className="delete-button"
                      >
                        Delete
                      </button>
                      <button className="replace-button">
                        Replace
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            handleReplaceImage(celebration._id, idx, e)
                          }
                        />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Image */}
              <div className="add-image-section">
                <label>Add Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddImage(celebration._id, e)}
                  className="add-image-btn"
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ManageCelebrations;
