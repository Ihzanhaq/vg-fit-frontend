import React, { useEffect, useState } from "react";
import "../Styles/Pricing.css";
import AnimatedSection from "../Components/AnimatedSection";
import axios from "axios";

const Pricing = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    axios
      .get("https://vgfit-backend.onrender.com/api/pricing")
      .then((res) => setPlans(res.data))
      .catch((err) => console.log("Failed to load plans", err));
  }, []);

  // Group plans by name
  const groupedPlans = plans.reduce((acc, plan) => {
    if (!acc[plan.name]) {
      acc[plan.name] = [];
    }
    acc[plan.name].push(plan);
    return acc;
  }, {});
  

  return (
    <div className="pricing-membership-container">
      <div className="pricing-section">
        <AnimatedSection>
          <h2>Our Pricing Plans</h2>
          <p className="section-description">
            Choose a plan that suits your goals — whether you're just getting
            started or ready to go all in, we have the right option for you.
          </p>
        </AnimatedSection>


          {Object.entries(groupedPlans).map(([name, group]) => (
            <AnimatedSection key={name}>
              <div className="plan-group">
                <h3 className="plan-heading">{name}</h3>
                <div className="pricing-cards">
                  {group.map((plan, idx) => (
                    <div key={idx} className="pricing-card">
                      <p className="duration">{plan.duration}</p>
                      <p className="price">{plan.price}</p>
                      <ul className="features">
                        {plan.features.map((item, i) => (
                          <li key={i}>✔ {item}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          ))}
   
      </div>
    </div>
  );
};

export default Pricing;
