  import React, { useEffect, useState } from "react";
  import axios from "axios";
  import "../Styles/ManagePricing.css";

  const ManagePricing = () => {
    const [plans, setPlans] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingPlan, setEditingPlan] = useState(null);
    const [formData, setFormData] = useState({
      name: "",
      duration: "",
      price: "",
      features: [""],
    });

    useEffect(() => {
      fetchPlans();
    }, []);

    const fetchPlans = async () => {
      const res = await axios.get("https://vgfit-backend.onrender.com/api/pricing");
      setPlans(res.data);
    };

    const handleDelete = async (id) => {
      await axios.delete(`https://vgfit-backend.onrender.com/api/pricing/${id}`);
      fetchPlans();
    };

    const handleEdit = (plan) => {
      setEditingPlan(plan._id);
      setFormData({ ...plan });
      setShowModal(true);
    };

    const handleAddNew = () => {
      setEditingPlan(null);
      setFormData({
        name: "",
        duration: "",
        price: "₹",
        features: [""],
      });
      setShowModal(true);
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (editingPlan) {
        await axios.put(
          `https://vgfit-backend.onrender.com/api/pricing/${editingPlan}`,
          formData
        );
      } else {
        await axios.post("https://vgfit-backend.onrender.com/api/pricing", formData);
      }
      setShowModal(false);
      fetchPlans();
    };

    const handleFeatureChange = (index, value) => {
      const updated = [...formData.features];
      updated[index] = value;
      setFormData({ ...formData, features: updated });
    };

    const addFeature = () => {
      setFormData({ ...formData, features: [...formData.features, ""] });
    };

    const removeFeature = (index) => {
      const updated = [...formData.features];
      updated.splice(index, 1);
      setFormData({ ...formData, features: updated });
    };

    return (
      <div className="pricing-container">
        <div className="pricing-cards">
          {Object.entries(
            plans.reduce((acc, plan) => {
              acc[plan.name] = acc[plan.name] || [];
              acc[plan.name].push(plan);
              return acc;
            }, {})
          ).map(([planName, grouped]) => (
            <div key={planName} className="pricing-group">
              <h3 className="plan-heading">{planName}</h3>
              <div className="grouped-cards">
                {grouped.map((plan) => (
                  <div key={plan._id} className="pricing-card">
                    <p>{plan.duration}</p>
                    <p>{plan.price}</p>
                    <ul>
                      {plan.features.map((feat, idx) => (
                        <li key={idx}>{feat}</li>
                      ))}
                    </ul>
                    <div className="pricing-actions">
                      <button onClick={() => handleEdit(plan)}>Edit</button>
                      <button onClick={() => handleDelete(plan._id)}>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <div className="add-card" onClick={handleAddNew}>
            + Add Plan
          </div>
        </div>

        {showModal && (
          <div className="modal">
            <form className="modal-form" onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Title"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Duration"
                value={formData.duration}
                onChange={(e) =>
                  setFormData({ ...formData, duration: e.target.value })
                }
                required
              />
              <input
                type="text"
                placeholder="Price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
              />
              <label>Features:</label>
              {formData.features.map((feat, index) => (
                <div key={index} className="feature-input">
                  <input
                    type="text"
                    value={feat}
                    onChange={(e) => handleFeatureChange(index, e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => removeFeature(index)}>
                    ❌
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addFeature}
                className="add-feature"
              >
                + Add Feature
              </button>
              <div className="modal-actions">
                <button type="submit">{editingPlan ? "Update" : "Add"}</button>
                <button type="button" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  };

  export default ManagePricing;
