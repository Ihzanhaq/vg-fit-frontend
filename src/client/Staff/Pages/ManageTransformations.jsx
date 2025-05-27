import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "../Components/getCroppedImg";
import "../Styles/Transformations.css";

const ManageTransformations = () => {
  const [transformations, setTransformations] = useState([]);
  const [form, setForm] = useState({
    name: "",
    duration: "",
    beforeImage: null,
    afterImage: null,
    story: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppingField, setCroppingField] = useState(null);

  useEffect(() => {
    fetchTransformations();
  }, []);

  const fetchTransformations = async () => {
    try {
      const res = await axios.get("https://vgfit-backend.onrender.com/api/transformations");
      setTransformations(res.data);
    } catch (err) {
      toast.error("Failed to load transformations");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    const field = e.target.name; // either 'beforeImage' or 'afterImage'

    if (file && (field === "beforeImage" || field === "afterImage")) {
      setImageSrc(URL.createObjectURL(file));
      setShowCropper(true);
      setCroppingField(field);
    } else {
      setForm((prev) => ({ ...prev, [field]: file }));
    }
  };

  const onCropComplete = async (croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCropComplete = async () => {
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      const croppedFile = new File([croppedBlob], "cropped.jpg", {
        type: "image/jpeg",
      });

      setForm((prev) => ({
        ...prev,
        [croppingField]: croppedFile,
      }));

      setImageSrc(null);
      setShowCropper(false);
      setCroppingField(null);
    } catch (err) {
      toast.error("Error cropping image");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    try {
      await axios.post("https://vgfit-backend.onrender.com/api/transformations", formData);
      toast.success("Transformation added!");
      setForm({
        name: "",
        duration: "",
        beforeImage: null,
        afterImage: null,
        story: "",
      });
      fetchTransformations();
      setShowForm(false);
    } catch (err) {
      toast.error("Failed to add transformation");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this transformation?")) return;
    try {
      await axios.delete(`https://vgfit-backend.onrender.com/api/transformations/${id}`);
      toast.success("Transformation deleted");
      fetchTransformations();
    } catch (err) {
      toast.error("Error deleting transformation");
    }
  };

  return (
    <div className="staff-transformations">
      {/* Cropper Modal */}
      {showCropper && (
        <div className="cropper-modal">
          <div className="cropper-container">
            <Cropper
              image={imageSrc}
              crop={crop}
              zoom={zoom}
              aspect={1}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
          </div>
          <div className="cropper-controls">
            <button
              type="button"
              onClick={handleCropComplete}
              className="crop-confirm-btn"
            >
              Save Crop
            </button>
            <button
              type="button"
              onClick={() => {
                setImageSrc(null);
                setShowCropper(false);
              }}
              className="crop-cancel-btn"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="transformations-container">
        <h1 className="transformations-header">Success Stories</h1>
        <p className="transformations-subheader">Real People. Real Results.</p>

        <button
          className="add-transformation-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? "Cancel" : "Add New Transformation"}
        </button>

        {showForm && (
          <form onSubmit={handleSubmit} className="transformation-form">
            <div className="form-group">
              <label>Name</label>
              <input
                name="name"
                value={form.name}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration</label>
              <input
                name="duration"
                value={form.duration}
                onChange={handleInputChange}
                placeholder="e.g., 6 months"
                required
              />
            </div>

            <div className="form-group">
              <label>Before Image</label>
              <div className="image-upload-group">
                <input
                  type="file"
                  name="beforeImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {form.beforeImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageSrc(URL.createObjectURL(form.beforeImage));
                      setCroppingField("beforeImage");
                      setShowCropper(true);
                    }}
                    className="crop-btn"
                  >
                    ✂️ Crop
                  </button>
                )}
              </div>
            </div>

            <div className="form-group">
              <label>After Image</label>
              <div className="image-upload-group">
                <input
                  type="file"
                  name="afterImage"
                  onChange={handleFileChange}
                  accept="image/*"
                  required
                />
                {form.afterImage && (
                  <button
                    type="button"
                    onClick={() => {
                      setImageSrc(URL.createObjectURL(form.afterImage));
                      setCroppingField("afterImage");
                      setShowCropper(true);
                    }}
                    className="crop-btn"
                  >
                    ✂️ Crop
                  </button>
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn">
              Submit Transformation
            </button>
          </form>
        )}

        <div className="transformations-grid">
          {transformations.map((transformation) => (
            <div key={transformation._id} className="transformation-card">
              <div className="image-comparison">
                <div className="image-wrapper before">
                  <img
                    src={`https://vgfit-backend.onrender.com${transformation.beforeImage}`}
                    alt={`${transformation.name} before`}
                  />
                  <span>Before</span>
                </div>
                <div className="image-wrapper after">
                  <img
                    src={`https://vgfit-backend.onrender.com${transformation.afterImage}`}
                    alt={`${transformation.name} after`}
                  />
                  <span>After</span>
                </div>
              </div>

              <div className="transformation-details">
                <h3>{transformation.name}</h3>
                <p className="duration">{transformation.duration}</p>
                <button
                  onClick={() => handleDelete(transformation._id)}
                  className="delete-btn"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManageTransformations;
