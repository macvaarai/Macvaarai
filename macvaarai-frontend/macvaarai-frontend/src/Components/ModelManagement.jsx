import React, { useState, useEffect } from "react";
import { Edit2, Trash2, Plus, ChevronDown, ChevronUp, X } from "lucide-react";

const ModelManagement = ({ apiUrl }) => {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedModel, setExpandedModel] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingModelId, setEditingModelId] = useState(null);

  const [formData, setFormData] = useState({
    model_id: "",
    name: "",
    category: "Premium",
    price: "",
    description: "",
    accuracy: "",
    training_data: "",
  });

  const [featuresList, setFeaturesList] = useState([]);
  const [diseasesList, setDiseasesList] = useState([]);
  const [featureInput, setFeatureInput] = useState("");
  const [diseaseInput, setDiseaseInput] = useState("");

  // Fetch models on mount
  useEffect(() => {
    fetchModels();
  }, []);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${apiUrl}/admin/models`);
      if (res.ok) {
        const data = await res.json();
        setModels(data.models || []);
      }
    } catch (err) {
      console.error("Error fetching models:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddModel = async (e) => {
    e.preventDefault();
    if (!formData.model_id || !formData.name || !formData.category) {
      alert("Please fill in required fields");
      return;
    }

    try {
      const endpoint = editingModelId ? `/admin/models/${editingModelId}` : "/admin/models";
      const method = editingModelId ? "PUT" : "POST";

      const body = editingModelId
        ? new URLSearchParams({
            name: formData.name,
            category: formData.category,
            price: formData.price,
            description: formData.description,
            accuracy: formData.accuracy,
          })
        : new URLSearchParams({
            model_id: formData.model_id,
            name: formData.name,
            category: formData.category,
            price: formData.price,
            description: formData.description,
            accuracy: formData.accuracy,
            training_data: formData.training_data,
            features: JSON.stringify(featuresList),
            diseases_trained: JSON.stringify(diseasesList),
          });

      const res = await fetch(`${apiUrl}${endpoint}`, {
        method,
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      if (res.ok) {
        alert(editingModelId ? "Model updated!" : "Model created!");
        resetForm();
        setShowAddModal(false);
        fetchModels();
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Error saving model");
    }
  };

  const handleEditModel = (model) => {
    setFormData({
      model_id: model.model_id,
      name: model.name,
      category: model.category,
      price: model.price.toString(),
      description: model.description,
      accuracy: model.accuracy,
      training_data: model.training_data,
    });
    setFeaturesList(model.features || []);
    setDiseasesList(model.diseases_trained || []);
    setEditingModelId(model.model_id);
    setShowAddModal(true);
  };

  const handleDeleteModel = async (modelId) => {
    if (!window.confirm("Are you sure you want to deactivate this model?")) return;

    try {
      const res = await fetch(`${apiUrl}/admin/models/${modelId}`, { method: "DELETE" });
      if (res.ok) {
        alert("Model deactivated!");
        fetchModels();
      }
    } catch (err) {
      console.error("Error deleting model:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      model_id: "",
      name: "",
      category: "Premium",
      price: "",
      description: "",
      accuracy: "",
      training_data: "",
    });
    setFeaturesList([]);
    setDiseasesList([]);
    setFeatureInput("");
    setDiseaseInput("");
    setEditingModelId(null);
  };

  const addFeature = () => {
    if (featureInput.trim()) {
      setFeaturesList([...featuresList, featureInput]);
      setFeatureInput("");
    }
  };

  const addDisease = () => {
    if (diseaseInput.trim()) {
      setDiseasesList([...diseasesList, diseaseInput]);
      setDiseaseInput("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">💊 Model Management & Pricing</h2>
        <button
          onClick={() => {
            resetForm();
            setShowAddModal(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg flex items-center gap-2 font-semibold"
        >
          <Plus size={20} /> Add New Model
        </button>
      </div>

      {/* Price Summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-600 to-yellow-800 p-4 rounded-lg">
          <p className="text-gray-200 text-sm">Premium Models</p>
          <p className="text-3xl font-bold mt-2">{models.filter(m => m.category === "Premium").length}</p>
          <p className="text-sm text-gray-300 mt-1">
            ₹{models.filter(m => m.category === "Premium").reduce((sum, m) => sum + m.price, 0)}/year each
          </p>
        </div>
        <div className="bg-gradient-to-br from-green-600 to-green-800 p-4 rounded-lg">
          <p className="text-gray-200 text-sm">Free Models</p>
          <p className="text-3xl font-bold mt-2">{models.filter(m => m.category === "Free").length}</p>
          <p className="text-sm text-gray-300 mt-1">No charge</p>
        </div>
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-4 rounded-lg">
          <p className="text-gray-200 text-sm">Total Revenue (4 Premium)</p>
          <p className="text-3xl font-bold mt-2">₹20,000</p>
          <p className="text-sm text-gray-300 mt-1">per hospital/year</p>
        </div>
      </div>

      {/* Models Table */}
      {loading ? (
        <p className="text-center text-gray-400">Loading models...</p>
      ) : models.length === 0 ? (
        <p className="text-center text-gray-400 py-8">No models found</p>
      ) : (
        <div className="space-y-3">
          {models.map((model) => (
            <div key={model.model_id} className="bg-gray-900 border border-gray-700 rounded-lg overflow-hidden">
              {/* Model Header */}
              <button
                onClick={() => setExpandedModel(expandedModel === model.model_id ? null : model.model_id)}
                className="w-full p-4 flex items-center justify-between hover:bg-gray-800 transition"
              >
                <div className="text-left flex-1">
                  <h3 className="font-bold text-lg">{model.name}</h3>
                  <p className="text-sm text-gray-400">ID: {model.model_id}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-bold text-lg">
                      {model.category === "Free" ? "FREE" : `₹${model.price}`}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded block mt-1 ${
                      model.category === "Premium"
                        ? "bg-yellow-900 text-yellow-200"
                        : "bg-green-900 text-green-200"
                    }`}>
                      {model.category}
                    </span>
                  </div>
                  {expandedModel === model.model_id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </div>
              </button>

              {/* Model Details */}
              {expandedModel === model.model_id && (
                <div className="border-t border-gray-700 p-4 bg-gray-800 space-y-4">
                  {/* Description */}
                  <div>
                    <h4 className="font-semibold text-sm text-gray-300 mb-2">Description</h4>
                    <p className="text-sm text-gray-400">{model.description}</p>
                  </div>

                  {/* Key Info */}
                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div>
                      <p className="text-gray-400">Accuracy</p>
                      <p className="font-semibold text-green-400">{model.accuracy}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Training Data</p>
                      <p className="font-semibold text-blue-400">{model.training_data}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="font-semibold text-green-400">{model.status}</p>
                    </div>
                  </div>

                  {/* Features */}
                  {model.features && model.features.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-300 mb-2">✨ Key Features</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {model.features.map((feature, idx) => (
                          <div key={idx} className="bg-gray-700 p-2 rounded text-sm">
                            • {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Diseases Trained */}
                  {model.diseases_trained && model.diseases_trained.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-sm text-gray-300 mb-2">🦠 Diseases Trained With</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {model.diseases_trained.map((disease, idx) => (
                          <div key={idx} className="bg-red-900 bg-opacity-30 border border-red-700 p-2 rounded text-sm">
                            {disease}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 border-t border-gray-700">
                    <button
                      onClick={() => handleEditModel(model)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <Edit2 size={16} /> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteModel(model.model_id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 px-4 py-2 rounded flex items-center justify-center gap-2"
                    >
                      <Trash2 size={16} /> Deactivate
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 border border-gray-700 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 flex justify-between items-center p-6 border-b border-gray-700 bg-gray-800">
              <h2 className="text-2xl font-bold">{editingModelId ? "Edit Model" : "Add New Model"}</h2>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleAddModel} className="p-6 space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-lg font-bold mb-4">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-gray-400">Model ID</label>
                    <input
                      type="text"
                      placeholder="e.g., eye"
                      value={formData.model_id}
                      onChange={(e) => setFormData({ ...formData, model_id: e.target.value })}
                      disabled={!!editingModelId}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none disabled:opacity-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Model Name</label>
                    <input
                      type="text"
                      placeholder="Eye Disease Detection"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    >
                      <option value="Premium">Premium (Paid)</option>
                      <option value="Free">Free</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-sm text-gray-400">Price (₹/year)</label>
                    <input
                      type="number"
                      placeholder="5000"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Details */}
              <div>
                <h3 className="text-lg font-bold mb-4">Details & Performance</h3>
                <textarea
                  placeholder="Model description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none mb-3"
                  rows="3"
                />
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Accuracy e.g., 94.5%"
                    value={formData.accuracy}
                    onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <input
                    type="text"
                    placeholder="Training data e.g., 500,000+ images"
                    value={formData.training_data}
                    onChange={(e) => setFormData({ ...formData, training_data: e.target.value })}
                    className="p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-bold mb-4">✨ Features</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add feature and press Add"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addFeature()}
                    className="flex-1 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <button type="button" onClick={addFeature} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {featuresList.map((feature, idx) => (
                    <div key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                      <span>{feature}</span>
                      <button
                        type="button"
                        onClick={() => setFeaturesList(featuresList.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Diseases */}
              <div>
                <h3 className="text-lg font-bold mb-4">🦠 Diseases Trained With</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    placeholder="Add disease and press Add"
                    value={diseaseInput}
                    onChange={(e) => setDiseaseInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addDisease()}
                    className="flex-1 p-3 rounded bg-gray-800 border border-gray-600 focus:border-blue-500 outline-none"
                  />
                  <button type="button" onClick={addDisease} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded">
                    Add
                  </button>
                </div>
                <div className="space-y-2">
                  {diseasesList.map((disease, idx) => (
                    <div key={idx} className="bg-gray-800 p-2 rounded flex justify-between items-center">
                      <span>{disease}</span>
                      <button
                        type="button"
                        onClick={() => setDiseasesList(diseasesList.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-gray-700">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2 rounded bg-gray-700 hover:bg-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold">
                  {editingModelId ? "Update Model" : "Create Model"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModelManagement;
