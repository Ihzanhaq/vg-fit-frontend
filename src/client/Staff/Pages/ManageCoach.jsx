import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../Styles/ManageCoach.css";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../Components/getCroppedImg";

const ManageCoach = () => {
  const [coaches, setCoaches] = useState([]);
  const [form, setForm] = useState(initialForm());
  const [editingId, setEditingId] = useState(null);
  const [newQualification, setNewQualification] = useState("");
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppingField, setCroppingField] = useState(null); // NEW: track which field is cropping

  function initialForm() {
    return {
      id: "",
      name: "",
      title: "",
      phone: "",
      description: "",
      qualifications: [],
      image: null,
      detailImage: null,
    };
  }

  const fetchCoaches = async () => {
    const res = await axios.get("https://vgfit-backend.onrender.com/api/coaches");
    setCoaches(res.data);
  };

  useEffect(() => {
    fetchCoaches();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const field = e.target.name; // either 'image' or 'detailImage'

    if (file && (field === "image" || field === "detailImage")) {
      setImageSrc(URL.createObjectURL(file));
      setShowCropper(true);
      setCroppingField(field); // store which field is cropping
    } else {
      setForm((prev) => ({ ...prev, [field]: file }));
    }
  };

  const handleAddQualification = () => {
    if (newQualification.trim()) {
      setForm((prev) => ({
        ...prev,
        qualifications: [...prev.qualifications, newQualification.trim()],
      }));
      setNewQualification("");
    }
  };

  const handleRemoveQualification = (index) => {
    setForm((prev) => ({
      ...prev,
      qualifications: prev.qualifications.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();

    // Append all fields except qualifications
    Object.entries(form).forEach(([key, value]) => {
      if (key !== "qualifications") {
        data.append(key, value);
      }
    });

    // Append qualifications as array
    form.qualifications.forEach((q) => {
      data.append("qualifications", q);
    });

    try {
      if (editingId) {
        await axios.put(`https://vgfit-backend.onrender.com/api/coaches/${editingId}`, data);
        toast.success("Coach updated!");
        setEditingId(null);
      } else {
        await axios.post("https://vgfit-backend.onrender.com/api/coaches", data);
        toast.success("Coach added!");
      }
      setForm(initialForm());
      fetchCoaches();
    } catch (err) {
      toast.error("Failed to save coach");
    }
  };

  const handleEdit = (coach) => {
    setEditingId(coach._id);
    setForm({
      id: coach.id,
      name: coach.name,
      title: coach.title,
      phone: coach.phone,
      description: coach.description,
      qualifications: [...coach.qualifications],
      image: null,
      detailImage: null,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this coach?")) return;
    try {
      await axios.delete(`https://vgfit-backend.onrender.com/api/coaches/${id}`);
      toast.success("Coach deleted");
      fetchCoaches();
    } catch (err) {
      toast.error("Error deleting coach");
    }
  };

  return (
    <div className="coach-container-staff">
      <h2 className="heading">{editingId ? "Edit Coach" : "Add Coach"}</h2>

      {showCropper && imageSrc && (
        <div className="cropper-wrapper">
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={croppingField === "detailImage" ? 16 / 9 : 2 / 3}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={(_, croppedAreaPixels) =>
                setCroppedAreaPixels(croppedAreaPixels)
              }
            />
          </div>
          <div className="cropper-controls">
            <button
              type="button"
              onClick={async () => {
                const croppedBlob = await getCroppedImg(
                  imageSrc,
                  croppedAreaPixels
                );
                const croppedFile = new File([croppedBlob], "cropped.jpg", {
                  type: "image/jpeg",
                });

                setForm((prev) => ({
                  ...prev,
                  [croppingField]: croppedFile, // 👈 this makes it dynamic
                }));

                setImageSrc(null);
                setShowCropper(false);
                setCroppingField(null); // reset
              }}
              className="crop-btn"
            >
              ✅ Crop & Save
            </button>
            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setShowCropper(false);
              }}
              className="cancel-btn"
            >
              ❌ Cancel
            </button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="coach-form">
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={handleInputChange}
          required
        />

        <label>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={handleInputChange}
          required
        />

        <label>Phone</label>
        <input
          name="phone"
          value={form.phone}
          onChange={handleInputChange}
          required
        />

        <label>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleInputChange}
          required
        />

        <label>Qualifications</label>
        <div className="qualifications-container">
          {form.qualifications.map((q, index) => (
            <div key={index} className="qualification-item">
              <span>{q}</span>
              <button
                type="button"
                onClick={() => handleRemoveQualification(index)}
                className="remove-qualification"
              >
                ×
              </button>
            </div>
          ))}
          <div className="add-qualification">
            <input
              type="text"
              value={newQualification}
              onChange={(e) => setNewQualification(e.target.value)}
              placeholder="Add new qualification"
            />
            <button
              type="button"
              onClick={handleAddQualification}
              className="add-qualification-btn"
            >
              Add
            </button>
          </div>
        </div>

        <label>Coach Image</label>
        <div className="image-field-group">
          <input type="file" name="image" onChange={handleFileChange} />
          {form.image && (
            <button
              type="button"
              onClick={() => {
                setImageSrc(URL.createObjectURL(form.image));
                setCroppingField("image");
                setShowCropper(true);
              }}
              className="crop-launch-btn"
            >
              ✂️ Crop Image
            </button>
          )}
        </div>

        <label>Detailed Image</label>
        <div className="image-field-group">
          <input type="file" name="detailImage" onChange={handleFileChange} />
          {form.detailImage && (
            <button
              type="button"
              onClick={() => {
                setImageSrc(URL.createObjectURL(form.detailImage));
                setCroppingField("detailImage");
                setShowCropper(true);
              }}
              className="crop-launch-btn"
            >
              ✂️ Crop Detail
            </button>
          )}
        </div>

        <button type="submit" className="submit-btn">
          {editingId ? "Update Coach" : "Add Coach"}
        </button>
      </form>

      <div className="coach-grid">
        {coaches.map((coach) => (
          <div className="coach-card-staff" key={coach._id}>
            <img
              src={`https://vgfit-backend.onrender.com${coach.image}`}
              alt={coach.name}
              className="coach-img"
            />
            <h3>{coach.name}</h3>
            <p>{coach.title}</p>
            <div className="qualifications-preview">
              {coach.qualifications.slice(0, 2).map((q, i) => (
                <span key={i}>{q}</span>
              ))}
              {coach.qualifications.length > 2 && (
                <span>+{coach.qualifications.length - 2} more</span>
              )}
            </div>
            <div className="card-actions">
              <button onClick={() => handleEdit(coach)} className="edit-btn">
                Edit
              </button>
              <button
                onClick={() => handleDelete(coach._id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageCoach;
