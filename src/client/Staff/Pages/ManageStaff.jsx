    import React, { useEffect, useState } from "react";
    import axios from "axios";
    import { toast } from "react-toastify";
    import "react-toastify/dist/ReactToastify.css";
    import Cropper from "react-easy-crop";
    import { getCroppedImg } from "../Components/getCroppedImg";
    import '../Styles/ManageStaff.css'

    const ManageStaff = () => {
      const [staffMembers, setStaffMembers] = useState([]);
      const [form, setForm] = useState(initialForm());
      const [editingId, setEditingId] = useState(null);
      const [imageSrc, setImageSrc] = useState(null);
      const [crop, setCrop] = useState({ x: 0, y: 0 });
      const [zoom, setZoom] = useState(1);
      const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
      const [showCropper, setShowCropper] = useState(false);
      const [croppingField, setCroppingField] = useState(null);

      function initialForm() {
        return {
          id: "",
          name: "",
          role: "",
          bio: "",
          image: null,
        };
      }

      const fetchStaff = async () => {
        try {
          const res = await axios.get("https://vgfit-backend.onrender.com/api/staff");
          setStaffMembers(res.data);
        } catch (err) {
          toast.error("Failed to load staff members");
        }
      };

      useEffect(() => {
        fetchStaff();
      }, []);

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
      };

      const handleFileChange = async (e) => {
        const file = e.target.files[0];
        const field = e.target.name;

        if (file && field === "image") {
          setImageSrc(URL.createObjectURL(file));
          setShowCropper(true);
          setCroppingField(field);
        } else {
          setForm((prev) => ({ ...prev, [field]: file }));
        }
      };

      const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();

        Object.entries(form).forEach(([key, value]) => {
          if (value !== null) {
            data.append(key, value);
          }
        });

        try {
          if (editingId) {
            await axios.put(
              `https://vgfit-backend.onrender.com/api/staff/${editingId}`,
              data
            );
            toast.success("Staff member updated!");
            setEditingId(null);
          } else {
            await axios.post("https://vgfit-backend.onrender.com/api/staff", data);
            toast.success("Staff member added!");
          }
          setForm(initialForm());
          fetchStaff();
        } catch (err) {
          toast.error("Failed to save staff member");
        }
      };

      const handleEdit = (staff) => {
        setEditingId(staff._id);
        setForm({
          id: staff.id,
          name: staff.name,
          role: staff.role,
          image: null,
        });
      };

      const handleDelete = async (id) => {
        if (!window.confirm("Delete this staff member?")) return;
        try {
          await axios.delete(`https://vgfit-backend.onrender.com/api/staff/${id}`);
          toast.success("Staff member deleted");
          fetchStaff();
        } catch (err) {
          toast.error("Error deleting staff member");
        }
      };

      return (
        <div className="staff-management-container">
          <div className="staff-management-header">
            <h2>{editingId ? "Edit Staff Member" : "Add Staff Member"}</h2>
            <p className="subtitle">Manage your gym staff members</p>
          </div>

          {/* Cropper Modal */}
          {showCropper && imageSrc && (
            <div className="cropper-modal">
              <div className="cropper-content">
                <div className="cropper-wrapper">
                  <Cropper
                    image={imageSrc}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={(_, croppedAreaPixels) =>
                      setCroppedAreaPixels(croppedAreaPixels)
                    }
                  />
                </div>
                <div className="cropper-controls">
                  <button
                    className="control-btn confirm"
                    onClick={async () => {
                      const croppedBlob = await getCroppedImg(
                        imageSrc,
                        croppedAreaPixels
                      );
                      const croppedFile = new File(
                        [croppedBlob],
                        "cropped.jpg",
                        {
                          type: "image/jpeg",
                        }
                      );

                      setForm((prev) => ({
                        ...prev,
                        [croppingField]: croppedFile,
                      }));

                      setImageSrc(null);
                      setShowCropper(false);
                      setCroppingField(null);
                    }}
                  >
                    Save Crop
                  </button>
                  <button
                    className="control-btn cancel"
                    onClick={() => {
                      setImageSrc(null);
                      setShowCropper(false);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="staff-form-container">
            <form onSubmit={handleSubmit} className="staff-form">
              <div className="form-group">
                <label>Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleInputChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="form-group">
                <label>Role/Position</label>
                <input
                  name="role"
                  value={form.role}
                  onChange={handleInputChange}
                  placeholder="Front Desk Manager"
                  required
                />
              </div>

              <div className="form-group">
                <label>Profile Photo</label>
                <div className="file-upload-group">
                  <label className="file-upload-label">
                    Choose Image
                    <input
                      type="file"
                      name="image"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="file-input"
                    />
                  </label>
                  {form.image && (
                    <button
                      type="button"
                      className="crop-btn"
                      onClick={() => {
                        setImageSrc(URL.createObjectURL(form.image));
                        setCroppingField("image");
                        setShowCropper(true);
                      }}
                    >
                      Edit Crop
                    </button>
                  )}
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="submit-btn">
                  {editingId ? "Update Staff" : "Add Staff"}
                </button>
                {editingId && (
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => {
                      setEditingId(null);
                      setForm(initialForm());
                    }}
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>

          <div className="staff-grid-container">
            <h3>Current Staff Members</h3>
            <div className="staff-grid">
              {staffMembers.map((staff) => (
                <div key={staff._id} className="staff-card-admin">
                  <div className="staff-image-container">
                    <img
                      src={staff.image}
                      alt={staff.name}
                      className="staff-image"
                    />
                  </div>
                  <div className="staff-info">
                    <h4>{staff.name}</h4>
                    <p className="staff-role">{staff.role}</p>
                  </div>
                  <div className="staff-actions">
                    <button
                      onClick={() => handleEdit(staff)}
                      className="action-btn edit"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(staff._id)}
                      className="action-btn delete"
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

    export default ManageStaff;