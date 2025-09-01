import React, { useState } from "react";
import api from "../utils/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../Context/userContext";

export default function EditProfile() {
  const [profileImage, setProfileImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const {user , setUser} = useUser();

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: user?.name,
    email: '',
    phone: user.phone,
    dob: '',
    location: '',
    gender: '',
    language: '',
    bio: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
      setImageFile(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (imageFile) data.append('image', imageFile);

    for (const key in formData) {
      data.append(key, formData[key]);
    }

    try {
      const res = await api.post("/user/edit", data,);
      alert("Profile updated!");
      setUser(prev => ({ ...prev, cover: profileImage }));
      navigate('/profile')

    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Update failed!");
      navigate('/profile')
    }
  };

  return (
    <div className="min-h-screen w-full bg-gray-50 flex items-center justify-center">
      <div className="w-full max-w-7xl bg-white md:rounded-3xl shadow-xl grid grid-cols-1 lg:grid-cols-3 overflow-hidden">
        
        {/* Profile Image */}
        <div className="bg-neutral-800 flex flex-col items-center justify-center p-10">
          <label className="cursor-pointer">
            <div className="w-40 h-40 rounded-full overflow-hidden shadow-xl border-4 border-white hover:scale-105 transition duration-300">
              <img
                src={profileImage || user?.cover}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
          </label>
          <p className="text-white mt-4 text-sm font-light">Click to change</p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="lg:col-span-2 p-10 flex flex-col justify-center w-full"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Edit Profile</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="name"
              value={formData.name}
              onChange={handleChange}
              type="text"
              placeholder="Full Name"
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            />
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              type="email"
              placeholder="Email"
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            />
            <input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              type="tel"
              placeholder="Phone"
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            />
            <input
              name="dob"
              value={formData.dob}
              onChange={handleChange}
              type="date"
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            />
            <input
              name="location"
              value={formData.location}
              onChange={handleChange}
              type="text"
              placeholder="Location"
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            >
              <option value="">Select Gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
            <select
              name="language"
              value={formData.language}
              onChange={handleChange}
              className="py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
            >
              <option value="">Select Language</option>
              <option>English</option>
              <option>Hindi</option>
              <option>Spanish</option>
              <option>French</option>
            </select>
          </div>

          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows="4"
            placeholder="Tell others about yourself..."
            className="w-full mt-6 py-3 px-4 bg-gray-100 rounded-lg focus:bg-gray-200 outline-none"
          />

          <div className="mt-6 flex justify-end">
            <button
              type="submit"
              className="py-3 px-8 bg-black text-white rounded-full hover:translate-y-1 transition duration-200"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}