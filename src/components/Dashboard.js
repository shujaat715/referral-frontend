import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa"; // Import icons
import "./Dashboard.css";
import { useSelector } from "react-redux";

const Dashboard = () => {
  const { token } = useSelector((state) => state.common);
  const [referrals, setReferrals] = useState([]);
  const [editingReferral, setEditingReferral] = useState(null);
  const [newReferralLink, setNewReferralLink] = useState("");
  const [newReferralProvider, setNewReferralProvider] = useState("");
  const email = localStorage.getItem("email"); // Get logged-in user email from local storage


  useEffect(() => {
    fetchReferrals();
  }, [email]);

  const fetchReferrals = () => {
    axios
      .get(
        `https://2660-2a0a-a547-f2a0-0-b8ae-d478-c531-347d.ngrok-free.app/api/controller/getReferralsByUser?email=${email}`
      )
      .then((response) => {
        console.log("API Response:", response.data);
        const data = response.data;
        setReferrals(Array.isArray(data) ? data : []); // Ensure referrals is always an array
      })
      .catch((err) => {
        console.error("Failed to fetch referrals", err);
        setReferrals([]); // Fallback to an empty array
      });
  };

  const handleEdit = (referral) => {
    setEditingReferral(referral);
    setNewReferralLink(referral.referralLink);
    setNewReferralProvider(referral.referralProvider);
  };

  const handleUpdate = () => {
    const updatedData = {
      referralLink: newReferralLink,
      referralProvider: newReferralProvider,
    };

    axios
      .put(
        `https://2660-2a0a-a547-f2a0-0-b8ae-d478-c531-347d.ngrok-free.app/api/controller/updateReferral/${editingReferral.id}`,
        updatedData
      )
      .then(() => {
        fetchReferrals();
        setEditingReferral(null);
        alert("Referral updated successfully!");
      })
      .catch((err) => console.error("Failed to update referral", err));
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this referral?"
    );
    if (confirmDelete) {
      axios
        .delete(`https://2660-2a0a-a547-f2a0-0-b8ae-d478-c531-347d.ngrok-free.app/api/controller/deleteReferral/${id}`)
        .then(() => {
          fetchReferrals();
          alert("Referral deleted successfully!");
        })
        .catch((err) => console.error("Failed to delete referral", err));
    }
  };

  return (
    <div className="dashboard">
      <h2>Your Referrals</h2>
      <table className="referral-table">
        <thead>
          <tr>
            <th>Referral Link</th>
            <th>Referral Provider</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(referrals) && referrals.length > 0 ? (
            referrals.map((referral) => (
              <tr key={referral.id}>
                <td>{referral.referralLink}</td>
                <td>{referral.referralProvider}</td>
                <td>
                  <button onClick={() => handleEdit(referral)}>
                    <FaEdit />
                  </button>
                  <button onClick={() => handleDelete(referral.id)}>
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="text-center">
                No referrals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {editingReferral && (
        <div className="edit-form">
          <h3>Edit Referral</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUpdate();
            }}
          >
            <div>
              <label>Referral Link:</label>
              <input
                type="text"
                value={newReferralLink}
                onChange={(e) => setNewReferralLink(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Referral Provider:</label>
              <input
                type="text"
                value={newReferralProvider}
                onChange={(e) => setNewReferralProvider(e.target.value)}
                required
              />
            </div>
            <button type="submit">Save Changes</button>
            <button type="button" onClick={() => setEditingReferral(null)}>
              Cancel
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
